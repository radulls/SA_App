import React, { useState } from 'react';

import { View, TextInput, Text, StyleSheet, Image, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const InputFieldUpload = ({ label, sublabel = '', secureTextEntry = false }) => {
	const [image, setImage] = useState(null);

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	return (
		<View style={styles.container}>
			<View>
				<Text style={styles.label}>{label}</Text>
				{sublabel.length > 0 && <Text style={styles.sublabel}>{sublabel}</Text>}
			</View>
			<Pressable onPress={pickImage} style={styles.back}>
				{image && <Image
					resizeMode="contain"
					source={{ uri: image }}
					style={styles.icon}
					accessibilityLabel="Verification illustration"
				/>}
				{!image && <Image
					resizeMode="contain"
					source={require('../assets/images/Rectangle.png')}
					style={styles.icon}
					accessibilityLabel="Verification illustration"
				/>}
				<Text style={styles.label}>{label}</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 18,
	},
	icon: {
		width: 22,
		height: 22
	},
	label: {
		color: 'rgba(0, 0, 0, 1)', // Label color set to white
		fontSize: 14,
		fontWeight: '700',
		// fontFamily: 'SFUIDisplay-Bold',
		marginBottom: 0,
		// marginTop: 10
	},
	sublabel: {
		color: 'rgba(0, 0, 0, 0.85)', // Label color set to white
		fontSize: 12,
		fontWeight: '300',
		// fontFamily: 'SFUIDisplay-Bold',
	},
	back: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		alignContent: 'center',
		borderRadius: 10,
		marginTop: 6,
		gap: 10,
		backgroundColor: 'rgba(243, 243, 243, 1)',
		paddingLeft: 16,
		paddingRight: 12,
		paddingTop: 14,
		paddingBottom: 14,
		color: 'rgba(0, 0, 0, 1)',
		textAlignVertical: 'center',
		height: 80,
	},
});

export default InputFieldUpload;


