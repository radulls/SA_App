import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {mockUserData} from '@/api/mockApi'; // Импортируем мок-данные напрямую

const ProfileStats: React.FC = () => {
  const user = mockUserData; // Берем данные из мока

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.label}>Подписчики: </Text>
        <Text style={styles.value}>{user.subscribers ?? 0}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>Рейтинг: </Text>
        <Text style={[styles.value, styles.ratingBackground]}>
          {/* {(user.rating ?? 0).toFixed(1)} */}
          {user.rating ?? 0}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingLeft: 16,
    paddingRight: 16,
    gap: 18,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: 'rgba(153, 153, 153, 1)',
  },
  value: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
    paddingVertical: 3,
    paddingHorizontal: 3,
  },
  ratingBackground: {
    backgroundColor: '#FFE772',
    borderRadius: 2,
  },
});

export default ProfileStats;
