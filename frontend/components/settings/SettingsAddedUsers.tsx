import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, FlatList, Image, TextInput } from 'react-native';
import { getInvitedUsers } from '@/api/activeCodes';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { styles } from './SettingsStyle';
import { IMAGE_URL } from '@/api';
import SearchIcon from '../svgConvertedIcons/BottomMenuIcons/SearchIcon';

interface InvitedUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileImage?: string;
}

interface SettingsAddedUsersProps {
  onBack: () => void;
}

const SettingsAddedUsers: React.FC<SettingsAddedUsersProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<InvitedUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchInvitedUsers = async () => {
      try {
        const users: InvitedUser[] = await getInvitedUsers();
        setInvitedUsers(users);
        setFilteredUsers(users); // Изначально отображаем всех
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Не удалось загрузить приглашенных пользователей.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvitedUsers();
  }, []);

  // Обработчик поиска
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(invitedUsers);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      setFilteredUsers(
        invitedUsers.filter((user) => {
          const username = user.username?.toLowerCase() || '';
          const firstName = user.firstName?.toLowerCase() || '';
          const lastName = user.lastName?.toLowerCase() || '';

          return (
            username.includes(lowerCaseQuery) ||
            firstName.includes(lowerCaseQuery) ||
            lastName.includes(lowerCaseQuery)
          );
        })
      );
    }
  }, [searchQuery, invitedUsers]);

  const handleProfilePress = (userId: string) => {
    router.push({ pathname: "/profile/[userId]", params: { userId } });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
        <View style={styles.formWrapper}>
          {/* Поле ввода для поиска */}
          <View style={[styles.inputSearchContainer, styles.inputAdded]}>
              <SearchIcon width={18} height={18} fill="#aaa"/>
              <TextInput
                style={styles.inputSearch}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder=""
              />
            </View>
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : filteredUsers.length === 0 ? (
            <Text style={styles.emptyText}>Список пуст</Text>
          ) : (
            <FlatList
              data={filteredUsers}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleProfilePress(item._id)}>
                  <View style={styles.userItem}>
                    <Image
                      source={{ uri: item.profileImage ? `${IMAGE_URL}${item.profileImage}` : 'https://via.placeholder.com/50' }}
                      style={styles.userImage}
                    />
                    <View style={styles.nameContainer}>
                      <Text style={styles.username}>{item.username || 'Без имени'}</Text>
                      <Text style={styles.name}>
                        {item.firstName || ''} {item.lastName || ''}
                      </Text>
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

export default SettingsAddedUsers;