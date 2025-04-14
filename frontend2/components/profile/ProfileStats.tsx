import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { UserDataProps } from '@/api/index'; // Импортируем интерфейс из API

interface UserProps {
  user: UserDataProps;
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
      <View style={styles.item}>
        <Text style={styles.label}>Подписчики: </Text>
        <Text style={styles.value}>{Number(user.subscribers ?? 0)}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>Рейтинг: </Text>
        <Text style={[styles.value, styles.ratingBackground]}>
          {Number(user.rating ?? 0).toFixed(1)}
        </Text>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    paddingLeft: 16,
    paddingRight: 16,
    gap: 18,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontFamily: "SFUIDisplay-regular",
    fontSize: 12,
    color: "rgba(153, 153, 153, 1)",
  },
  value: {
    fontFamily: "SFUIDisplay-bold",
    fontSize: 12,
    color: "#000",
    paddingVertical: 3,
    paddingHorizontal: 3,
    fontWeight: '700'
  },
  ratingBackground: {
    backgroundColor: "#FFE772",
    paddingHorizontal: 2.5,
    paddingVertical: 3,
    borderRadius: 3,
  },
});

export default ProfileStats;
