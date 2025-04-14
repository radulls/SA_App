import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getAllUsers, UserDataProps } from '@/api';
import UserAvatar from '@/components/UserAvatar';
import { useRouter } from 'expo-router';
import { Subdivision } from '@/types/subdivision';
import { styles } from '../participants/ParticipantsStyles';
import SearchAdmin from './SearchAdmin';

interface AddAdminProps {
  subdivision: Subdivision;
  onBack: () => void;
  onSelect: (userId: string) => void; // 🆕
}

const AddAdmin: React.FC<AddAdminProps> = ({ subdivision, onBack, onSelect }) => {
  const [users, setUsers] = useState<UserDataProps[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        const memberIds = subdivision.members.map(m => typeof m === 'string' ? m : m._id);
        const filtered = allUsers.filter(user => user._id && memberIds.includes(user._id));
        setUsers(filtered);
      } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, [subdivision.members]);
  
  const handleSelectUser = (userId: string) => {
    onSelect(userId);
  };  

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const username = user.username?.toLowerCase() || '';
    return fullName.includes(query) || username.includes(query);
  });
 
  return (
    <View style={styles.container}>
      <SearchAdmin
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder=""
      />
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <ScrollView>
          {filteredUsers.map(user => (
            <TouchableOpacity
              key={user._id}
              onPress={() => handleSelectUser(user._id!)}
              style={[styles.userCard, styles.verifiedUserCard]}
            >
              <UserAvatar user={user} />
              <View>
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.name}>{`${user.firstName || ''} ${user.lastName || ''}`}</Text>
              </View>            
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default AddAdmin;
