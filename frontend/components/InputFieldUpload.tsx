import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import PhotoAddVerification from './svgConvertedIcons/PhotoAddVerification';

interface Props {
  label: string;
  sublabel?: string;
  onPress: () => void; // Добавляем onPress
}

const InputFieldUpload: React.FC<Props> = ({ label, sublabel = '', onPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.label}>{label}</Text>
        {sublabel.length > 0 && <Text style={styles.sublabel}>{sublabel}</Text>}
      </View>
      <Pressable onPress={onPress} style={styles.back}>
        <PhotoAddVerification />
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 0,
  },
  sublabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '400',
    paddingLeft: 3,
  },
  back: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 6,
    gap: 10,
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 16,
    height: 48,
  },
});

export default InputFieldUpload;
