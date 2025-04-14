import React, {	useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
	Share,
	Animated, LayoutAnimation, Platform, UIManager
} from 'react-native';
import { PostData, POST_IMAGE_URL, toggleLikePost, togglePinPost, deletePost } from '@/api/postApi';
import { router } from 'expo-router';
import moment from 'moment';
import 'moment/locale/ru';
import PhotoCarousel from '../PhotoCarousel/PhotoCarousel';
import { IMAGE_URL } from '@/api';
import LikeIcon from '../svgConvertedIcons/Posts/likeIcon';
import CommentIcon from '../svgConvertedIcons/Posts/commentIcon';
import RepostIcon from '../svgConvertedIcons/Posts/repostIcon';
import MoreOptionsIcon from '../svgConvertedIcons/MoreOptionsIcon';
import BottomSheetMenu from '@/components/Menu/BottomSheetMenu';
import ShareIcon from '@/components/svgConvertedIcons/shareIcon';
import CopyLink from '@/components/svgConvertedIcons/copyLink';
import Toast from 'react-native-toast-message';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { getCommentsByPost } from '@/api/comment';
import PinnedPostIcon from '../svgConvertedIcons/Posts/pinnedPostIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommentsBottomSheet from './CommentsBottomSheet';
import ReportMenu from '../Menu/ReportMenu';
import { ResizeMode, Video } from 'expo-av';
import PostVideo from './PostVideo';

interface PostProps {
  post: PostData;
	onTogglePin?: (id: string, newPinned: boolean) => void;
}  

moment.locale('ru');
  
