import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { getAllUsers, UserDataProps } from '@/api';
import { styles } from './ParticipantsStyles';
import UserAvatar from '@/components/UserAvatar';

const PendingParticipants = () => {
  const [users, setUsers] = useState<UserDataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter(); // Используем роутер для перехода

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        if (!Array.isArray(allUsers)) return;

        const pendingUsers = allUsers.filter((user) => user.verificationStatus === 'pending');
        setUsers(pendingUsers);
      } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <ScrollView>
          {users.length > 0 ? (
            users.map((user) => (
              <TouchableOpacity
                key={user.id || user._id}
                style={styles.userCard}
                onPress={() =>
                  router.push({
                    pathname: '/admin/user-verification/[id]',
                    params: { id: String(user.id || user._id) },
                  })
                }
              >
                <UserAvatar user={user} />
                <View>
                  <Text style={styles.username}>{user.username || 'Без имени'}</Text>
                  <Text style={[styles.name, styles.notVerifiedName]}>
                    {`${user.firstName || ''} ${user.lastName || ''}`.trim()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noUsers}>Нет ожидающих участников</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default PendingParticipants;
