import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import DeleteAccountIcon from "../svgConvertedIcons/Verification/deletetAccountIcon";

interface VerificationPageProgressProps {
  onStart: (value: string) => void;
}


const VerificationPageDeleted: React.FC<VerificationPageProgressProps> = ({onStart}) => {
	return (
		<View style={styles.container}>
			<View style={styles.contentWrapper}>
				<View style={styles.card}>
					<DeleteAccountIcon/>
					<Text style={styles.title}>Ваша страница удалена</Text>
					<Text style={styles.description}>
						По причине: мошенничество и обман. Вы можете обжаловать решение, связавшись с администратором в telegram.
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
		fontFamily: "SFUIDisplay-Bold",
		color: "rgba(255, 255, 255, 1)",
		textAlign: "center",
		marginTop: 20,
		marginBottom: 8,
		},
   description: {
      fontFamily: "SFUIDisplay-Regular",
      color: "rgba(255, 255, 255, 1)",
      textAlign: "center",
      fontSize: 12,
      marginBottom: 30,
  },
});

export default VerificationPageDeleted;