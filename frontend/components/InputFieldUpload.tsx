import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import PhotoAddVerification from './svgConvertedIcons/PhotoAddVerification';
import CheckMarkIcon from './svgConvertedIcons/checkMarkIcon';
import PhotoIcon from './svgConvertedIcons/photoIcon';

interface Props {
  label: string;
  sublabel?: string;
  onPress: () => void;
  isUploaded: boolean; // Новый пропс
}

const InputFieldUpload: React.FC<Props> = ({ label, sublabel = '', onPress, isUploaded }) => {
  const Icon = label === "Паспорт" ? PhotoAddVerification : PhotoIcon; // Условие для выбора иконки

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.label}>{label}</Text>
        {sublabel.length > 0 && <Text style={styles.sublabel}>{sublabel}</Text>}
      </View>
      <Pressable onPress={onPress} style={styles.back}>
        {isUploaded ? '' : <Icon />}
        <View style={styles.addContainer}>
          <Text style={styles.label}>{isUploaded ? "Добавлено" : label}</Text>
        </View>
        {isUploaded ? <CheckMarkIcon /> : ''}
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
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 6,
    gap: 10,
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 16,
    paddingRight:40,
    height: 48,
  },
  addContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default InputFieldUpload;
