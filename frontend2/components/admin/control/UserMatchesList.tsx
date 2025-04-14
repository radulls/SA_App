import React from 'react';
import { View, ScrollView, StyleSheet, Image, Text } from 'react-native';
import { UserDataProps, IMAGE_URL } from '@/api';
import AdminProfileHeader from '@/components/admin/control/AdminProfileHeader';
import AdminUserInfo from '@/components/admin/control/AdminUserInfo';

interface UserMatchesListProps {
  users: UserDataProps[];
}

const UserMatchesList: React.FC<UserMatchesListProps> = ({ users }) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {users.map((user) => (
          <View key={user._id}>
            <AdminProfileHeader user={user} />
            <AdminUserInfo user={user} visibleFields={['phone', 'email']} />
            {user.selfiePhoto && (
            <View style={styles.imageContainer}>
              <Text style={styles.contactsLabel}>Фото</Text>
              <Image source={{ uri: `${IMAGE_URL}${user.selfiePhoto}` }} style={styles.image} />
            </View>
          )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingHorizontal: 16,
  },
  contactsLabel:{
    fontSize: 12,
    fontWeight: '700',
  },
  imageContainer: {
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
});

export default UserMatchesList;
