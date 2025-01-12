import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
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
        <View style={styles.fullscreenModal}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            setIsModalVisible(false);
          }}
        >
          <CloseIcon />
        </TouchableOpacity>

          <Text style={styles.titleSearch}>Выбор города</Text>
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
    fontWeight: '700',
  },
  label: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '700'
  },
  description: {
    marginTop: 10,
    color: '#fff',
    fontSize: 12,
    marginBottom: 30, 
  },
  fullscreenModal: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    position: 'relative'
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
    paddingHorizontal: 10,
    width: '100%',
    marginBottom: 10,
    paddingLeft: 12, 
    paddingTop: 14,
    textAlignVertical: 'center',
    fontSize: 16,
    color: '#fff',
  },
  inputText: {
    fontSize: 16,
    color: '#fff',
  },
  inputFocused: {
    borderWidth: 1,
    borderColor: 'rgba(66, 66, 66, 100)',
  },
  titleSearch: {
    color: '#fff',
    marginTop: 40,
    paddingVertical: 20,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15
  },
  closeButton: {
   position: 'absolute',
   top: 65,
   left: 0,
   zIndex: 20,
   padding: 20
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
