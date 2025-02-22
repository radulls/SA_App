import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import CloseIcon from '../../svgConvertedIcons/closeIcon';
import MoreOptionsIcon from '../../svgConvertedIcons/MoreOptionsIcon';
import SosHelpersIcon from '../../svgConvertedIcons/sosIcons/sosHelpersIcon';
import { getSosHelpers } from '@/api/sos/sosApi';
import HelperActionModal from '../HelperActionModal';

interface SosHeaderProps {
  onClose: () => void;
  sosId: string;
}

const SosHeader: React.FC<SosHeaderProps> = ({ onClose, sosId }) => {
  const [helperCount, setHelperCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false); // 🔥 Добавили состояние для модалки
  const router = useRouter();

  useEffect(() => {
    fetchHelpers();
  }, [sosId]);

  const fetchHelpers = async () => {
    try {
      const response = await getSosHelpers(sosId);
      setHelperCount(response.data.length);
    } catch (error) {
      console.error("❌ Ошибка загрузки помощников:", error);
    }
  };

  // 📌 Переход на страницу с помощниками
  const navigateToHelpers = () => {
    router.push({
      pathname: '/sos-helpers',
      params: { sosId },
    });
  };

  return (
    <View style={styles.topItems}>
      <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
        <CloseIcon fill="#000" />
      </TouchableOpacity>
      <Text style={styles.sosTitle}>Сигнал SOS</Text>
      <View style={styles.options}>
        <TouchableOpacity style={[styles.closeIcon, styles.helpers]} onPress={navigateToHelpers}>
          <SosHelpersIcon />
          {helperCount > 0 && <Text style={styles.helperCount}>{helperCount}</Text>}
        </TouchableOpacity>

        {/* 🔥 Открываем меню при нажатии */}
        <TouchableOpacity style={[styles.closeIcon, styles.moreOptions]} onPress={() => setIsModalVisible(true)}>
          <MoreOptionsIcon fill="#000" />
        </TouchableOpacity>
      </View>

      {/* 🔥 Добавляем модалку */}
      <HelperActionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        sosId={sosId}
        mode="options" // 🔥 Обычное меню с "Копировать", "Поделиться", "Пожаловаться"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  topItems: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 16,
    height: 124,
  },
  closeIcon: {
    padding: 20,
    zIndex: 1000,
    flexDirection: 'row',
    alignContent: 'center',
    marginLeft: -20,
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
  helperCount: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
    paddingLeft: 6,
  },
  helpers:{
    paddingVertical: 10,
  },
  moreOptions:{
    marginRight: -20,
  }
});

export default SosHeader;
