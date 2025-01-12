import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";

interface VerificationPageSubProps {
  onStart: (value: string) => void;
}


const VerificationPageSub: React.FC<VerificationPageSubProps> = ({onStart}) => {
	return (
		<View style={styles.container}>
			<View style={styles.contentWrapper}>
				<View style={styles.card}>
					<Image
						resizeMode="contain"
						source={require('../../assets/images/sub_noti.png')}
						style={styles.verificationImage}
						accessibilityLabel="Verification illustration"
					/>
					<Text style={styles.title}>Подписка</Text>
					<Text style={styles.description}>
					В объединении предусмотрена платная подписка, это необходимо для работы объединения и создания бюджета, из которого финансируются добрые дела.
					</Text>
					<TouchableOpacity style={styles.verifyButton} onPress={() => onStart}accessibilityRole="button">
						<Text style={styles.buttonText}>Далее</Text>
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
		backgroundColor: "#FFD200",
		padding: 25,
      alignItems: "center",
      maxWidth: 414,
      width: "100%",  
      alignSelf: "center", 
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
      marginBottom: 32,
  },
	verifyButton: {
      borderRadius: 8,
      backgroundColor: "rgba(0, 0, 0, 1)",
      paddingVertical: 15,
      paddingHorizontal: 0, 
      width: "100%",  
      alignItems: "center", 
	},
	buttonText: {
		color: "rgba(255, 255, 255, 1)",
		fontWeight: "700",
		fontSize: 12,
		// fontFamily: "SF UI Display, sans-serif",
	},
});

export default VerificationPageSub;