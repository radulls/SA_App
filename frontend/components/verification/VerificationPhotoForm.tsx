import React, { useEffect } from 'react';
import { View, Text, Image, Alert, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import InputFieldUpload from '../InputFieldUpload';
import Button from '../Button';
import LockIcon from '../svgConvertedIcons/LockIcon';

interface Props {
  value: {
    passportPhoto: string | null;
    selfiePhoto: string | null;
  };
  onDataChange: (data: any) => void;
  onSubmit: () => void;
}

const VerificationPhotoForm: React.FC<Props> = ({ value, onDataChange, onSubmit }) => {
  useEffect(() => {
    // Запрашиваем разрешения при загрузке компонента
    const requestPermissions = async () => {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!cameraPermission.granted || !mediaLibraryPermission.granted) {
        Alert.alert(
          'Ошибка',
          'Для работы приложения необходимо разрешить доступ к камере и галерее.'
        );
      }
    };

    requestPermissions();
  }, []);

  const pickImage = async (type: 'passportPhoto' | 'selfiePhoto') => {
    try {
      const options =
        type === 'selfiePhoto'
          ? {
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 1,
              allowsEditing: true, // Включаем встроенную обрезку
              cameraType: ImagePicker.CameraType.front, // Открывает фронтальную камеру
            }
          : {
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 1,
              allowsEditing: true, // Включаем встроенную обрезку
            };

      const result =
        type === 'selfiePhoto'
          ? await ImagePicker.launchCameraAsync(options) // Открывает камеру для селфи
          : await ImagePicker.launchImageLibraryAsync(options); // Открывает галерею для паспорта

      if (!result.canceled && result.assets) {
        const uri = result.assets[0].uri;

        // Проверяем существование файла
        const fileInfo = await FileSystem.getInfoAsync(uri);
        console.log(`Информация о файле ${type}:`, fileInfo);

        if (!fileInfo.exists) {
          Alert.alert('Ошибка', `Файл ${type} не существует.`);
          return;
        }

        // Сохраняем путь к обработанному изображению
        onDataChange({ [type]: uri });
      }
    } catch (error) {
      console.error('Ошибка выбора изображения:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать изображение.');
    }
  };

  return (
    <View>
      <Text style={styles.stepIndicator}>Шаг 2 из 2</Text>
      <Text style={styles.instructions}>
        Добавьте главную страницу паспорта гражданина РФ и ваше фото в реальном времени, чтобы подтвердить, что вы - это вы.
      </Text>

      {/* Загрузка паспорта */}
      <InputFieldUpload
        label="Паспорт"
        sublabel="(Главная страница)"
        onPress={() => pickImage('passportPhoto')} // Открывает галерею
      />
      {value.passportPhoto && (
        <Image source={{ uri: value.passportPhoto }} style={{ width: 100, height: 100, marginVertical: 10 }} />
      )}
      {/* Загрузка селфи */}
      <InputFieldUpload
        label="Ваше фото"
        onPress={() => pickImage('selfiePhoto')} // Открывает камеру
      />
      {value.selfiePhoto && (
        <Image source={{ uri: value.selfiePhoto }} style={{ width: 100, height: 100, marginVertical: 10 }} />
      )}
      <View style={styles.lockTextContainer}>
        <LockIcon />
        <Text style={styles.text}>
          После верификации аккаунта, информация удаляется, не передаётся и не хранится на серверах, в целях нашей и вашей безопасности.
        </Text>
      </View>

      {/* Кнопка отправки */}
      <Button title="Отправить" onPress={onSubmit} disabled={!value.passportPhoto || !value.selfiePhoto} />
    </View>
  );
};

const styles = StyleSheet.create({
  stepIndicator: {
    fontSize: 18,
    marginTop: 186,
    color: '#fff',
    fontWeight: '700',
  },
  instructions: {
    fontSize: 12,
    marginTop: 10,
    marginBottom: 26,
    color: '#fff',
    fontWeight: '400',
  },
  lockTextContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    zIndex: 999999,
    marginBottom: 20,
  },
  text: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
});

export default VerificationPhotoForm;
