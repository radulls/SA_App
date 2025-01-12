import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";

interface VerificationPageStartProps {
  onStart: (value: string) => void;
}

const VerificationPageStart: React.FC<VerificationPageStartProps> = ({ onStart }) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.card}>
          <Image
            resizeMode="contain"
            source={require('../../assets/images/Group 6.png')}
            style={styles.verificationImage}
            accessibilityLabel="Verification illustration"
          />
          <Text style={styles.title}>Верификация страницы</Text>
          <Text style={styles.description}>
            Благодаря верификации мы создаём безопасную среду добрососедства. Пройдите верификацию, чтобы открыть все разделы объединения.
          </Text>
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={() => onStart('verification')} // Вызов функции onStart
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Пройти</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    flex: 1,
    width: "100%",
    alignItems: "stretch",
  },
  contentWrapper: {
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    flex: 1,
    justifyContent: "center",
    padding: 30,
  },
  card: {
    borderRadius: 16,
    backgroundColor: "rgba(98, 54, 255, 1)",
    padding: 25,
    alignItems: "center",
    maxWidth: 414,
    width: "100%",  // Добавляем ширину 100% для равномерного распределения
    alignSelf: "center", // Центрируем карточку по горизонтали
  },
  verificationImage: {
    width: 167,
    aspectRatio: 1.06,
    marginBottom: 21,
  },
  title: {
    fontSize: 18,
    // fontFamily: "SFUIDisplay-Bold",
    color: "rgba(255, 255, 255, 1)",
    textAlign: "center",
    marginBottom: 14,
  },
  description: {
    // fontFamily: "SFUIDisplay-Regular",
    color: "rgba(255, 255, 255, 1)",
    textAlign: "center",
    marginBottom: 32,
    fontSize: 12,
  },
  verifyButton: {
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 1)",
    paddingVertical: 15,
    paddingHorizontal: 0,  // Убираем горизонтальные отступы, чтобы кнопка заполнила контейнер
    width: "100%",  // Ширина кнопки равна ширине контейнера
    alignItems: "center", // Центрируем текст в кнопке
  },
  buttonText: {
    color: "rgba(255, 255, 255, 1)",
    fontWeight: "700",
    fontSize: 12,
    // fontFamily: "SFUIDisplay-Bold",
  },
});

export default VerificationPageStart;
