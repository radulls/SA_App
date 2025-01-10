import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, ScrollView, TouchableOpacity } from 'react-native';
import ParticipantItem from '../components/ParticipantItem';
import Helper from '../components/Helper';
import MessageItem from '../components/messages/MessageItem';
import { router } from 'expo-router';

const ParticipantList = () => {
	const [users, setUsers] = useState([]);
	useEffect(() => {
		const dbUser = Helper.get('users').catch(console.error).then(dbUsers => {
			console.log('dbUsers', dbUsers);
			setUsers([])
		})
		// setUser(dbUser) 
	}, []);
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
				<Text style={styles.headerTitle}>theandy</Text>
				<Image
					resizeMode="contain"
					source={require('../assets/images/avatars/dbfdb548212018f3af91d157f4915cd4a55f8053ea7e02f0a76f62025a2b4908.png')}
					style={styles.image1}
				/>
				{/* <Image
					resizeMode="contain"
					source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/98b40a73d7d7a9073b8e92330ed21da52b2dab34ee7555b406a03467dd094ba0?placeholderIfAbsent=true&apiKey=f739d4c470a340468bd500c2bd45e954" }}
					style={styles.menuIcon}
				/> */}
			</View>
			<View style={styles.divider} />

			<ScrollView style={styles.participantList}>
				<View style={styles.view1}>
					<View style={styles.view2}>
						{/* <View style={styles.view3}>
							<Text>30 МАРТА 14:06</Text>
						</View> */}
						<View style={styles.view4}>
							<View style={styles.message}>
								<Image
									resizeMode="contain"
									source={require('../assets/images/avatars/dbfdb548212018f3af91d157f4915cd4a55f8053ea7e02f0a76f62025a2b4908.png')}
									style={styles.image1}
								/>
								<View style={styles.view6}>
									<Text>
										Здравствуйте, очень понравился ваш маршрут, хотим повторить.
									</Text>
								</View>
							</View>
							<Image
								resizeMode="contain"
								source={{
									uri: "https://cdn.builder.io/api/v1/image/assets/f739d4c470a340468bd500c2bd45e954/c9fe0e44ad4a1df91f8a79e9ab9a47aa5fb789b9d04848c87914fcb4deb30311?apiKey=f739d4c470a340468bd500c2bd45e954&",
								}}
								style={styles.image2}
							/>
						</View>
						<View style={styles.view7}>
							<View style={styles.message }>
								<Image
									resizeMode="contain"
									source={{
										uri: "https://cdn.builder.io/api/v1/image/assets/f739d4c470a340468bd500c2bd45e954/dbfdb548212018f3af91d157f4915cd4a55f8053ea7e02f0a76f62025a2b4908?apiKey=f739d4c470a340468bd500c2bd45e954&",
									}}
									style={styles.image3}
								/>
								<View style={styles.view9}>
									<Text>Почему так?)</Text>
								</View>
							</View>
							<View style={styles.view10 }>
								<Text>
									Почему так что? Если про цену, то она оправдана сложностью!
								</Text>
							</View>
							<View style={styles.view11}>
								<Text>15:30</Text>
							</View>
						</View>
						<View style={styles.view12}>
							<View style={styles.message}>
								<Image
									resizeMode="contain"
									source={{
										uri: "https://cdn.builder.io/api/v1/image/assets/f739d4c470a340468bd500c2bd45e954/dbfdb548212018f3af91d157f4915cd4a55f8053ea7e02f0a76f62025a2b4908?apiKey=f739d4c470a340468bd500c2bd45e954&",
									}}
									style={styles.image4}
								/>
								<View style={styles.view14}>
									<Text>
										Видимо не отправилось сообщение, а как сейчас с лодками?
									</Text>
								</View>
							</View>
							<View style={styles.message}>
								<Image
									resizeMode="contain"
									source={{
										uri: "https://cdn.builder.io/api/v1/image/assets/f739d4c470a340468bd500c2bd45e954/dbfdb548212018f3af91d157f4915cd4a55f8053ea7e02f0a76f62025a2b4908?apiKey=f739d4c470a340468bd500c2bd45e954&",
									}}
									style={styles.image5}
								/>
								<View style={styles.view16}>
									<Text>Очень хочу лодку себе</Text>
								</View>
							</View>
							{/* <View style={styles.view17}>
								<Image
									resizeMode="contain"
									source={{
										uri: "https://cdn.builder.io/api/v1/image/assets/f739d4c470a340468bd500c2bd45e954/04ee033278702ca8d7725a327fb273c8386ec0c923ad2687ba7b3004c6ed5b24?apiKey=f739d4c470a340468bd500c2bd45e954&",
									}}
									style={styles.image6}
								/>
								<View>
									<Text>Договор.pdf</Text>
								</View>
							</View> */}
						</View>

					</View>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "rgba(255, 255, 255, 1)",
		display: "flex",
		maxWidth: 480,
		width: "100%",
		flexDirection: "column",
		overflow: "hidden",
		alignItems: "stretch",
		marginHorizontal: "auto",
	},
	messageContainer: {
		display: "flex",
		flexDirection: "column",
		gap: 20,
		minHeight: 600
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
		fontSize: 15,
		//fontFamily: "SF UI Display, sans-serif",
	},
	menuIcon: {
		width: 22,
		aspectRatio: 1,
	},

	divider: {
		borderRadius: 1,
		backgroundColor: "rgba(236, 236, 236, 1)",
		display: "flex",
		minHeight: 1,
		width: "100%",
	},

	participantList: {
		// marginTop: 25,
		width: '100%',
		paddingHorizontal: 16,
	},


	view1: {
		flex: 1,
		marginHorizontal: "auto",
		maxWidth: 480,
		width: "100%",
		flexDirection: "column",
		overflow: "hidden",
		alignItems: "stretch",
		fontFamily: "SF UI Display",
		fontSize: 14,
		fontWeight: "400",
	},
	view2: {
		flex: 1,
		width: "100%",
		paddingTop: 57,
		flexDirection: "column",
		alignItems: "stretch",
	},
	view3: {
		color: "#696969",
		fontSize: 10,
		textAlign: "center",
		alignSelf: "center",
		marginTop: 23,
	},
	view4: {
		flex: 1,
		marginTop: 19,
		width: "100%",
		paddingHorizontal: 11,
		flexDirection: "column",
		color: "#000000",
	},
	message: {
		flex: 2,
		flexDirection: 'row',
		alignItems: "stretch",
		marginBottom: 10,
		gap: 9
	},
	image1: {
		width: 38,
		aspectRatio: 1,
	},
	view6: {
		borderRadius: 10,
		padding: 16,
		flexGrow: 1,
		backgroundColor: "#F0F0F0",
	},
	image2: {
		marginTop: 15,
		width: 224,
		maxWidth: "100%",
		aspectRatio: 1.22,
	},
	view7: {
		flex: 1,
		marginTop: 14,
		width: "100%",
		paddingHorizontal: 11,
		flexDirection: "column",
	},
	view8: {
		flex: 1,
		alignItems: "stretch",
		gap: 9,
		color: "#000000",
	},
	image3: {
		width: 38,
		aspectRatio: 1,
	},
	view9: {
		borderRadius: 10,
		paddingHorizontal: 16,
		paddingTop: 7,
		paddingBottom: 18,
		backgroundColor: "#F0F0F0",
	},
	view10: {
		borderRadius: 10,
		marginTop: 14,
		width: 279,
		maxWidth: "100%",
		padding: 18,
		backgroundColor: "#007AFF",
		color: "#FFFFFF",
	},
	view11: {
		color: "#696969",
		fontSize: 10,
		textAlign: "center",
		alignSelf: "center",
		marginTop: 15,
	},
	view12: {
		flex: 1,
		marginTop: 19,
		width: "100%",
		paddingHorizontal: 11,
		flexDirection: "column",
		color: "#000000",
	},
	view13: {
		flex: 1,
		alignItems: "stretch",
		gap: 9,
	},
	image4: {
		width: 38,
		aspectRatio: 1,
	},
	view14: {
		borderRadius: 10,
		padding: 15,
		flexGrow: 1,
		backgroundColor: "#F0F0F0",
	},
	view15: {
		flex: 1,
		marginTop: 14,
		alignItems: "stretch",
		gap: 9,
	},
	image5: {
		width: 38,
		aspectRatio: 1,
	},
	view16: {
		borderRadius: 10,
		paddingHorizontal: 15,
		paddingTop: 7,
		paddingBottom: 18,
		backgroundColor: "#F0F0F0",
	},
	view17: {
		borderRadius: 12,
		flex: 1,
		marginTop: 18,
		padding: 22,
		alignItems: "stretch",
		gap: 23,
		backgroundColor: "#007AFF",
		color: "#FFFFFF",
	},
	image6: {
		width: 22,
		aspectRatio: 1,
	},
	view18: {
		flex: 1,
		marginTop: 55,
		width: "100%",
		padding: 12,
		flexDirection: "column",
		alignItems: "stretch",
		color: "#000000",
	},
	image7: {
		flex: 1,
		aspectRatio: 8.85,
		width: "100%",
		paddingLeft: 14,
		paddingRight: 6,
		paddingVertical: 6,
		alignItems: "stretch",
		gap: 20,
		justifyContent: "space-between",
	},
	view19: {
		position: "relative",
		marginVertical: "auto",
	},
	image8: {
		width: 32,
		aspectRatio: 1,
	},
	view20: {
		borderRadius: 3,
		alignSelf: "center",
		marginTop: 27,
		width: 148,
		height: 5,
		backgroundColor: "#E0E0E0",
	},

});

export default ParticipantList;