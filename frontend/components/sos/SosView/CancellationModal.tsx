import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Animated,
  PanResponder
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

interface CancellationModalProps {
  visible: boolean;
  sosId: string;
  reasons: { _id: string; reason: string }[];
  selectedReason: string | null;
  onSelectReason: (id: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const CancellationModal: React.FC<CancellationModalProps> = ({
  visible,
  reasons,
  selectedReason,
  onSelectReason,
  onClose,
  onConfirm,
  sosId, 
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

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
    } else {
      closeWithAnimation();
    }
  }, [visible]);

  const closeWithAnimation = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
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

  const handleConfirm = () => {
    if (!selectedReason) {
      Toast.show({ 
        type: 'error', 
        text1: 'Выберите причину отмены.',
        position: 'top',
       });
      return;
    }
    if (selectedReason === "67b601cb172f6e3aeb95cd8e") {
      if (!sosId) {
        console.error("❌ Ошибка: sosId отсутствует!");
        Toast.show({ 
          type: 'error', 
          text1: 'Некорректный ID сигнала.',
          position: 'top',
         });
        return;
      }
      console.log("📡 Переход на выбор помощников, sosId:", sosId);
      closeWithAnimation();
      router.push({ pathname: "/select-helpers", params: { sosId } });
      return;
    }  
    onConfirm();
  };
  
  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={closeWithAnimation}>
      <TouchableWithoutFeedback onPress={closeWithAnimation}>
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modalContentContainer, { transform: [{ translateY: slideAnim }] }]}>                         
              <View style={styles.modalContent}>
                <View style={styles.dragHandleContainer} {...panResponder.panHandlers}>
                  <View style={styles.dragHandle} />
                </View>
                <Text style={styles.modalTitle}>Причина отмены</Text>
                <FlatList
                  data={reasons}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.reasonItem}
                      onPress={() => onSelectReason(item._id)}
                    >
                      <Text style={styles.reasonText}>{item.reason}</Text>
                      <View
                        style={[styles.radioCircle, selectedReason === item._id ? styles.activeCircle : '' 
                      ]}
                      >
                        {selectedReason === item._id && <View style={styles.radioInnerCircle} />}
                      </View>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                  <Text style={styles.confirmButtonText}>Отменить сигнал</Text>
                </TouchableOpacity>
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
  modalTitle: {
    fontSize: 15,
    marginBottom: 7,
    marginTop: 6,
    fontFamily: "SFUIDisplay-bold",
    textAlign: 'center',
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  reasonText: {
    fontSize: 12,
    fontFamily: "SFUIDisplay-bold",
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E7E7E7',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle:{
    borderColor: '#000',
    borderWidth: 7,
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  confirmButton: {
    marginTop: 15,
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: "SFUIDisplay-bold",
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

export default CancellationModal;
