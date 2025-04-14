import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import IconArrowSettings from '../svgConvertedIcons/IconArrowSettings';

interface ProfileSectionProps {
  label: string;
  value: string | React.ReactNode;
  onPress?: () => void;
  isDanger?: boolean; // 🔥 Флаг для красного текста
  isNone?: boolean;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ label, value, onPress, isDanger, isNone }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.profileContainer}>
      <Text style={[styles.label, isDanger && styles.dangerText]}>{label}</Text>
      <View style={styles.valueContainer}>
        {typeof value === 'string' ? (
          <Text style={[styles.value, isDanger && styles.dangerText]}>{value}</Text>
        ) : (
          value
        )}
        {onPress && (
          <View style={[isNone && styles.arrowIconNone]}>
            <IconArrowSettings fill={isDanger ? '#E53935' : '#000'}/>
          </View>
        )}
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
    position: 'relative',
    zIndex: 0,
    paddingHorizontal: 16,
  },
  label: {
    flex: 1,
    fontWeight: '700',
    color: 'black',
    fontSize: 12,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontWeight: '500',
    marginRight: 8,
    color: 'black',
    fontSize: 12,
  },
  dangerText: {
    color: '#f00',
  },
  arrowIconNone:{
    display: 'none',
  }
});

export default ProfileSection;
