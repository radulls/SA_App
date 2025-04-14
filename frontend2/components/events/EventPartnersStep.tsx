import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import CheckMarkIcon from '@/components/svgConvertedIcons/checkMarkIcon';
import { getAllMarkets } from '@/api/marketApi';
import { getAllUsers } from '@/api';
import { IMAGE_URL } from '@/api';
import type { FullEventData } from '@/types/event';
import SearchAdmin from '../admin/settings/SearchAdmin';
import CustomModal from '@/components/admin/CustomModal';
import BaseIcon from '@/components/svgConvertedIcons/settings/baseIcon';
import { City } from '@/types/city';
import { getAllCities } from '@/api/citiesApi';
import IconArrowSettings from '../svgConvertedIcons/IconArrowSettings';

interface Props {
  eventData: FullEventData;
  setEventData: React.Dispatch<React.SetStateAction<FullEventData>>;
  onBack: () => void;
  onSubmit: () => void;
}

const EventPartnersStep: React.FC<Props> = ({ eventData, setEventData }) => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [allPartners, setAllPartners] = useState<
  { _id: string; name: string; photo: string; type: 'user' | 'market'; cityId: string }[]
>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const togglePartner = (type: 'user' | 'market', id: string) => {
    const exists = eventData.partners.some((p) => p.type === type && p.id === id);
    setEventData((prev) => ({
      ...prev,
      partners: exists
        ? prev.partners.filter((p) => !(p.type === type && p.id === id))
        : [...prev.partners, { type, id }],
    }));
  };

  const isSelected = (type: 'user' | 'market', id: string) =>
    eventData.partners.some((p) => p.type === type && p.id === id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userListRaw, marketListRaw, citiesData] = await Promise.all([
          getAllUsers(),
          getAllMarkets(),
          getAllCities(),
        ]);
        setCities(citiesData);

        const usersMapped = userListRaw
          .map((u) => ({
            _id: u._id,
            name: u.username,
            photo: u.profileImage,
            cityId: (typeof u.city === 'object' && u.city !== null)
            ? (u.city as { _id?: string })._id || ''
            : typeof u.city === 'string'
            ? u.city
            : '',
            type: 'user' as const,
          }))
          .filter(
            (u): u is { _id: string; name: string; photo: string; type: 'user'; cityId: string } =>
              typeof u._id === 'string' &&
              typeof u.name === 'string' &&
              typeof u.photo === 'string' &&
              typeof u.cityId === 'string'
          );


        const marketsMapped = marketListRaw
          .map((m) => ({
            _id: m._id,
            name: m.name,
            photo: m.marketPhoto || '',
            cityId: typeof m.city === 'object' ? m.city?._id || '' : m.city || '',
            type: 'market' as const,
          }))
          .filter(
            (m): m is { _id: string; name: string; photo: string; cityId: string; type: 'market' } =>
              typeof m._id === 'string' &&
              typeof m.name === 'string' &&
              typeof m.photo === 'string' &&
              typeof m.cityId === 'string'
          );

        const mixed = [...usersMapped, ...marketsMapped].sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setAllPartners(mixed);
      } catch (err) {
        console.error('Ошибка загрузки партнёров:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const filteredPartners = allPartners.filter((partner) => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase());
  
    const matchesCity =
      selectedCityIds.length === 0 ||
      selectedCityIds.includes(partner.cityId || '');
  
    return matchesSearch && matchesCity;
  });
  

  const citySelectOptions = cities.map((city) => ({
    label: city.name,
    value: city._id,
  }));

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

        {/* --- Фильтр по городам и счётчик --- */}
        <TouchableOpacity style={styles.citySelector} onPress={() => setModalVisible(true)}>
          <View style={styles.cityContainer}>
            <BaseIcon />
            <Text style={styles.cityName}>
              {selectedCityIds.length > 0
                ? cities
                    .filter((city) => selectedCityIds.includes(city._id))
                    .map((city) => city.name)
                    .join(', ')
                : 'Выберите город'}
            </Text>
            <View style={{ transform: [{ rotate: '90deg' }], paddingBottom: 8 }}>
              <IconArrowSettings />
            </View>
          </View>
         
          <View style={styles.countBox}>
            <Text style={styles.countText}>Выбрано:</Text>
            <Text style={styles.countNumber}>{eventData.partners.length}</Text>     
          </View>
        </TouchableOpacity>

        {/* --- Поиск --- */}
        <SearchAdmin searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <ScrollView style={styles.scroll}>
        {/* --- Список партнёров --- */}
        {filteredPartners.map((partner: { _id: string; name: string; photo: string; type: 'user' | 'market'; cityId: string }) => (
          <TouchableOpacity
            key={`${partner.type}-${partner._id}`}
            style={[styles.item, isSelected(partner.type, partner._id) && styles.itemSelected]}
            onPress={() => togglePartner(partner.type, partner._id)}
          >
            <View style={styles.detailsContainer}>
              {partner.photo ? (
                <Image source={{ uri: `${IMAGE_URL}${partner.photo}` }} style={styles.avatar} />
              ) : (
                <View style={styles.marketPhotoFallback}>
                  <Text style={styles.marketPhotoInitial}>
                    {partner.name?.[0]?.toUpperCase() || '?'}
                  </Text>
                </View>
              )}
              <Text
                style={[
                  styles.itemText,
                  isSelected(partner.type, partner._id) && styles.itemTextSelected,
                ]}
              >
                {partner.name}
              </Text>
            </View>
            <View
              style={[
                styles.selectionCircle,
                isSelected(partner.type, partner._id) && styles.selectionCircleSelected,
              ]}
            >
              {isSelected(partner.type, partner._id) && <CheckMarkIcon width={12} />}
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>

      {/* --- Модалка выбора города --- */}
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
          fontWeight: selectedCityIds.includes(cityId) ? '700' : '400',
        })}
        buttons={[
          { label: 'Отмена', action: () => setModalVisible(false), type: 'danger' },
          { label: 'Готово', action: () => setModalVisible(false), type: 'primary' },
        ]}
      />
    </View>
  );
};

export default EventPartnersStep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    marginBottom: 20,
  },
  citySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cityContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cityName: {
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 4,
  },
  countBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  countNumber: {
    fontSize: 12,
    color: '#000',
    fontWeight: '400',
  },
  countText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '400',
  },
  item: {
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemSelected: {},
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 25,
    marginRight: 12,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 14,
  },
  itemTextSelected: {},
  selectionCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#DFDFDF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  selectionCircleSelected: {
    backgroundColor: 'black',
    borderWidth: 0,
  },
  marketPhotoFallback: {
    width: 38,
    height: 38,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  marketPhotoInitial: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
