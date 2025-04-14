import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, ScrollView } from 'react-native';
import { getUserData, getUserStats, updateUserVerificationStatus, UserStatsProps } from '@/api/adminApi';
import { getAllMarkets } from '@/api/marketApi';
import AdminProfileHeader from '@/components/admin/control/AdminProfileHeader';
import AdminUserInfo from '@/components/admin/control/AdminUserInfo';
import AdminUserStats from '@/components/admin/control/AdminUserStats';
import AdminMarketInfo from '@/components/admin/control/AdminMarketInfo';
import AdminDeletedUser from '@/components/admin/control/AdminDeletedUser';
import { UserDataProps } from '@/api';
import AdminUserLimits from '@/components/admin/control/AdminUserLimits';
import Header from '@/components/common/Header';
import { useRouter } from 'expo-router';
import { getMarketByUserId } from '@/api/adminApi';
import { useLocalSearchParams } from 'expo-router';
import CustomModal from '@/components/admin/CustomModal';
import { MarketDataProps } from '@/types/market';

const Control: React.FC = () => {
  const [user, setUser] = useState<UserDataProps | null>(null);
  const [userStats, setUserStats] = useState<UserStatsProps | null>(null);
  const [markets, setMarkets] = useState<MarketDataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [marketId, setMarketId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'account' | 'market' | 'stats' | 'limits' | 'deleted'>('account');
  const router = useRouter();
  const { id, tab } = useLocalSearchParams(); // 👈 получаем и id и tab
  const params = useLocalSearchParams();
  const status = Array.isArray(params.status) ? params.status[0] : params.status;  
  const [isRestoreModalVisible, setRestoreModalVisible] = useState(false);

  const onClose = () => {
    router.replace('/settings'); // или router.replace('/admin') — как тебе нужно
  };

  const userId = id as string;

  useEffect(() => {
    if (typeof tab === 'string' && ['account', 'market', 'stats', 'limits', 'deleted'].includes(tab)) {
      setActiveTab(tab as 'account' | 'market' | 'stats' | 'limits' | 'deleted');
    }
  }, [tab]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
  
        const userData = await getUserData(userId);
        setUser(userData);
  
        if (activeTab === 'market') {
          const allMarkets = await getAllMarkets();
          setMarkets(allMarkets);
        }
  
        if (activeTab === 'limits') {
          const market = await getMarketByUserId(userId);
          if (market) {
            setMarkets([market]);
            setMarketId(market._id); // 👈 ВАЖНО!
          } else {
            setMarkets([]);
            setMarketId(null);
          }
        }
        
        if (activeTab === 'stats') {
          const statsData = await getUserStats(userId);
          setUserStats(statsData);
        }
  
      } catch (err) {
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [activeTab]);

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;
  if (!user) return <Text style={styles.errorText}>Пользователь не найден.</Text>;

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return <AdminUserInfo user={user} visibleFields={['phone', 'email', 'verificationStatus', 'invitedBy', 'createdAt']}/>;
      case 'market':
        return markets.length > 0 ? (
          markets.map((market) => (
            <AdminMarketInfo 
              key={market.id} 
              market={market} 
              status={status as string} // 👈 передаём сюда статус
            />
          ))
        ) : (
          <Text style={styles.placeholderText}>Нет данных о маркетах</Text>
        );        
      case 'stats':
        return <AdminUserStats stats={userStats} />;
        case 'limits':
          return (
            <AdminUserLimits
              userId={user._id as string}
              marketId={marketId || undefined} // <-- теперь будет точно
            />
          );
          case 'deleted':
            return <AdminDeletedUser user={user} onRestore={handleRestore} />;
      default:
        return null;
    }
  };

  const handleRestore = async () => {
    if (!user?._id) return;
    try {
      await updateUserVerificationStatus(user._id, 'verified');
      setRestoreModalVisible(false); // 👈 закрываем
      router.replace('/settings'); // или router.back()
    } catch (err) {
      console.error('Ошибка при восстановлении:', err);
    }
  };  

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.paddingHorizontalContainer}>
          <Header title="Управление" onLeftPress={onClose} leftType="close" />
          <AdminProfileHeader user={user} />                 
        </View>
        {/* Горизонтальный скролл для кнопок */}
        {activeTab !== 'deleted' && (
          <ScrollView 
            horizontal={true} 
            showsHorizontalScrollIndicator={false} 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            >
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'account' && styles.activeTab]} 
              onPress={() => setActiveTab('account')}
            >
              <Text style={[styles.tabText, activeTab === 'account' && styles.activeTabText]}>Аккаунт</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'market' && styles.activeTab]} 
              onPress={() => setActiveTab('market')}
            >
              <Text style={[styles.tabText, activeTab === 'market' && styles.activeTabText]}>Маркет</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'stats' && styles.activeTab]} 
              onPress={() => setActiveTab('stats')}
            >
              <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>Статистика</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'limits' && styles.activeTab]} 
              onPress={() => setActiveTab('limits')}
            >
              <Text style={[styles.tabText, activeTab === 'limits' && styles.activeTabText]}>Ограничения</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
        <View style={styles.paddingHorizontalContainer}>
          {/* Контент */}
          {renderContent()}
          {activeTab === 'deleted' && (
            <TouchableOpacity style={styles.restoreButton} onPress={() => setRestoreModalVisible(true)}>
              <Text style={styles.restoreText}>Восстановить</Text>
            </TouchableOpacity>
          )}
        </View>
        <CustomModal
          visible={isRestoreModalVisible}
          onClose={() => setRestoreModalVisible(false)}
          title=""
          buttonLayout="column" // 👈 вот это добавляешь
          buttons={[
            { label: 'Восстановить', action: handleRestore, type: 'grayBack' },
            { label: 'Отмена', action: () => setRestoreModalVisible(false), type: 'grayBack' },
          ]}
        />
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
  }, 
  paddingHorizontalContainer:{
    paddingHorizontal: 16,
  },
  errorText: { 
    color: 'red', 
    textAlign: 'center', 
    marginVertical: 10 
  },
  placeholderText: { 
    textAlign: 'center', 
    fontSize: 16, 
    color: '#888', 
    marginVertical: 20 
  },
  scrollContainer: { 
    maxHeight: 36,
    marginBottom: 25,
    paddingHorizontal: 16
  },
  scrollContent: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6,
  },
  tabButton: { 
    paddingHorizontal: 12, 
    height: 36,
    borderRadius: 8, 
    backgroundColor: '#fff',
    minWidth: 106,
    borderColor: '#D9D9D9',
    borderWidth: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: { 
    backgroundColor: '#000',
  },
  tabText: { 
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',  
  },
  activeTabText:{
    color: '#fff',
  },
  restoreButton:{
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#000',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    width: '100%'
  },
  restoreText:{
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  }
});

export default Control;
