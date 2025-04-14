import React from 'react';
import { View, Text } from 'react-native';
import { UserStatsProps } from '@/api/adminApi';
import { styles } from './AdminControlStyles'

const AdminUserStats: React.FC<{ stats: UserStatsProps | null }> = ({ stats }) => {
  if (!stats) return <Text>Нет данных о статистике</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.infoItem}>
        <Text style={styles.label}>Публикация сигнал SOS:</Text>
        <Text style={styles.value}>{stats.sosPublished}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.label}>Выезд на сигнал SOS:</Text>
        <Text style={styles.value}>{stats.sosResponses}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.label}>Подключил к SA:</Text>
        <Text style={styles.value}>{stats.connectedUsers}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.label}>Заданий в общем деле:</Text>
        <Text style={styles.value}>{stats.generalTasks}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.label}>Помощь в общем деле:</Text>
        <Text style={styles.value}>{stats.generalHelp}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.label}>Сделки в маркете:</Text>
        <Text style={styles.value}>{stats.marketDeals}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.label}>Сигнальный огонь:</Text>
        <Text style={styles.value}>{stats.signalFire}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.label}>Спортер поприветствовал:</Text>
        <Text style={styles.value}>{stats.sporterGreetings}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.label}>Упоминания в жалобах:</Text>
        <Text style={styles.value}>{stats.complaintMentions}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.label}>Награды:</Text>
        <Text style={styles.value}>{stats.awards}</Text>
      </View>
    </View>
  );
};


export default AdminUserStats;
