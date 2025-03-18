import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, ActivityIndicator, PanResponder } from 'react-native';
import Toast from 'react-native-toast-message';
import { getReportTopics, reportUser } from '@/api/reportService';

interface ReportMenuProps {
  isVisible: boolean;
  onClose: () => void;
  userId: string;
}

const ReportMenu: React.FC<ReportMenuProps> = ({ isVisible, onClose, userId }) => {
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

  const closeWithAnimation = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 300, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(onClose);
  };

  const handleReportSubmit = async (topicId: string) => {
    try {
      await reportUser(userId, topicId);
      Toast.show({ type: 'success', text1: 'Жалоба отправлена.', position: 'bottom' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Ошибка', text2: 'Не удалось отправить жалобу.', position: 'bottom' });
    } finally {
      closeWithAnimation(); // Закрываем меню после отправки жалобы
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
    <Modal visible={isVisible} transparent>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
      <TouchableOpacity style={styles.touchableOverlay} activeOpacity={1} onPress={closeWithAnimation}>
        <Animated.View style={[styles.menuContainer, { transform: [{ translateY }] }]}>  
          <View style={styles.dragHandleContainer} {...panResponder.panHandlers}>
            <View style={styles.dragHandle} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Пожаловаться</Text>
          </View>
          {loadingTopics ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            reportTopics.length > 0 ? (
              reportTopics.map((topic) => (
                <TouchableOpacity key={topic._id} style={styles.reportButton} onPress={() => handleReportSubmit(topic._id)}>
                  <Text style={styles.reportText}>{topic.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noTopicsText}>Нет доступных тем жалоб.</Text>
            )
          )}
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  menuContainer: { 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 16, 
    borderTopRightRadius: 16, 
    paddingHorizontal: 20, 
    paddingBottom: 40,
    gap: 5
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
