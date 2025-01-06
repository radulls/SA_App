import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

function BottomNavigation() {
	return (
		<View style={styles.nav}>
			<TouchableOpacity onPress={() => {router.push('/home')}}>
				<Image
					source={require('../assets/images/nav/home.png')}
					style={styles.navigationImage}
				/>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => {router.push('/search')}}>
				<Image
					source={require('../assets/images/nav/search.png')}
					style={styles.navigationImage}
				/>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => {router.push('/eventCreation')}}>
				<Image
					source={require('../assets/images/nav/plus.png')}
					style={styles.navigationImage}
				/>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => {router.push('/messages')}}>
				<Image
					source={require('../assets/images/nav/noti.png')}
					style={styles.navigationImage}
				/>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => {router.push('/settings')}}>
				<Image
					source={require('../assets/images/nav/acc.png')}
					style={styles.navigationImage}
				/>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	nav: {
		position: 'absolute',  
		bottom: 0,
		height: 63,
		width: '100%',
		backgroundColor: '#FDFDFD',
		borderTopColor: '#D8D8D8',
		borderTopWidth: 1,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 60,
		// zIndex: 99
	},
	navigationImage: {
		// borderRadius: "0px 0px 0px 0px",
		// position: "relative",
		// display: "flex",
		// marginTop: 257,
		// backgroundColor: 'black',
		height: 22,
		width: 22,
		zIndex: 9999
		// width: "100%",
		// aspectRatio: "1",
	},
});

export default BottomNavigation;