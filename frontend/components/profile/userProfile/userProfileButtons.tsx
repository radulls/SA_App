import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import BottomSheetMenu from '@/components/BottomSheetMenu/BottomSheetMenu';
import Toast from 'react-native-toast-message';

const UserProfileButtons: React.FC = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleUnsubscribe = () => {
    setIsSubscribed(false);
    setIsMenuVisible(false);
    Toast.show({
      type: 'success',
      text1: 'Вы успешно отписались',
      position: 'bottom',
    });
  };

  return (
    <View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.chatButton}>
          <Text style={styles.buttonText}>Чат</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.subscribeButton, isSubscribed && styles.subscribedButton]} 
          onPress={() => isSubscribed ? setIsMenuVisible(true) : setIsSubscribed(true)}
        >
          <Text style={[styles.buttonText, !isSubscribed && styles.notSubscribedText]}>
            {isSubscribed ? 'Подписан' : 'Подписаться'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Меню при попытке отписаться */}
      <BottomSheetMenu 
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        buttons={[
          { label: 'Отписаться', onPress: handleUnsubscribe, icon: null, isRowButton: false }, 
        ]}
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
    color: '#000',
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
    fontWeight: '700',
  },
  notSubscribedText: {
    color: '#fff'
  }
});

export default UserProfileButtons;
