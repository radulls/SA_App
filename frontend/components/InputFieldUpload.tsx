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
  {isUploaded && <CheckMarkIcon style={styles.checkmarkIcon}/>}
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
    fontFamily: "SFUIDisplay-bold",
    marginBottom: 0,
  },
  sublabel: {
    color: '#fff',
    fontSize: 12,
    fontFamily: "SFUIDisplay-regular",
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
    height: 48,
    justifyContent: 'space-between', 
  },
  checkmarkIcon: {
    marginLeft: 'auto', 
  },
  addContainer: {
    flex: 1, 
  },
});

export default InputFieldUpload;
