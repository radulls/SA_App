import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { IMAGE_URL } from '@/api';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { BlockedUserData, getBlockedUsers } from '@/api/blockedUsers';
import { styles } from './SettingsStyle';

const SettingsBlocked = ({ onBack }: { onBack: () => void }) => {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        console.log("📡 Вызываем getBlockedUsers()...");
        const users = await getBlockedUsers();
        console.log("✅ Полученные пользователи:", users);
        setBlockedUsers(users);
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Ошибка загрузки списка', position: 'bottom' });
      } finally {
        setLoading(false);
      }
    };

    fetchBlockedUsers();
  }, []);

  // Функция перехода в профиль пользователя
  const handleProfilePress = (userId: string | undefined) => {
    if (!userId) {
      console.error("❌ Ошибка: userId отсутствует при переходе на профиль");
      return;
    }
    console.log("📡 Переход на профиль пользователя с ID:", userId);
    router.push({ pathname: "/profile/[userId]", params: { userId } });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
      >
        <View style={styles.formWrapper}>
          {loading ? (
          <ActivityIndicator size="large" color="#000" />
          ) : blockedUsers.length === 0 ? (
            <Text style={styles.emptyText}>Список пуст</Text>
          ) : (
            <FlatList
              data={blockedUsers}
              keyExtractor={(item) => item.blocked?._id ?? item._id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleProfilePress(item.blocked?._id)}>
                  <View style={styles.userItem}>
                    <Image
                      source={{ uri: item.blocked.profileImage ? `${IMAGE_URL}${item.blocked.profileImage}` : 'https://via.placeholder.com/50' }}
                      style={styles.userImage}
                    />
                    <View style={styles.nameContainer}>
                      <Text style={styles.username}>{item.blocked.username}</Text>
                      <Text style={styles.name}>{item.blocked.firstName} {item.blocked.lastName}</Text>
                    </View>           
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsBlocked;
