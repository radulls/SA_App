import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { UserDataProps } from '../TestData/testdata';

interface UserProps {
  user: UserDataProps | null;
}


const ProfileStats: React.FC<UserProps> = ({ user }) => {
  // Проверяем, что `user` не null
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Данные пользователя не загружены</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <Text>
          <Text style={styles.label}>Подписчики: </Text>
          <Text style={styles.value}>{user.subs ?? 0}</Text>
        </Text>
      </View>
      <View>
        <Text>
          <Text style={styles.label}>Рейтинг: </Text>
          <Text style={[styles.value, styles.ratingBackground]}>{user.rating ?? 0}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingLeft: 16,
    paddingRight: 16,
    gap: 18,
  },
  label: {
    fontSize: 12,
    color: "rgba(153, 153, 153, 1)",
  },
  value: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(0, 0, 0, 1)",
  },
  ratingBackground: {
    backgroundColor: "rgba(255, 231, 114, 1)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    overflow: "hidden",
  },
});

export default ProfileStats;
