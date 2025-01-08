import React, { useState } from 'react';

import { View, TextInput, Text, StyleSheet, Image, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import PhotoAddVerification from './svgConvertedIcons/PhotoAddVerification';

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
			<View style={styles.title}>
				<Text style={styles.label}>{label}</Text>
				{sublabel.length > 0 && <Text style={styles.sublabel}>{sublabel}</Text>}
			</View>
			<Pressable onPress={pickImage} style={styles.back}>
				<PhotoAddVerification/>
				<Text style={styles.label}>{label}</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 18,
	},
	title: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	icon: {
		width: 22,
		height: 22
	},
	label: {
		color: '#fff', // Label color set to white
		fontSize: 14,
		fontWeight: '700',
		// fontFamily: 'SFUIDisplay-Bold',
		marginBottom: 0,
		// marginTop: 10
	},
	sublabel: {
		color: '#fff', // Label color set to white
		fontSize: 12,
		fontWeight: '400',
		paddingLeft: 3
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
		backgroundColor: '#1E1E1E',
		paddingHorizontal: 16,
		paddingVertical: 1,
		color: 'rgba(0, 0, 0, 1)',
		textAlignVertical: 'center',
		height: 48,
	},
});

export default InputFieldUpload;


