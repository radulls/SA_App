import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CloseIcon from '../svgConvertedIcons/closeIcon'; // иконка закрытия
import IconBack from '../svgConvertedIcons/iconBack';   // иконка назад

interface HeaderProps {
  title: string;
  onLeftPress: () => void;
  leftType?: 'back' | 'close'; // можно выбрать иконку
}

const Header: React.FC<HeaderProps> = ({ title, onLeftPress, leftType = 'back' }) => {
  const LeftIcon = leftType === 'close' ? CloseIcon : IconBack;

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onLeftPress} style={styles.leftIcon}>
        <LeftIcon fill="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={{ width: 24 }} /> {/* Пустой блок для симметрии */}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingTop: 55,
    paddingBottom: 56,
    // paddingHorizontal: 16,
  },
  leftIcon: {
    padding: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default Header;
