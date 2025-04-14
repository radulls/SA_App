import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { getAllUsers, UserDataProps } from '@/api';
import { useRouter } from 'expo-router';
import { IMAGE_URL } from '@/api';
import SearchAdmin from './SearchAdmin'; // путь поправь при необходимости

const BlockedUsers = ({ onBack }: { onBack: () => void }) => {
  const [blockedUsers, setBlockedUsers] = useState<UserDataProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const users = await getAllUsers();
        const filtered = users.filter(user => user.verificationStatus === 'blocked');
        setBlockedUsers(filtered);
      } catch (error) {
        console.error('❌ Ошибка загрузки пользователей:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockedUsers();
  }, []);

  const handleProfilePress = (userId: string | undefined) => {
    if (userId) {
      router.push({
        pathname: '/admin/control/[id]',
        params: { id: userId, tab: 'deleted' },
      });
    }
  };

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return blockedUsers.filter(user =>
      user.firstName?.toLowerCase().includes(q) ||
      user.lastName?.toLowerCase().includes(q) ||
      user.username?.toLowerCase().includes(q)
    );
  }, [searchQuery, blockedUsers]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
        <View style={styles.formWrapper}>
          <SearchAdmin searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder=" " />
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : filteredUsers.length === 0 ? (
            <Text style={styles.emptyText}>Пользователи не найдены</Text>
          ) : (
            <FlatList
              data={filteredUsers}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleProfilePress(item._id)}>
                  <View style={styles.userItem}>
                    <Image
                      source={{ uri: item.profileImage ? `${IMAGE_URL}${item.profileImage}` : 'https://via.placeholder.com/50' }}
                      style={styles.userImage}
                    />
                    <View style={styles.nameContainer}>
                      <Text style={styles.username}>{item.username}</Text>
                      <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
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

export default BlockedUsers;


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    overflowX:'visible',
    overflowY:'visible',
  },
  scrollViewContent: {
    paddingBottom: 90,
    alignItems: 'center',
  },
  formWrapper: {
    width: '100%',
  },
  emptyText:{
    color: '#000'
  },
  userItem:{
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  userImage: {
    width: 38,
    height: 38,
    borderRadius: 25,
    marginRight: 12,
  },
  nameContainer:{
  },
  username:{
    color: '#000',
    fontSize: 14,
    fontWeight: '700'
  },
  name:{
    color: '#000',
    fontSize: 12,
    fontWeight: '400'
  },
});