import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getAllUsers, UserDataProps } from '@/api';
import UserAvatar from '@/components/UserAvatar';
import { styles } from '../participants/ParticipantsStyles';
import AddAdminIcon from '@/components/svgConvertedIcons/settings/addAdminIcon';

interface AdminsProps {
  onBack: () => void;
  onAdd: () => void;
  onEdit: (userId: string) => void; // 🆕 добавлено
  adminIds: string[];
}

const Admins: React.FC<AdminsProps> = ({ onBack, onAdd, adminIds, onEdit }) => {
  const [admins, setAdmins] = useState<UserDataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        if (!Array.isArray(allUsers)) return;

        const filteredAdmins = allUsers.filter(
          user => user._id && adminIds.includes(user._id)
        );        
        setAdmins(filteredAdmins);
      } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [adminIds]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : admins.length > 0 ? (
        <ScrollView>
          {admins.map((user) => (
            <TouchableOpacity
              key={user._id}
              style={[styles.userCard, styles.verifiedUserCard]}
              onPress={() => onEdit(user._id!)} // 🆕 переход к редактированию
            >
              <UserAvatar user={user} />
              <View>
                <Text style={styles.username}>{user.username || 'Без username'}</Text>
                <Text style={styles.name}>
                  {`${user.firstName || ''} ${user.lastName || ''}`.trim()}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
           <TouchableOpacity style={styles.addAdmin} onPress={onAdd}>
            <AddAdminIcon />
            <Text style={styles.username}>Добавить</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <>
          <Text style={styles.noUsers}>Нет администраторов</Text>
          <TouchableOpacity style={styles.addAdmin} onPress={onAdd}>
            <AddAdminIcon />
            <Text style={styles.username}>Добавить</Text>
          </TouchableOpacity>
        </>  
      )}
    
    </View>
  );
};

export default Admins;
