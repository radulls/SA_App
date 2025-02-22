import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, ActivityIndicator, PanResponder } from 'react-native';
import Toast from 'react-native-toast-message';
import { getReportTopics, reportUser } from '@/api/reportService';

interface BottomSheetMenuProps {
  isVisible: boolean;
  onClose: () => void;
  buttons: { label: string; onPress: () => void; icon?: JSX.Element | null; isRowButton?: boolean }[];
  type?: 'default' | 'report'; 
  userId?: string;
}

const BottomSheetMenu: React.FC<BottomSheetMenuProps> = ({ isVisible, onClose, buttons, type = 'default', userId }) => {
  const translateY = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [reportTopics, setReportTopics] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start(() => setIsAnimating(false));

      if (type === 'report') {
        loadReportTopics();
      }
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
      Toast.show({ type: 'error', 
      text1: 'Не удалось загрузить темы жалоб.', position: 'bottom' });
    } finally {
      setLoadingTopics(false);
    }
  };

  const closeWithAnimation = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 300, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setIsAnimating(false);
      onClose();
    });
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
      }
    })
  ).current;

  const handleReportSubmit = async (topicId: string) => {
    if (!userId) return;
    try {
      await reportUser(userId, topicId);
      Toast.show({ type: 'success', text1: 'Жалоба отправлена.', position: 'bottom' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Ошибка', text2: 'Не удалось отправить жалобу.', position: 'bottom' });
    } finally {
      closeWithAnimation();
    }
  };

  return (
    <Modal visible={isVisible} transparent>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
      <TouchableOpacity style={styles.touchableOverlay} activeOpacity={1} onPress={closeWithAnimation}>
        <Animated.View style={[styles.menuContainer, { transform: [{ translateY }] }]}>
          
          {/* Полоска для перетаскивания */}
          <View style={styles.dragHandleContainer} {...panResponder.panHandlers}>
            <View style={styles.dragHandle} />
          </View>

          {/* Меню жалоб */}
          {type === 'report' ? (
            <View style={styles.reportButtons}>
              <Text style={styles.title}>Пожаловаться</Text>
              {loadingTopics ? (
                <ActivityIndicator size="large" color="#000" />
              ) : (
                reportTopics.length > 0 ? (
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
                  <Text style={{ textAlign: 'center', padding: 10 }}>Нет доступных тем жалоб.</Text>
                )
              )}
            </View>
          ) : (
            <>
              {/* Блок для кнопок "Копировать" и "Поделиться" */}
              <View style={styles.rowButtons}>
                {buttons.filter(button => button.isRowButton).map((button, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.rowButton} 
                    onPress={button.onPress}
                  >
                    {button.icon && <View style={styles.icon}>{button.icon}</View>}
                    <Text style={styles.rowButtonText}>{button.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>  

              {/* Кнопки меню */}
              <View style={styles.columnButtons}>
                {buttons.filter(button => !button.isRowButton).map((button, index, arr) => (
                  <React.Fragment key={index}>
                    <TouchableOpacity style={styles.menuButton} onPress={button.onPress}>
                      {button.icon && <View style={styles.icon}>{button.icon}</View>}
                      <Text style={[styles.buttonText, button.label === 'Заблокировать' && styles.blockText]}>
                        {button.label}
                      </Text>
                    </TouchableOpacity>
                    {index < arr.length - 1 && <View style={styles.separator} />}
                  </React.Fragment>
                ))}
              </View>

              {/* Кнопка "Отмена" */}
              <TouchableOpacity style={styles.cancelButton} onPress={closeWithAnimation}>
                <Text style={styles.buttonText}>Отмена</Text>
              </TouchableOpacity>
            </>
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
    width: '100%',
    maxWidth: 600, 
    alignSelf: 'center',
  },
  menuContainer: { 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 50,
    gap: 12,
  },
  rowButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
  },
  rowButton: { 
    alignItems: 'center', 
    paddingVertical: 18, 
    backgroundColor: '#F5F5F5', 
    borderRadius: 12, 
    flex: 1, 
    justifyContent: 'center', 
    marginHorizontal: 5 
  },
  columnButtons: { 
    flexDirection: 'column', 
    backgroundColor: '#F5F5F5', 
    borderRadius: 12 
  },
  menuButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    borderRadius: 12 
  },
  reportButtons: {
   
  },
  reportButton: {
    backgroundColor: '#fff',
  },
  reportText: {
    fontSize: 14,
    fontWeight: '400',
    paddingVertical: 10, 
  },
  cancelButton: { 
    backgroundColor: '#F5F5F5', 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    borderRadius: 12, 
  },
  separator: { 
    height: 1, 
    backgroundColor: '#DCDDDC', 
    marginHorizontal: 20 
  },
  icon: { 
    marginRight: 10 
  },
  buttonText: { 
    fontSize: 12, 
    color: '#000', 
    fontWeight: '700' 
  },
  blockText: { 
    color: '#f00' 
  },
  rowButtonText: { 
    fontSize: 12, 
    color: '#000', 
    fontWeight: '500', 
    paddingTop: 10 
  },
  title: { 
    fontSize: 15, 
    fontWeight: '700', 
    marginBottom: 10, 
    textAlign: 'center' 
  },
  dragHandleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10, 
  },
  dragHandle: {
    width: 50,
    height: 5,
    backgroundColor: '#DADBDA',
    borderRadius: 3,
  },
});

export default BottomSheetMenu;
