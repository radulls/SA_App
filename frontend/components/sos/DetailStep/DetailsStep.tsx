import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TouchableOpacity,
  StyleSheet, Alert, Platform, Animated 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getSosTags, createSosSignal, SosTag, getAuthHeaders, updateSosSignal } from '@/api/sos/sosApi';
import SosStartButtonIcon from '../../svgConvertedIcons/MapIcons/sosStartButton';
import Toast from 'react-native-toast-message';  // 🚀 Импортируем Toast
import { useRouter } from 'expo-router';
import PhotoUploader from './PhotoUploader';
import SosForm from './SosForm';

interface DetailsData {
  title: string;
  tags: string[];
  description: string;
  photos: string[];
}

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

interface Props {
  onNext: (sosId: string) => void; // ✅ Теперь onNext принимает только sosId
  location: LocationData;
  initialData?: DetailsData; 
  goBackToMap: () => void; 
  sosId?: string; // Если сигнал уже существует
  isEditing?: boolean; // 🔥 Флаг редактирования
}

const DetailsStep: React.FC<Props> = ({ onNext, location, initialData, goBackToMap, sosId, isEditing }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [photos, setPhotos] = useState<string[]>(initialData?.photos || []);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

   // 🔥 Анимации
   const scaleAnim = useRef(new Animated.Value(1)).current; // Размер кнопки
   const shakeAnim = useRef(new Animated.Value(0)).current; // Тряска кнопки

  useEffect(() => {
    loadTags();
    requestPermissions();
    (async () => {
      try {
        const headers = await getAuthHeaders(); // ✅ ТЕПЕРЬ `headers` содержит `userId`
        console.log("✅ userId получен:", headers.userId);
        setUserId(headers.userId);
      } catch (err) {
        console.error("❌ Ошибка получения userId:", err);
      }
    })();
  }, []);
  
  // 📌 Запрашиваем разрешения на доступ к галерее
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Ошибка", "Для загрузки фото нужно разрешение на доступ к галерее.");
    }
  };

  // 📌 Загружаем список тегов с бэкенда
  const loadTags = async () => {
    try {
      const data: SosTag[] = await getSosTags();
      setAvailableTags(data.map((tag: SosTag) => tag.name));
    } catch (error) {
      console.error('Ошибка загрузки тегов:', error);
    }
  };

  // 📌 Функция для получения ObjectId тегов перед отправкой
  const getTagIds = async () => {
    const allTags = await getSosTags();
    return tags.map(tag => {
      const foundTag = allTags.find(t => t.name === tag);
      return foundTag ? foundTag._id : null;
    }).filter(id => id !== null);
  };

  // 📌 Отправка данных на сервер
  const handleSubmit = async () => {
    console.log("🟢 handleSubmit() вызван");
    if (!userId) {
      Toast.show({ type: 'error', text1: 'Не удалось определить пользователя.', position: 'bottom' });
      return;
    }
    if (!location.address || !title.trim()) {
      Toast.show({ type: 'error', text1: 'Заполните заголовок и выберите местоположение.', position: 'bottom' });
      return;
    }
    if (tags.length === 0) {
      Toast.show({ type: 'error', text1: 'Выберите хотя бы один тег.', position: 'bottom' });
      return;
    }
    try {
      const tagIds = (await getTagIds()).filter((tag): tag is string => tag !== null);
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('title', title);
      formData.append('description', description.trim() ? description : "");
      formData.append('location[latitude]', location.latitude.toString());
      formData.append('location[longitude]', location.longitude.toString());
      formData.append('location[address]', location.address);
      tagIds.forEach(tag => formData.append('tags[]', tag));
      console.log("📤 Готовим файлы к отправке...");
      // **Фильтруем старые и новые фото**
      const existingPhotos: string[] = photos.filter(uri => {
        return uri.startsWith('http') || uri.startsWith('/uploads/') || uri.startsWith('uploads/');
      });
      const newPhotos = photos.filter(uri => {
        return !uri.startsWith('http') && !uri.startsWith('/uploads/') && !uri.startsWith('uploads/');
      });
      console.log("📸 Сохраняем старые фото:", existingPhotos);
      console.log("📸 Новые фото:", newPhotos);
      if (existingPhotos.length > 0) {
        formData.append('existingPhotos', JSON.stringify(existingPhotos));
      }
      for (const [index, uri] of newPhotos.entries()) {
        const fileName = uri.split('/').pop();
        let fileType = fileName?.split('.').pop()?.toLowerCase() || 'jpeg';
        if (!['jpg', 'jpeg', 'png'].includes(fileType)) {
          fileType = 'jpeg';
        }
        if (Platform.OS === 'web') {
          const response = await fetch(uri);
          const blob = await response.blob();
          const extension = blob.type.split("/")[1] || "jpeg";
          const correctFileName = `photo-${index}.${extension}`;
          const file = new File([blob], correctFileName, { type: blob.type });
          console.log("📤 Загружаем файл:", file.name, file.type);
          formData.append("photos", file);
        } else {
          formData.append('photos', {
            uri,
            type: `image/${fileType}`,
            name: `photo-${index}.${fileType}`,
          } as any);
        }
      }
      console.log("📤 Отправляем FormData:", formData);
      let response;
      if (isEditing && sosId) {
        console.log("📤 Обновляем SOS-сигнал...");
        response = await updateSosSignal(sosId, formData);
        console.log("✅ SOS-сигнал обновлен:", response.data);
      } else {
        console.log("📤 Создаем новый SOS-сигнал...");
        response = await createSosSignal(formData);
        console.log("✅ SOS-сигнал создан:", response.data);
      }
      Toast.show({ type: 'success', text1: isEditing ? 'SOS-сигнал обновлен.' : 'SOS-сигнал создан.', position: 'bottom' });
      const newSosId = response.data.sos._id;
      console.log("🚀 Переход на маршрут:", `/sos-signal/${newSosId}`);
      router.push(`/sos-signal/${newSosId}`);
    } catch (error) {
      console.log("❌ Ошибка при отправке SOS-сигнала:", error);
      Toast.show({ type: 'error', text1: 'Не удалось отправить SOS-сигнал.', position: 'bottom' });
    }
  };
  
  const handlePressIn = () => {
    if (!location.address || !title.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Заполните заголовок и выберите местоположение.',
        position: 'bottom',
      });
      return;
    }
    if (Platform.OS === 'web') {
      // ✅ На вебе сразу отправляем сигнал
      handleSubmit();
    } else {
      // ✅ На мобильных устройствах ждём 2 секунды перед отправкой
      const timer = setTimeout(() => {
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
  
          Toast.show({
            type: 'success',
            text1: 'SOS-сигнал создан!',
            position: 'bottom',
          });
          handleSubmit();
        });
      }, 2000); // ⏳ Ждём 2 секунды
      setPressTimer(timer);
      // Анимация уменьшения
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 2000,
        useNativeDriver: true,
      }).start();
    }
  };
  
  const handlePressOut = () => {
    if (Platform.OS !== 'web' && pressTimer) {
      clearTimeout(pressTimer); // ❌ Отменяем отправку, если пользователь отпустил кнопку раньше
      setPressTimer(null);
    }
  
    // Сбрасываем анимацию
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  
  return (
    <View style={styles.container}>
      <SosForm
        location={location}
        goBackToMap={goBackToMap}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        tags={tags}
        setTags={setTags}
        availableTags={availableTags}
      />
      <PhotoUploader photos={photos} setPhotos={setPhotos} />
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={handlePressIn} 
          onPressOut={handlePressOut} 
          style={styles.startButton}
        >
          <SosStartButtonIcon />
        </TouchableOpacity>
      </Animated.View>
      <Text style={styles.buttonText}>Для запуска удерживайте кнопку</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 15,
  },
  startButton:{
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 14,
  },
  buttonText:{
    fontFamily: "SFUIDisplay-medium",
    fontSize: 14,
    textAlign: 'center',
    color: '#000',
  }
});

export default DetailsStep;