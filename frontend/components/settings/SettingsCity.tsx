import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  ScrollView,
  Animated,
  PanResponder,
} from 'react-native';
import { get, patch } from '@/api';
import { SettingsProps } from '@/app/settings';
import CloseIcon from '../svgConvertedIcons/closeIcon';
import ContinueButton from '../eventCreation/ContinueButton';
import { styles } from '@/components/settings/SettingsStyle';
import SearchIcon from '../svgConvertedIcons/BottomMenuIcons/SearchIcon';

interface City {
  _id: string;
  name: string;
}

const SettingsCity: React.FC<SettingsProps> = ({ user, onBack }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Анимация для модального окна
  const translateY = useRef(new Animated.Value(700)).current;

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data: City[] = await get('/cities');
        setCities(data);
        setFilteredCities(data);

        // ✅ Устанавливаем текущий город пользователя
        if (user.city) {
          const currentCity = data.find((city) => city._id === user.city);
          if (currentCity) {
            setSelectedCity(currentCity.name);
          }
        }
      } catch (error) {
        console.error('❌ Ошибка при загрузке городов:', error);
      }
    };

    fetchCities();
  }, [user.city]);

  const openModal = () => {
    setIsModalVisible(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: 700,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsModalVisible(false));
  };

  // Панель для свайпа вниз
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          closeModal();
        } else {
          Animated.timing(translateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Фильтрация городов
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = cities.filter((city) =>
      city.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  // Выбор нового города
  const handleCitySelect = (city: City) => {
    setSelectedCity(city.name);
    closeModal();
    setSearchQuery('');
  };

  // Отправка обновленного города на сервер
  const handleSaveCity = async () => {
    if (!selectedCity) {
      Alert.alert('Ошибка', 'Выберите город перед сохранением.');
      return;
    }

    try {
      setIsSaving(true);
      const selectedCityObject = cities.find((city) => city.name === selectedCity);
      if (!selectedCityObject) throw new Error('Город не найден');

      await patch('/users/update', { city: selectedCityObject._id });
      Alert.alert('Успех', 'Город успешно изменён.');
      onBack();
    } catch (error: any) {
      console.error('❌ Ошибка при обновлении города:', error);
      Alert.alert('Ошибка', 'Не удалось обновить город.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
        <View style={styles.formWrapper}>
          <Text style={styles.subtitle}>Выберите город вашей территориальной принадлежности.</Text>

          {/* Поле с текущим городом */}
          <TouchableOpacity style={styles.input} onPress={openModal}>
            <Text style={styles.inputText}>
              {selectedCity || user.city || 'Выберите город'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {!isSaving && (
        <View style={styles.ContinueButton}>
          <ContinueButton onPress={handleSaveCity} text="Сохранить" />
        </View>
      )}

      {/* Модальное окно с анимацией */}
      <Modal visible={isModalVisible} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.overlayTouchable} activeOpacity={1} onPress={closeModal} />
          <Animated.View style={[styles.modalContent, { transform: [{ translateY }] }]}>
            {/* Свайп-хендл */}
            <View style={styles.dragHandleContainer} {...panResponder.panHandlers}>
              <View style={styles.dragHandle} />
            </View>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeModal}>
                <CloseIcon />
              </TouchableOpacity>
              <Text style={styles.titleSearch}>Выбор города</Text>
            </View>
            <View style={styles.inputSearchContainer}>
              <SearchIcon width={20} height={20} fill="#aaa"/>
              <TextInput
                style={styles.inputSearch}
                value={searchQuery}
                onChangeText={handleSearch}
                placeholder=""
                placeholderTextColor="#aaa"
              />
            </View>

            <FlatList
              data={filteredCities}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.cityItem} onPress={() => handleCitySelect(item)}>
                  <Text style={styles.cityName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingsCity;
