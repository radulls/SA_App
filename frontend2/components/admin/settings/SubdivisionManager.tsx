import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { 
  createSubdivision,
  getSubdivisionsByCity 
} from '@/api/adminApi';
import { Subdivision } from '@/types/subdivision';
import { City } from '@/types/city';
import { getAllSubdivisions } from '@/api/adminApi';
import { getAllCities } from '@/api/citiesApi';
import CustomModal from '../CustomModal';
import AddSubdivisionIcon from '@/components/svgConvertedIcons/settings/addSubdivisionIcon';
import IconArrowSettings from '../../svgConvertedIcons/IconArrowSettings';
import TribunaIcon from '@/components/svgConvertedIcons/settings/tribunaIcon';
import DruzinaIcon from '@/components/svgConvertedIcons/settings/druzinaIcon';
import BaseIcon from '@/components/svgConvertedIcons/settings/baseIcon';

interface SubdivisionManagerProps {
  activeSubdivision: Subdivision | null;
  setActiveSubdivision: (subdivision: Subdivision | null) => void;
  isAdmin?: boolean; // 👈 добавили флаг
}

const SubdivisionManager = forwardRef(({ isAdmin, activeSubdivision, setActiveSubdivision }: SubdivisionManagerProps, ref) => {
  const [subdivisions, setSubdivisions] = useState<Subdivision[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [activeCity, setActiveCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');  const ALL_GROUPS = ['Основа', 'Трибуна', 'Дружина'];
  const [showGroupOptions, setShowGroupOptions] = useState(false);
  const [allSubdivisions, setAllSubdivisions] = useState<Subdivision[]>([]);

  const getGroupIcon = (group: string) => {
    switch (group) {
      case 'Основа':
        return <BaseIcon/>;
      case 'Трибуна':
        return <TribunaIcon />;
      case 'Дружина':
        return <DruzinaIcon />;
      default:
        return null;
    }
  };

  useImperativeHandle(ref, () => ({
    reload: () => {
      if (activeCity?._id) loadCitySubdivisions(activeCity._id);
    },
    getAllSubdivisions: () => allSubdivisions, // 👈 это добавь
  }));  

  // Загрузка подразделений для выбранного города
  const loadCitySubdivisions = async (cityId: string) => {
    try {
      const subdivisionsData = await getSubdivisionsByCity(cityId);
  
      const sortOrder: Record<string, number> = { 'Основа': 0, 'Трибуна': 1, 'Дружина': 2 };
      const sortedSubdivisions = subdivisionsData.sort(
        (a: Subdivision, b: Subdivision) => sortOrder[a.group] - sortOrder[b.group]
      );
  
      setSubdivisions(sortedSubdivisions);
  
      const currentId = activeSubdivision?._id;
      const stillExists = sortedSubdivisions.find(sub => sub._id === currentId);
      setActiveSubdivision(stillExists || sortedSubdivisions[0] || null);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Ошибка при загрузке данных');
    }
  };
  
  
  // Загрузка городов и подразделений
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
  
        const [citiesData, allSubs] = await Promise.all([
          getAllCities(),
          getAllSubdivisions()
        ]);
        
        setCities(citiesData);
        setFilteredCities(citiesData);
        setAllSubdivisions(allSubs);
  
        if (citiesData.length) {
          const firstCity = citiesData[0];
          setActiveCity(firstCity);
          loadCitySubdivisions(firstCity._id);
        }
      } catch (err) {
        const error = err as Error;
        setError(error.message || 'Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  // Фильтрация городов
  useEffect(() => {
    if (searchText) {
      const filtered = cities.filter(city => 
        city.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(cities);
    }
  }, [searchText, cities]);

  // Обработчик выбора города
  const handleCitySelect = async (city: City) => {
    setActiveCity(city);
    setCityModalVisible(false);
    setSearchText('');
    await loadCitySubdivisions(city._id);
  };

  // Создание нового подразделения
  const handleCreateSubdivision = async (group: string) => {
    if (!activeCity) return;
  
    try {
      await createSubdivision({
        cityId: activeCity._id,
        group
      });
  
      // Вместо повторной загрузки вручную — вызываем уже готовую функцию
      await loadCitySubdivisions(activeCity._id);
  
      setCreateModalVisible(false);
    } catch (error) {
      console.error('Ошибка при создании подразделения:', error);
    }
  };

  if (loading) return <Text>Загрузка...</Text>;
  if (error) return <Text>Ошибка: {error}</Text>;

  // Получаем доступные для создания группы (исключая уже существующие)
  const availableGroups = ALL_GROUPS.filter(group => 
    !subdivisions.some(sub => sub.group === group)
  );

  const filteredCitiesWithSubdivisions = filteredCities.filter(city =>
    allSubdivisions.some(sub => {
      const cityId = typeof sub.city === 'string' ? sub.city : sub.city._id;
      return cityId === city._id;
    })
  );
  
  const filteredCitiesWithoutSubdivisions = filteredCities.filter(
    city => !filteredCitiesWithSubdivisions.includes(city)
  );
  
  const citySelectOptions = [
    { label: 'Города объединения', value: '__title1', isTitle: true },
    ...filteredCitiesWithSubdivisions.map(city => ({
      label: city.name,
      value: city._id,
      isOtherCity: false,
    })),
    { label: 'Остальные города', value: '__title2', isTitle: true },
    ...filteredCitiesWithoutSubdivisions.map(city => ({
      label: city.name,
      value: city._id,
      isOtherCity: true,
    })),
  ]; 

  return (
    <View style={styles.container}>
      {/* Блок выбора города */}
      <View style={styles.chooseContainer}>
        {isAdmin ? (
          // Только отображение города для админа
          <View style={styles.cityButton}>
            <View style={styles.locationIcon}>
              <Text style={styles.locationIconText}>sa</Text>
            </View>
            <View style={styles.cityContainer}>
              <Text style={styles.cityText}>
                {activeCity ? activeCity.name : 'Город не выбран'}
              </Text>
            </View>
          </View>
        ) : (
          // Кнопка выбора города для не-админа
          <TouchableOpacity
            onPress={() => setCityModalVisible(true)}
            style={styles.cityButton}
          >
            <View style={styles.locationIcon}>
              <Text style={styles.locationIconText}>sa</Text>
            </View>
            <View style={styles.cityContainer}>
              <Text style={styles.cityText}>
                {activeCity ? activeCity.name : 'Выберите город'}
              </Text>
              <View style={{ transform: [{ rotate: '90deg' }] }}>
                <IconArrowSettings />
              </View>
            </View>
          </TouchableOpacity>
        )}
  
        {/* Кнопка создания подразделения (только для не-админа) */}
        {!isAdmin && availableGroups.length > 0 && (
          <View style={styles.createContainer}>
            <TouchableOpacity onPress={() => setShowGroupOptions(prev => !prev)}>
              <AddSubdivisionIcon />
            </TouchableOpacity>
            {showGroupOptions && (
              <View style={styles.groupOptionsContainer}>
                {availableGroups.map(group => (
                  <TouchableOpacity
                    key={group}
                    style={styles.groupOptionButton}
                    onPress={() => {
                      handleCreateSubdivision(group);
                      setShowGroupOptions(false);
                    }}
                  >
                    <View style={styles.groupOptionContent}>
                      {getGroupIcon(group)}
                      <Text style={styles.groupOptionText}>{group}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
  
      {/* Подразделения */}
      <View style={styles.groupsRow}>
        {isAdmin ? (
          // Только отображение активного подразделения для админа
          <View style={[styles.groupButton, styles.groupButtonActive]}>
            <Text style={[styles.groupText, styles.groupTextActive]}>
              {activeSubdivision?.group || 'Нет подразделения'}
            </Text>
          </View>
        ) : (
          // Селекторы подразделений для не-админа
          subdivisions.map((subdivision) => (
            <TouchableOpacity
              key={subdivision._id}
              onPress={() => setActiveSubdivision(subdivision)}
              style={[
                styles.groupButton,
                activeSubdivision?._id === subdivision._id && styles.groupButtonActive
              ]}
            >
              <Text
                style={[
                  styles.groupText,
                  activeSubdivision?._id === subdivision._id && styles.groupTextActive
                ]}
              >
                {subdivision.group}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
  
      {/* Модальное окно выбора города (только для не-админа) */}
      {!isAdmin && (
        <CustomModal
          visible={cityModalVisible}
          onClose={() => {
            setCityModalVisible(false);
            setSearchText('');
          }}
          hideOptionIcons={true}
          title="Выберите город"
          input={{
            placeholder: '',
            value: searchText,
            onChange: setSearchText,
            showArrowIcon: false,
          }}
          selectOptions={citySelectOptions}
          selectedOption={activeCity?._id || null}
          onSelectOption={(cityId) => {
            const selected = cities.find(c => c._id === cityId);
            if (selected) handleCitySelect(selected);
          }}
        />
      )}
    </View>
  );
  
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
    paddingHorizontal: 16,
  },
  chooseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cityButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
  },
  cityContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  cityText: {
    color: '#000',
    fontWeight: '700',
  },
  groupsRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6,
    marginBottom: 30,
    position: 'relative',
    zIndex: -1,
  },
  groupButton: {
    paddingHorizontal: 12, 
    height: 36,
    borderRadius: 8, 
    backgroundColor: '#fff',
    minWidth: 106,
    borderColor: '#D9D9D9',
    borderWidth: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupButtonActive: {
    backgroundColor: '#000',
    borderWidth: 0, 
  },
  groupText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',  
    fontSize: 12,
  },
  groupTextActive: {
    color: '#fff'
  },
  locationIcon: {
    backgroundColor: "#000000",
    borderRadius: 4,
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  locationIconText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 2,
  },
  subdivisionContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 16,
  },
  subdivisionName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  createContainer:{
    position: 'relative',
    zIndex: 10
  },
  groupOptionsContainer: {
    position: 'absolute',
    backgroundColor: '#F3F3F3',
    borderRadius: 16,
    paddingVertical: 29,
    paddingHorizontal: 33,
    top: '100%',
    marginTop: 10,
    width: 174,
    right: 0,
    zIndex: 1,
    gap: 28
  },
  groupOptionButton: {


  },
  groupOptionContent:{
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  groupOptionText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '700'
  },
  
});

export default SubdivisionManager;