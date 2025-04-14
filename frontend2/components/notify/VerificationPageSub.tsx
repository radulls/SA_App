import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import SubsIcon from "../svgConvertedIcons/Verification/subsIcon";

interface VerificationPageSubProps {
  onStart: (value: string) => void;
}

const VerificationPageSub: React.FC<VerificationPageSubProps> = ({onStart}) => {
	return (
		<View style={styles.container}>
			<View style={styles.contentWrapper}>
				<View style={styles.card}>
					<SubsIcon/>
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
    marginBottom: 32,
    fontSize: 12,
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
		fontFamily: "SFUIDisplay-Bold",
	},
});

export default VerificationPageSub;