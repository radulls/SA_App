import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import SosView from '@/components/sos/SosView';

const SosSignalPage = () => {
  const { id } = useLocalSearchParams(); // 🔥 Получаем ID из URL

  if (!id) {
    return <ActivityIndicator size="large" color="#F22C2C" />;
  }
  console.log("🚀 ID из useLocalSearchParams:", id);

  return (
    <View style={styles.container}>
      <SosView sosId={id as string} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default SosSignalPage;
