export type RootStackParamList = {
  VerificationPhotoForm: undefined; // Экран без параметров
  CropImageScreen: {                // Экран с параметрами
    uri: string;                    // URI выбранного изображения
    onCropComplete: (croppedUri: string) => void; // Callback для завершения обрезки
  };
};
