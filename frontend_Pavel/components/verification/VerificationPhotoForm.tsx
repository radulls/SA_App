import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import InputFieldUpload from "../InputFieldUpload";
import Button from "../Button";
import LockIcon from "../svgConvertedIcons/LockIcon";
import ErrorMessage from "../ErrorMessage";

interface Props {
  value: {
    passportPhoto: string | null;
    selfiePhoto: string | null;
  };
  onDataChange: (data: any) => void;
  onSubmit: () => void;
}

const VerificationPhotoForm: React.FC<Props> = ({
  value,
  onDataChange,
  onSubmit,
}) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!cameraPermission.granted || !mediaLibraryPermission.granted) {
        setError(
          "Для работы приложения необходимо разрешить доступ к камере и галерее."
        );
      }
    };

    requestPermissions();
  }, []);

  const pickImage = async (type: "passportPhoto" | "selfiePhoto") => {
    try {
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        cameraType: type === "selfiePhoto" ? ImagePicker.CameraType.front : undefined,
      };

      const result =
        type === "selfiePhoto"
          ? await ImagePicker.launchCameraAsync(options)
          : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets) {
        const uri = result.assets[0].uri;

        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) {
          setError(`Файл ${type} не существует.`);
          return;
        }

        onDataChange({ [type]: uri });
      }
    } catch (error) {
      console.error("Ошибка выбора изображения:", error);
      setError("Ошибка загрузки");
    }
  };

  const dismissError = () => {
    setError(null);
  };

  return (
    <View>
      {error && (
        <ErrorMessage
          message={error}
        />
      )}
      <Text style={styles.stepIndicator}>Шаг 2 из 2</Text>
      <Text style={styles.instructions}>
        Добавьте главную страницу паспорта гражданина РФ и ваше фото в реальном
        времени, чтобы подтвердить, что вы - это вы.
      </Text>

      {/* Загрузка паспорта */}
      <InputFieldUpload
        label="Паспорт"
        sublabel="(Главная страница)"
        onPress={() => pickImage("passportPhoto")}
        isUploaded={!!value.passportPhoto} // Пропс для изменения текста
      />

      {/* Загрузка селфи */}
      <InputFieldUpload
        label="Ваше фото"
        onPress={() => pickImage("selfiePhoto")}
        isUploaded={!!value.selfiePhoto} // Пропс для изменения текста
      />

      <View style={styles.lockTextContainer}>
        <LockIcon />
        <Text style={styles.text}>
          После верификации аккаунта, информация удаляется, не передаётся и не
          хранится на серверах, в целях нашей и вашей безопасности.
        </Text>
      </View>

      {/* Кнопка отправки */}
      <Button
        title="Отправить"
        onPress={onSubmit}
        disabled={!value.passportPhoto || !value.selfiePhoto}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  stepIndicator: {
    fontSize: 18,
    marginTop: 186,
    color: "#fff",
    fontWeight: "700",
  },
  instructions: {
    fontSize: 12,
    marginTop: 10,
    marginBottom: 26,
    color: "#fff",
    fontWeight: "400",
  },
  lockTextContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
    marginBottom: 20,
  },
  text: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500",
  },
});

export default VerificationPhotoForm;
