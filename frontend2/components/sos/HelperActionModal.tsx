import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Share,
  PanResponder
} from 'react-native';
import Toast from 'react-native-toast-message';
import * as Clipboard from 'expo-clipboard';
import { leaveSosSignal } from '@/api/sos/sosApi';
import * as Linking from 'expo-linking';
import CopyLink from '../svgConvertedIcons/copyLink';
import ShareIcon from '../svgConvertedIcons/shareIcon';

interface HelperActionModalProps {
  visible: boolean;
  onClose: () => void;
  sosId: string;
  mode: "leave" | "options"; 
  onLeave?: () => void;
}

const HelperActionModal: React.FC<HelperActionModalProps> = ({
  visible,
  onClose,
  sosId,
  mode,
  onLeave
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const closeWithAnimation = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback?.();
      onClose();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          closeWithAnimation();
        } else {
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      }
    })
  ).current;

  // 📌 Выйти из участия
  const handleLeave = async () => {
    try {
      await leaveSosSignal(sosId);
      closeWithAnimation(() => {
        onLeave?.();
        Toast.show({
          type: 'success',
          text1: 'Вы больше не участвуете',
          position: 'bottom',
        });
      });
    } catch (error) {
      Toast.show({ 
        type: 'error', 
        text1: 'Не удалось выйти из SOS-сигнала.', position: 'bottom' });
      }
    };

  // 📌 Копировать ссылку
  const copyToClipboard = async () => {
    try {
      const deepLink = Linking.createURL(`/sos-signal/${sosId}`);
      await Clipboard.setStringAsync(deepLink);
      Toast.show({
        type: 'success',
        text1: 'Ссылка скопирована!',
        position: 'bottom',
      });
      closeWithAnimation();
    } catch (error) {
      Toast.show({ 
        type: 'error', 
        text1: 'Не удалось скопировать ссылку.', position: 'bottom' });
      }
  };

  // 📌 Поделиться ссылкой
  const shareLink = async () => {
    try {
      const deepLink = Linking.createURL(`/sos-signal/${sosId}`);
      await Share.share({
        message: `Посмотрите этот SOS-сигнал: ${deepLink}`,
        url: deepLink
      });
      closeWithAnimation();
    } catch (err) {
      Toast.show({ 
        type: 'error', 
        text1: 'Не удалось поделиться ссылкой.', position: 'bottom',
       });
    }
  };

  // 📌 Пожаловаться
  const reportSos = () => {
    Toast.show({
      type: 'success',
      text1: 'Жалоба отправлена',
      position: 'bottom',
    });
    closeWithAnimation();
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={() => closeWithAnimation()}>
      <TouchableWithoutFeedback onPress={() => closeWithAnimation()}>
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modalContentContainer, { transform: [{ translateY: slideAnim }] }]}>             
              <View style={styles.modalContent}>
              <View style={styles.dragHandleContainer} {...panResponder.panHandlers}>
                <View style={styles.dragHandle} />
              </View>
                {mode === "leave" ? (
                  <>
                    <TouchableOpacity style={styles.optionButton} onPress={handleLeave}>
                      <Text style={styles.optionText}>Не участвовать</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton} onPress={() => closeWithAnimation()}>
                      <Text style={styles.optionText}>Отмена</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={styles.copySendContainer}>
                      <TouchableOpacity style={styles.rowButton} onPress={copyToClipboard}>
                        <CopyLink fill={'#000'}/>
                        <Text style={styles.rowButtonText}>Копировать ссылку</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rowButton} onPress={shareLink}>
                        <ShareIcon fill={'#000'}/>
                        <Text style={styles.rowButtonText}>Поделиться</Text>
                      </TouchableOpacity>
                    </View>                   
                    <TouchableOpacity style={styles.optionButton} onPress={reportSos}>
                      <Text style={styles.optionText}>Пожаловаться</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton} onPress={() => closeWithAnimation()}>
                      <Text style={styles.optionText}>Отмена</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>

            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContentContainer: {
    maxWidth: 600,
    width: '100%', 
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 52,
    gap: 12,
  },
  optionButton: {
    paddingVertical: 17, 
    paddingHorizontal: 16,
    width: '100%',
    backgroundColor: '#F5F5F5', 
    borderRadius: 12, 
  },
  optionText: {
    fontSize: 12,
    fontFamily: "SFUIDisplay-bold",
    color: '#1A1A1A',
    textAlign: 'left'
  },
  copySendContainer:{
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 7, 
    gap: 12,
  },
  rowButton: { 
    alignItems: 'center', 
    paddingVertical: 14, 
    backgroundColor: '#F5F5F5', 
    borderRadius: 12, 
    flex: 1, 
    justifyContent: 'center', 
  },
  rowButtonText: { 
    fontSize: 12, 
    color: '#000', 
    fontFamily: "SFUIDisplay-medium",
    paddingTop: 10,
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
});

export default HelperActionModal;