const Post: React.FC<PostProps> = ({ post, onTogglePin }) => {
	const formattedDate = moment(post.createdAt).fromNow(true); // "2 часа", "1 день" и т.д.
	const [isMenuVisible, setIsMenuVisible] = useState(false);
	const [closeAnimation, setCloseAnimation] = useState<(() => void) | null>(null);
	const [commentsCount, setCommentsCount] = useState(0);
	const [likes, setLikes] = useState(post.likes || []);
	const [isLiked, setIsLiked] = useState(false);
	const [isDelete, setIsDelete] = useState(false);
	const [yourUserId, setYourUserId] = useState<string | null>(null);
	const [isPinned, setIsPinned] = useState(post.isPinned);
	const opacityAnim = useState(new Animated.Value(1))[0]; // Начальная прозрачность = 1
	const [isCommentsVisible, setIsCommentsVisible] = useState(false);
	const isOwnPost = post.userId === yourUserId;
	const [isReportMenuVisible, setIsReportMenuVisible] = useState(false);
	
	const shortTime = formattedDate
		.replace('несколько секунд', 'только что')
		.replace('минут', 'мин.')
		.replace('минуту', '1 мин.')
		.replace('минута', '1 мин.')
		.replace('час', 'ч.')
		.replace('часа', 'ч.')
		.replace('часов', 'ч.')
		.replace('день', 'д.')
		.replace('дня', 'д.')
		.replace('дней', 'д.')
		.replace('месяц', 'мес.')
		.replace('месяца', 'мес.')
		.replace('месяцев', 'мес.');

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\s+)/); // сохраняем пробелы

		console.log('🖼️ post.photos (из базы):', post.photos);
		const fullPhotoUrls = post.photos.map(photo => `${POST_IMAGE_URL}${photo}`);
		console.log('🔗 Полные URL для показа:', fullPhotoUrls);

    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <Text key={index} style={styles.hashTags}>
            {part}
          </Text>
        );
      } else if (part.startsWith('@')) {
        return (
          <Text key={index} style={styles.mention}>
            {part}
          </Text>
        );
      } else {
        return (
          <Text key={index} style={styles.captionText}>
            {part}
          </Text>
        );
      }
    });
  };

	const handleCopyLink = async () => {
		try {
			const link = Linking.createURL(`/post/${post._id}`);
			await Clipboard.setStringAsync(link);
			closeAnimation?.();
			setTimeout(() => {
				Toast.show({ type: 'success', text1: 'Ссылка скопирована!', position: 'bottom' });
			}, 200);
		} catch (err) {
			Toast.show({ type: 'error', text1: 'Ошибка копирования.', position: 'bottom' });
		}
	};
	
	const handleShare = async () => {
		try {
			const link = Linking.createURL(`/post/${post._id}`);
			await Share.share({ message: `Посмотри пост: ${link}`, url: link });
		} catch (err) {
			Toast.show({ type: 'error', text1: 'Ошибка при шаринге.', position: 'bottom' });
		}
	};

	const handleLike = async () => {
		try {
			const res = await toggleLikePost(post._id);
			if (!yourUserId) return;
	
			const newIsLiked = !isLiked;
			setIsLiked(newIsLiked);
	
			setLikes(prev =>
				newIsLiked ? [...prev, yourUserId] : prev.filter(id => id !== yourUserId)
			);
	
			Toast.show({ type: 'success', text1: res.message, position: 'bottom' });
		} catch (err) {
			console.error("Ошибка лайка:", err);
			Toast.show({ type: 'error', text1: 'Не удалось поставить лайк', position: 'bottom' });
		}
	};
	
	const handlePin = async () => {
		try {
			const res = await togglePinPost(post._id);
			const newPinned = !isPinned;
	
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
			setIsPinned(newPinned);
	
			onTogglePin?.(post._id, newPinned); // 👈 Уведомляем родителя
			Toast.show({ type: 'success', text1: res.message, position: 'bottom' });
			closeAnimation?.();
		} catch (err) {
			console.error("Ошибка при закреплении:", err);
			Toast.show({ type: 'error', text1: 'Ошибка при закреплении.', position: 'bottom' });
		}
	};	
	
	const handleDelete = async () => {
		try {
			const res = await deletePost(post._id);
	
			// Плавная анимация исчезновения
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
			Animated.timing(opacityAnim, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start(() => {
				setIsDelete(true); // после завершения анимации
			});
	
			Toast.show({ type: 'success', text1: res.message, position: 'bottom' });
			closeAnimation?.();
		} catch (err) {
			console.error("Ошибка при удалении:", err);
			Toast.show({ type: 'error', text1: 'Ошибка при удалении.', position: 'bottom' });
		}
	};
	
	useEffect(() => {
		const fetchComments = async () => {
			try {
				const comments = await getCommentsByPost(post._id);
				setCommentsCount(comments.length);
			} catch (error) {
				console.error("Ошибка загрузки комментариев:", error);
			}
		};
	
		fetchComments();
	}, [post._id]);
	
	useEffect(() => {
		const checkIfLiked = async () => {
			const token = await AsyncStorage.getItem('token');
			if (!token) return;
	
			const payload = JSON.parse(atob(token.split('.')[1] || '{}'));
			setYourUserId(payload.id);
	
			setIsLiked(post.likes.includes(payload.id));
		};
		checkIfLiked();
	}, [post.likes]);

	useEffect(() => {
		if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}
	}, []);	

	if (isDelete) return null;

  return (
    <Animated.View style={[styles.postContainer, { opacity: opacityAnim }]}>
      {/* HEADER */}
      <View style={styles.postHeader}>
				<View style={styles.nameContainer}>
					<Image
						source={
							post.user?.profileImage
								? { uri: `${IMAGE_URL}${post.user.profileImage}` }
								: require('../../assets/images/avatar_post.png')
						}
						style={styles.avatarImage}
					/>
					<View style={styles.usernameContainer}>
						<Text style={styles.username}>{post.user?.username || 'Пользователь'}</Text>
					</View>
					<View style={styles.timeContainer}>
						<Text style={styles.timePosted}>{shortTime}</Text>
					</View>
				</View>
				<View style={styles.topIcons}>
					{isPinned && <PinnedPostIcon />}
					<TouchableOpacity onPress={() => setIsMenuVisible(true)}>
						<MoreOptionsIcon fill='black' width={18} height={4} />
					</TouchableOpacity>				
				</View>
      </View>
      {/* PHOTOS */}
			<TouchableOpacity onPress={() => router.push(`/PostView?id=${post._id}`)}>
				<PhotoCarousel
					photos={post.photos.map(photo => `${POST_IMAGE_URL}${photo}`)}
					onImagePress={(index) => router.push(`/PostView?id=${post._id}&photoIndex=${index}`)}
				/>
			</TouchableOpacity>
      {/* VIDEOS */}
			{post.videos && post.videos.length > 0 && (
				<PostVideo
					uri={`${POST_IMAGE_URL}${post.videos[0]}`}
					preview={`${POST_IMAGE_URL}${post.videoPreviews?.[0] || ''}`} // можно опустить если нет
					onPress={() => router.push(`/PostView?id=${post._id}`)}
				/>
			)}

      {/* CAPTION */}
      <View style={styles.captionContainer}>
        {!!post.description && (
          <Text style={styles.captionText}>
            {renderFormattedText(post.description)}
          </Text>
        )}
      </View>

      {/* FOOTER */}
      <View style={styles.postFooter}>
				<View style={styles.iconRow}>
					<TouchableOpacity onPress={handleLike}>
						<LikeIcon fill={isLiked ? '#F00' : '#000'} />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => setIsCommentsVisible(true)}>
						<CommentIcon />
					</TouchableOpacity>
					<RepostIcon />
				</View>
				<View style={styles.countsRow}>
					<Text style={styles.countText}>Нравится: <Text style={styles.number}>{likes.length}</Text></Text>
					<Text style={styles.countText}>Ответов: <Text style={styles.number}>{commentsCount}</Text></Text>
				</View>
			</View>
			<BottomSheetMenu
				isVisible={isMenuVisible}
				onClose={() => setIsMenuVisible(false)}
				setCloseAnimation={setCloseAnimation}
				buttons={[
					{
						label: 'Копировать ссылку',
						onPress: handleCopyLink,
						icon: <CopyLink fill={'#000'} />,
						isRowButton: true,
					},
					{
						label: 'Поделиться через…',
						onPress: handleShare,
						icon: <ShareIcon fill={'#000'} />,
						isRowButton: true,
					},
					{
						label: isPinned ? 'Открепить' : 'Закрепить',
						onPress: handlePin,
					},
					isOwnPost
						? {
								label: 'Удалить',
								onPress: handleDelete,
							}
						: {
								label: 'Пожаловаться',
								onPress: () => {
									closeAnimation?.();
									setTimeout(() => setIsReportMenuVisible(true), 200);
								},
							},
				]}
			/>
			<CommentsBottomSheet
				isVisible={isCommentsVisible}
				onClose={() => setIsCommentsVisible(false)}
				postId={post._id}
				currentUserId={yourUserId || ''}
			/>
			<ReportMenu
				isVisible={isReportMenuVisible}
				onClose={() => setIsReportMenuVisible(false)}
				userId={post._id} // <- это ID поста или комментария, НО ты называешь его userId — сбивает!
				type="post"       // <- это ОК
			/>

    </Animated.View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    width: '100%',
    marginBottom: 40,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
		justifyContent: 'space-between',
		paddingHorizontal: 16,
  },
	nameContainer:{
		flexDirection: 'row',
    alignItems: 'center',
		gap: 10,
	},
	topIcons:{
		flexDirection: 'row',
    alignItems: 'center',
		gap: 20,
	},
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  usernameContainer: {
    
  },
  username: {
    fontSize: 14,
    fontWeight: '700',
  },
  timeContainer: {
    marginLeft: 'auto',
  },
  timePosted: {
    fontSize: 12,
    color: '#696969',
  },
  photosContainer: {
    width: '100%',
    maxHeight: 360,
    borderRadius: 8,
  },
  postImage: {
    width: 300,
    height: 300,
    marginRight: 10,
    borderRadius: 8,
  },
  videoPlaceholderText: {
    width: '100%',
    textAlign: 'center',
    paddingVertical: 130,
    backgroundColor: '#ccc',
    fontSize: 18,
    fontWeight: 'bold',
  },
  captionContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
		paddingHorizontal: 16,
  },
  captionText: {
    fontSize: 14,
		fontWeight: '400',
    color: '#000',
  },
  hashTags: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  mention: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0095f6',
  },
  postFooter: {
    marginTop: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
  },
  boldText: {
    fontWeight: '600',
  },
	iconRow: {
		flexDirection: 'row',
		gap: 15,
	},
	countsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 10,
	},
	countText: {
		fontSize: 12,
		color: '#999',
		fontWeight: '400',
	},
	number:{
		fontWeight: '600'
	},
	photoLikeVideo: {
		width: '100%',
		aspectRatio: 1,
		backgroundColor: '#000',
	},	
	video: {
		width: '100%',
		height: 300,
		backgroundColor: '#000',
	}
});

export default Post;
