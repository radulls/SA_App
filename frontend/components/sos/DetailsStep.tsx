import React, { useState, useEffect, useRef } from 'react';
import { 
  View, TextInput, Text, TouchableOpacity, FlatList, 
  StyleSheet, Alert, Image, Platform, Animated 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getSosTags, createSosSignal, SosTag, getAuthHeaders } from '@/api/sos/sosApi';
import * as FileSystem from 'expo-file-system';
import DeleteIcon from '../svgConvertedIcons/MapIcons/deleteIcon';
import PlusIcon from '../svgConvertedIcons/MapIcons/plusIcon';
import SosStartButtonIcon from '../svgConvertedIcons/MapIcons/sosStartButton';
import Toast from 'react-native-toast-message';  // 🚀 Импортируем Toast
import { useRouter } from 'expo-router';

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
}

const DetailsStep: React.FC<Props> = ({ onNext, location, initialData, goBackToMap }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
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

  // 📌 Функция для выбора тега
  const toggleTag = (tag: string) => {
    setTags(prevTags =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    );
  };

  // 📌 Открываем галерею и выбираем фото
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      const fileUri = result.assets[0].uri;

      if (Platform.OS === 'web') {
        // ✅ На вебе `copyAsync` НЕ РАБОТАЕТ, просто используем `fileUri`
        setPhotos([...photos, fileUri]);
      } else {
        // ✅ На мобильных устройствах копируем в `cacheDirectory`
        const newUri = `${FileSystem.cacheDirectory}${fileUri.split('/').pop()}`;
        await FileSystem.copyAsync({ from: fileUri, to: newUri });
        setPhotos([...photos, newUri]);
      }
    }
  };

  // 📌 Удаляем фото
  const removePhoto = (index: number) => {
    setPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
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
      Toast.show({
        type: 'error',
        text1: 'Не удалось определить пользователя.',
        position: 'bottom',
      });
      return;
    }
  
    if (!location.address || !title.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Заполните заголовок и выберите местоположение.',
        position: 'bottom',
      });
      return;
    }
  
    if (tags.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Выберите хотя бы один тег.',
        position: 'bottom',
      });
      return;
    }
  
    try {
      const tagIds = await getTagIds();
      console.log("✅ Теги собраны:", tagIds);
  
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('title', title);
      formData.append('description', description.trim() ? description : "");
      formData.append('location[latitude]', location.latitude.toString());
      formData.append('location[longitude]', location.longitude.toString());
      formData.append('location[address]', location.address);
      
      tagIds.forEach(tag => {
        if (tag) {
          formData.append('tags[]', tag);
        }
      });
  
      console.log("📤 Готовим файлы к отправке...");
      for (const [index, uri] of photos.entries()) {
        const fileName = uri.split('/').pop();
        const fileType = fileName?.split('.').pop()?.toLowerCase() || 'jpeg';
  
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
  
      const response = await createSosSignal(formData);
      console.log("✅ SOS-сигнал создан:", response.data);
  
      Toast.show({
        type: 'success',
        text1: 'SOS-сигнал создан.',
        position: 'bottom',
      });
  
      const newSosId = response.data.sos._id; // 🔥 Гарантируем правильный ID
      console.log("🚀 Перенаправляем на страницу SOS:", newSosId);
  
      console.log("🚀 Переход на маршрут:", `/sos-signal/${newSosId}`);
      router.push(`/sos-signal/${newSosId}`);
      
    } catch (error) {
      console.log("❌ Ошибка при отправке SOS-сигнала:", error);
      Toast.show({
        type: 'error',
        text1: 'Не удалось отправить SOS-сигнал.',
        position: 'bottom',
      });
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
      <Text style={styles.label}>Локация:</Text>
      <TouchableOpacity onPress={goBackToMap} style={styles.adressContainer}>
        <Text style={styles.address}>{location.address}</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Готовые теги</Text>
      <FlatList
        style={styles.tagContainer} 
        data={availableTags}
        keyExtractor={(item) => item}
        contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.tagButton, tags.includes(item) && styles.selectedTag]}
            onPress={() => toggleTag(item)}
          >
            <Text style={[styles.tagText, tags.includes(item) && styles.selectedTagText]}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.label}>Заголовок</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} />

      <Text style={styles.label}>Детали</Text>
      <TextInput       
        value={description}
        onChangeText={setDescription}
        multiline
        style={[styles.input, styles.description]} 
      />
      <View style={styles.photoContainer}>
        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          <View style={styles.plusButton}>
            <PlusIcon/>
          </View>    
        </TouchableOpacity>
        <FlatList
          horizontal
          data={photos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item }} style={styles.image} />
              <TouchableOpacity onPress={() => removePhoto(index)} style={styles.removePhoto}>
                <DeleteIcon/>
              </TouchableOpacity>
            </View>
          )}
        />      
      </View>
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
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    paddingVertical: 10,
  },
  input: {
    fontSize: 14,
    fontWeight: '400',
    height: 43,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#F3F3F3',
  },
  adressContainer: {
    justifyContent: 'center',
    height: 43,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#F3F3F3',
  },
  address: {
    fontSize: 14,
    fontWeight: '400',
  },
  tagContainer: {
    paddingBottom: 20,
  },
  tagButton: {
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
    alignItems: 'center',
    flex: 1,
  },
  selectedTag: {
    backgroundColor: '#F22C2C',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  selectedTagText: {
    color: '#fff',
  },
  description: {
    height: 100,
    paddingVertical: 18,
  },
  photoContainer:{
    flexDirection: 'row',
    gap: 10,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 112,
    height: 112,
    borderRadius: 12,
  },
  removePhoto: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -11 }, { translateY: -11 }], 
},
  photoButton:{
    width: 112,
    height: 112,
    borderRadius: 12,
    backgroundColor: '#F3F3F3',
    position: 'relative'
  },
  plusButton:{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -7 }, { translateY: -7 }], 
  },
  startButton:{
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 18
  },
  buttonText:{
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'center'
  }
});

export default DetailsStep;