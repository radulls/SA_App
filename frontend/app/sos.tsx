import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform, ActivityIndicator, Pressable } from 'react-native';
import Map, { LocationData } from '@/components/sos/Map'; 
import DetailsStep from '@/components/sos/DetailStep/DetailsStep';
import CloseIcon from '@/components/svgConvertedIcons/closeIcon';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { checkSosAccess } from '@/api/sos/sosApi';
import SosIcon from '@/components/svgConvertedIcons/sosIcons/SosIcon';

const SosPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [remainingTime, setRemainingTime] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<{ months: string[]; days: string[]; hours: string[] }>({
    months: ["0", "0"],
    days: ["0", "0"],
    hours: ["0", "0"],
  });  

  const splitDigits = (num: string) => num.split('');

  const formatNumber = (num: number) => (num < 10 ? `0${num}` : num.toString());

  const parseRemainingTime = (months: number, days: number, hours: number) => {
    return {
      months: splitDigits(formatNumber(months > 0 ? months : 0)),
      days: splitDigits(formatNumber(days > 0 ? days : 0)),
      hours: splitDigits(formatNumber(hours > 0 ? hours : 0)),
    };
  };

  useEffect(() => {
    const fetchAccess = async () => {
      setLoading(true);
      try {
        const result = await checkSosAccess();        
        console.log("📡 Ответ API checkSosAccess:", result); 
        const { access, remainingMonths, remainingDays, remainingHours, message } = result;
        if (!access) {
          setAccessDenied(true);
          if (Number.isInteger(remainingMonths) && Number.isInteger(remainingDays) && Number.isInteger(remainingHours)) {
            setRemaining(parseRemainingTime(remainingMonths, remainingDays, remainingHours));
          } else {
            console.error("❌ Ошибка: remainingMonths, remainingDays или remainingHours отсутствуют!", result);
            setRemainingTime(message || "Ошибка загрузки времени доступа.");
          }
        }
      } catch (error) {
        console.error("❌ Ошибка при проверке доступа к SOS:", error);
        setRemainingTime("Ошибка загрузки доступа.");
      }
      setLoading(false);
    };   
    fetchAccess();
  }, []);

  const isEditing = params.editMode === "true"; // Проверяем, редактируем ли мы сигнал

  // Функция для извлечения строки из параметра (если массив, берём первый элемент)
  const getString = (value: string | string[] | undefined): string => {
    return Array.isArray(value) ? value[0] : value || '';
  };

  // Функция для извлечения массива (если параметр в JSON, парсим)
  const parseArray = (value: string | string[] | undefined): string[] => {
    if (!value) return [];
    try {
      return Array.isArray(value) ? JSON.parse(value[0]) : JSON.parse(value);
    } catch {
      return [];
    }
  };

  // Если редактируем, ставим второй шаг, иначе первый
  const [step, setStep] = useState(isEditing ? 2 : 1);

  // Устанавливаем локацию из параметров (если редактируем)
  const [location, setLocation] = useState<LocationData | null>(
    isEditing
      ? {
          latitude: Number(getString(params.latitude)),
          longitude: Number(getString(params.longitude)),
          address: getString(params.address) || 'Неизвестный адрес',
        }
      : null
  );

  // Если редактируем, загружаем переданные данные
  const initialData = isEditing
    ? {
        title: getString(params.title),
        description: getString(params.description),
        tags: parseArray(params.tags),
        photos: parseArray(params.photos),
      }
    : undefined;

  // Функция для выхода
  const closeSos = () => {
    router.push('/home');
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#F22C2C" />;
  }

  if (accessDenied) {
    return (
      <View style={styles.container}> 
        <View style={[styles.contentContainer, styles.acessDenied]}>
          <View style={styles.sosContainer}>
            <Pressable onPress={closeSos} style={styles.closeDenied}>
              <CloseIcon/>
            </Pressable>   
            <SosIcon width={150} height={150}/>
            <Text style={styles.sosTitle}>SOS</Text>
            <Text style={styles.sosSubTitle}>Эта функция будет доступна после 2х месяцев членства в объединении.</Text>
            {/* Кастомное оформление времени */}
            <View style={styles.timeContainer}>
              {/* Месяцы */}
              <View style={styles.timeBlock}>
                <View style={styles.numbersContainer}>
                  {remaining.months.map((digit, index) => (
                    <Text key={`month-${index}`} style={styles.timeNumber}>{digit}</Text>
                  ))}
                </View>              
                <Text style={styles.timeLabel}>мес.</Text>
              </View>
              <Text style={styles.dots}>:</Text>
              {/* Дни */}
              <View style={styles.timeBlock}>
                <View style={styles.numbersContainer}>
                  {remaining.days.map((digit, index) => (
                    <Text key={`day-${index}`} style={styles.timeNumber}>{digit}</Text>
                  ))}
                </View>            
                <Text style={styles.timeLabel}>дн.</Text>
              </View>
              <Text style={styles.dots}>:</Text>
              {/* Часы */}
              <View style={styles.timeBlock}>
                <View style={styles.numbersContainer}>
                  {remaining.hours.map((digit, index) => (
                    <Text key={`hour-${index}`} style={styles.timeNumber}>{digit}</Text>
                  ))}
                </View>            
                <Text style={styles.timeLabel}>ч.</Text>
              </View>
            </View>
          </View>         
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
      <View style={styles.topContainer}>
  <View style={styles.headerContainer}>
    <TouchableOpacity style={styles.closeIcon} onPress={closeSos}>
      <CloseIcon fill='#000' />
    </TouchableOpacity>
    <Text style={styles.title}>Сигнал SOS</Text>
  </View>
  <Text style={styles.subtitle}>Используйте, когда вам нужна помощь</Text>
</View>

        {/* Первый шаг: выбор локации */}
        {step === 1 && (
          <Map 
            onNext={(loc: string | LocationData) => {  
              setLocation(typeof loc === 'string' ? { latitude: 0, longitude: 0, address: loc } : loc);
              setStep(2);
            }} 
            selectedLocation={location}
          />
        )}

        {/* Второй шаг: заполнение данных SOS-сигнала */}
        {step === 2 && location && (
          <DetailsStep
            onNext={(id) => router.push(`/sos-signal/${id}`)}
            location={{
              latitude: location.latitude,
              longitude: location.longitude,
              address: location.address || 'Неизвестный адрес',
            }}
            goBackToMap={() => setStep(1)}
            initialData={initialData}
            sosId={getString(params.sosId)} // Преобразуем в строку
            isEditing={isEditing} // Говорим, что редактируем
          />
        )}
      </View>    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  contentContainer: {
    maxWidth: 600,
    width: '100%',
    height: '100%',
  },
  
  topContainer: {
    paddingTop: 56, // Отступ от верхней границы экрана
  },
  headerContainer: {
    flexDirection: 'row', // Размещаем элементы в строку
    alignItems: 'center', // Выравниваем элементы по центру по вертикали
    justifyContent: 'center', // Выравниваем элементы по центру по горизонтали
    position: 'relative', // Позиционируем контейнер относительно
  },

  acessDenied: {
    backgroundColor: '#FF3B00',
    width: '100%',
    maxWidth: '100%', // Переопределяем ограничение

  },
  sosContainer:{
    maxWidth: 600,
    width: '100%',
    marginHorizontal: 'auto', // Для центрирования контента внутри
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    position: 'relative',
    height: '100%',
  },
  closeDenied:{
    position: 'absolute',
    top: Platform.select({
      ios: 60,
      android: 60,
      web: 60,
    }),  
    left: 16,
    
  },
  sosTitle:{
    color: '#fff',
    fontSize: 22,
    fontFamily: "SFUIDisplay-bold",
    paddingTop: 35,
    paddingBottom: 15,
  },
  sosSubTitle:{
    color: '#fff',
    fontSize: 14,
    fontFamily: "SFUIDisplay-medium",
    textAlign: 'center',
    width: '90%'
  },
  timeContainer:{
    marginTop: 55,
    borderRadius: 16,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 30,
    flexDirection: 'row',
  },
  timeBlock:{
    gap: 10
  },
  numbersContainer:{
    flexDirection: 'row',
    gap: 4
  },
  timeNumber:{
    fontSize: 30,
    fontFamily: "SFUIDisplay-medium",
    paddingVertical: 18,
    paddingHorizontal: 10,
    backgroundColor: '#EFEFEF',
    borderRadius: 6,
  },
  dots:{
    fontSize: 30,
    fontFamily: "SFUIDisplay-medium",
    marginTop: 15,
    marginHorizontal: 4
  },
  timeLabel:{
    fontSize: 14,
    fontWeight: '700'
  },
  title: {
    fontSize: 15,
    fontFamily: "SFUIDisplay-bold",
    textAlign: 'center', // Выравниваем текст по центру
    flex: 1, // Занимаем все доступное пространство
  },
  subtitle: {
    fontSize: 12,
    paddingTop: 9,
    paddingBottom: 14,
    fontFamily: "SFUIDisplay-regular",
    color: '#8b8b8b',
    textAlign: 'center', // Выравниваем текст по центру
  },
closeIcon: {
  position: 'absolute', // Абсолютное позиционирование для кнопки закрытия
  left: 20, // Отступ слева
  zIndex: 1000, // Убедимся, что кнопка поверх других элементов
},
});

export default SosPage;
