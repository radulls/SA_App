import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import IconStartVerification from "../svgConvertedIcons/Verification/iconStartVerification";

interface VerificationPageProgressProps {
  onStart: (value: string) => void;
}

const VerificationRejected: React.FC<VerificationPageProgressProps> = ({onStart}) => {
	return (
		<View style={styles.container}>
			<View style={styles.contentWrapper}>
				<View style={styles.card}>
					<IconStartVerification/>
					<Text style={styles.title}>Верификация не пройдена</Text>
					<Text style={styles.description}>
						Ваш запрос на верификацию и активацию аккаунта отклонён. Вы можете попробовать ещё раз.
					</Text>
					<TouchableOpacity style={styles.verifyButton} onPress={() => onStart} accessibilityRole="button">
						<Text style={styles.buttonText}>Хорошо</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.cardsmall}>
					<Text style={styles.subtitle}>Комментарий:</Text>
					<Text style={styles.subdescription}>
						Фотография не читаема, сделайте более чёткую фотографию или скан.
					</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
container: {
	flex: 1,
	alignItems: "center",
},
contentWrapper: {
	maxWidth: 600,
	width: '100%',
	height: '100%',
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
	cardsmall: {
		borderRadius: 16,
		backgroundColor: "rgba(98, 54, 255, 1)",
		padding: 16,
		marginTop: 12,
		maxWidth: 600,
	},
	verificationImage: {
		width: 167,
		aspectRatio: 1.06,
		marginBottom: 21,
	},
    title: {
		fontSize: 18,
		fontFamily: "SFUIDisplay-Bold",
		color: "rgba(255, 255, 255, 1)",
		textAlign: "center",
		marginTop: 20,
		marginBottom: 8,
		},
	subtitle: {
		fontSize: 12,
		fontFamily: "SFUIDisplay-Bold",
		color: "rgba(255, 255, 255, 1)",
		marginBottom: 8,
	},
	description: {
		fontFamily: "SFUIDisplay-Regular",
		 color: "rgba(255, 255, 255, 1)",
		 textAlign: "center",
		 marginBottom: 32,
		 fontSize: 12,
	   },
   subdescription: {
    fontFamily: "SFUIDisplay-Regular",
    color: "rgba(255, 255, 255, 1)",
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
		fontFamily: "SFUIDisplay-Bold",
	},
});

export default VerificationRejected;