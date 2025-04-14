import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity } from 'react-native';
import { getUserProfile, UserDataProps } from '@/api';
import ProfileSection from '../components/settings/ProfileSection';
import IconBack from '@/components/svgConvertedIcons/iconBack';
import { useRouter } from 'expo-router';
import SettingsNameScreen from '@/components/settings/SettingsName';
import SettingsAbout from '@/components/settings/SettingsAbout';
import SettingsEmail from '@/components/settings/SettingsEmail';
import SettingsId from '@/components/settings/SettingsId';
import SettingsPhone from '@/components/settings/SettingsPhone';
import SettingsPassword from '@/components/settings/SettingPassword';
import SettingsCity from '@/components/settings/SettingsCity';
import SettingsBlocked from '@/components/settings/SettingsBlocked';
import SettingsActivationCode from '@/components/settings/SettingsActivationCode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsAddedUsers from '@/components/settings/SettingsAddedUsers';
import SettingsNontification from '@/components/settings/SettingsNontification';
import { getInvitedUsers } from '@/api/activeCodes';
import { getBlockedUsers } from '@/api/blockedUsers';
import SettingsRules from '@/components/settings/SettingsRules';
import SettingsSupport from '@/components/settings/SettingsSupport';
import SettingsSubscription from '@/components/settings/SettingsSubscription';

export interface SettingsProps {
  user: UserDataProps;
  onBack: () => void;
}

const Divider = () => <View style={styles.divider} />;

const SettingsScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserDataProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSetting, setActiveSetting] = useState<string | null>(null);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false); 
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] = useState(false);
  const [invitedCount, setInvitedCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserProfile();
        console.log('✅ Загружены данные пользователя:', userData);
        setUser(userData);
      } catch (error) {
        console.error('❌ Ошибка загрузки профиля:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const invitedUsers = await getInvitedUsers();
        setInvitedCount(invitedUsers.length); // ✅ Обновляем количество приглашенных
  
        const blockedUsers = await getBlockedUsers();
        setBlockedCount(blockedUsers.length); // ✅ Обновляем количество заблокированных
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };
  
    fetchCounts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Ошибка загрузки данных</Text>
      </View>
    );
  }

  const handleBack = () => {
    if (activeSetting) {
      setActiveSetting(null);
    } else {
      router.back();
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token'); // Удаляем токен из локального хранилища
      setIsLogoutModalVisible(false);
      router.replace('/auth/login'); // Перенаправляем на страницу входа
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  const getHeaderTitle = (activeSetting: string | null) => {
    switch (activeSetting) {
      case 'name':
        return 'Имя';
      case 'id':
        return 'Установить id';
      case 'about':
        return 'О себе';
      // case 'phone':
      //   return 'Телефон';
      case 'email':
        return 'Почта';
      case 'password':
        return 'Задать пароль';
      case 'city':
        return 'Сменить город';
      case 'blocked':
        return 'Черный список';
      case 'code':
        return 'Активационный код';
      case 'addedUsers': 
        return 'Добавленные вами';
      case 'nontification': 
        return 'Уведомления';
      case 'rules': 
        return 'Правила';
      case 'support': 
        return 'Поддержка';
      case 'subs': 
        return '';
      default:
        return 'Настройки';
    }
  };

  const renderActiveSetting = () => {
    switch (activeSetting) {
      case 'name': return <SettingsNameScreen user={user} onBack={handleBack} />;
      case 'id': return <SettingsId user={user} onBack={handleBack} />;
      case 'about': return <SettingsAbout user={user} onBack={handleBack} />;
      case 'email': return <SettingsEmail user={user} onBack={handleBack} />;
      case 'password': return <SettingsPassword user={user} onBack={handleBack} />;
      case 'city': return <SettingsCity user={user} onBack={handleBack} />;
      case 'blocked': return <SettingsBlocked onBack={handleBack} />;
      case 'code': 
      return (
        <SettingsActivationCode 
          userRole={user?.role as 'user' | 'creator' | 'admin'} 
          onBack={handleBack} 
          setActiveSetting={setActiveSetting} 
        />
      );    
      case 'addedUsers': 
      return <SettingsAddedUsers onBack={handleBack} />;
      case 'nontification': 
      return <SettingsNontification onBack={handleBack}/>;
      case 'rules': 
      return <SettingsRules onBack={handleBack}/>;
      case 'support': 
      return <SettingsSupport onBack={handleBack}/>;
      case 'subs': 
      return <SettingsSubscription onBack={handleBack}/>;
      default: return null;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerIcons}>
          <View style={styles.backIcon}>
            <IconBack fill='#000' onPress={handleBack} />
          </View>
          <Text style={styles.headerTitle}>{getHeaderTitle(activeSetting)}</Text>
          <View />
        </View>
        {activeSetting ? (
          renderActiveSetting()
        ) : (
          <View style={styles.mainContentContainer}>
            <View style={styles.mainContent}>
              <ProfileSection onPress={() => setActiveSetting('name')} label="Имя" value={`${user.firstName} ${user.lastName}`} />
              <ProfileSection onPress={() => setActiveSetting('id')} label="ID" value={'@' + user.username} />
              <ProfileSection onPress={() => setActiveSetting('about')} label="О себе" value='' />
              <ProfileSection label="Город" onPress={() => setActiveSetting('city')} value={user.city || 'Не указан'} />
              <ProfileSection
                label="Активационный код"
                onPress={() => setActiveSetting('code')}
                value={`${invitedCount}`} // ✅ Отображаем количество приглашенных
              />
              <Divider />
              <ProfileSection label="Телефон" value={user.phone || 'Не указан'} isNone/>
              <ProfileSection onPress={() => setActiveSetting('email')} label="Почта" value={user.email || 'Не указана'} />
              <ProfileSection onPress={() => setActiveSetting('password')} label="Пароль" value={'*********'}/>
              <ProfileSection
                onPress={() => setActiveSetting('blocked')}
                label="Черный список"
                value={`${blockedCount}`}
              />
              <Divider />
              <ProfileSection label="Подписка" value={''} onPress={() => setActiveSetting('subs')}/>
              <ProfileSection label="Правила" value={''} onPress={() => setActiveSetting('rules')}/>
              <ProfileSection label="Поддержка" value={''} onPress={() => setActiveSetting('support')}/>
              <ProfileSection label="Уведомления" value={''} onPress={() => setActiveSetting('nontification')}/>
              <Divider />
              <ProfileSection
                label="Удалить аккаунт"
                value=""
                isDanger
                isNone
                onPress={() => setIsDeleteAccountModalVisible(true)} 
              />
              <ProfileSection
                label="Выйти"
                value=""
                isDanger
                isNone
                onPress={() => setIsLogoutModalVisible(true)} 
              />
            </View>
          </View>
        )}
          {/* 🔥 Модальное окно для выхода */}
        <Modal visible={isLogoutModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Выйти из аккаунта?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <Text style={styles.logoutText}>Выйти</Text>
                </TouchableOpacity> 
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsLogoutModalVisible(false)}>
                  <Text style={styles.cancelText}>Отмена</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

          {/* 🔥 Модальное окно для удаления аккаунта */}
        <Modal visible={isDeleteAccountModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Вы хотите удалить аккаунт?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.logoutButton} onPress={() => console.log('Удаление аккаунта')}>
                  <Text style={styles.logoutText}>Удалить</Text>
                </TouchableOpacity> 
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsDeleteAccountModalVisible(false)}>
                  <Text style={styles.cancelText}>Отмена</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
  },
  contentContainer:{
    flex: 1, 
    maxWidth: 600,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 58,
  },  
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
    width: '100%',
    position: 'relative'
  },
  backIcon:{
    position: 'absolute',
    left: 0
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  mainContentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  username: {
    fontSize: 16,
    color: '#555',
    marginTop: 8,
  },
  mainContent: {
    width: '100%',
  },
  divider: {
    backgroundColor: '#ececec',
    marginBottom: 26,
    height: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '700',
    paddingVertical: 35,
    color: '#000',
  },
  modalButtons: {
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  logoutButton: {
    paddingVertical: 25,
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#ECECEC', 
    width: '100%', 
  },
  logoutText: {
    color: '#f00',
    fontSize: 14,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 25,
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#ECECEC', 
    width: '100%', 
  },  
  cancelText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },

});

export default SettingsScreen;