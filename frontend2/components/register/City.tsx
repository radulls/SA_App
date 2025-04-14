import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
} from 'react-native';
import { get } from '@/api'; // Используем вашу функцию GET для запросов
import { ValueProps } from '@/app/register';
import CloseIcon from '../svgConvertedIcons/closeIcon';

interface City {
  _id: string;
  name: string;
}

const CityForm: React.FC<ValueProps> = ({ value, onDataChange }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await get('/cities'); // Запрос к вашему API
        setCities(data); // Устанавливаем список городов
        setFilteredCities(data); // Начальное значение для фильтрации
      } catch (error: unknown) {
        console.error('Ошибка при загрузке городов:', (error as any).message);
      }
    };

    fetchCities();
  }, []);

  // Фильтрация городов по поисковому запросу
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = cities.filter((city) =>
      city.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  // Выбор города
  const handleCitySelect = (cityId: string) => {
    onDataChange(cityId); // Передаём ID выбранного города
    setIsModalVisible(false); // Закрываем модальное окно
    setSearchQuery(''); // Сбрасываем поиск
  };
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={styles.form}>
      <Text style={styles.title}>Регистрация</Text>
      <Text style={styles.description}>
        Укажите город вашей территориальной принадлежности СЧ.
      </Text>
      <Text style={styles.label}>
        Город
      </Text>
      {/* Поле для открытия модального окна */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.inputText}>
          {value
            ? cities.find((city) => city._id === value)?.name || ''
            : ''}
        </Text>
      </TouchableOpacity>

      {/* Модальное окно со списком городов */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={false} // Окно на весь экран
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.fullscreenModal}>
            <View style={styles.topContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setIsModalVisible(false);
                }}
              >
                <CloseIcon/>
              </TouchableOpacity>
              <Text style={styles.titleSearch}>Выбор города</Text>
            </View>         
            <TextInput
              style={[styles.inputSearch, isFocused && styles.inputFocused]}            
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <FlatList
              data={filteredCities}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cityItem}
                  onPress={() => handleCitySelect(item._id)}
                >
                  <Text style={styles.cityName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>   
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    marginTop: 28,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontFamily: "SFUIDisplay-Bold",
    fontWeight: '700',
  },
  label: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '700',
    fontFamily: "SFUIDisplay-Bold",
  },
  description: {
    marginTop: 10,
    color: '#fff',
    fontSize: 12,
    marginBottom: 30, 
    fontFamily: "SFUIDisplay-medium",
  },
  modalContainer:{
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center'
  },
  fullscreenModal: {    
    paddingHorizontal: 16,
    paddingTop: 58,
    width: '100%',
    height: '100%',
    maxWidth: 600,
  },
  topContainer:{
    position: 'relative',
  },
  inputSearch: {
    height: 48,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    paddingHorizontal: 10,
    width: '100%',
    marginBottom: 10,
    paddingLeft: 12, 
    textAlignVertical: 'center',
    fontSize: 16,
    color: '#fff',
  },
  input: {
    height: 48,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    paddingRight: 10,
    width: '100%',
    marginBottom: 18,
    paddingLeft: 12, 
    paddingTop: 14,
    textAlignVertical: 'center',
    fontSize: 16,
    color: '#fff',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  inputText: {
    fontSize: 14,
    fontFamily: "SFUIDisplay-regular",
    color: '#fff',
  },
  inputFocused: {
    borderWidth: 1,
    borderColor: 'rgba(66, 66, 66, 100)',
  },
  titleSearch: {
    color: '#fff',
    paddingBottom: 40,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15,
    fontFamily: "SFUIDisplay-bold",
  },
  closeButton: {
    position: 'absolute',
    top: 3,
    left: 0,
    zIndex: 20,
  },  
  cityItem: {
    paddingVertical: 10,
  },
  cityName: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '400'
  },
});

export default CityForm;
