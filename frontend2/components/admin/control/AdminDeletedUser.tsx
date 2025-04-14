import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UserDataProps } from '@/api';
import { styles } from './AdminControlStyles'

interface AdminDeletedUserProps {
  user: UserDataProps | null;
  onRestore?: () => void;
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Не указана';
  const date = new Date(dateString);
  return `${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

const AdminDeletedUser: React.FC<AdminDeletedUserProps> = ({ user, onRestore }) => {
  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.infoItem}>
        <Text style={styles.label}>Дата удаления:</Text>
        <Text style={styles.value}>{formatDate(user.deletedAt)}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.label}>Причина удаления:</Text>
        <Text style={styles.value}>
          {user.deleteReason?.name || 'Не указана'}
        </Text>
      </View>

      <View style={styles.infoItem}>
        <Text style={styles.label}>Удалил:</Text>
        <Text style={styles.value}>
          {user.deletedBy?.username || 'Неизвестно'}
        </Text>
      </View>

      {/* {onRestore && (
        <TouchableOpacity style={styles.restoreButton} onPress={onRestore}>
          <Text style={styles.restoreText}>Восстановить</Text>
        </TouchableOpacity>
      )} */}
    </View>
  );
};

export default AdminDeletedUser;