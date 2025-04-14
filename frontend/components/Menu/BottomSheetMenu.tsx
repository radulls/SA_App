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
  setCloseAnimation?: (callback: () => void) => void; // ✅ Добавляем setCloseAnimation
}

const BottomSheetMenu: React.FC<BottomSheetMenuProps> = ({ isVisible, onClose, buttons, type = 'default', userId, setCloseAnimation }) => {
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

      if (type === 'report') {
        loadReportTopics();
      }
    } else {
      closeWithAnimation();
    }
  }, [isVisible]);

  useEffect(() => {
    if (setCloseAnimation) {
      setCloseAnimation(() => () => closeWithAnimation()); // ✅ Передаём обёрнутую функцию
    }
  }, []);  

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
      if (callback) callback(); // Вызываем коллбэк после анимации
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
      },
    })
  ).current;

  return (
    <Modal visible={isVisible} transparent>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
      <TouchableOpacity 
        style={styles.touchableOverlay} 
        activeOpacity={1} 
        onPress={() => closeWithAnimation()}
      >
        <Animated.View style={[styles.menuContainer, { transform: [{ translateY }] }]}>          
          <View style={styles.dragHandleContainer} {...panResponder.panHandlers}>
            <View style={styles.dragHandle} />
          </View>
          <View style={styles.rowButtons}>
            {buttons.filter(button => button.isRowButton).map((button, index) => (
              <TouchableOpacity key={index} style={styles.rowButton} onPress={button.onPress}>
                {button.icon && <View style={styles.icon}>{button.icon}</View>}
                <Text style={styles.rowButtonText}>{button.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
          <TouchableOpacity style={styles.cancelButton} onPress={() => closeWithAnimation()}>
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
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 52,
    gap: 12,
  },
  dragHandleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 11, 
    paddingBottom: 2,
  },
  dragHandle: { 
    width: 36, 
    height: 4, 
    backgroundColor: '#DADBDA',
    borderRadius: 3,
  },
  rowButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 7, 
    gap: 12 
  },
  rowButton: { 
    alignItems: 'center', 
    paddingVertical: 14, 
    backgroundColor: '#F5F5F5', 
    borderRadius: 12, 
    flex: 1, 
    justifyContent: 'center' 
  },
  columnButtons: { 
    flexDirection: 'column', 
    backgroundColor: '#F5F5F5', 
    borderRadius: 12 
  },
  menuButton: { 
    paddingVertical: 17, 
    paddingHorizontal: 16, 
    width: '100%', 
    backgroundColor: '#F5F5F5', 
    borderRadius: 12 
  },
  blockText: { 
    color: '#f00' 
  },
  separator: { 
    height: 0.5, 
    backgroundColor: '#DCDDDC', 
    marginHorizontal: 20 
  },
  cancelButton: { 
    paddingVertical: 17, 
    paddingHorizontal: 16, 
    width: '100%', 
    backgroundColor: '#F5F5F5', 
    borderRadius: 12, 
  },
  icon: { 
    marginRight: 10 
  },
  buttonText: { 
    fontSize: 12, 
    fontFamily: "SFUIDisplay-bold", 
    color: '#1A1A1A', 
    textAlign: 'left' 
  },
  rowButtonText: { 
    fontSize: 12, 
    color: '#000', 
    fontFamily: "SFUIDisplay-medium", 
    paddingTop: 10 
  },
});

export default BottomSheetMenu;