import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { UserDataProps, IMAGE_URL } from '@/api';

interface UserAvatarProps {
  user: UserDataProps;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {
  const userInitial = user.firstName ? user.firstName[0].toUpperCase() : '?';

  return user.profileImage ? (
    <Image source={{ uri: `${IMAGE_URL}${user.profileImage}` }} style={styles.avatar} />
  ) : (
    <View style={styles.defaultAvatar}>
      <Text style={styles.initial}>{userInitial}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 25,
    marginRight: 12,
  },
  defaultAvatar: {
    width: 38,
    height: 38,
    borderRadius: 25,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default UserAvatar;
