import React, { useState } from 'react';

import { View, ScrollView, StyleSheet, Image, Text, Pressable } from "react-native";
// import Header from "./Header";
import InputFieldBlack from "./InputFieldBlack";
import InputFieldUpload from "./InputFieldUpload";
// import SecurityInfo from "./SecurityInfo";
import Button from "./Button";
import VerificationPageStart from "./notify/VerificationPageStart";
import VerificationPageProgress from "./notify/VerificationPageProgress";
import VerificationPageDecline from "./notify/VerificationPageDecline";
import VerificationPageDelete from "./notify/VerificationPageDelete";
import VerificationPageSub from "./notify/VerificationPageSub";

import { router } from 'expo-router';

function Verification() {
	let [step, setStep] = useState(0);

	const toNextStep = () => {
		let nextStep = step + 1;
		console.log('toNextStep', step, nextStep);
		if (nextStep > 6) {
			router.push('/home');
		}
		setStep(nextStep);
	};

	const goBack = () => {
		router.push('/verification/start'); // Navigate to VerificationPageStart
	};

	

	return (
		<View style={styles.container}>
			<View style={styles.headerIcons}>
				{/* <Image
					resizeMode="contain"
					source={{ uri: '12' }}
					style={styles.backIcon}
					onPress={goBack}
				/> */}
				{/* <Text style={styles.headerTitle}>Верификация</Text> */}
			</View>

			<ScrollView contentContainerStyle={styles.scrollViewContent}>
				{step === 0 && <View style={styles.startVer}>
					<VerificationPageStart onStart={() => { setStep(1) }} />
				</View>}
				{step === 3 && <View style={styles.startVer}>
					<VerificationPageProgress onStart={() => { setStep(4) }} />
				</View>}
				{step === 4 && <View style={styles.startVer}>
					<VerificationPageDecline onStart={() => { setStep(5) }} />
				</View>}
				{step === 5 && <View style={styles.startVer}>
					<VerificationPageSub onStart={() => { setStep(6) }} />
				</View>}
				{step === 6 && <View style={styles.startVer}>
					<VerificationPageDelete onStart={() => { setStep(7) }} />
				</View>}
				<View style={styles.content}>
					{step === 1 && (
						<View>
							<Text style={styles.stepIndicator1}>Шаг 1 из 2</Text>
							<Text style={styles.instructions}>
								Укажите реальные имя и фамилию, для построения безопасной среды, необходимо знать своих друзей.
							</Text>
							<InputFieldBlack label="Имя" />
							<InputFieldBlack label="Фамилия" />
						</View>
					)}
					{step === 2 && (
						<View>
							<Text style={styles.stepIndicator2}>Шаг 2 из 2</Text>
							<Text style={styles.instructions}>
								Добавьте главную страницу паспорта гражданина РФ и ваше фото в реальном времени, чтобы подтвердить, что вы - это вы.
							</Text>
							<InputFieldUpload label="Паспорт" sublabel="(Главная страница)" />
							<InputFieldUpload label="Ваше фото" />
						</View>
					)}

					{ (step === 1 || step === 2) && 
					<View>
						<View style={styles.lockTextContainer}>
							<Image
								source={require('../assets/images/verification/lock.png')}
								style={styles.lockIcon}
							/>
							<Text style={styles.text}>
								После верификации аккаунта, информация удаляется, не передаётся и не хранится на серверах, в целях нашей и вашей безопасности.
							</Text>
						</View>
						<Button title="Далее" onPress={toNextStep} />
					</View> }
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'rgba(255, 255, 255, 0.9)',
		flex: 1,
		width: '100%',
		// minWidth: 300,
		alignItems: 'center',
	},
	headerIcons: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		// paddingHorizontal: 16,
		// marginTop: 55,
		position: 'relative',
		maxWidth: 600,
		height: 22,
	},
	backIcon: {
		width: 8,
		aspectRatio: 0.57,
		tintColor: 'black',
		position: 'absolute',
		left: 16,
	},
	headerTitle: {
		fontSize: 15,
		// fontFamily: "SFUIDisplay-Bold",
		color: 'black',
		textAlign: 'center',
		width: '100%',
	},
	startVer: {
		// position: 'absolute',
		// top: 0,
		// zIndex: 999,
		height: '100%',
		width: 400,
	},
	scrollViewContent: {
		flexGrow: 1,
		width: '100%',
		// minWidth: 300,

	},
	content: {
		backgroundColor: "rgba(255, 255, 255, 1)",
		width: "100%",
		height: '100%',
		flexDirection: "column",
		// position:'absolute',
		top: 0,
		left: 0,
		minWidth: 400,
		paddingLeft: 16,
		paddingRight: 16,
		paddingBottom: 41,
		// maxWidth: 600,
	},
	stepIndicator1: {
		// fontFamily: "SFUIDisplay-Bold",
		fontSize: 18,
		marginTop: 186,
	},
	stepIndicator2: {
		// fontFamily: "SFUIDisplay-Bold",
		fontSize: 18,
		marginTop: 148,
	},
	instructions: {
		fontSize: 12,
		// fontFamily: "SFUIDisplay-Regular",
		marginTop: 10,
		marginBottom: 26,
	},
	textContainer: {
		flexGrow: 1,
		marginTop: 10,
		marginBottom: 20,
	},
	lockTextContainer: {
		width: '90%',
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 22,
		zIndex: 999999,
		marginBottom: 20,
	},
	lockIcon: {
		height: 22,
		width: 22,
		marginRight: 8,
	},
	text: {
		fontSize: 10,
		// fontFamily: "SFUIDisplay-Regular",
	},
	Button: {
		marginBottom: 41,
	}
});

export default Verification;