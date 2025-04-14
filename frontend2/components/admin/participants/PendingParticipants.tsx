import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { getAllUsers, UserDataProps } from '@/api';
import { styles } from './ParticipantsStyles';
import UserAvatar from '@/components/UserAvatar';
import SearchAdmin from '../settings/SearchAdmin';

interface PendingParticipantsProps {
  pendingRequests: string[];
  cityId: string;
}

const PendingParticipants: React.FC<PendingParticipantsProps> = ({ pendingRequests, cityId }) => {
  const [users, setUsers] = useState<UserDataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter(); // Используем роутер для перехода
  const [searchQuery, setSearchQuery] = useState(''); // 👈 состояние поиска

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        if (!Array.isArray(allUsers)) return;
  
        const filtered = allUsers.filter((user) => {
          const isPending = user.verificationStatus === 'pending';
  
          const isInPendingList = pendingRequests.includes(String(user._id || user.id));
          console.log('pendingRequests:', pendingRequests);
  
          let userCityId: string | undefined;
          if (typeof user.city === 'string') {
            userCityId = user.city;
          } else if (user.city && typeof user.city === 'object' && '_id' in user.city) {
            userCityId = (user.city as any)._id;
          }
  
          const isInCity = userCityId === cityId;
  
          return isPending && isInPendingList && isInCity;
        });
  
        setUsers(filtered);
      } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const username = user.username?.toLowerCase() || '';
    return fullName.includes(query) || username.includes(query);
  });

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (   
        <ScrollView>
            <SearchAdmin
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder=""
          />
          {filteredUsers.length > 0 ? (
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
