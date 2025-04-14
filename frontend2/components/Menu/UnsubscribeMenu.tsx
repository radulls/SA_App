import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, PanResponder } from 'react-native';
import Toast from 'react-native-toast-message';
import { checkIfSubscribed, unsubscribeFromUser } from '@/api/index';

interface UnsubscribeMenuProps {
  isVisible: boolean;
  onClose: () => void;
  userId: string;
  onUnsubscribe: () => void;
}

const UnsubscribeMenu: React.FC<UnsubscribeMenuProps> = ({ isVisible, onClose, userId, onUnsubscribe }) => {
  const translateY = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      closeWithAnimation(); // ✅ Теперь плавно закрывается
    }
  }, [isVisible]);
  

  const closeWithAnimation = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 300, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(onClose);
  };

  const handleUnsubscribe = async () => {
    try {
      console.log(`Отписка от пользователя ${userId}...`);
      
      // Проверяем подписан ли пользователь перед запросом
      const statusBefore = await checkIfSubscribed(userId);
      if (!statusBefore) {
        console.warn("❌ Пользователь уже отписан, повторный запрос не нужен.");
        closeWithAnimation();
        return;
      }
  
      await unsubscribeFromUser(userId); // ✅ Отписываем пользователя
  
      Toast.show({ type: 'success', text1: 'Вы отписались!', position: 'bottom' });
      
      onUnsubscribe(); // ✅ Вызываем обновление состояния в родителе
      closeWithAnimation(); // ✅ Закрываем плавно
    } catch (error) {
      console.error(`Ошибка отписки: ${error}`);
      Toast.show({ type: 'error', text1: 'Ошибка отписки', position: 'bottom' });
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
        <Animated.View style={[styles.menuContainer, { transform: [{ translateY }] }]} {...panResponder.panHandlers}>
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleUnsubscribe}>
            <Text style={styles.buttonText}>Отписаться</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={closeWithAnimation}>
            <Text style={styles.buttonText}>Отмена</Text>
          </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  touchableOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 600,
  },
  menuContainer: {
    backgroundColor: '#fff', 
    borderTopLeftRadius: 16, 
    borderTopRightRadius: 16, 
    paddingHorizontal: 20, 
    paddingTop: 11,
    paddingBottom: 52,
    gap: 5, 
  },
  dragHandleContainer: { 
    width: '100%', 
    alignItems: 'center', 
    paddingBottom: 2, 
  },
  dragHandle: { 
    width: 36, 
    height: 4, 
    backgroundColor: '#DADBDA',
    borderRadius: 3,
  },
  button: {
    paddingVertical: 17, 
    paddingHorizontal: 16, 
    width: '100%', 
    backgroundColor: '#F5F5F5', 
    borderRadius: 12, 
    marginTop: 7, 
  },
  buttonText: { 
    fontSize: 12, 
    fontFamily: "SFUIDisplay-bold", 
    color: '#1A1A1A', 
    textAlign: 'left', 
    fontWeight: '700',
  },
  cancelText: {
    color: '#1A1A1A',
    fontSize: 12,
    fontFamily: 'SFUIDisplay-bold',
  },
});

export default UnsubscribeMenu;
