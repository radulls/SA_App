// components/CommentsBottomSheet.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView, 
  ScrollView, 
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { getCommentsByEvent, createComment, toggleLikeComment, deleteComment, reportComment } from '@/api/eventComment';
import moment from 'moment';
import 'moment/locale/ru';
import MoreOptionsIcon from '../svgConvertedIcons/MoreOptionsIcon';
import LikeCommentIcon from '../svgConvertedIcons/Posts/likeCommentIcon';
import CreatePostIcon from '../svgConvertedIcons/createPostIcon';
import { IMAGE_URL, getUserProfileById } from '@/api';
import CloseIcon from '../svgConvertedIcons/closeIcon';
import BottomSheetMenu from '../Menu/BottomSheetMenu';
import ReportMenu from '../Menu/ReportMenu';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface EventCommentsBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  eventId: string;
  currentUserId: string; // 👈 добавь это!
}

const EventCommentsBottomSheet: React.FC<EventCommentsBottomSheetProps> = ({ isVisible, onClose, eventId, currentUserId }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<null | { id: string; username: string }>(null);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [selectedComment, setSelectedComment] = useState<any>(null);
  const [isCommentMenuVisible, setIsCommentMenuVisible] = useState(false);
  const [isCommentReportVisible, setIsCommentReportVisible] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          closeWithAnimation();
        } else {
          Animated.timing(translateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();          
        }
      },
    })
  ).current;

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      fetchComments();
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      closeWithAnimation(); // вызываем вручную, чтобы не дублировать
    }
  }, [isVisible]);

  const showCommentMenu = (comment: any) => {
    setSelectedComment(comment);
    setIsCommentMenuVisible(true);
  };
  
  const flattenReplies = (comment: any): any[] => {
    const result: any[] = [];
    const stack = [...(comment.replies || [])];
    while (stack.length > 0) {
      const reply = stack.shift();
      result.push(reply);
      if (reply.replies && reply.replies.length > 0) {
        stack.push(...reply.replies);
      }
    }
    return result;
  };  

  const closeWithAnimation = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT, // уезжаем за экран
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShouldRender(false);
      onClose();
    });
  };
  
  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getCommentsByEvent(eventId);
  
      // рекурсивно добавим user ко всем комментам и их ответам
      const enrichWithUsers = async (commentsList: any[]): Promise<any[]> => {
        return Promise.all(
          commentsList.map(async (comment) => {
            const user = await getUserProfileById(comment.userId);
            const replies: any[] = comment.replies?.length
              ? await enrichWithUsers(comment.replies)
              : [];
      
            return {
              ...comment,
              user,
              replies,
            };
          })
        );
      };
      
      const enriched = await enrichWithUsers(data);
      setComments(enriched);
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Ошибка загрузки комментариев' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      await createComment(eventId, text, replyTo?.id);
      setText('');
      setReplyTo(null);
      fetchComments();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Ошибка отправки комментария' });
    }
  };

  const handleLike = async (commentId: string) => {
    await toggleLikeComment(commentId);
    fetchComments();
  };

  const handleCommentDelete = async () => {
    if (!selectedComment) return;
    await deleteComment(selectedComment._id);
    setIsCommentMenuVisible(false);
    fetchComments();
  };

  const renderComment = (comment: any) => {
    return (
      <View key={comment._id}>
        {/* Основной комментарий */}
        <View style={styles.commentContainer}>
          <View style={styles.headerRow}>
            <View style={styles.namePart}>
              <Image
                source={{ uri: `${IMAGE_URL}${comment.user?.profileImage}` }}
                style={styles.avatar}
              />
              <Text style={styles.username}>{comment.user?.username || 'Гость'}</Text>
              <Text style={styles.time}>{moment(comment.createdAt).fromNow(true)}</Text>
            </View>
            <TouchableOpacity onPress={() => handleLike(comment._id)}>
              <View style={styles.likeCountContainer}>
                <Text style={[styles.likeCount, comment.isLiked ? styles.liked : '']}>{comment.likesCount}</Text>
                <LikeCommentIcon fill={comment.isLiked ? '#F00' : '#000'} />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.commentText}>{comment.text}</Text>
          <View style={styles.commentActions}>
            <TouchableOpacity onPress={() => setReplyTo({ id: comment._id, username: comment.user?.username })}>
              <Text style={styles.reply}>Ответить</Text>
            </TouchableOpacity>          
            <TouchableOpacity onPress={() => showCommentMenu(comment)}>
              <MoreOptionsIcon fill="#000" width={18} height={4} />
            </TouchableOpacity>
          </View>
        </View>
  
        {/* Все ответы к нему — одним уровнем */}
        {flattenReplies(comment).map((reply: any) => (
          <View key={reply._id} style={[styles.commentContainer, styles.replyContainer]}>
            <View style={styles.headerRow}>
              <View style={styles.namePart}>
                <Image
                  source={{ uri: `${IMAGE_URL}${reply.user?.profileImage}` }}
                  style={styles.avatar}
                />
                <Text style={styles.username}>{reply.user?.username || 'Гость'}</Text>
                <Text style={styles.time}>{moment(reply.createdAt).fromNow(true)}</Text>
              </View>
              <TouchableOpacity onPress={() => handleLike(reply._id)}>
                <View style={styles.likeCountContainer}>
                  <Text style={[styles.likeCount, reply.isLiked ? styles.liked : '']}>{reply.likesCount}</Text>
                  <LikeCommentIcon fill={reply.isLiked ? '#F00' : '#000'} />
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.commentText}>{reply.text}</Text>
            <View style={styles.commentActions}>
              <TouchableOpacity onPress={() => setReplyTo({ id: reply._id, username: reply.user?.username })}>
                <Text style={styles.reply}>Ответить</Text>
              </TouchableOpacity>  
              <TouchableOpacity onPress={() => showCommentMenu(reply)}>
                <MoreOptionsIcon fill="#000" width={18} height={4} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    );
  };
  
  return (
    <>
      <Modal visible={isVisible} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={closeWithAnimation}
          />
          <Animated.View
            style={[styles.modalContainer, { transform: [{ translateY }] }]}
            {...panResponder.panHandlers}
          >
            <View style={styles.dragHandleContainer}>
              <View style={styles.dragHandle} />
            </View>
            <Text style={styles.title}>Ответы</Text>
  
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 20 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {comments
                .filter((c) => !c.parentCommentId)
                .map((comment) => renderComment(comment))}
            </ScrollView>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
            >
              <SafeAreaView>
                <View style={styles.inputContainer}>
                  {replyTo && (
                    <View style={styles.replyToContainer}>
                      <Text style={styles.replyingTo}>
                        Ваш ответ <Text style={styles.replyToUsername}>@{replyTo.username}</Text>
                      </Text>
                      <TouchableOpacity onPress={() => setReplyTo(null)}>
                        <CloseIcon fill="#000" />
                      </TouchableOpacity>
                    </View>
                  )}
                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.input}
                      value={text}
                      onChangeText={setText}
                      placeholder="Ваш комментарий"
                      placeholderTextColor="#999"
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                      <CreatePostIcon />
                    </TouchableOpacity>
                  </View>
                </View>
              </SafeAreaView>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Modal>
  
      {/* Меню комментариев */}
      <BottomSheetMenu
        isVisible={isCommentMenuVisible}
        onClose={() => setIsCommentMenuVisible(false)}
        buttons={[
          selectedComment?.userId === currentUserId
            ? {
                label: 'Удалить',
                onPress: handleCommentDelete,
              }
            : {
                label: 'Пожаловаться',
                onPress: () => {
                  setIsCommentMenuVisible(false);
                  setTimeout(() => setIsCommentReportVisible(true), 200);
                },
              },
        ]}
      />
  
      {/* Меню жалоб */}
      <ReportMenu
        isVisible={isCommentReportVisible}
        onClose={() => setIsCommentReportVisible(false)}
        userId={selectedComment?._id}
        type="comment"
      />
    </>
  );
  
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  
  backdropTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  
  modalContainer: {
    backgroundColor: 'white',
    padding: 16,
    paddingBottom: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '100%',
    maxHeight: '80%',
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  
  overlay: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: 'rgba(0, 0, 0, 0.3)' 
  },
  touchableOverlay: { 
    flex: 1, 
    justifyContent: 'flex-end', 
    alignSelf: 'center', 
    width: '100%', 
    maxWidth: 600 
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  namePart:{
    flexDirection: 'row',
    alignItems: 'center'
  },
  sheet: {
    height: SCREEN_HEIGHT * 0.8,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  dragHandleContainer: { 
    alignItems: 'center', 
    paddingVertical: 8 }
    ,
  dragHandle: { 
    width: 36, 
    height: 4, 
    borderRadius: 3, 
    backgroundColor: '#DADBDA' 
  },
  title: { 
    fontSize: 16, 
    fontWeight: '600', 
    textAlign: 'center', 
    marginBottom: 10 
  },
  commentContainer: { 
    paddingVertical: 12, 
    borderBottomWidth: 0.5, 
    borderColor: '#eee' 
  },
  replyContainer: { 
    paddingLeft: 20 
  },
  username: { 
    fontWeight: 'bold' 
  },
  time: { 
    color: '#888', 
    fontSize: 12, 
    marginLeft: 6 
  },
  commentText: { 
    marginTop: 10,
    fontSize: 14 
  },
  commentActions: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10, 
    marginTop: 8 
  },
  reply: { 
    fontWeight: '600', 
    color: '#000' 
  },
  likeCountContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, 
  },
  likeCount: { 
    fontSize: 12, 
    color: '#000',
    fontWeight: '700'  
  },
  liked:{
    color: '#F00',
  },
  repliesContainer: {
     marginTop: 8 
    },
  inputContainer: {
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 44,
  },
  inputRowContainer:{
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
    
  sendButton: { 
    marginLeft: 12 
  },
  sendButtonText: {
    color: '#007aff', 
    fontWeight: '600' 
  },
  replyToContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 10, 
  },
  replyingTo: { 
    fontSize: 12, 
    color: '#000', 
  },
  replyToUsername:{
    fontWeight: '700',
  },
  avatar:{
    width: 32, 
    height: 32, 
    borderRadius: 16,
    marginRight: 10,
  }
});

export default EventCommentsBottomSheet;
