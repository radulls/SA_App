import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Pressable, Dimensions, TouchableOpacity, Text } from 'react-native';
import TitleDescription from '../components/eventCreation/TitleDescription';
import InputField from '../components/eventCreation/InputField';
import TextAreaInline from '../components/eventCreation/TextAreaInline';
import ContinueButton from '../components/eventCreation/ContinueButton';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

const EventCreationForm = () => {
	const [descriptionHeight, setDescriptionHeight] = useState(100);
	const [images, setImages] = useState([]);

	const handleDescriptionHeightChange = (newHeight) => {
		setDescriptionHeight(newHeight);
	};
	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			// mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [9, 16],
			quality: 1,
		});

		console.log(result);

		if (!result.canceled) {
			setImages([...images, result.assets[0].uri]);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => { router.back() }}>
					<Image
						resizeMode="contain"
						source={require('../assets/images/back.png')}
						style={styles.backIcon}
					/>
				</TouchableOpacity>
				<View style={{ display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
					<Text style={styles.headerTitle}>Новый пост</Text>
					<Text>Пост размещается на 24 часа.</Text>
				</View>
				<Image
					resizeMode="contain"
					source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/98b40a73d7d7a9073b8e92330ed21da52b2dab34ee7555b406a03467dd094ba0?placeholderIfAbsent=true&apiKey=f739d4c470a340468bd500c2bd45e954" }}
					style={styles.menuIcon}
				/>
			</View>
			<ScrollView
				contentContainerStyle={styles.scrollViewContent}
				style={styles.scrollView}
			>
				<View style={styles.formWrapper}>
					<View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
						{images.map((image, imageIndex) => (
								<Image
									key={imageIndex}
									// resizeMode="contain"
									source={{ uri: image }}
									style={{width: 112, height: 112, borderRadius: 12}}
									accessibilityLabel=""
								/>
						)
						)}
						<Pressable onPress={pickImage}>
							<Image source={require('../assets/images/add_more_btn.png')} />
						</Pressable>
					</View>
					
					<View  style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
						<Image source={require('../assets/images/Хэштег.png')}></Image>
						<Image source={require('../assets/images/Отметка.png')}></Image>
						
					</View>
					{/* <InputField
						label="Название"
						onHeightChange={() => { }} // Placeholder
					/> */}
					<TextAreaInline
						label=""
						multiline
						onHeightChange={handleDescriptionHeightChange}
					/>
				</View>
			</ScrollView>
			<View style={styles.ContinueButton}>
				<ContinueButton />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'rgba(255, 255, 255, 1)',
		alignItems: 'center',
	},
	header: {
		alignSelf: "center",
		display: "flex",
		width: "100%",
		maxWidth: 382,
		alignItems: "center",
		justifyContent: "space-between",
		flexDirection: "row",
		paddingTop: 55,
		paddingBottom: 25,
	},
	backIcon: {
		width: 8,
		marginLeft: 16,
		aspectRatio: 0.57,
	},
	headerTitle: {
		color: "rgba(0, 0, 0, 1)",
		fontWeight: "700",
		textAlign: 'center',
		fontSize: 15,
		//fontFamily: "SF UI Display, sans-serif",
	},
	menuIcon: {
		width: 22,
		aspectRatio: 1,
	},
	scrollView: {
		flex: 1,
		width: '100%',
	},
	scrollViewContent: {
		paddingBottom: 90,
		alignItems: 'center',
	},
	headerIcons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		height: 22,
		marginTop: 55,
		width: '100%',
		maxWidth: 600,
	},
	backIcon: {
		width: 8,
		aspectRatio: 0.57,
	},
	menuIcon: {
		width: 18,
		aspectRatio: 1,
	},
	formWrapper: {
		paddingLeft: 16,
		paddingRight: 16,
		paddingTop: 35,
		width: '100%',
		maxWidth: 600,
	},
	ContinueButton: {
		paddingLeft: 16,
		paddingRight: 16,
		paddingTop: 35,
		width: '100%',
		maxWidth: 600,
	}

});

export default EventCreationForm;



