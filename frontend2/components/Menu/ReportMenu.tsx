import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, ActivityIndicator, PanResponder } from 'react-native';
import Toast from 'react-native-toast-message';
import { getReportTopics, reportUser } from '@/api/reportService';
import { reportComment } from '@/api/comment';
import { reportPost } from '@/api/postApi';

interface ReportMenuProps {
  isVisible: boolean;
  onClose: () => void;
  userId: string; // это может быть postId или userId
  type?: 'user' | 'post' | 'comment'; // 👈 расширяем, если пригодится
}

const ReportMenu: React.FC<ReportMenuProps> = ({ isVisible, onClose, userId, type }) => {
  const translateY = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [reportTopics, setReportTopics] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
      loadReportTopics();
    } else {
      closeWithAnimation();
    }
  }, [isVisible]);

  const loadReportTopics = async () => {
    setLoadingTopics(true);
    try {
      const topics = await getReportTopics();
      setReportTopics(topics);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Не удалось загрузить темы жалоб.', position: 'bottom' });
    } finally {
      setLoadingTopics(false);
    }
  };

  const closeWithAnimation = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 300, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      onClose();
      if (callback) callback();
    });
  };  

  const handleReportSubmit = async (topicId: string) => {
    try {
      console.log('🚨 reportComment вызван с:', { type, userId, topicId });
  
      if (type === 'user') {
        await reportUser(userId, topicId);
      } else if (type === 'comment') {
        await reportComment(userId, topicId);
      } else {
        await reportPost(userId, topicId);
      }
  
      // Переносим показ Toast после закрытия
      closeWithAnimation(() => {
        Toast.show({
          type: 'success',
          text1: 'Жалоба отправлена.',
        });
      });
  
    } catch (error) {
      console.error('❌ Ошибка при отправке жалобы:', error);
      closeWithAnimation(() => {
        Toast.show({
          type: 'error',
          text1: 'Не удалось отправить жалобу.',
        });
      });
    }
  };
  

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

  return (
    <Modal visible={isVisible} transparent animationType="none">
      <View style={styles.modalOverlay}>
        {/* Кликабельный фон */}
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={() => closeWithAnimation()}
        />
  
        {/* Bottom Sheet */}
        <Animated.View
          style={[styles.menuContainer, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Пожаловаться</Text>
          </View>
          {loadingTopics ? (
            <ActivityIndicator size="large" color="#000" />
          ) : reportTopics.length > 0 ? (
            reportTopics.map((topic) => (
              <TouchableOpacity
                key={topic._id}
                style={styles.reportButton}
                onPress={() => handleReportSubmit(topic._id)}
              >
                <Text style={styles.reportText}>{topic.name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noTopicsText}>Нет доступных тем жалоб.</Text>
          )}
        </Animated.View>
      </View>
    </Modal>
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
    zIndex: 1,
  },
  
  menuContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 5,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    zIndex: 2,
  },
  
  dragHandleContainer: { 
    width: '100%', 
    alignItems: 'center', 
    paddingBottom: 15, 
    paddingTop: 11,
  },
  dragHandle: { 
    width: 36, 
    height: 4, 
    backgroundColor: '#DADBDA',
    borderRadius: 3,
  },
  titleContainer: { 
    alignItems: 'center', 
    marginBottom: 17, 
  },
  title: { 
    fontSize: 15, 
    fontFamily: "SFUIDisplay-Bold",
    color: '#000' 
  },
  reportButton: { 
    backgroundColor: '#fff', 
    paddingTop: 3, 
    paddingBottom: 10,
  },
  reportText: { 
    fontSize: 14, 
    fontFamily: "SFUIDisplay-regular", 
    color: '#000' 
  },
  noTopicsText: { 
    textAlign: 'center', 
    padding: 10, 
    color: '#888' 
  },
});

export default ReportMenu;
