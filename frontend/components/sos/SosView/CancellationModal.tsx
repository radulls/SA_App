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
} from 'react-native';

interface CancellationModalProps {
  visible: boolean;
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
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current; // Начинаем ниже экрана
  const fadeAnim = useRef(new Animated.Value(0)).current; // Фон сначала прозрачный

  useEffect(() => {
    if (visible) {
      // Анимация появления
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
      // Анимация исчезновения (меню уезжает вниз, затем исчезает фон)
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          delay: 100, // Ждём пока меню уедет, затем исчезает фон
          useNativeDriver: true,
        }),
      ]).start(() => onClose()); // Закрываем модалку после завершения анимации
    }
  }, [visible]);

  const handleClose = () => {
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
    ]).start(() => onClose());
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={handleClose}>
      {/* Фон, который исчезает и появляется */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          {/* Контейнер для меню, который двигается вверх/вниз */}
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modalContentContainer, { transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.modalContent}>
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
                        style={[
                          styles.radioCircle,
                          { borderColor: selectedReason === item._id ? '#000' : '#ccc' },
                        ]}
                      >
                        {selectedReason === item._id && <View style={styles.radioInnerCircle} />}
                      </View>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
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
    paddingHorizontal: 16,
    paddingVertical: 40,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 30,
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
    fontWeight: '700',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  confirmButton: {
    marginTop: 30,
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default CancellationModal;
