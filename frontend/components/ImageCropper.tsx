import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  Button,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { GestureHandlerRootView, GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

interface ImageCropperProps {
  onCropComplete: (uri: string) => void;
  initialImageUri: string;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ onCropComplete, initialImageUri }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Shared values for cropping
  const cropX = useSharedValue(width / 4);
  const cropY = useSharedValue(height / 4);
  const cropWidth = useSharedValue(width / 2);
  const cropHeight = useSharedValue(height / 4);

  useEffect(() => {
    setImageUri(initialImageUri);
  }, [initialImageUri]);

  const cropStyle = useAnimatedStyle(() => ({
    left: withSpring(cropX.value),
    top: withSpring(cropY.value),
    width: withSpring(cropWidth.value),
    height: withSpring(cropHeight.value),
  }));

  const cropImage = async () => {
    if (!imageUri) return;

    try {
      const cropped = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX: cropX.value,
              originY: cropY.value,
              width: cropWidth.value,
              height: cropHeight.value,
            },
          },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      Alert.alert("Успех", "Изображение обрезано!");
      onCropComplete(cropped.uri);
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось обрезать изображение.");
    }
  };

  const panGesture = Gesture.Pan().onUpdate((e) => {
    cropX.value = Math.min(
      Math.max(0, cropX.value + e.translationX),
      width - cropWidth.value
    );
    cropY.value = Math.min(
      Math.max(0, cropY.value + e.translationY),
      height - cropHeight.value
    );
  });

  const pinchGesture = Gesture.Pinch().onUpdate((e) => {
    const newWidth = cropWidth.value * e.scale;
    const newHeight = cropHeight.value * e.scale;

    if (
      cropX.value + newWidth <= width &&
      cropY.value + newHeight <= height &&
      newWidth >= 50 &&
      newHeight >= 50
    ) {
      cropWidth.value = newWidth;
      cropHeight.value = newHeight;
    }
  });

  if (!imageUri) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <GestureDetector gesture={Gesture.Simultaneous(panGesture, pinchGesture)}>
        <Animated.View style={[styles.cropBox, cropStyle]} />
      </GestureDetector>
      <Button title="Обрезать" onPress={cropImage} />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  cropBox: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "red",
  },
});

export default ImageCropper;
