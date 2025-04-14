import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform, TouchableOpacity, Text, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

// Шаги
import EventSettingsStep from '@/components/events/EventSettingsStep';
import EventTitleStep from '@/components/events/EventTitleStep';
import EventMediaStep from '@/components/events/EventMediaStep';
import EventLocationStep from '@/components/events/EventLocationStep';
import EventDateTimeStep from '@/components/events/EventDateTimeStep';
import EventPriceStep from '@/components/events/EventPriceStep';
import EventPartnersStep from '@/components/events/EventPartnersStep';
import { createEvent } from '@/api/eventApi'; // 🔥 Добавь свой метод отправки
import { FullEventData } from '@/types/event';
import IconBack from '@/components/svgConvertedIcons/iconBack';
import CloseIcon from '@/components/svgConvertedIcons/closeIcon';

const CreateEventScreen = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Общие данные мероприятия
  const [eventData, setEventData] = useState<FullEventData>({
    title: '',
    description: '',
    photos: [],
    cover: '',
    isOnline: true,
    location: null, // 👈 новое поле
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    isFree: true,
    price: '',
    subdivisionId: [],
    partners: [],
    settings: {
      target: 'self',
      from: 'user',
      isEmergency: false,
      cityId: null,
      group: null,
    },
  });  

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => Math.max(0, prev - 1));

  const stepMeta = [
    { title: '', subtitle: '' }, // EventSettingsStep — без заголовка
    { title: 'Название и описание', subtitle: 'Название и описание поможет быстрее понять, что будет на мероприятии.' },
    { title: 'Добавьте фото', subtitle: 'Обложка и фото позволят более подробно понять суть мероприятия.' },
    { title: 'Локация мероприятия', subtitle: 'Где будет проходить иероприятие.' },
    { title: 'Срок мероприятия', subtitle: 'Когда будет проходить мероприятие.' },
    { title: 'Стоимость участия', subtitle: 'Мероприятие может бытиь бесплатным или платным.' },
    { title: 'Партнёры', subtitle: 'Выбрать партнёров, которые помогают мероприятию.' },
  ];

  const handleSubmitEvent = async () => {
    console.log('🧠 handleSubmitEvent вызван!');
    console.log('📦 subdivisionId:', eventData.subdivisionId);
  
    try {
      setLoading(true);
  
      const submitForm = async (subId?: string) => {
        const formData = new FormData();
  
        // 🖼️ Обложка
        if (eventData.cover) {
          const name = `cover.jpg`;
  
          if (Platform.OS === 'web') {
            const mimeMatch = eventData.cover.match(/^data:(image\/[a-zA-Z]+);base64,/);
            const fileType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
            const blob = await fetch(eventData.cover).then(res => res.blob());
            formData.append('cover', new File([blob], name, { type: fileType }));
          } else {
            formData.append('cover', {
              uri: eventData.cover,
              name,
              type: 'image/jpeg',
            } as any);
          }
        }
  
        // 📷 Фото
        for (let i = 0; i < eventData.photos.length; i++) {
          const uri = eventData.photos[i];
          const name = `photo_${i}.jpg`;
  
          if (Platform.OS === 'web') {
            const mimeMatch = uri.match(/^data:(image\/[a-zA-Z]+);base64,/);
            const fileType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
            const blob = await fetch(uri).then(res => res.blob());
            formData.append('photos', new File([blob], name, { type: fileType }));
          } else {
            formData.append('photos', {
              uri,
              name,
              type: 'image/jpeg',
            } as any);
          }
        }
  
        // 📌 Основные поля
        formData.append('title', eventData.title);
        formData.append('description', eventData.description);
        formData.append('isOnline', String(eventData.isOnline));
        formData.append('isFree', String(eventData.isFree));
        formData.append('price', eventData.isFree ? '' : eventData.price || '');
  
        // 📍 Локация (если офлайн)
        if (!eventData.isOnline && eventData.location) {
          formData.append('location', JSON.stringify(eventData.location));
        }
  
        // 🕒 Дата и время
        const startDateTime = new Date(`${eventData.startDate}T${eventData.startTime}:00`);
        const endDateTime = new Date(`${eventData.endDate}T${eventData.endTime}:00`);
  
        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
          console.error('❌ Ошибка: некорректная дата или время!');
          Toast.show({ type: 'error', text1: 'Неверный формат даты/времени' });
          return;
        }
  
        formData.append('startDate', startDateTime.toISOString());
        formData.append('endDate', endDateTime.toISOString());
  
        // 👥 Партнёры
        formData.append(
          'partnerUsers',
          JSON.stringify(eventData.partners.filter(p => p.type === 'user').map(p => p.id))
        );
        formData.append(
          'partnerMarkets',
          JSON.stringify(eventData.partners.filter(p => p.type === 'market').map(p => p.id))
        );
  
        // ⚙️ Настройки
        formData.append('from', eventData.settings.from);
        formData.append('target', eventData.settings.target);
        formData.append('isEmergency', String(eventData.settings.isEmergency));
        if (eventData.settings.cityId) formData.append('cityId', eventData.settings.cityId);
        if (eventData.settings.group) formData.append('group', eventData.settings.group);
        if (subId) formData.append('subdivisionId', subId);
  
        console.log('📤 Отправка формы мероприятия для:', subId || 'личной страницы');
        await createEvent(formData);
      };
  
      const subdivisionIds = eventData.subdivisionId;
  
      if (subdivisionIds.length > 0) {
        await Promise.all(subdivisionIds.map(subId => submitForm(subId)));
      } else {
        await submitForm();
      }
  
      Toast.show({ type: 'success', text1: 'Мероприятие опубликовано!' });
      router.replace('/home');
    } catch (err: any) {
      console.error('❌ Ошибка при создании мероприятия:', err?.message || err);
      if (err?.response?.data) {
        console.log('💥 Ответ сервера:', err.response.data);
      }
      Toast.show({ type: 'error', text1: 'Ошибка при публикации' });
    } finally {
      setLoading(false);
    }
  };  
  
  const steps = [
    <EventSettingsStep
      key="settings"
      onNext={goNext}
      setEventSettings={(settings) => {
        // Отдельно забираем subdivisionIds
        const { subdivisionIds, ...rest } = settings as any;

        setEventData((prev) => ({
          ...prev,
          subdivisionId: Array.isArray(subdivisionIds) ? subdivisionIds : [],
          settings: {
            ...prev.settings,
            ...rest,
          },
        }));
      }}
    />,

    <EventTitleStep key="title" onNext={goNext} onBack={goBack} eventData={eventData} setEventData={setEventData} />,
    <EventMediaStep key="media" onNext={goNext} onBack={goBack} eventData={eventData} setEventData={setEventData} />,
    <EventLocationStep key="location" onNext={goNext} onBack={goBack} eventData={eventData} setEventData={setEventData} />,
    <EventDateTimeStep key="datetime" onNext={goNext} onBack={goBack} eventData={eventData} setEventData={setEventData} />,
    <EventPriceStep key="price" onNext={goNext} onBack={goBack} eventData={eventData} setEventData={setEventData} />,
    <EventPartnersStep key="partners" onBack={goBack} onSubmit={handleSubmitEvent} eventData={eventData} setEventData={setEventData} />,
  ];

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>       
        <ScrollView >
          {/* Header */}
          {step > 0 ? (
            <>
            <View style={styles.header}>
              <TouchableOpacity >
                <IconBack fill="#000" onPress={goBack}/>
              </TouchableOpacity>
            
              <TouchableOpacity onPress={() => router.back()}>
                <CloseIcon fill="#000"/>
              </TouchableOpacity>
            </View> 
          <Text style={styles.title}>
            {stepMeta[step].title}
          </Text>
          <Text style={styles.subtitle}>
            {stepMeta[step].subtitle}
          </Text>
          </>
           ) : ''} {/* Заглушка для выравнивания */}
          {steps[step]}
          {/* Footer (Navigation button) */}
        </ScrollView>
        {step > 0 ? (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={step === steps.length - 1 ? handleSubmitEvent : goNext}
          >
            <Text style={styles.nextButtonText}>
              {step === steps.length - 1 ? 'Готово' : 'Продолжить'}
            </Text>
          </TouchableOpacity>
          ) : '' }
        {loading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}
      </View>
    </View>
  );
};

export default CreateEventScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    paddingTop: 58,
    paddingHorizontal: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  header: {
    width: '100%',
    marginBottom: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title:{
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    paddingBottom: 15,  
  },
  subtitle:{
    fontSize: 12,
    fontWeight: '400',
    color: '#8B8B8B',
    marginBottom: 30,
  },
  footer: {
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  nextButton: {
    marginTop: 'auto',
    paddingVertical: 18,
    backgroundColor: '#000',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
    width: '100%'
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});