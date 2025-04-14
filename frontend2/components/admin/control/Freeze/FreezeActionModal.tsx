import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import CustomModal from '../../CustomModal'; // подключаем универсальную модалку
import { FreezeDataProps, freezeUser, getUserFreezes } from '@/api/adminApi';
import Header from '@/components/common/Header';

interface FreezeActionModalProps {
  userId: string;
  onClose: () => void;
}

const freezeOptions = [
  { id: 'market', label: 'Маркет' },
  { id: 'general_task', label: 'Общее дело' },
  { id: 'sporter', label: 'Спортер' },
  { id: 'signal_fire', label: 'Сигнальный огонь' },
  { id: 'post', label: 'Публикация постов' },
  { id: 'sos', label: 'Публикация SOS' },
];

const FreezeActionModal: React.FC<FreezeActionModalProps> = ({ userId, onClose }) => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [isDaysModalVisible, setDaysModalVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number>(7);
  const [freezes, setFreezes] = useState<FreezeDataProps[]>([]);
  const [viewType, setViewType] = useState<'active' | 'past'>('active');
  

  const handleSelectAction = (action: string) => {
    setSelectedAction(action);
    setDaysModalVisible(true); // открываем кастомную модалку
  };

  const handleFreeze = async () => {
    if (!selectedAction) return;
  
    try {
      console.log(`📡 Заморозка: ${selectedAction} на ${selectedDays} дней для пользователя ${userId}`);
      await freezeUser(userId, [selectedAction], selectedDays); // ⚠️ вызов API
      console.log('✅ Заморозка прошла успешно');
      setDaysModalVisible(false);
      onClose();
    } catch (error) {
      console.error('❌ Ошибка при заморозке:', error);
    }
  };

  useEffect(() => {
    const fetchFreezes = async () => {
      try {
        const data = await getUserFreezes(userId);
        setFreezes(data);
      } catch (error) {
        console.error("Ошибка при загрузке заморозок:", error);
      }
    };
  
    fetchFreezes();
  }, []);

  const freezeLabels: Record<string, string> = freezeOptions.reduce((acc, item) => {
    acc[item.id] = item.label;
    return acc;
  }, {} as Record<string, string>);
  
   
  return (
    <View style={styles.container}>    
      <View style={styles.modalContainer}>
        <View style={styles.contentContainer}>
          <Header title="Заморозка аккаунта" onLeftPress={onClose} leftType="close" />
          <Text style={styles.subtitle}>
            Выберите раздел, для ограничения действий пользователя в конкретном разделе, максимальная длительность 14 дней.
          </Text>
          <FlatList
            data={freezeOptions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleSelectAction(item.id)}
              >
                <Text style={styles.optionText}>{item.label}</Text>
                <View style={[styles.radioCircle, selectedAction === item.id ? styles.activeCircle : null]}>
                  {selectedAction === item.id && <View style={styles.radioInnerCircle} />}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={styles.buttonRow}>
          <View style={styles.buttonRowItem}>
            <TouchableOpacity onPress={() => setViewType('active')} style={[styles.typeButton, viewType === 'active' && styles.activeTypeButton]}>
              <Text style={[styles.buttonRowText, viewType === 'active' && styles.buttonRowTextSelected]}>Активные</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRowItem}>
            <TouchableOpacity onPress={() => setViewType('past')} style={[styles.typeButton, viewType === 'past' && styles.activeTypeButton]}>
              <Text style={[styles.buttonRowText, viewType === 'past' && styles.buttonRowTextSelected]}>Предыдущие</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <FlatList
            data={freezes.filter(freeze =>
              viewType === 'active' ? new Date(freeze.endDate) >= new Date() : new Date(freeze.endDate) < new Date()
            )}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              const start = new Date(item.startDate);
              const end = new Date(item.endDate);
              const diffInDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

              return (
                <View style={styles.freezeItem}>
                <View style={styles.info}>
                  <View>
                    <Text style={styles.freezeTitle}>
                      {item.frozenActions.map(action => freezeLabels[action] || action).join(', ')}
                    </Text>
                    <Text style={styles.freezeDays}>
                      {diffInDays} {diffInDays === 1 ? 'день' : diffInDays < 5 ? 'дня' : 'дней'}
                    </Text>
                  </View>               
                  <Text style={styles.freezeDate}>
                  {new Date(item.startDate).toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </Text>
                </View>             
              </View>
              
              );
            }}
            ListEmptyComponent={<Text style={styles.noFreezesText}>Нет {viewType === 'active' ? 'активных' : 'прошлых'} заморозок</Text>}
          />               
       </View>
        {/* Универсальная модалка вместо FreezeDaysModal */}
        <CustomModal
          visible={isDaysModalVisible}
          onClose={() => setDaysModalVisible(false)}
          title="Выберите длительность заморозки"
          slider={{ min: 1, max: 14, value: selectedDays, onChange: setSelectedDays }}
          buttons={[
            { label: 'Отмена', action: () => setDaysModalVisible(false), type: 'danger' },
            { label: 'Применить', action: handleFreeze, type: 'primary' }
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalContainer: {
    maxWidth: 600,
    width: '100%',
    borderRadius: 10,
  },
  contentContainer:{
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8B8B8B',
    marginBottom: 20,
  },
  option: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 12,
    flex: 1,
    fontWeight: '700',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E7E7E7',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle: {
    borderColor: '#000',
    borderWidth: 7,
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: 'black',
    alignItems: 'center',
    borderRadius: 5,
  },
  closeText: {
    color: 'white',
    fontSize: 18,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#000',
  },
  tabText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  freezeItem: {
    paddingVertical: 10,
  },
  info:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  freezeTitle: {
    fontSize: 12,
    color: '#000',
    fontWeight: '700',
  },
  freezeDays:{
    fontSize: 12,
    color: '#000',
    fontWeight: '400',
  },
  freezeDate:{
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
  },
  noFreezesText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonRow:{ 
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  buttonRowItem:{
    justifyContent: 'center',
    flex: 1
  },
  typeButton:{
    borderBottomWidth: 0.5,
    borderColor: '#ECECEC',
  },
  activeTypeButton:{
    borderBottomWidth: 2,
    borderColor: '#000',
  },
  buttonRowText:{
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color:'#ECECEC',
    paddingBottom: 12
  },
  buttonRowTextSelected:{
    color:'#000'
  },
  
});

export default FreezeActionModal;
