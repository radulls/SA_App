import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Platform, Image, Modal, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import InputFieldUpload from "../InputFieldUpload";
import Button from "../Button";
import CloseIcon from "@/components/svgConvertedIcons/closeIcon"; // Ваш крестик для закрытия
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

const VerificationPhotoForm: React.FC<Props> = ({ value, onDataChange, onSubmit }) => {
  const [error, setError] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const requestPermissions = async () => {
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

      if (!mediaLibraryPermission.granted || !cameraPermission.granted) {
        setError("Для работы приложения необходимо разрешить доступ к камере и галерее.");
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  const pickImage = async (type: "passportPhoto" | "selfiePhoto") => {
    try {
      if (Platform.OS === "web") {
        if (type === "passportPhoto") {
          // Открываем окно выбора файла
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.onchange = (event: any) => {
            const file = event.target.files[0];
            if (file) {
              const uri = URL.createObjectURL(file);
              onDataChange({ [type]: { uri, file } });
            }
          };
          input.click();
        } else {
          // Включаем камеру в модальном окне
          setIsCameraOpen(true);
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
            setVideoStream(stream);
          } catch (err) {
            setError("Ошибка доступа к камере");
            console.error(err);
          }
        }
      } else {
        // Expo-приложение (галерея для паспорта)
        const options = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
        };

        const result = await ImagePicker.launchImageLibraryAsync(options);

        if (!result.canceled && result.assets) {
          const uri = result.assets[0].uri;
          onDataChange({ [type]: { uri } });
        }
      }
    } catch (error) {
      console.error("Ошибка выбора изображения:", error);
      setError("Ошибка загрузки изображения.");
    }
  };

  const takeSelfie = () => {
    if (videoRef.current && videoStream) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const context = canvas.getContext("2d");
  
      context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  
      const uri = canvas.toDataURL("image/jpeg");
      setSelfiePreview(uri);
  
      // Закрываем камеру
      closeCamera();
    }
  };
  
  const closeCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
    setIsCameraOpen(false);
  };

  const confirmSelfie = () => {
    if (selfiePreview) {
      onDataChange({ selfiePhoto: { uri: selfiePreview } });
      setSelfiePreview(null);
      setIsCameraOpen(false);
    }
  };

  return (
    <View>
      {error && <ErrorMessage message={error} />}
      <Text style={styles.stepIndicator}>Шаг 2 из 2</Text>
      <Text style={styles.instructions}>
        Добавьте главную страницу паспорта гражданина РФ и ваше фото в реальном времени, чтобы подтвердить, что вы - это вы.
      </Text>

      {/* Загрузка паспорта */}
      <InputFieldUpload
        label="Паспорт"
        sublabel="(Главная страница)"
        onPress={() => pickImage("passportPhoto")}
        isUploaded={!!value.passportPhoto}
      />
      {/* Загрузка селфи */}
      <InputFieldUpload
        label="Ваше фото"
        onPress={() => pickImage("selfiePhoto")}
        isUploaded={!!value.selfiePhoto}
      />
      <View style={styles.lockTextContainer}>
        <View style={styles.iconContainer}>
        <LockIcon />
        </View>
        <Text style={styles.text}>
          После верификации аккаунта, информация удаляется, не передаётся и не хранится на серверах, в целях нашей и вашей безопасности.
        </Text>
      </View>

      <Button title="Отправить" onPress={onSubmit} disabled={!value.passportPhoto || !value.selfiePhoto} />

      {/* Модальное окно для камеры */}
      <Modal visible={isCameraOpen} transparent>
        <View style={styles.containerModal}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={closeCamera}>
              <CloseIcon />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Сделайте селфи</Text>
            <video ref={videoRef} autoPlay playsInline style={styles.video} />
            <TouchableOpacity style={styles.captureButton} onPress={takeSelfie} />
          </View>
        </View>
      </Modal>

      {/* Превью перед подтверждением селфи */}
      {selfiePreview && (
        <Modal visible={true} transparent>
          <View style={styles.containerModal}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setSelfiePreview(null)}>
              <CloseIcon />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Подтвердите фото</Text>
            <Image source={{ uri: selfiePreview }} style={styles.preview} />
            <Button title="Подтвердить" onPress={confirmSelfie} />
          </View>
          </View>      
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  stepIndicator: {
    fontSize: 18,
    marginTop: 150,
    color: "#fff",
    fontFamily: "SFUIDisplay-Bold",
  },
  instructions: {
    fontSize: 12,
    marginTop: 10,
    marginBottom: 26,
    color: "#fff",
    fontFamily: "SFUIDisplay-regular",
  },
  lockTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', 
    marginTop: 22,
    marginBottom: 20,
	},
  iconContainer: {
    width: 22, 
    height: 22, 
    marginRight: 8, 
    flexShrink: 0, 
  },
  text: {
		fontSize: 10,
    color: '#fff',
    fontFamily: "SFUIDisplay-medium",
	},
  containerModal:{
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    alignItems: "center",
  },
  modalContainer: {
    maxWidth: 600,
    width: '100%',
    height: '100%',
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  modalTitle: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 20,
    fontFamily: "SFUIDisplay-medium",
  },
  video: {
    width: 320,
    height: 240,
    backgroundColor: "black",
  },
  preview: {
    width: 320,
    height: 240,
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 80,
    left: 26,
  },
  captureButton: {
    width: 70,
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 35,
    marginTop: 20,
  },
});

export default VerificationPhotoForm;