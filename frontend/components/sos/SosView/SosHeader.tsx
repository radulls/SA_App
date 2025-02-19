import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CloseIcon from '../../svgConvertedIcons/closeIcon';
import MoreOptionsIcon from '../../svgConvertedIcons/MoreOptionsIcon';
import SosHelpersIcon from '../../svgConvertedIcons/sosIcons/sosHelpersIcon';

interface SosHeaderProps {
  onClose: () => void;
}

const SosHeader: React.FC<SosHeaderProps> = ({ onClose }) => {
  return (
    <View style={styles.topItems}>
      <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
        <CloseIcon fill="#000" />
      </TouchableOpacity>
      <Text style={styles.sosTitle}>Сигнал SOS</Text>
      <View style={styles.options}>
        <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
          <SosHelpersIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
          <MoreOptionsIcon fill="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topItems: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingHorizontal: 6,
    paddingTop: 40,
  },
  closeIcon: {
    padding: 10,
    zIndex: 1000,
  },
  sosTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 50,
  },
  options: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SosHeader;
