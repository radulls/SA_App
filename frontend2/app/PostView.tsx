import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { createComment, getCommentsByPost } from '@/api/comment';
import { POST_IMAGE_URL, getAllPosts } from '@/api/postApi'; // Или getPostById, если сделаешь
import { IMAGE_URL, getUserProfileById} from '@/api';
import PhotoCarousel from '@/components/PhotoCarousel/PhotoCarousel';
import LikeIcon from '@/components/svgConvertedIcons/Posts/likeIcon';
import CommentIcon from '@/components/svgConvertedIcons/Posts/commentIcon';
import RepostIcon from '@/components/svgConvertedIcons/Posts/repostIcon';
import IconBack from '@/components/svgConvertedIcons/iconBack';
import PostImageView from '@/components/Posts/PostImageView';
import moment from 'moment';

const PostView = () => {
  const { id, photoIndex } = useLocalSearchParams<{ id: string; photoIndex?: string }>();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedIndex = Number(photoIndex) || 0;
  const [text, setText] = useState('');

  const handleSendComment = async () => {
    if (!text.trim()) return;
    try {
      await createComment(id, text);
      setText('');
      const updated = await getCommentsByPost(id);
      setComments(updated);
    } catch (err) {
      console.error('Ошибка при отправке комментария:', err);
    }
  };

  useEffect(() => {
    const loadPost = async () => {
      try {
        const allPosts = await getAllPosts();
        const currentPost = allPosts.find(p => p._id === id);
        setPost(currentPost || null);
  
        const comments = await getCommentsByPost(id);
  
        // Подгружаем пользователей для комментариев
        const enrichComments = await Promise.all(
          comments.map(async (comment: any) => {
            try {
              const res = await getUserProfileById(comment.userId);
              return { ...comment, user: res };
            } catch (err) {
              return { ...comment, user: null };
            }
          })
        );
  
        setComments(enrichComments);
      } catch (error) {
        console.error('Ошибка загрузки поста:', error);
      } finally {
        setLoading(false);
      }
    };
  
    loadPost();
  }, [id]);
  

  if (loading || !post) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const user = post.user || {};

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Назад */}
        <TouchableOpacity style={styles.backButton} >
          <IconBack fill="#fff" onPress={() => router.back()}/>
        </TouchableOpacity>

        {/* Фото */}
        <View style={styles.imageContainer}>
          <PostImageView uri={`${POST_IMAGE_URL}${post.photos[selectedIndex]}`} maxWidth={600}/>
        </View>

        {/* Контент */}
        <View style={styles.content}>
        <View style={styles.userInfo}>
          {comments.length > 0 ? (
            <>
              <View style={styles.autorContainer}>
                <Image
                  source={
                    comments[comments.length - 1]?.user?.profileImage
                      ? { uri: `${IMAGE_URL}${comments[comments.length - 1]?.user?.profileImage}` }
                      : require('@/assets/images/avatar_post.png')
                  }
                  style={styles.avatar}
                />
                <Text style={styles.username}>{comments[comments.length - 1]?.user?.username || 'Гость'}</Text>
                <Text style={styles.timeAgo}>{moment(comments[comments.length - 1]?.createdAt).fromNow(true)}</Text>
              </View>
              <Text style={styles.description}>{comments[comments.length - 1]?.text}</Text>
            </>
          ) : (
            <>
              <View style={styles.autorContainer}>
                <Image
                  source={
                    user.profileImage
                      ? { uri: `${IMAGE_URL}${user.profileImage}` }
                      : require('@/assets/images/avatar_post.png')
                  }
                  style={styles.avatar}
                />
                <Text style={styles.username}>{user.username || 'Пользователь'}</Text>
                <Text style={styles.timeAgo}>3д.</Text>
              </View>
              <Text style={styles.description}>{post.description}</Text>
            </>
          )}
        </View>

          <View style={styles.bottomBlock}>
          <TextInput
            placeholder="Напишите комментарий"
            placeholderTextColor="#999"
            style={styles.commentInputNew}
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleSendComment} // отправка по Enter (на web / iOS)
            returnKeyType="send"
          />
            <View style={styles.iconBlock}>
              <View style={styles.iconWrapper}>
                <LikeIcon />
                <Text style={styles.iconCount}>{post.likes?.length || 0}</Text>
              </View>
              <View style={styles.iconWrapper}>
                <CommentIcon />
                <Text style={styles.iconCount}>{comments.length}</Text>
              </View>
              <View style={styles.iconWrapper}>
                <RepostIcon />
                <Text style={styles.iconCount}> </Text>
              </View>
            
            </View>
          </View>

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  contentContainer:{
    maxWidth: 600,
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 58,
    left: 10,
    zIndex: 10,
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: '#000',
    position: 'relative'
  },
  userInfo: {
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    zIndex: 1,
    bottom: '100%',  
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, .3)'
  },
  autorContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 18,
  },
  name:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    color: '#fff',
    fontWeight: '700',
  },
  timeAgo: {
    color: '#aaa',
    fontSize: 12,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  iconsRow: {
    flexDirection: 'row',
    gap: 15,
    marginVertical: 8,
  },
  countsRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 10,
  },
  countText: {
    color: '#aaa',
    fontSize: 12,
  },
  commentInput: {
    backgroundColor: '#111',
    paddingVertical: 10,
    color: '#fff',
  },
  bottomBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 18,
    paddingBottom: 30,
    justifyContent: 'space-between',
    gap: 12,
  },
  commentInputNew: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  iconBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconWrapper: {
    alignItems: 'center',
    gap: 4,
  },
  iconCount: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  
});

export default PostView;
