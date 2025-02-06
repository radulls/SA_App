import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { getReportTopics, reportUser } from '@/api/reportService';

interface BottomSheetMenuProps {
  isVisible: boolean;
  onClose: () => void;
  buttons: { label: string; onPress: () => void; icon?: JSX.Element | null; isRowButton?: boolean }[];
  type?: 'default' | 'report'; // Тип меню: обычное или меню жалоб
  userId?: string; // ID пользователя для жалобы (если type === 'report')
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
      Animated.parallel([
        Animated.timing(translateY, { toValue: 300, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => {
        setIsAnimating(false);
        onClose();
      });
    }
  }, [isVisible]);

  // 📌 Загрузка тем жалоб
  const loadReportTopics = async () => {
    setLoadingTopics(true);
    try {
      const topics = await getReportTopics();
      setReportTopics(topics);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Ошибка', text2: 'Не удалось загрузить темы жалоб.', position: 'bottom' });
    } finally {
      setLoadingTopics(false);
    }
  };

  const handleClose = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      Animated.parallel([
        Animated.timing(translateY, { toValue: 300, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => {
        setIsAnimating(false);
        onClose();
      });
    }
  };

  // 📌 Обработка выбора жалобы
  const handleReportSubmit = async (topicId: string) => {
    if (!userId) return;
    try {
      await reportUser(userId, topicId);
      Toast.show({ type: 'success', text1: 'Жалоба отправлена.', position: 'bottom' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Ошибка', text2: 'Не удалось отправить жалобу.', position: 'bottom' });
    } finally {
      handleClose();
    }
  };

  const handleButtonPress = async (onPress: () => void | Promise<void>) => {
    handleClose();
    await new Promise(resolve => setTimeout(resolve, 300)); 
    await Promise.resolve(onPress());
  };

  return (
    <Modal visible={isVisible} transparent>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
      <TouchableOpacity style={styles.touchableOverlay} activeOpacity={1} onPress={handleClose}>
        <Animated.View style={[styles.menuContainer, { transform: [{ translateY }] }]}>        

          {/* Если это меню жалоб */}
          {type === 'report' ? (
            <View style={styles.columnButtons}>
              <Text style={styles.title}>Выберите причину жалобы</Text>
              {loadingTopics ? (
                <ActivityIndicator size="large" color="#000" />
              ) : (
                reportTopics.map((topic) => (
                  <TouchableOpacity 
                    key={topic._id} 
                    style={styles.menuButton} 
                    onPress={() => handleReportSubmit(topic._id)}
                  >
                    <Text style={styles.buttonText}>{topic.name}</Text>
                  </TouchableOpacity>
                ))
              )}
              <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                <Text style={styles.buttonText}>Отмена</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Блок для кнопок "Копировать" и "Поделиться" */}
              <View style={styles.rowButtons}>
                {buttons.filter(button => button.isRowButton).map((button, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.rowButton} 
                    onPress={() => handleButtonPress(button.onPress)}
                  >
                    {button.icon && <View style={styles.icon}>{button.icon}</View>}
                    <Text style={styles.rowButtonText}>{button.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>          

              {/* Остальные кнопки */}
              <View style={styles.columnButtons}>
                {buttons.filter(button => !button.isRowButton).map((button, index, arr) => (
                  <React.Fragment key={index}>
                    <TouchableOpacity 
                      style={styles.menuButton} 
                      onPress={() => handleButtonPress(button.onPress)}
                    >
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
              <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
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
    justifyContent: 'flex-end' 
  },
  menuContainer: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderTopLeftRadius: 16, 
    borderTopRightRadius: 16 
  },
  rowButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 12 
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
  cancelButton: { 
    backgroundColor: '#F5F5F5', 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    borderRadius: 12, 
    marginVertical: 12 
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
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    textAlign: 'center' 
  },
});

export default BottomSheetMenu;
