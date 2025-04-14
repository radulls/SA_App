import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Subdivision } from '@/types/subdivision';
import { IMAGE_URL } from '@/api';
import InputField from '@/components/eventCreation/InputField';
import { updateSubdivision } from '@/api/adminApi';
import EditSubdivisionAvatarModal from './EditSubdivisionAvatarModal';
import UploadPhoto from '@/components/svgConvertedIcons/settings/uploadPhoto';
import Toast from 'react-native-toast-message';
import BottomSheetMenu from '@/components/Menu/BottomSheetMenu';
import * as ImagePicker from 'expo-image-picker';
import CustomModal from '../CustomModal';

interface SubdivisionInformationProps {
  onBack: () => void;
  info: Subdivision;
  allSubdivisions: Subdivision[]; // 👈 добавь сюда
}

const SubdivisionInformation: React.FC<SubdivisionInformationProps> = ({ onBack, info, allSubdivisions }) => {
  if (!info) return null;

  // Инициализация состояний
  const sharedAvatarUri = info.sharedAvatar || null;
  const [description, setDescription] = useState(info.description || '');
  const initialAvatarUri = info.avatar?.startsWith('http') || info.avatar?.startsWith('file://')
    ? info.avatar
    : `${IMAGE_URL}${info.avatar}`;
  
  const [avatarUri, setAvatarUri] = useState<string>(initialAvatarUri);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const [applyToAll, setApplyToAll] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isSharedApplied, setIsSharedApplied] = useState(() => {
    // Проверяем при инициализации, совпадает ли текущий аватар с общим
    return initialAvatarUri === sharedAvatarUri;
  });
  const [sharedStylePressed, setSharedStylePressed] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAvatarMenuVisible, setAvatarMenuVisible] = useState(false);
  const [isStyleChoiceVisible, setStyleChoiceVisible] = useState(false);

  const hasSharedAvatar = !!sharedAvatarUri;

  // Эффект для отслеживания изменений avatarUri
  useEffect(() => {
    setIsSharedApplied(avatarUri === sharedAvatarUri);
  }, [avatarUri, sharedAvatarUri]);

  const handleSave = async () => {
    try {
      setUploading(true);
  
      const avatarSource = localAvatar || (sharedStylePressed ? sharedAvatarUri : null);
      const applyToAllSubs = applyToAll || sharedStylePressed;
  
      // 1. Если аватар выбран и нужно применить ко всем
      if (avatarSource && applyToAllSubs && info.city && typeof info.city === 'object' && '_id' in info.city) {
        const cityId = info.city._id;
  
        const subsInCity = allSubdivisions.filter(sub => {
          const city = sub.city;
          return typeof city === 'object' && '_id' in city && city._id === cityId;
        });
  
        await Promise.all(
          subsInCity.map(async (sub) => {
            const formData = new FormData();
  
            if (Platform.OS === 'web') {
              const mimeMatch = avatarSource.match(/^data:(image\/[a-zA-Z]+);base64,/);
              const fileType = mimeMatch ? mimeMatch[1] : 'image/png';
              const blob = await fetch(avatarSource).then(res => res.blob());
              formData.append('avatar', blob, 'avatar.png');
            } else {
              const fileName = avatarSource.split('/').pop() || 'avatar.jpg';
              const fileType = fileName.split('.').pop() || 'jpg';
              formData.append('avatar', {
                uri: avatarSource,
                name: fileName,
                type: `image/${fileType}`,
              } as any);
            }
  
            formData.append('applyToAll', 'true');
  
            return updateSubdivision(sub._id, {}, formData);
          })
        );
      }
  
      // 2. Всегда обновляем описание и/или avatar для текущего подразделения
      const formData = new FormData();
  
      // Если изменён avatar — прикладываем его
      if (avatarSource) {
        if (Platform.OS === 'web') {
          const mimeMatch = avatarSource.match(/^data:(image\/[a-zA-Z]+);base64,/);
          const fileType = mimeMatch ? mimeMatch[1] : 'image/png';
          const blob = await fetch(avatarSource).then(res => res.blob());
          formData.append('avatar', blob, 'avatar.png');
        } else {
          const fileName = avatarSource.split('/').pop() || 'avatar.jpg';
          const fileType = fileName.split('.').pop() || 'jpg';
          formData.append('avatar', {
            uri: avatarSource,
            name: fileName,
            type: `image/${fileType}`,
          } as any);
        }
      }
  
      // description — **только для текущего info**
      formData.append('description', description);
  
      await updateSubdivision(info._id, {}, formData);
  
      Toast.show({
        type: 'success',
        text1: 'Данные подразделения обновлены.',
      });
  
      onBack();
    } catch (error) {
      console.error('❌ Ошибка при сохранении:', error);
      Toast.show({
        type: 'error',
        text1: 'Не удалось обновить подразделение.',
      });
    } finally {
      setUploading(false);
    }
  };  
  
  const handleAvatarPress = () => setAvatarMenuVisible(true);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      const uri = result.assets[0].uri;
      setLocalAvatar(uri);
      setAvatarUri(uri);
      setSharedStylePressed(false); // ← сбрасываем вручную
      
      if (isSharedApplied) {
        // Если общий стиль применен, сразу сохраняем для всех
        setApplyToAll(true);
        handleSave();
      } else {
        // Показываем выбор применения стиля
        setTimeout(() => setStyleChoiceVisible(true), 100);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formWrapper}>
        <EditSubdivisionAvatarModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onAvatarChange={(uri, applyAll) => {
            setLocalAvatar(uri);
            setAvatarUri(uri);
            setApplyToAll(applyAll);
            setIsSharedApplied(applyAll);
            setSharedStylePressed(false);
            setModalVisible(false);
          }}
          initialUri={avatarUri}
        />

        <BottomSheetMenu
          isVisible={isAvatarMenuVisible}
          onClose={() => setAvatarMenuVisible(false)}
          buttons={[
            {
              label: 'Применить общий стиль',
              onPress: () => {
                if (sharedAvatarUri && avatarUri !== sharedAvatarUri) {
                  setAvatarUri(sharedAvatarUri);
                  setLocalAvatar(sharedAvatarUri); // нужно для FormData
                }
                setSharedStylePressed(true);
                setApplyToAll(true);
                // Меню остаётся открытым, пользователь сам жмёт "Сохранить"
              },
              labelColor: sharedStylePressed ? '#000' : '#888',
              disabled: !hasSharedAvatar,
            }
            ,            
            {
              label: 'Новое изображение',
              onPress: () => {
                setAvatarMenuVisible(false);
                if (sharedStylePressed) {
                  pickImage(); // если кнопка чёрная — сразу загружаем
                } else {
                  setModalVisible(true); // если серая — открываем модалку
                }
              },
            },
          ]}
        />
        <TouchableOpacity onPress={handleAvatarPress} style={styles.photoContainer}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            <View style={styles.photoIcon}>
              <UploadPhoto />
            </View>
          </View>
        </TouchableOpacity>

        <InputField
          label="О себе"
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={80}
          isLarge
        />

        <Text style={styles.subtitle}>Информация будет отображаться на странице подразделения.</Text>
      </View>

      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={handleSave} 
        disabled={uploading}
      >
        <Text style={styles.saveButtonText}>
          {uploading ? 'Сохраняем...' : 'Сохранить'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  formWrapper: {},
  photoContainer: {
    width: '100%',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    alignSelf: 'center',
    backgroundColor: '#F3F3F3',
  },
  photoIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    marginBottom: 20,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SubdivisionInformation;