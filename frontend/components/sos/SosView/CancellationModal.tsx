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
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';

interface CancellationModalProps {
  visible: boolean;
  sosId: string; // ✅ Добавляем sosId в пропсы
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
  const slideAnim = useRef(new Animated.Value(300)).current; // Начинаем ниже экрана
  const fadeAnim = useRef(new Animated.Value(0)).current; // Фон сначала прозрачный
  const router = useRouter();

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

  const handleConfirm = () => {
    if (!selectedReason) {
      Alert.alert("Ошибка", "Выберите причину отмены.");
      return;
    }
    if (selectedReason === "67b601cb172f6e3aeb95cd8e") { // "Участники помогли"
      if (!sosId) {
        console.error("❌ Ошибка: sosId отсутствует!");
        Alert.alert("Ошибка", "Некорректный ID сигнала.");
        return;
      }
      console.log("📡 Переход на выбор помощников, sosId:", sosId);
      onClose(); // Закрываем модалку
      router.push({ pathname: "/select-helpers", params: { sosId } }); // ✅ Передаём sosId
      return;
    }
  
    onConfirm();
  };
  
  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      {/* Фон, который исчезает и появляется */}
      <TouchableWithoutFeedback onPress={onClose}>
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
  activeCircle:{
    borderColor: '#000',
    borderWidth: 6,
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
