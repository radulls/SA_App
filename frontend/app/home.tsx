import React, { useState, useEffect } from 'react';

import { View, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';
import Post from '../components/profile/Post';
import BottomNavigation from '../components/BottomNavigation';
import Verification from '../components/Verification';
import { router } from 'expo-router';
import Helper from '../components/Helper';
import { mockUser } from '@/components/TestData/testdata';

const ProfileScreen: React.FC = () => {
	// const user = Helper.readUser()
	const [user, setUser] = useState(mockUser);
	// useEffect(() => {
	// 	const dbUser = Helper.readUser().catch(console.error).then(dbUser => {
	// 		console.log('dbUser', dbUser);
	// 		setUser(dbUser)
	// 	})
	// 	// setUser(dbUser) 
	// }, []);
	return (
		<View style={styles.container}>
				{/* {user?.status == 'verification_request' && <View  style={styles.verificationContainer}>
					<Verification />
				</View>} */}
				{true && <ScrollView contentContainerStyle={styles.scrollViewContent}>
				<View style={styles.contentContainer}>
					<View style={styles.headerButtons}>
						<TouchableOpacity onPress={() => { router.push('/profileQR') }}>
							<Image
								source={require('../assets/images/profile/qr.png')}
								style={styles.qrIcon}
							/>
						</TouchableOpacity>
						<View style={styles.rightIcons}>
							<Image
								source={require('../assets/images/profile/sos.png')}
								style={styles.sosIcon}
							/>
							<TouchableOpacity onPress={() => { router.push('/settings') }}>
								<Image
									source={require('../assets/images/profile/settings.png')}
									style={styles.settingsIcon}
								/>
							</TouchableOpacity>
						</View>
					</View>
					<View style={styles.coverImageContainer}>
						<Image
							source={require('../assets/images/profile_bg.png')}
							style={styles.coverImage}
							accessibilityLabel="Profile cover image"
						/>
					</View>

					<ProfileHeader user={user} />
					<ProfileStats user={user}/>
					<View style={styles.divider} />
					<Post postType="image"/>
					<Post postType="video" />
					{/* <PostList /> */}
				</View>
			</ScrollView>}
			<BottomNavigation />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "rgba(255, 255, 255, 1)",
		flex: 1,
	},
	verificationContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		// backgroundColor: '#FF',
		// backgroundColor: "rgba(100, 0, 0, 1)",
		// width: '100%',
		height: '100%',
		zIndex: 999999
	},
	scrollViewContent: {
		alignItems: 'center',
		width: '100%',
	},
	contentContainer: {
		maxWidth: 600,
		width: '100%',
	},
	headerButtons: {
		position: 'absolute',
		top: 55,
		left: 16,
		right: 16,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		zIndex: 10,
	},
	qrIcon: {
		width: 22,
		height: 22,
	},
	rightIcons: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	sosIcon: {
		width: 22,
		height: 22,
		marginRight: 20,
	},
	settingsIcon: {
		width: 22,
		height: 22,
	},
	coverImageContainer: {
		width: '100%',
		height: 210,
	},
	coverImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
	},
	divider: {
		backgroundColor: "rgba(236, 236, 236, 1)",
		minHeight: 0.5,
		marginTop: 20,
		marginBottom: 20,
		width: "100%",
	},
});

export default ProfileScreen;

