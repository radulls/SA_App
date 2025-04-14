import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { getAllCities } from '@/api/citiesApi';
import { getUserProfile, getSubdivisionsICanPostTo } from '@/api';
import { City } from '@/types/city';
import { Subdivision } from '@/types/subdivision';
import CustomModal from '@/components/admin/CustomModal';
import IconArrowSettings from '@/components/svgConvertedIcons/IconArrowSettings';
import { getAllSubdivisions } from '@/api/adminApi';
import CloseIcon from '../svgConvertedIcons/closeIcon';
import CheckMarkIcon from '../svgConvertedIcons/checkMarkIcon';
import BaseIcon from '../svgConvertedIcons/settings/baseIcon';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { styles } from './SettingStepStyle';

interface PostSettings {
  target: 'self' | 'subdivision';
  from: 'user' | 'subdivision';
  isEmergency: boolean;
  cityId: string | null;
  group: string | null;
  subdivisionId: string | null;
}

interface PostSettingsStepProps {
  onNext: () => void;
  setPostSettings: React.Dispatch<React.SetStateAction<PostSettings>>;
}

const PostSettingsStep: React.FC<PostSettingsStepProps> = ({ onNext, setPostSettings }) => {
  const router = useRouter();
  const [cities, setCities] = useState<City[]>([]);
  const [allSubdivisions, setAllSubdivisions] = useState<Subdivision[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [subdivisions, setSubdivisions] = useState<Subdivision[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [canPostToSubdivisions, setCanPostToSubdivisions] = useState(false);
  const [target, setTarget] = useState<'self' | 'subdivision'>('self');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectAllGroups, setSelectAllGroups] = useState(false);
  const [postFrom, setPostFrom] = useState<'user' | 'subdivision'>('user');
  const [user, setUser] = useState<any>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [adminSubdivision, setAdminSubdivision] = useState<Subdivision | null>(null);
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>([]);
  const [isEmergency, setIsEmergency] = useState(false);

  const GROUPS = ['Основа', 'Трибуна', 'Дружина'];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [citiesData, subdivisionsData, userProfile, allowedSubs] = await Promise.all([
          getAllCities(),
          getAllSubdivisions(),
          getUserProfile(),
          getSubdivisionsICanPostTo(),
        ]);
  
        setUser(userProfile);
        setIsCreator(userProfile.role === 'creator');
        setAllSubdivisions(subdivisionsData);
        setCities(citiesData);
        setCanPostToSubdivisions(allowedSubs.length > 0);
  
        // 🔒 Если creator — полная свобода
        if (userProfile.role === 'creator') {
          const firstCity = citiesData[0];
          setSelectedCity(firstCity);
  
          const subsInCity = subdivisionsData.filter(sub =>
            (typeof sub.city === 'string' ? sub.city : sub.city._id) === firstCity._id
          );
          setSubdivisions(subsInCity);
  
          const availableGroups = [...new Set(subsInCity.map(s => s.group))];
          if (availableGroups.includes('Основа')) {
            setSelectedGroups(['Основа']);
          } else if (availableGroups.length > 0) {
            setSelectedGroups([availableGroups[0]]);
          } else {
            setSelectedGroups([]);
          }
  
          return;
        }
  
        // 👮 Если обычный админ (не creator) — найдём его подразделение
        let adminSubdivision: Subdivision | null = null;
        if (userProfile._id) {
          adminSubdivision = subdivisionsData.find(sub =>
            (sub.admins || []).some(admin => admin._id === userProfile._id)
          ) || null;          
        }
  
        if (adminSubdivision) {
          setAdminSubdivision(adminSubdivision);
  
          const cityId = typeof adminSubdivision.city === 'string'
            ? adminSubdivision.city
            : adminSubdivision.city._id;
  
          const city = citiesData.find(c => c._id === cityId) || null;
          setSelectedCity(city);
          setSelectedGroups([adminSubdivision.group]);
          setTarget('subdivision');
          setPostFrom('subdivision');
          setSubdivisions([adminSubdivision]); // показываем только своё подразделение
        }
  
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };
  
    loadData();
  }, []);
  
  const handleSelectCitiesConfirm = () => {
    const selected = cities.find(city => city._id === selectedCityIds[0]) || null;
    setSelectedCity(selected);
    setModalVisible(false);
  
    const subsInCity = allSubdivisions.filter(sub =>
      selectedCityIds.includes(typeof sub.city === 'string' ? sub.city : sub.city._id)
    );
    setSubdivisions(subsInCity);
  };

  const handleNext = () => {
    const matchedSubdivisions = allSubdivisions.filter(
      s =>
        selectedCityIds.includes(typeof s.city === 'string' ? s.city : s.city._id) &&
        (selectAllGroups || selectedGroups.includes(s.group))
    );    

    if (target === 'subdivision' && matchedSubdivisions.length === 0) {
      Toast.show({ type: 'error', text1: 'Выберите хотя бы одно подразделение' });
      return;
    } 

    if (!isCreator && adminSubdivision) {
      setPostSettings({
        target,
        from: target === 'self' ? 'user' : postFrom,
        isEmergency,
        cityId: null, // т.к. выкладываем в несколько городов
        group: null,  // аналогично
        subdivisionId: JSON.stringify(matchedSubdivisions.map(s => s._id)), // ← теперь массив, но строкой
      });      
      onNext();
      return;
    }
    
    // Можно записать все ID через запятую или передавать массив — зависит от дальнейшей логики
    setPostSettings({
      target,
      from: target === 'self' ? 'user' : postFrom,
      isEmergency,
      cityId: selectedCity?._id || null,
      group: selectAllGroups ? 'all' : null,
      subdivisionId: matchedSubdivisions.map(s => s._id).join(','), // ← всегда массив ID
    });    
    onNext();
  };

  const matchedSubdivisions = allSubdivisions.filter(
    s =>
      (typeof s.city === 'string' ? s.city : s.city._id) === selectedCity?._id &&
      (selectAllGroups || selectedGroups.includes(s.group))
  );
  
  const citySelectOptions = cities.map(city => ({
    label: city.name,
    value: city._id
  }));
  

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const handleClose = () => {
    router.push('/home')
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeIcon} onPress={handleClose}>
          <CloseIcon fill='#000'/>
        </TouchableOpacity>
        <Text style={styles.title}>Новый пост</Text>
      </View>
  
      {canPostToSubdivisions && (
        <View style={styles.postTypeContainer}>
          <TouchableOpacity
            style={styles.postType}
            onPress={() => setTarget('self')}
          >
            <Text style={styles.postTypeText}>На своей странице</Text>
            <View style={[styles.selectionCircle, target === 'self' && [isCreator ? styles.selectionCircleSelected : styles.selectionCircleSelectedAdmin]]}>
              {target === 'self' && (isCreator ? <CheckMarkIcon width={10}/> : null)}
            </View>

          </TouchableOpacity>
          <View style={styles.line}/>
          <TouchableOpacity
            style={styles.postType}
            onPress={() => setTarget('subdivision')}
          >
            <Text style={styles.groupText}>На странице подразделения</Text>
            <View style={[styles.selectionCircle, target === 'subdivision' && [isCreator ? styles.selectionCircleSelected : styles.selectionCircleSelectedAdmin]]}>
              {target === 'subdivision' && (isCreator ? <CheckMarkIcon width={10}/> : null)}
            </View>
          </TouchableOpacity>
        </View>
      )}
  
      {target === 'subdivision' && (
        <>
          {/* 👑 CREATOR — сначала город, потом подразделения */}
          {isCreator && (
            <>
              <TouchableOpacity style={styles.citySelector} onPress={() => setModalVisible(true)}>
                <BaseIcon/>
                <Text style={styles.cityName}>
                  {selectedCityIds.length > 0
                    ? cities
                        .filter(city => selectedCityIds.includes(city._id))
                        .map(city => city.name)
                        .join(', ')
                    : 'Выберите город'}
                </Text>
                <View style={{ transform: [{ rotate: '90deg' }], paddingBottom: 8 }}>
                  <IconArrowSettings />
                </View>
              </TouchableOpacity>
              <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.groupsRow}>
                    <TouchableOpacity
                      style={[styles.groupButton, selectAllGroups && styles.groupButtonActive]}
                      onPress={() => {
                        if (selectAllGroups) {
                          setSelectAllGroups(false);
                          const defaultGroup = GROUPS.find(g => subdivisions.some(s => s.group === g));
                          if (defaultGroup) setSelectedGroups([defaultGroup]);
                        } else {
                          setSelectAllGroups(true);
                          setSelectedGroups([]);
                        }
                      }}
                    >
                      <Text style={[styles.groupText, selectAllGroups && styles.groupTextActive]}>Все</Text>
                    </TouchableOpacity>
                    {GROUPS.map(group => {
                      const exists = subdivisions.some(s => s.group === group);
                      if (!exists) return null;
      
                      const isActive = selectAllGroups || selectedGroups.includes(group);
                      return (
                        <TouchableOpacity
                          key={group}
                          style={[styles.groupButton, isActive && styles.groupButtonActive]}
                          onPress={() => {
                            if (selectAllGroups) setSelectAllGroups(false);
                            setSelectedGroups(prev =>
                              prev.includes(group)
                                ? prev.filter(g => g !== group)
                                : [...prev, group]
                            );
                          }}
                        >
                          <Text style={[styles.groupText, isActive && styles.groupTextActive]}>{group}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            </>
          )}
  
          {/* ADMIN — сначала подразделение, потом город */}
          {!isCreator && adminSubdivision && (
            <>
              <View style={styles.groupsRow}>
                <TouchableOpacity style={[styles.groupButton, styles.groupButtonActive]}>
                  <Text style={[styles.groupText, styles.groupTextActive]}>
                    {adminSubdivision.group}
                  </Text>
                </TouchableOpacity>
              </View>
  
              <View style={styles.citySelector}>
                <BaseIcon />
                <Text style={styles.cityName}>
                  {typeof adminSubdivision.city === 'string'
                    ? 'Город'
                    : adminSubdivision.city?.name || 'Город'}
                </Text>
              </View>
            </>
          )}
  
          {/* Только creator может выбрать от кого постить */}
          {isCreator && matchedSubdivisions.length >= 1 && (
            <View style={styles.fromRow}>
              <View style={styles.fromButtons}>
                <TouchableOpacity
                  style={[styles.fromButton, postFrom === 'user' && styles.fromButtonActive]}
                  onPress={() => setPostFrom('user')}
                >
                  <Text style={[styles.fromText, postFrom === 'user' && styles.fromTextActive]}>
                    От своего имени
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.fromButton, postFrom === 'subdivision' && styles.fromButtonActive]}
                  onPress={() => setPostFrom('subdivision')}
                >
                  <Text style={[styles.fromText, postFrom === 'subdivision' && styles.fromTextActive]}>
                    От подразделения
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {/* Экстренный пост */}
          {isCreator && (
            <>
              <View style={styles.line}/>
              <TouchableOpacity style={styles.emergencyButton}
              onPress={() => setIsEmergency(prev => !prev)}>
                <View style={styles.emergency}>
                  <Text style={styles.postTypeText}>Экстренное</Text>
                  <View style={[styles.selectionCircle, isEmergency && styles.selectionCircleSelected]}>
                    {isEmergency && <CheckMarkIcon width={10} />}
                  </View>
                </View>
                <Text style={styles.emergencyText}>Применять в исключительных случаях, функционал пользователя будет недоступен до момента ознакомления с постом.</Text>             
              </TouchableOpacity>              
            </>
          )}
        </>
      )}
  
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Продолжить</Text>
      </TouchableOpacity>
  
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Выбрать город"
        multiple
        selectedOptions={selectedCityIds}
        onToggleOption={(cityId) => {
          setSelectedCityIds((prev) =>
            prev.includes(cityId)
              ? prev.filter((id) => id !== cityId)
              : [...prev, cityId]
          );
        }}
        selectOptions={citySelectOptions}
          optionTextStyle={(cityId: string) => ({
            fontWeight: selectedCityIds.includes(cityId) ? '700' : '400'
          })}
        buttons={[
          { label: 'Отмена', action: () => setModalVisible(false), type: 'danger' },
          { label: 'Готово', action: handleSelectCitiesConfirm, type: 'primary' }
        ]}
      />
    </View>
  );
  
};

export default PostSettingsStep;