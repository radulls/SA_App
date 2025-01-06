import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import ForgotForm from '../components/register/ForgotForm';
import Button from '../components/Button';
import { useRouter } from 'expo-router';

const RegistrationScreen = () => { 
  const router = useRouter();  // Используем useRouter из expo-router для навигации

  const handleBack = () => {
    router.push('/auth/login');  // Переход на страницу логина
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            {/* Кнопка назад */}
            <Pressable onPress={handleBack} style={styles.backIconWrapper}>
              <Image
                resizeMode="contain"
                source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/79908b091650bce0fbdeedac444a9417ae5c46510712ac9d9abedd2132d02e2f?placeholderIfAbsent=true&apiKey=f739d4c470a340468bd500c2bd45e954' }}
                style={styles.backIcon}
              />
            </Pressable>
            {/* Лого */}
            <View style={styles.logo} />
          </View>
          <ForgotForm />
          <View style={styles.footer}>
            <Button title="Отправить инструкцию" onPress={() => console.log(1)} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    flexGrow: 1, 
    width: '100%',
  },
  wrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 100)',
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 100)',
    flexGrow: 1, 
    paddingHorizontal: 16,
    paddingTop: 59,
    maxWidth: 600,
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  backIconWrapper: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  backIcon: {
    width: 8,
    aspectRatio: 0.57,
  },
  logo: {
    backgroundColor: 'rgba(67, 67, 67, 1)',
    width: 186,
    height: 240,
  },
  footer: {
    marginTop: 20,
    paddingBottom: 41,
  },
  footerText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  regularText: {
    fontSize: 12,
    color: 'rgba(139, 139, 139, 1)',
    fontWeight: '500',
  },
  highlightText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(148,179,255,1)',
  },
});

export default RegistrationScreen;

