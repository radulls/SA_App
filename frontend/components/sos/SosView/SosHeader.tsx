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
  {/* Первый контейнер (закрыть) */}
  <View style={styles.leftContainer}>
    <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
      <CloseIcon fill="#000" />
    </TouchableOpacity>
  </View>

  {/* Заголовок */}
  <View style={styles.titleContainer}>
    <Text style={styles.sosTitle}>Сигнал SOS</Text>
  </View>

  {/* Третий контейнер (хелперс, хелперкаунт, опшнс) */}
  <View style={styles.rightContainer}>
    <View style={styles.options}>
      <View style={styles.helpers}>
        <TouchableOpacity style={styles.closeIcon} onPress={navigateToHelpers}>
          <SosHelpersIcon />
        </TouchableOpacity>
        {helperCount > 0 && <Text style={styles.helperCount}>{helperCount}</Text>}
      </View>

      <TouchableOpacity style={[styles.closeIcon, styles.moreOptions]} onPress={() => setIsModalVisible(true)}>
        <MoreOptionsIcon fill="#000" />
      </TouchableOpacity>
    </View>
  </View>

  {/* Модалка */}
  <HelperActionModal
    visible={isModalVisible}
    onClose={() => setIsModalVisible(false)}
    sosId={sosId}
    mode="options" // Меню с "Копировать", "Поделиться", "Пожаловаться"
  />
</View>
  );
};

const styles = StyleSheet.create({
  topItems: {
    paddingHorizontal: 16,
    paddingTop: 55,
    paddingBottom: 56,
    width: '100%',
    maxWidth: 600,
    flexDirection: 'row', // Горизонтальное расположение
    justifyContent: 'space-between', // Пространство между контейнерами
    alignItems: 'center', // Выравнивание по центру по вертикали
  },
  leftContainer: {
    width: 110, // Фиксированная ширина для первого контейнера
    justifyContent: 'center',
  },
  closeIcon: {
    zIndex: 20,
  },
  titleContainer: {
    flex: 1, // Заголовок занимает всё оставшееся пространство
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosTitle: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'SFUIDisplay-bold',
  },
  rightContainer: {
    width: 110, // Фиксированная ширина для третьего контейнера
    justifyContent: 'center',
    alignItems: 'flex-end', // Элементы выравниваются по правому краю
  },
  options: {
    flexDirection: 'row', // Горизонтальное расположение для helper и more options
    alignItems: 'center', // Выравнивание по центру по вертикали
  },
  helperCount: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'SFUIDisplay-bold',
    paddingLeft: 6, // Немного отступа от иконки
  },
  helpers: {
    flexDirection: 'row', // Элементы выстраиваются в ряд
    alignItems: 'center', // Иконка и счетчик выравниваются по вертикали
  },
  moreOptions: {
    marginLeft: 20, // Отступ между иконками
  }
});




export default SosHeader;
