import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import BottomSheetMenu from '@/components/Menu/BottomSheetMenu';
import Toast from 'react-native-toast-message';
import { checkIfSubscribed, subscribeToUser, unsubscribeFromUser } from '@/api/index';
import UnsubscribeMenu from '@/components/Menu/UnsubscribeMenu';

interface UserProfileButtonsProps {
  userId: string;
  initialSubscribed: boolean; // Передаем начальное состояние подписки
  onSubscriptionChange: (status: boolean) => void; //  Новый коллбэк
}

const UserProfileButtons: React.FC<UserProfileButtonsProps> = ({ userId, initialSubscribed, onSubscriptionChange }) => {
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribed);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    setIsSubscribed(initialSubscribed); // Обновляем состояние подписки, если оно изменится
  }, [initialSubscribed]);

  const handleSubscribe = async () => {
    try {
      await subscribeToUser(userId);
      const status = await checkIfSubscribed(userId); // ✅ Повторная проверка подписки
      setIsSubscribed(status);
      onSubscriptionChange(status);
      Toast.show({ type: 'success', text1: 'Вы подписались!', position: 'bottom' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Ошибка подписки', position: 'bottom' });
    }
  };
  
  return (
    <View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.chatButton}>
          <Text style={styles.buttonText}>Чат</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.subscribeButton, isSubscribed && styles.subscribedButton]} 
          onPress={() => isSubscribed ? setIsMenuVisible(true) : handleSubscribe()}
        >
          <Text style={[styles.buttonText, !isSubscribed && styles.notSubscribedText]}>
            {isSubscribed ? 'Подписан' : 'Подписаться'}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Меню отписки */}
      <UnsubscribeMenu 
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        userId={userId}
        onUnsubscribe={() => {
          setIsSubscribed(false);
          onSubscriptionChange(false); // ✅ Теперь обновляет подписку
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 25,
    paddingHorizontal: 16,
    gap: 10,
    paddingBottom: 20,
  },
  subscribeButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    color: '#fff',
    flex: 1,
    alignItems: 'center'
  },
  subscribedButton: {
    backgroundColor: '#f1f1f1',
    flex: 1,
    alignItems: 'center'
  },
  chatButton: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center'
  },
  buttonText: {
    color: '#000',
    fontSize: 12,
    fontFamily: "SFUIDisplay-bold",
  },
  notSubscribedText: {
    color: '#fff'
  }
});

export default UserProfileButtons;
