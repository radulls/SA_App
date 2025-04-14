import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserDataProps } from '@/api';
import { styles } from './AdminControlStyles'

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Не указана';
  const date = new Date(dateString);
  return `${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
};

interface AdminUserInfoProps {
  user: UserDataProps | null;
  visibleFields?: Array<'phone' | 'email' | 'verificationStatus' | 'invitedBy' | 'createdAt'>;
}

const AdminUserInfo: React.FC<AdminUserInfoProps> = ({ user, visibleFields }) => {
  if (!user) return null;

  const show = (field: 'phone' | 'email' | 'verificationStatus' | 'invitedBy' | 'createdAt') =>
  !visibleFields || visibleFields.includes(field);

  const verificationStatusMap: Record<string, string> = {
    verified: 'Пройдена',
    unverified: 'Не пройдена',
    pending: 'Ожидает',
    rejected: 'Отклонена',
    blocked: 'Заблокирована',
  };

  return (
    <View style={styles.container}>
      {show('phone') && (
        <View style={styles.infoItem}>
          <Text style={styles.label}>Телефон:</Text>
          <Text style={styles.value}>{user.phone || 'Не указан'}</Text>
        </View>
      )}
      {show('email') && (
        <View style={styles.infoItem}>
          <Text style={styles.label}>Почта:</Text>
          <Text style={styles.value}>{user.email || 'Не указана'}</Text>
        </View>
      )}
      {show('verificationStatus') && (
        <View style={styles.infoItem}>
          <Text style={styles.label}>Верификация:</Text>
          <Text style={styles.value}>
            {user.verificationStatus && verificationStatusMap[user.verificationStatus]
              ? verificationStatusMap[user.verificationStatus]
              : 'Не указана'}
          </Text>
        </View>
      )}
      {show('invitedBy') && (
        <View style={styles.infoItem}>
          <Text style={styles.label}>Кто подключил:</Text>
          <Text style={styles.value}>@{user.invitedBy?.username || 'Нет данных'}</Text>
        </View>
      )}
      {show('createdAt') && (
        <View style={styles.infoItem}>
          <Text style={styles.label}>Дата подключения:</Text>
          <Text style={styles.value}>{formatDate(user.createdAt)}</Text>
        </View>
      )}
    </View>
  );
};
export default AdminUserInfo;
