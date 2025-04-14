import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TitleDescription = () => {
  return (
    <View>
      <Text style={styles.title}>Название и описание</Text>
      <Text style={styles.description}>
        Название и описание поможет быстрее понять, что будет на мероприятии.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 22,
    fontWeight: '700',
    // fontFamily: 'SFUIDisplay-Bold',
    marginBottom: 7,
  },
  description: {
    color: 'rgba(139, 139, 139, 1)',
    fontSize: 12,
    // fontFamily: 'SFUIDisplay-Regular',
    marginBottom: 28,
  },
});

export default TitleDescription;