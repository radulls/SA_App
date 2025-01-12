import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";

const VerificationPageStart = ({ onStart }) => {
	return (
		<View style={styles.container}>
			<View style={styles.contentWrapper}>
				<View style={styles.card}>
					<Image
						resizeMode="contain"
						source={require('../../assets/images/Snowflake.png')}
						style={styles.verificationImage}
						accessibilityLabel="Verification illustration"
					/>
					<Text style={styles.title}>Ваша страница удалена</Text>
					<Text style={styles.description}>
						мошенничество и обман. Вы можете обжаловать решение, связавшись с администратором в telegram.
					</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		flex: 1,
		maxWidth: 480,
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
		backgroundColor: "rgba(0, 0, 0, 1)",
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
      fontSize: 12,
      marginBottom: 41,
  },
});

export default VerificationPageStart;