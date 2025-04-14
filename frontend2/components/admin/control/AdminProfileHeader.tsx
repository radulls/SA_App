import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { IMAGE_URL, UserDataProps } from '@/api';

const AdminProfileHeader: React.FC<{ user: UserDataProps | null }> = ({ user }) => {
  if (!user) return null;

  const verificationStatusMap: Record<string, string> = {
    verified: 'Активен',
    rejected: 'Отказано',
    pending: 'Подтверждение верификации',
    blocked: 'Удалён',
    payment: 'Оплата подписки',
  };

  const roleMap: Record<string, string> = {
    admin: 'Админ',
    user: 'Пользователь',
    creator: 'Создатель',
  };  

  const status =
  user.verificationStatus && verificationStatusMap[user.verificationStatus]
    ? verificationStatusMap[user.verificationStatus]
    : 'Не указан';

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <View style={styles.topInfoContainer}>
          <View>
            <Text style={styles.name}>{`${user.firstName || ''} ${user.lastName || ''}`.trim()}</Text>
            <Text style={styles.username}>@{user.username || 'Нет данных'}</Text>
            <View style={styles.userInfoContainer}>
              <View style={styles.locationIcon}>
                <Text style={styles.locationIconText}>sa</Text>
              </View>
              <Text style={styles.label}>{user.city || 'Не указан'}</Text>
            </View>
          </View>
          <Image
            source={{ uri: user.profileImage ? `${IMAGE_URL}${user.profileImage}` : 'https://via.placeholder.com/80' }}
            style={styles.avatar}
          />
        </View>
        <View style={styles.roleStatusContainer}>
          <View style={styles.userInfoContainer}>
            <Text style={styles.label}>Роль:</Text>
            <Text style={styles.value}>
              {user.role && roleMap[user.role] ? roleMap[user.role] : 'Не указана'}
            </Text>
          </View>

          <View style={styles.userInfoContainer}>
            <Text style={styles.label}>Статус:</Text>
            <Text style={styles.value}>{status}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { 
    backgroundColor: '#fff', 
    borderBottomWidth: 0.5,
    borderColor: '#ECECEC',
    paddingBottom: 23,
    marginBottom: 23,
  },
  topInfoContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {

  },
  locationIcon: {
    backgroundColor: '#000',
    borderRadius: 4,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  locationIconText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  avatar: { 
    width: 69, 
    height: 69, 
    borderRadius: 40, 
  },
  name: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  username: { 
    fontSize: 14, 
    marginBottom: 10 
  },
  userInfoContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  label: { 
    fontSize: 14, 
    fontWeight: '700',
    marginRight: 4, 
  },
  value: { 
    fontSize: 12, 
    fontWeight: '500' 
  },
  roleStatusContainer: { 
    gap: 10,
    paddingTop: 25,
  },
  contactsContainer: { 
    marginTop: 10 
  },
  contactsItem: { 
    flexDirection: 'row', 
    marginBottom: 5 
  },
  contactsLabel: { 
    fontSize: 14, 
    color: 'gray',
    marginRight: 5 
    },
});

export default AdminProfileHeader;
