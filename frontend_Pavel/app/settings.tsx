import React, { useState, useEffect } from 'react';

import { View, StyleSheet, Image, Text } from 'react-native';
import ProfileSection from '../components/settings/ProfileSection';
import Helper from '../components/Helper';
import { router } from 'expo-router';

const Divider = () => <View style={styles.divider} />;

const SettingsScreen = () => {
  const [user, setUser] = useState({});
	useEffect(() => {
		const dbUser = Helper.readUser().catch(console.error).then(dbUser => {
			console.log('dbUser', dbUser);
			setUser(dbUser)
		})
		// setUser(dbUser) 
	}, []);
  return (
    <View style={styles.container}>
      <View style={styles.headerIcons}>
        <Image
          resizeMode="contain"
          source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/79908b091650bce0fbdeedac444a9417ae5c46510712ac9d9abedd2132d02e2f?placeholderIfAbsent=true&apiKey=f739d4c470a340468bd500c2bd45e954' }}
          style={styles.backIcon}
        />
        <Text style={styles.headerTitle}>Настройки</Text>
      </View>

      {/* Основной контейнер */}
      <View style={styles.mainContentContainer}>
        <View style={styles.mainContent}>
          <ProfileSection onclick={() => router.push('settings_name')} label="Имя" value={`${user.first_name} ${user.second_name}`}/>
          <ProfileSection onclick={() => router.push('settings_id')} label="ID" value={'@'+user.id_login}/>
          <ProfileSection onclick={() => router.push('settings_about')} label="О себе" value={''}/>
          <ProfileSection label="Город" value={user.city}/>
          <ProfileSection label="Активационный код" value={user.code}/>
          <Divider />
          <ProfileSection onclick={() => router.push('settings_phone')} label="Телефон" value={user.phone}/>
          <ProfileSection onclick={() => router.push('settings_email')}  label="Почта" value={user.email}/>
          <ProfileSection label="Пароль" value={'*********'}/>
          <ProfileSection label="Чёрный список" value={0}/>
          <Divider />
          <ProfileSection label="Подписка" value={''}/>
          <ProfileSection label="Правила" value={''}/>
          <ProfileSection label="Поддержка" value={''}/>
          <Divider />
          <ProfileSection label="Удалить аккаунт" value={''}/>
          <ProfileSection label="Выйти" value={''}/>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 22,
    marginTop: 55,
    width: '100%',
    maxWidth: 600, 
    alignSelf: 'center',
  },
  backIcon: {
    width: 8,
    aspectRatio: 0.57,
    tintColor: 'black',
  },
  headerTitle: {
    fontSize: 15,
    // fontFamily: "SFUIDisplay-Bold",
    color: 'black',
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -30 }],
  },
  mainContentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center', 
  },
  mainContent: {
    marginTop: 47,
    paddingHorizontal: 16,
    width: '100%',
    maxWidth: 600, 
  },
  divider: {
    backgroundColor: 'rgba(236, 236, 236, 1)',
    marginBottom: 26,
    height: 1,
  },
});

export default SettingsScreen;

