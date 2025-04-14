import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { getUserProfile, UserDataProps } from '@/api';
import { getAllUsers } from '@/api';
import { getAllMarkets } from '@/api/marketApi';
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
import SettingsAddedUsers from '@/components/settings/SettingsAddedUsers';
import SettingsNontification from '@/components/settings/SettingsNontification';
import { getInvitedUsers } from '@/api/activeCodes';
import { getBlockedUsers } from '@/api/blockedUsers';
import SettingsRules from '@/components/settings/SettingsRules';
import SettingsSupport from '@/components/settings/SettingsSupport';
import SettingsSubscription from '@/components/settings/SettingsSubscription';
import ParticipantList from './admin/users';
import Admins from '@/components/admin/settings/Admins';
import Market from '@/components/admin/settings/Market';
import Coupons from '@/components/admin/settings/Coupons';
import PartnerCoupons from '@/components/admin/settings/PartnersCoupons';
import SosTags from '@/components/admin/settings/SosTags';
import CouponPlusIcon from '@/components/svgConvertedIcons/settings/couponPlusIcon';
import DeletedUsersIcon from '@/components/svgConvertedIcons/settings/deletedUsersIcon';
import BlockedUsers from '@/components/admin/settings/BlockedUsers';
import SubdivisionManager from '@/components/admin/settings/SubdivisionManager';
import { Subdivision } from '@/types/subdivision';
import { MarketDataProps } from '@/types/market';
import AddAdmin from '@/components/admin/settings/AddAdmin';
import AdminPermissions from '@/components/admin/settings/AdminPermissions';
import SubdivisionInformation from '@/components/admin/settings/SubdivisionInformation';
import CustomModal from '@/components/admin/CustomModal';
import { deleteSubdivision } from '@/api/adminApi';
import CreateCouponScreen from '@/components/admin/settings/CreateCouponScreen';

export interface SettingsProps {
  user: UserDataProps;
  onBack: () => void;
}

const Divider = () => <View style={styles.divider} />;

const SettingsScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserDataProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [settingHistory, setSettingHistory] = useState<string[]>([]);
  const activeSetting = settingHistory[settingHistory.length - 1] || null;
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false); 
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] = useState(false);
  const [invitedCount, setInvitedCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0); 
  const [markets, setMarkets] = useState<MarketDataProps[]>([]);
  const [usersCount, setUsersCount] = useState(0); 
  const [activeSubdivision, setActiveSubdivision] = useState<Subdivision | null>(null);
  const [addAdminMode, setAddAdminMode] = useState(false);
  const [adminSetupUser, setAdminSetupUser] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'personal' | 'group'>('personal'); // Переключение между вкладками
  const adminPermissionsRef = useRef<{ handleSave: () => void }>(null);
  const [isDeleteSubdivisionModalVisible, setIsDeleteSubdivisionModalVisible] = useState(false);
  const subdivisionManagerRef = useRef<{
    reload: () => void;
    getAllSubdivisions?: () => Subdivision[];
  }>(null);  

  const goToSetting = (key: string) => {
    setSettingHistory(prev => [...prev, key]);
  };  

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
        setInvitedCount(invitedUsers.length); 

        const blockedUsers = await getBlockedUsers();
        setBlockedCount(blockedUsers.length); 

        const fetchedMarkets = await getAllMarkets();
        setMarkets(fetchedMarkets); // ✅ сохраняем массив        

        const users = await getAllUsers();
        setUsersCount(users.length); 

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

  const subdivisionCityId = typeof activeSubdivision?.city === 'string'
  ? activeSubdivision.city
  : activeSubdivision?.city?._id;

    const marketIdsInSubdivision = activeSubdivision?.markets?.map(m => typeof m === 'string' ? m : m._id);

    const filteredMarkets = markets.filter(m => {
      const marketCityId = typeof m.city === 'string'
        ? m.city
        : m.city && '_id' in m.city
          ? m.city._id
          : undefined;

      return (
        marketCityId &&
        subdivisionCityId &&
        marketCityId === subdivisionCityId &&
        marketIdsInSubdivision?.includes(m._id)
      );
    });

    const handleBack = async () => {
      if (settingHistory.length > 0) {
        const newHistory = settingHistory.slice(0, -1);
        const prev = newHistory[newHistory.length - 1];
    
        if (prev !== 'admins-add') {
          setAddAdminMode(false);
        }
        if (prev !== 'admins') {
          setAdminSetupUser(null);
        }
    
        setSettingHistory(newHistory);
    
        // 👇 перезапрашиваем user, если возвращаемся на главный экран
        if (newHistory.length === 0) {
          try {
            const userData = await getUserProfile();
            setUser(userData);
          } catch (e) {
            console.error('❌ Ошибка при обновлении user:', e);
          }
        }
      } else {
        router.back();
      }
    };
    
  const hasPendingMarkets = markets.some(m => 
    m.verificationStatus === 'pending' &&
    (typeof m.city === 'string' ? m.city : m.city._id) === subdivisionCityId
  );
  
  
  // const handleLogout = async () => {
  //   try {
  //     await AsyncStorage.removeItem('token'); // Удаляем токен из локального хранилища
  //     setIsLogoutModalVisible(false);
  //     router.replace('/auth/login'); // Перенаправляем на страницу входа
  //   } catch (error) {
  //     console.error('Ошибка при выходе:', error);
  //   }
  // };

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
          goToSetting={goToSetting}
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

  const getGroupHeaderTitle = () => {
    if (activeSetting === 'admins') {
      if (addAdminMode) {
        return adminSetupUser ? 'Назначение админа' : 'Назначение админа';
      }
      return 'Администраторы';
    }
  
    switch (activeSetting) {
      case 'participants': 
        return 'Участники';
      case 'market': 
        return 'Маркет';
      case 'coupons': 
        return 'Купоны объединения';
      case 'partner-coupons': 
        return 'Купоны партнеров';
      case 'create-coupon':
        return 'Создать купон';
      case 'sosTags': 
        return 'Теги SOS';
      case 'blockedUsers': 
        return 'Удалённые';
      case 'subInfo': 
        return 'Информация';
      default: 
        return 'Настройки';
    }
  };

  const renderGroupSetting = () => {
    switch (activeSetting) {
      case 'participants':
        return activeSubdivision ? (
          <ParticipantList
            onBack={handleBack}
            members={activeSubdivision?.members?.map(m => typeof m === 'string' ? m : m._id) || []}
            pendingRequests={activeSubdivision?.pendingRequests?.map(p => typeof p === 'string' ? p : p._id) || []}
            cityId={
              typeof activeSubdivision?.city === 'string'
                ? activeSubdivision.city
                : activeSubdivision?.city?._id
            }
          />
        ) : null;
        
      case 'admins':
        return activeSubdivision ? (
          addAdminMode ? (
            adminSetupUser ? (
              <AdminPermissions
              ref={adminPermissionsRef}
              subdivisionId={activeSubdivision._id}
              userId={adminSetupUser}
              currentAdminIds={activeSubdivision?.admins?.map(a => typeof a === 'string' ? a : a._id) || []}
              onBack={handleBack}
            />              
            ) : (
              <AddAdmin
              subdivision={activeSubdivision}
              onBack={handleBack}
              onSelect={(userId) => setAdminSetupUser(userId)}
              />            
            )
          ) : (
            <Admins
            key="admins-screen"
            onBack={handleBack}
            onAdd={() => {
              setAddAdminMode(true);
            }}
            onEdit={(userId) => {
              setAddAdminMode(true);
              setAdminSetupUser(userId); // установим сразу пользователя для редактирования
            }}
            adminIds={activeSubdivision?.admins?.map(a => typeof a === 'string' ? a : a._id) || []}
          />            
          )
        ) : null;
      
      case 'market':
          return (
            <Market
              onBack={handleBack}
              cityId={
                typeof activeSubdivision?.city === 'string'
                  ? activeSubdivision.city
                  : activeSubdivision?.city?._id
              }
              marketIds={activeSubdivision?.markets?.map(m => typeof m === 'string' ? m : m._id)}
            />     
          );
      case 'coupons':
        return <Coupons onBack={handleBack} />;
      case 'partner-coupons':
        return <PartnerCoupons onBack={handleBack} />;
      case 'create-coupon':
        return (
          <CreateCouponScreen
            onBack={handleBack}
            subdivisionId={activeSubdivision?._id}
          />
        );
      case 'sosTags':
        return <SosTags onBack={handleBack} />;
      case 'blockedUsers':
        return <BlockedUsers onBack={handleBack} />;
        case 'subInfo': 
        return activeSubdivision ? (
          <SubdivisionInformation
            onBack={handleBack}
            info={activeSubdivision}
            allSubdivisions={subdivisionManagerRef.current?.getAllSubdivisions?.() || []} // 👈 вот это
          />
        ) : null;         
      default:
        return null;
    }
  };
  
  return (
    <View style={[styles.container, activeSetting === 'subs' && { backgroundColor: '#FFD200' }]}>
     <View style={styles.contentContainer}>
        {/* Заголовок в зависимости от выбранной вкладки */}
        <View style={styles.headerIcons}>
          <View style={styles.backIcon}>
            <IconBack fill={activeSetting === 'subs' ? '#fff' : '#000'} onPress={handleBack} />
          </View>

          <Text style={styles.headerTitle}>
            {selectedTab === 'personal' ? getHeaderTitle(activeSetting) : getGroupHeaderTitle()}
          </Text>

          {activeSetting === 'coupons' && (
            <TouchableOpacity onPress={() => setSettingHistory(prev => [...prev, 'create-coupon'])}
            style={styles.plusIcon}>
              <CouponPlusIcon />
            </TouchableOpacity>
          )}

          {activeSetting === 'participants' && (
            <TouchableOpacity onPress={() => setSettingHistory(prev => [...prev, 'blockedUsers'])}style={styles.plusIcon}>
              <DeletedUsersIcon/>
            </TouchableOpacity>
          )}

          {activeSetting === 'admins' && addAdminMode && adminSetupUser && (
            <TouchableOpacity onPress={() => {
              // Тут прокинем handleSave из AdminPermissions:
              const adminPermsComponent = adminPermissionsRef.current;
              adminPermsComponent?.handleSave();
            }} style={styles.plusIcon}>
              <Text style={{ color: '#000', fontWeight: 'bold' }}>Готово</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Переключалка (только если в главном экране) */}
        {activeSetting === null && (user.role === 'creator' || user.role === 'admin') && (
          <View style={styles.buttonRow}>
            <View style={styles.buttonRowItem}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  selectedTab === 'personal' && styles.activeTypeButton,
                ]}
                onPress={() => setSelectedTab('personal')}
              >
                <Text
                  style={[
                    styles.buttonRowText,
                    selectedTab === 'personal' && styles.buttonRowTextSelected,
                  ]}
                >
                  Личные настройки
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonRowItem}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  selectedTab === 'group' && styles.activeTypeButton,
                ]}
                onPress={() => setSelectedTab('group')}
              >
                <Text
                  style={[
                    styles.buttonRowText,
                    selectedTab === 'group' && styles.buttonRowTextSelected,
                  ]}
                >
                  Объединение
                </Text>
              </TouchableOpacity>
            </View>         
          </View>
        )}
        {/* Отображение активной настройки или общего контента */}
        <ScrollView contentContainerStyle={styles.content}>
          {activeSetting ? (
            selectedTab === 'personal' ? renderActiveSetting() : renderGroupSetting()
          ) : (
            <View style={styles.mainContentContainer}>
              <View style={styles.mainContent}>
                {selectedTab === 'personal' ? (
                  <>
                    <ProfileSection onPress={() => setSettingHistory(prev => [...prev, 'name'])} label="Имя" value={`${user.firstName} ${user.lastName}`} />
                    <ProfileSection onPress={() => setSettingHistory(prev => [...prev, 'id'])} label="ID" value={'@' + user.username} />
                    <ProfileSection onPress={() => setSettingHistory(prev => [...prev, 'about'])} label="О себе" value='' />
                    <ProfileSection label="Город" onPress={() => setSettingHistory(prev => [...prev, 'city'])} value={user.city || 'Не указан'} />
                    <ProfileSection
                      label="Активационный код"
                      onPress={() => setSettingHistory(prev => [...prev, 'code'])}
                      value={`${invitedCount}`}
                    />
                    <Divider />
                    <ProfileSection label="Телефон" value={user.phone || 'Не указан'} isNone />
                    <ProfileSection onPress={() => setSettingHistory(prev => [...prev, 'email'])} label="Почта" value={user.email || 'Не указана'} />
                    <ProfileSection onPress={() => setSettingHistory(prev => [...prev, 'password'])} label="Пароль" value={'*********'} />
                    <ProfileSection
                      onPress={() => setSettingHistory(prev => [...prev, 'blocked'])}
                      label="Черный список"
                      value={`${blockedCount}`}
                    />
                    <Divider />
                    <ProfileSection label="Подписка" value={''} onPress={() => setSettingHistory(prev => [...prev, 'subs'])} />
                    <ProfileSection label="Правила" value={''} onPress={() => setSettingHistory(prev => [...prev, 'rules'])} />
                    <ProfileSection label="Поддержка" value={''} onPress={() => setSettingHistory(prev => [...prev, 'support'])} />
                    <ProfileSection label="Уведомления" value={''} onPress={() => setSettingHistory(prev => [...prev, 'nontification'])} />
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
                  </>
                ) : (
                  <>
                  {/* Subdivision Manager — только для создателя */}
                  {(user.role === 'creator' || user.role === 'admin') && (
                    <SubdivisionManager 
                    ref={subdivisionManagerRef}
                    activeSubdivision={activeSubdivision}
                    setActiveSubdivision={setActiveSubdivision}
                    isAdmin={user.role === 'admin'} // 👈 вот сюда передаём
                  />
                  
                  )}
                
                  {/* Настройки выбранного подразделения */}
                  {activeSubdivision && (
                    <>
                      {(user.role === 'creator') && (
                      <>
                      <ProfileSection
                      label='Информация'
                      value=''
                      onPress={() => setSettingHistory(prev => [...prev, 'subInfo'])}
                      />
                   <ProfileSection 
                    label="Администраторы" 
                    onPress={() => {
                      const admins = activeSubdivision?.admins || [];
                      setSettingHistory(prev => [...prev, 'admins']);
                    
                      if (admins.length === 0) {
                        setAddAdminMode(true);
                        setAdminSetupUser(null); // открывает AddAdmin
                      } else {
                        setAddAdminMode(false); // открывает Admins
                        setAdminSetupUser(null);
                      }
                    }}                    
                    value={
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingRight: 4 }}>
                        {activeSubdivision?.admins?.length === 0 && (
                          <Text style={{ color: '#000', fontSize: 12, fontWeight: '500' }}>Назначить</Text>
                        )}
                        {activeSubdivision?.admins?.length > 0 && (
                          <Text>{activeSubdivision.admins.length}</Text>
                        )}
                      </View>
                    }
                  />

                  </>
                  )}
                      {/* Общие для всех групп */}
                      {(user.role === 'creator' || user.role === 'admin') && (
                        <>                       
                          <ProfileSection
                            onPress={() => setSettingHistory(prev => [...prev, 'participants'])}
                            label="Участники"
                            value={
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingRight: 4 }}>
                                {activeSubdivision.pendingRequests?.length > 0 && (
                                  <View style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: '#41FF00',
                                  }} />
                                )}
                                <Text>{activeSubdivision?.members?.length || 0}</Text>
                              </View>
                            }
                          />
                        </>
                      )}
                
                      {/* Только для группы "Основа" */}
                      {activeSubdivision.group === 'Основа' && (
                        <>
                          {(user.role === 'creator' || user.role === 'admin') && (
                            <ProfileSection 
                            onPress={() => setSettingHistory(prev => [...prev, 'market'])} 
                            label="Маркет" 
                            value={
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingRight: 4 }}>
                                {hasPendingMarkets && (
                                  <View style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: '#4CAF50',
                                  }} />
                                )}
                                <Text>{filteredMarkets.length}</Text>
                              </View>
                            }
                          />
                          
                          )}
                
                          {user.role === 'creator' && (
                            <>
                              <ProfileSection 
                                label="Купоны объединения" 
                                value="" 
                                onPress={() => setSettingHistory(prev => [...prev, 'coupons'])} 
                              />
                              <ProfileSection 
                                label="Купоны партнёров" 
                                value="" 
                                onPress={() => setSettingHistory(prev => [...prev, 'partner-coupons'])} 
                              />
                              <ProfileSection 
                                label="Теги SOS" 
                                value="" 
                                onPress={() => setSettingHistory(prev => [...prev, 'sosTags'])} 
                              />
                            </>
                          )}
                        </>
                      )}     
                      {/* Удаление подразделения — всегда, если creator */}
                      {user.role === 'creator' && (
                        <>
                          <ProfileSection
                            label="Удалить подразделение"
                            value=""
                            isDanger
                            isNone
                            onPress={() => setIsDeleteSubdivisionModalVisible(true)}
                          />
                          <CustomModal
                            visible={isDeleteSubdivisionModalVisible}
                            onClose={() => setIsDeleteSubdivisionModalVisible(false)}
                            title="Удалить подразделение?"
                            buttons={[
                              {
                                label: 'Удалить',
                                action: async () => {
                                  if (activeSubdivision) {
                                    try {
                                      await deleteSubdivision(activeSubdivision._id);
                                      subdivisionManagerRef.current?.reload();
                                      setActiveSubdivision(null);
                                      setIsDeleteSubdivisionModalVisible(false);
                                    } catch (error) {
                                      console.error('❌ Ошибка при удалении подразделения:', error);
                                    }
                                  }
                                },
                                type: 'redText',
                              },
                              {
                                label: 'Отмена',
                                action: () => setIsDeleteSubdivisionModalVisible(false),
                                type: 'grayBack',
                              },
                            ]}
                            buttonLayout="column"
                          />
                        </>
                      )}
                    </>
                  )}
                  </>                
                )}
              </View>
            </View>
          )}
        </ScrollView>
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
    height: '100%',
    paddingTop: 58,
  },  
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
    width: '100%',
    position: 'relative',
  
  },
  backIcon:{
    position: 'absolute',
    left: 16
  },
  plusIcon:{
    position: 'absolute',
    right: 16
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  mainContentContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
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
  content:{
    flex: 1,
    height: '100%'
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
  buttonRow:{ 
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 40,
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

export default SettingsScreen;