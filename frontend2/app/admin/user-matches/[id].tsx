import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getUserMatchesDetailed } from '@/api/adminApi';
import { UserDataProps } from '@/api';
import UserMatchesList from '@/components/admin/control/UserMatchesList';
import Header from '@/components/common/Header';
import { ScrollView } from 'react-native-gesture-handler';

const UserMatchesPage = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [users, setUsers] = useState<UserDataProps[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof id === 'string') {
      getUserMatchesDetailed(id)
        .then(setUsers)
        .catch((err) => {
          console.error('Ошибка при загрузке совпадений:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  if (!users || users.length === 0) {
    return (
      <View>
        <Text>Совпадения не найдены</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Header title="Совпадения" onLeftPress={() => router.back()} leftType="back" />
        <ScrollView style={styles.scrollView}>
          <UserMatchesList users={users} />
        </ScrollView>
      </View>
    </View>
  );
};


export default UserMatchesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  contentContainer:{
    maxWidth: 600,
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    overflowX:'visible',
    overflowY:'visible',
    paddingHorizontal: 16,
  },
  centered:{
    textAlign: 'center',
  }
});
