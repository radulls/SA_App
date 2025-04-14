import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { getAllUsers, UserDataProps } from '@/api';
import UserAvatar from '@/components/UserAvatar';
import { styles } from './ParticipantsStyles';

const VerifiedParticipants = () => {
  const [users, setUsers] = useState<UserDataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        if (!Array.isArray(allUsers)) return;

        // Фильтруем только верифицированных пользователей, исключая `creator`
        const verifiedUsers = allUsers.filter(
          (user) => user.verificationStatus === 'verified' && user.role !== 'creator'
        );

        setUsers(verifiedUsers);
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
              <View key={user.id || user._id} style={[styles.userCard, styles.verifiedUserCard]}>
                <UserAvatar user={user} />
                <View>
                  <Text style={styles.username}>{user.username || 'Без имени'}</Text>
                  <Text style={styles.name}>{`${user.firstName || ''} ${user.lastName || ''}`.trim()}</Text>
                  <View style={styles.item}>
                    <Text style={styles.label}>Рейтинг: </Text>
                    <Text style={[styles.value, styles.ratingBackground]}>
                      {Number(user.rating ?? 0).toFixed(1)}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noUsers}>Нет верифицированных участников</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default VerifiedParticipants;
