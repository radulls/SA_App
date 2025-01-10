import React from 'react';
import { View, StyleSheet, Image, Text, Pressable, TouchableOpacity} from 'react-native';
import { router } from 'expo-router';

const PostHeader = ({ avatarUri, username, timePosted }) => (
	<View style={styles.postHeader}>
		<Image
			resizeMode="contain"
			source={require('../../assets/images/avatar_post.png')}
			style={styles.avatarImage}
		/>
		<View style={styles.usernameContainer}>
			<Text style={styles.username}>{username}</Text>
		</View>
		<View style={styles.timeContainer}>
			<Text style={styles.timePosted}>{timePosted}</Text>
		</View>
	</View>
);

const ActionButtons = () => (
	<View style={styles.actionButtons}>
		<Image
			resizeMode="contain"
			source={{ uri: "1" }}
			style={styles.actionIcon}
		/>
		<Image
			resizeMode="contain"
			source={{ uri: "2" }}
			style={styles.actionIcon}
		/>
	</View>
);

const PostContent = ({ imageUri, captionText, postType }) => (
	<>
		{postType == 'image' && <Image
			resizeMode="cover"
			// source={{ uri: imageUri }}
			source={require('../../assets/images/post.png')}
			style={styles.postImage}
		/>}
		{postType == 'video' && <TouchableOpacity style={styles.postImage_video} onPress={() => { router.push('/PostView') }}><Image
			resizeMode="cover"
			// source={{ uri: imageUri }}
			source={require('../../assets/images/post_video.png')}
			style={styles.postImage_video}
		/></TouchableOpacity>}
		<Image
			resizeMode="cover"
			source={{ uri: "http://test.ru/sadasd.jpg" }}
			style={styles.postIcon}
		/>
		<View style={styles.captionContainer}>
			<Text>
				<Text style={styles.captionText}>{captionText}</Text>
				<Text style={styles.hashTags}> #dog #собака #прикол #спорт </Text>
				<Text style={styles.captionText}> изжарила в масле и </Text>
				<Text style={styles.mention}> @xburanx </Text>
				<Text style={styles.captionText}> положила на окошечко </Text>
				<Text style={styles.readMore}>…ещё</Text>
			</Text>
		</View>
	</>
);

const PostFooter = () => (
	<View style={styles.postFooter}>
		<Image
			resizeMode="contain"
			source={{ uri: "123" }}
			style={styles.footerImage}
		/>
		<View style={styles.footerStats}>
			<View style={styles.likesContainer}>
				<Text>
					Нравится: <Text style={styles.boldText}>37</Text>
				</Text>
			</View>
			<View style={styles.commentsContainer}>
				<Text style={styles.grayText}>
					Ответов: <Text style={styles.boldGrayText}> 4 </Text>
				</Text>
			</View>
		</View>
	</View>
);

const InstagramPost = ({ postType }) => {
	return (
		<View style={styles.postContainer}>
			<View style={styles.postContent}>
				<PostHeader
					avatarUri="../assets/images/avatar_post.png"
					username="katya_kot"
					timePosted="1 ч."
				/>
				<ActionButtons />
			</View>
			<PostContent
				postType={postType}
				imageUri="post.png"
				captionText="Взяла старуха крылышко, по коробу поскребла, по сусеку помела, и набралось муки пригоршни с две. Замесила на сметане,"
			/>
			<PostFooter />
		</View>
	);
};

const styles = StyleSheet.create({
	postContainer: {
		borderRadius: 0,
		display: 'flex',
		width: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		marginBottom: 40
	},
	postContent: {
		display: 'flex',
		width: '100%',
		flexDirection: 'row',
		
		// alignItems: 'stretch',
		// gap: 20,
		// justifyContent: 'space-between',
	},
	postHeader: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		marginLeft: 10
		// fontFamily: 'SF UI Display, sans-serif',
	},
	avatarImage: {
		borderRadius: 0,
		alignSelf: 'stretch',
		position: 'relative',
		display: 'flex',
		width: 38,
		flexShrink: 0,
		aspectRatio: 1,
	},
	usernameContainer: {
		alignSelf: 'center',
		marginHorizontal: "auto",
	},
	username: {
		color: 'rgba(0, 0, 0, 1)',
		// fontFamily: "SFUIDisplay-Bold",
		fontSize: 14,
		fontWeight: '700',
	},
	timeContainer: {
		alignSelf: 'center',
		marginHorizontal: "auto",
	},
	timePosted: {
		color: 'rgba(105, 105, 105, 1)',
      // fontFamily: "SFUIDisplay-regular",
		fontSize: 12,
		fontWeight: '400',
	},
	actionButtons: {
		display: 'flex',
		alignItems: 'stretch',
		gap: 20,
		marginHorizontal: "auto",
	},
	actionIcon: {
		borderRadius: 0,
		position: 'relative',
		display: 'flex',
		width: 18,
		flexShrink: 0,
		aspectRatio: 1,
	},
	postImage: {
		alignSelf: 'stretch',
		position: 'relative',
		// display: 'flex',
		marginTop: 7,
		width: '100%',
		// height: '100%'
		// objectFit: 'cover',
		// maxHeight: 496,
		
	},
	postImage_video: {
		alignSelf: 'stretch',
		position: 'relative',
		// display: 'flex',
		marginTop: 0,
		width: '100%',
		// objectFit: 'cover',
		// maxHeight: 496,
		// aspectRatio: 0.,
	},
	postIcon: {
		position: 'relative',
		display: 'flex',
		marginTop: 10,
		width: 36,
		aspectRatio: 5.99,
	},
	captionContainer: {
		marginTop: 0,
		paddingHorizontal: 16,
		paddingTop: 13
	},
	captionText: {
		color: 'rgba(0, 0, 0, 1)',
		fontSize: 14,
		// fontFamily: 'SF UI Display, sans-serif',
		fontWeight: '400',
	},
	hashTags: {
		fontWeight: '700',
		color: 'rgba(0, 0, 0, 1)',
	},
	mention: {
		fontWeight: '700',
		color: 'rgba(0, 149, 246, 1)',
	},
	readMore: {
		fontWeight: '700',
		color: 'rgba(0, 0, 0, 1)',
	},
	postFooter: {
		display: 'flex',
		marginTop: 22,
		width: '100%',
		maxWidth: 382,
		flexDirection: 'row',
		alignItems: 'stretch',
		gap: 20,
		color: 'rgba(153, 153, 153, 1)',
		justifyContent: 'space-between',
		// fontFamily: 'SF UI Display, sans-serif',
		fontSize: 12,
		fontWeight: '400',
	},
	footerImage: {
		borderRadius: 0,
		position: 'relative',
		display: 'flex',
		width: 90,
		flexShrink: 0,
		aspectRatio: 5,
	},
	footerStats: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'stretch',
		gap: 13,
		marginHorizontal: "auto",
	},
	likesContainer: {
		flexGrow: 1,
	},
	commentsContainer: {
		textAlign: 'right',
	},
	boldText: {
		fontWeight: '600',
	},
	grayText: {
		color: 'rgba(153, 153, 153, 1)',
	},
	boldGrayText: {
		fontWeight: '600',
		color: 'rgba(153, 153, 153, 1)',
	},
});

export default InstagramPost;