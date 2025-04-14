import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { styles } from './SettingsStyle';
import CustomSwitch from './CustomSwitch';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsNotificationProps {
  onBack: () => void;
}

const SettingsNotification: React.FC<SettingsNotificationProps> = ({ onBack }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(false);

  // Загружаем сохраненные настройки при загрузке экрана
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedNotifications = await AsyncStorage.getItem('notificationsEnabled');
        const storedSound = await AsyncStorage.getItem('soundEnabled');
        const storedVibration = await AsyncStorage.getItem('vibrationEnabled');

        if (storedNotifications !== null) setNotificationsEnabled(JSON.parse(storedNotifications));
        if (storedSound !== null) setSoundEnabled(JSON.parse(storedSound));
        if (storedVibration !== null) setVibrationEnabled(JSON.parse(storedVibration));
      } catch (error) {
        console.error('Ошибка загрузки настроек:', error);
      }
    };

    loadSettings();
  }, []);

  // Функция для сохранения настроек
  const saveSetting = async (key: string, value: boolean) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
        <View style={styles.settingsItem}>
          <Text style={styles.usedDateText}>Уведомления</Text>
          <CustomSwitch
            value={notificationsEnabled}
            onValueChange={(value) => {
              setNotificationsEnabled(value);
              saveSetting('notificationsEnabled', value);
            }}
          />
        </View>
        <View style={styles.settingsItem}>
          <Text style={styles.usedDateText}>Звук</Text>
          <CustomSwitch
            value={soundEnabled}
            onValueChange={(value) => {
              setSoundEnabled(value);
              saveSetting('soundEnabled', value);
            }}
          />
        </View>
        <View style={styles.settingsItem}>
          <Text style={styles.usedDateText}>Вибрация</Text>
          <CustomSwitch
            value={vibrationEnabled}
            onValueChange={(value) => {
              setVibrationEnabled(value);
              saveSetting('vibrationEnabled', value);
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsNotification;
