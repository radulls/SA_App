import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { freezeUser } from "@/api/adminApi"; // Путь подставь правильный

// ✅ Интерфейс для пропсов
interface FreezeDaysModalProps {
  userId: string;
  action: string | null;
  onClose: () => void;
}

const FreezeDaysModal: React.FC<FreezeDaysModalProps> = ({ userId, action, onClose }) => {
  const [days, setDays] = useState(5); // По умолчанию 5 дней

  const handleApply = async () => {
    if (!action) return;
  
    try {
      console.log(`📡 Отправка запроса на заморозку: ${action} для ${userId} на ${days} дней`);
  
      // Отправляем запрос на сервер
      await freezeUser(userId, [action], days);
  
      console.log(`✅ Успешная заморозка ${action} для ${userId} на ${days} дней`);
  
      onClose(); // Закрываем модалку
    } catch (error) {
      console.error(`❌ Ошибка при заморозке ${action} для ${userId}:`, error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.modalContainer}>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={14}
        step={1}
        value={days}
        onValueChange={setDays}
      />
      <Text style={styles.daysText}>{days} дней</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
          <Text style={[styles.buttonText, styles.cancelButtonText]}>Отмена</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleApply} style={styles.applyButton}>
          <Text style={styles.buttonText}>Применить</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    maxWidth: 600,
    borderRadius: 16,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  daysText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    padding: 10,
    flex: 1,
    alignItems: 'center',
  },
  applyButton: {
    padding: 10,
    backgroundColor: 'black',
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  cancelButtonText:{
    color: '#000'
  }
});

export default FreezeDaysModal;
