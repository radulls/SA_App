import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform, TouchableOpacity, Text, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRouter, useLocalSearchParams } from 'expo-router';
// Шаги
import EventSettingsStep from '@/components/events/EventSettingsStep';
import EventTitleStep from '@/components/events/EventTitleStep';
import EventMediaStep from '@/components/events/EventMediaStep';
import EventLocationStep from '@/components/events/EventLocationStep';
import EventDateTimeStep from '@/components/events/EventDateTimeStep';
import EventPriceStep from '@/components/events/EventPriceStep';
import EventPartnersStep from '@/components/events/EventPartnersStep';
import { createEvent, getEventById, EVENT_IMAGE_URL, updateEvent} from '@/api/eventApi';
import { FullEventData } from '@/types/event';
import IconBack from '@/components/svgConvertedIcons/iconBack';
import CloseIcon from '@/components/svgConvertedIcons/closeIcon';

const CreateEventScreen = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = params.eventId as string | undefined;
  const [eventToEdit, setEventToEdit] = useState<FullEventData | null>(null);
  const [eventData, setEventData] = useState<FullEventData>({
    title: '',
    description: '',
    photos: [],
    cover: '',
    isOnline: true,
    location: null,
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

  useEffect(() => {
    if (!eventId) return;
    const loadEvent = async () => {
      try {
        const res = await getEventById(eventId);
        setEventData({
          title: res.title || '',
          description: res.description || '',
          cover: res.cover ? `${EVENT_IMAGE_URL}${res.cover}` : '',
          photos: res.photos?.map((p: string) => `${EVENT_IMAGE_URL}${p}`) || [],
          isOnline: res.isOnline ?? true,
          location: res.location || null,
          startDate: res.startDateTime?.slice(0, 10) || '',
          startTime: res.startDateTime?.slice(11, 16) || '',
          endDate: res.endDateTime?.slice(0, 10) || '',
          endTime: res.endDateTime?.slice(11, 16) || '',
          isFree: res.isFree ?? true,
          price: res.price ? String(res.price) : '',
          subdivisionId: Array.isArray(res.subdivisionId)
            ? res.subdivisionId.filter(Boolean) // 👈 важно!
            : [res.subdivisionId].filter(Boolean), // 👈 не добавляй undefined
            partners: [
              ...(res.partnersUsers?.map((p: any) => ({ type: 'user' as const, id: String(p._id) })) || []),
              ...(res.partnersMarkets?.map((p: any) => ({ type: 'market' as const, id: String(p._id) })) || []),
            ],            
          settings: {
            target: 'self',
            from: res.from || 'user',
            isEmergency: false,
            cityId: null,
            group: null,
          },
          
        });
        
      } catch (err) {
        console.error('❌ Не удалось загрузить мероприятие:', err);
      }
    };
    loadEvent();
  }, [eventId]);
  
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
    try {
      setLoading(true);
  
      const parseLocalDateTime = (dateStr: string, timeStr: string): Date => {
        const [year, month, day] = dateStr.split('-').map(Number);
        const [hour, minute] = timeStr.split(':').map(Number);
        return new Date(Date.UTC(year, month - 1, day, hour, minute));
      };
  
      const startDateTime = parseLocalDateTime(eventData.startDate, eventData.startTime);
      const endDateTime = parseLocalDateTime(eventData.endDate, eventData.endTime);
  
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        Toast.show({ type: 'error', text1: 'Неверный формат даты/времени' });
        return;
      }
  
      const coverFile = eventData.cover?.startsWith('data:')
        ? (() => {
            const mimeMatch = eventData.cover!.match(/^data:(image\/[a-zA-Z]+);base64,/);
            const fileType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
            const byteString = atob(eventData.cover!.split(',')[1]);
            const array = new Uint8Array(byteString.length);
            for (let i = 0; i < byteString.length; i++) {
              array[i] = byteString.charCodeAt(i);
            }
            return new File([array], 'cover.jpg', { type: fileType });
          })()
        : undefined;
  
      const cleanUrl = (url: string) => url.replace(EVENT_IMAGE_URL, '');
      const photosToUpload = eventData.photos.filter((p) => p.startsWith('data:'));
      const existingPhotos = eventData.photos.filter((p) => !p.startsWith('data:')).map(cleanUrl);
  
      const photosFiles = photosToUpload.map((base64, i) => {
        const mimeMatch = base64.match(/^data:(image\/[a-zA-Z]+);base64,/);
        const fileType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const byteString = atob(base64.split(',')[1]);
        const array = new Uint8Array(byteString.length);
        for (let j = 0; j < byteString.length; j++) array[j] = byteString.charCodeAt(j);
        return new File([array], `photo_${i}.jpg`, { type: fileType });
      });
  
      const submitForm = async (subId?: string) => {
        if (eventId) {
          const updated = await updateEvent(eventId, {
            title: eventData.title,
            description: eventData.description,
            startDateTime: startDateTime.toISOString(),
            endDateTime: endDateTime.toISOString(),
            isOnline: eventData.isOnline,
            isFree: eventData.isFree,
            price: eventData.isFree ? undefined : Number(eventData.price),
            from: eventData.settings.from,
            subdivisionId: subId || '',
            location: eventData.location,
            partnersUsers: eventData.partners.filter((p) => p.type === 'user').map((p) => p.id),
            partnersMarkets: eventData.partners.filter((p) => p.type === 'market').map((p) => p.id),
            existingPhotos,
            photos: photosFiles,
            cover: coverFile,
          });
  
          setEventData((prev) => ({
            ...prev,
            startDate: updated.startDateTime?.slice(0, 10) || '',
            startTime: updated.startDateTime?.slice(11, 16) || '',
            endDate: updated.endDateTime?.slice(0, 10) || '',
            endTime: updated.endDateTime?.slice(11, 16) || '',
          }));
        } else {
          const formData = new FormData();
  
          if (coverFile) formData.append('cover', coverFile);
          photosFiles.forEach((photo) => formData.append('photos', photo));
          formData.append('title', eventData.title);
          formData.append('description', eventData.description);
          formData.append('isOnline', String(eventData.isOnline));
          formData.append('isFree', String(eventData.isFree));
          formData.append('price', eventData.isFree ? '' : eventData.price || '');
  
          if (!eventData.isOnline && eventData.location) {
            formData.append('location', JSON.stringify(eventData.location));
          }
  
          formData.append('startDate', startDateTime.toISOString());
          formData.append('endDate', endDateTime.toISOString());
  
          formData.append('partnersUsers', JSON.stringify(eventData.partners.filter((p) => p.type === 'user').map((p) => p.id)));
          formData.append('partnersMarkets', JSON.stringify(eventData.partners.filter((p) => p.type === 'market').map((p) => p.id)));
          formData.append('from', eventData.settings.from);
          formData.append('target', eventData.settings.target);
          formData.append('isEmergency', String(eventData.settings.isEmergency));
          if (eventData.settings.cityId) formData.append('cityId', eventData.settings.cityId);
          if (eventData.settings.group) formData.append('group', eventData.settings.group);
          if (subId) formData.append('subdivisionId', subId);
  
          await createEvent(formData);
        }
      };
  
      const subdivisionIds = eventData.subdivisionId;
      if (subdivisionIds.length > 0) {
        await Promise.all(subdivisionIds.map((subId) => submitForm(subId)));
      } else {
        await submitForm();
      }
  
      Toast.show({
        type: 'success',
        text1: eventId ? 'Мероприятие обновлено!' : 'Мероприятие опубликовано!',
      });
      router.replace('/home');
    } catch (err: any) {
      console.error('❌ Ошибка при отправке мероприятия:', err?.message || err);
      if (err?.response?.data) console.log('💥 Ответ сервера:', err.response.data);
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