import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Button, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { UserDataProps, IMAGE_URL } from '@/api';
import { getUserVerificationData } from '@/api/adminApi';

const UserVerification = () => {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<UserDataProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserVerificationData(id as string);
        console.log('✅ Данные пользователя:', userData); // <-- ЛОГ ДЛЯ ПРОВЕРКИ
        setUser(userData);
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, [id]);
  

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={styles.loader} />;
  }

  if (!user) {
    return <Text style={styles.errorText}>Пользователь не найден</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Верификация</Text>

        <View style={styles.userInfo}>
          <Text style={styles.name}>{`${user.firstName || ''} ${user.lastName || ''}`.trim()}</Text>

          <Text style={styles.username}>@{user.username || 'Нет данных'}</Text>

          <View style={styles.userInfoContainer}>
            <View style={styles.locationIcon}>
              <Text style={styles.locationIconText}>sa</Text>
            </View>
            <Text style={styles.label}>{user.city || 'Не указан'}</Text>
          </View>

          <View style={styles.roleStatusContainer}>
            <View style={styles.userInfoContainer}>
              <Text style={styles.label}>Роль:</Text>
              <Text style={styles.value}>{user.role || 'Не указана'}</Text>
            </View>

            <View style={styles.userInfoContainer}>
              <Text style={styles.label}>Статус:</Text>
              <Text style={styles.value}>{user.verificationStatus === 'pending' ? 'Ожидает верификации' : 'Неизвестно'}</Text>
            </View>
          </View>

          <View style={styles.contactsContainer}>
            <View style={styles.contactsItem}>
              <Text style={styles.contactsLabel}>Телефон:</Text>
              <Text style={styles.value}>{user.phone || 'Не указан'}</Text>
            </View>
            <View style={styles.contactsItem}>
              <Text style={styles.contactsLabel}>Email:</Text>
              <Text style={styles.value}>{user.email || 'Не указан'}</Text>
            </View>         
          </View>       
         
        </View>
        <View style={styles.photoContainer}>
          {/* Фото паспорта */}
          {user.passportPhoto && (
              <View style={styles.imageContainer}>
                <Text style={styles.contactsLabel}>Паспорт</Text>
                <Image source={{ uri: `${IMAGE_URL}${user.passportPhoto}` }} style={styles.image} />
              </View>
            )}

            {/* Селфи фото */}
            {user.selfiePhoto && (
              <View style={styles.imageContainer}>
                <Text style={styles.contactsLabel}>Фото</Text>
                <Image source={{ uri: `${IMAGE_URL}${user.selfiePhoto}` }} style={styles.image} />
              </View>
            )}
        </View>
      </ScrollView>
      <View style={styles.ContinueButton}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            Решение
          </Text>
        </TouchableOpacity>
      </View>
    </View>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    overflowX:'visible',
    overflowY:'visible',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  userInfo: {
    marginBottom: 20,
  },
  name:{
    fontSize: 18,
    fontWeight: '700'
  },
  username:{
    fontSize: 14,
    fontWeight: '500',
    paddingTop: 5,
    paddingBottom: 10,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    backgroundColor: '#000',
    borderRadius: 4,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  locationIconText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  userLocation: {
    color: 'rgba(255, 255, 255, 1)',
    marginLeft: 3,
    fontSize: 14,
    fontWeight: '700',
  },
  roleStatusContainer:{
    paddingVertical: 22,
    borderBottomColor: '#ECECEC',
    borderBottomWidth: 0.5,
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    paddingRight: 4,
  },
  value: {
    fontSize: 12,
    fontWeight: '500',
  },
  contactsContainer:{
    paddingVertical: 26,
    gap: 26,
  },
  contactsItem:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactsLabel:{
    fontSize: 12,
    fontWeight: '700',
  },
  photoContainer:{
    flexDirection: 'row',
    gap: 14,
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: '100%', 
    height: undefined,
    aspectRatio: 1, 
    borderRadius: 8,
    resizeMode: 'cover', 
    marginTop: 7,
  },
  loader: {
    marginTop: 50,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 50,
  },
  ContinueButton: {
    paddingBottom: 40,
    width: '100%',
    maxWidth: 600,
    paddingHorizontal: 16
  },
  button: {
    borderRadius: 8,
    backgroundColor: '#000',
    paddingVertical: 14.5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default UserVerification;
