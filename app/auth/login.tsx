import React, { useState } from 'react';

import { View, Text, ScrollView, StyleSheet } from 'react-native';
import InputField from '../../components/InputField';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button';
import { Link } from 'expo-router';
import Helper from '../../components/Helper';
import { router } from 'expo-router';

const LoginScreen = () => {
	const [formData, setFormData] = useState({});
	const [errorMessage, setErrorMessage] = useState('')
	const handleSubmit = async () => {
		console.log('handleSubmit')
		let loginResponse = await Helper.post('users/login', formData)
		console.log('loginResponse', loginResponse)
		if (!loginResponse.user) {
			setErrorMessage('Неправильный логин')
		} else {
			await Helper.storeUser(loginResponse.user)
			router.push('/home');
		}
		// if (loginResponse.user.status == 'verification_request') {

		// }
	};
	return (
		<ScrollView contentContainerStyle={styles.scrollContainer}>
			<View style={styles.container}>
				<View style={styles.content}>
					<View style={styles.logo} />
					<View style={styles.formContainer}>
						<Text style={styles.title}>Вход</Text>
						<InputField label="Телефон, id или почта" onChange={e => setFormData({...formData, email: e})} />
						<View style={styles.passwordContainer}>
							<Text style={styles.passwordLabel}>Пароль</Text>
							<Link style={styles.forgotPassword} href="/forgot">Забыли пароль?</Link>
							{/* <Text style={styles.forgotPassword}>Забыли пароль?</Text> */}
						</View>
						<InputField secureTextEntry onChange={e => setFormData({...formData, password: e})} />
						{errorMessage &&  <View style={styles.erorMessageWrapper}>
								<ErrorMessage message={errorMessage}/>
							</View>
						}
						<View style={styles.footer}>
							<Text style={styles.signUpText}>
								<Text style={styles.signUpTextGray}>У вас ещё нет аккаунта? </Text>
								<Link style={styles.signUpTextBlue} href="/register">Зарегистрироваться</Link>
								{/* <Text style={styles.signUpTextBlue}>Зарегистрироваться</Text> */}
							</Text>
							<Button onPress={handleSubmit} title="Войти" />
						</View>
					</View>
				</View>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	scrollContainer: {
		flexGrow: 1,
		backgroundColor: 'rgba(255, 255, 255, 1)',
	},
	container: {
		flexGrow: 1,
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 100)',
	},
	erorMessageWrapper: {
		marginTop: 40
	},
	content: {
		backgroundColor: 'rgba(0, 0, 0, 100)',
		paddingHorizontal: 16,
		paddingTop: 59,
		maxWidth: 600,
		width: '100%',
	},
	logo: {
		backgroundColor: 'rgba(67, 67, 67, 1)',
		alignSelf: 'center',
		width: 186,
		height: 240,
	},
	formContainer: {
		marginTop: 28,
		flex: 1,
	},
	title: {
		color: 'rgba(255, 255, 255, 1)',
		fontSize: 18,
		fontWeight: '700',
		marginBottom: 27,
		// fontFamily: "SFUIDisplay-Bold",
	},
	passwordContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	passwordLabel: {
		color: 'rgba(255, 255, 255, 1)',
		fontSize: 14,
		// fontFamily: 'SFUIDisplay-Bold',
		maxWidth: '50%',
	},
	forgotPassword: {
		color: 'rgba(148, 179, 255, 1)',
		fontSize: 12,
		// fontFamily: 'SFUIDisplay-Bold',
	},
	signUpText: {
		fontSize: 12,
		fontWeight: '500',
		textAlign: 'center',
		marginTop: 22,
		marginBottom: 20,
	},
	signUpTextGray: {
		color: 'rgba(139, 139, 139, 1)',
		// fontFamily: 'SFUIDisplay-regular',
	},
	signUpTextBlue: {
		// fontFamily: 'SFUIDisplay-Bold',
		color: 'rgba(148, 179, 255, 1)',
		fontWeight: '700',
	},
	footer: {
		paddingBottom: 41,
	},
});

export default LoginScreen;
