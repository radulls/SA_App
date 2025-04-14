import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { getUserProfile, IMAGE_URL } from '@/api';
import { getAllCoupons, getCouponsBySubdivision, deleteCoupon, updateCouponStatus } from '@/api/adminApi';
import MoreOptionsIcon from '@/components/svgConvertedIcons/MoreOptionsIcon';
import CustomModal from '../CustomModal';
import Toast from 'react-native-toast-message';

interface CouponsProps {
  onBack: () => void;
}

const Coupons: React.FC<CouponsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'actual' | 'assigned' | 'archived'>('actual');
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [activeCouponId, setActiveCouponId] = useState<string | null>(null);
  const selectedCoupon = coupons.find(c => c._id === selectedCouponId);

  useEffect(() => {
    const loadCoupons = async () => {
      setLoading(true);
      try {
        const user = await getUserProfile();
        let result: any[] = [];

        if (user.role === 'creator') {
          result = await getAllCoupons();
        } else if (user.subdivision?._id) {
          result = await getCouponsBySubdivision(user.subdivision._id);
        }

        if (activeTab === 'assigned') {
          result = result.filter(c => c.assignedTo === user.id);
        } else if (activeTab === 'archived') {
          result = result.filter(c => c.status === 'archived');
        } else {
          result = result.filter(c => c.status === 'active');
        }

        setCoupons(result);
      } catch (error) {
        console.error('❌ Ошибка загрузки купонов:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCoupons();
  }, [activeTab]);

  const renderItem = ({ item }: { item: any }) => {
    const background = item.image ? `${IMAGE_URL}${item.image}` : undefined;
    const logo = item.subdivision?.avatar ? `${IMAGE_URL}${item.subdivision.avatar}` : undefined;

    return (
      <ImageBackground
        source={background ? { uri: background } : undefined}
        style={[styles.couponContainer, !background && item.color ? { backgroundColor: item.color } : {}]}
        imageStyle={styles.backgroundImage}
      >
        <TouchableOpacity style={styles.leftContent} onPress={() => setActiveCouponId(item._id)}>
          {logo ? (
            <Image source={{ uri: logo }} style={styles.logo} />
          ) : (
            <Text style={{ color: '#fff', fontSize: 10 }}>Нет аватарки</Text>
          )}
          <View style={styles.textContainer}>
            <Text style={styles.couponName}>
              {item.subdivision?.group || 'Без подразделения'}
            </Text>
            <Text style={styles.couponSubtitle}>{item.title}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedCouponId(item._id)}>
          <MoreOptionsIcon />
        </TouchableOpacity>
      </ImageBackground>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <Text style={styles.subtitle}>Купонами награждаются участники объединения за их активность.</Text>
      <View style={styles.tabsRow}>
        {['actual', 'assigned', 'archived'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'actual' ? 'Актуальные' : tab === 'assigned' ? 'Присвоенные' : 'Архив'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={coupons}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ gap: 16, paddingBottom: 40, paddingHorizontal: 16 }}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyText}>Нет купонов</Text>}
        />
      )}

      <CustomModal
        visible={!!selectedCouponId}
        onClose={() => setSelectedCouponId(null)}
        title=""
        buttons={[
          {
            label: selectedCoupon?.status === 'archived' ? 'В актуальные' : 'В архив',
            type: 'grayBack' as const,
            action: async () => {
              if (!selectedCouponId) return;
              try {
                const nextStatus = selectedCoupon?.status === 'archived' ? 'active' : 'archived';
                await updateCouponStatus(selectedCouponId, nextStatus);

                setCoupons(prev =>
                  prev
                    .map(c => (c._id === selectedCouponId ? { ...c, status: nextStatus } : c))
                    .filter(c =>
                      activeTab === 'archived' ? c.status === 'archived'
                      : activeTab === 'assigned' ? c.assignedTo === selectedCoupon?.assignedTo
                      : c.status === 'active'
                    )
                );                

                Toast.show({
                  type: 'success',
                  text1:
                    nextStatus === 'archived'
                      ? 'Купон отправлен в архив'
                      : 'Купон восстановлен в актуальные',
                });

                setSelectedCouponId(null);
              } catch (err) {
                console.error('❌ Ошибка при смене статуса:', err);
                Toast.show({
                  type: 'error',
                  text1: 'Ошибка при обновлении статуса',
                });
              }
            },
          },
          {
            label: 'Удалить',
            type: 'redText' as const,
            action: async () => {
              if (!selectedCouponId) return;
              try {
                await deleteCoupon(selectedCouponId);
                setCoupons(prev => prev.filter(c => c._id !== selectedCouponId));

                Toast.show({
                  type: 'success',
                  text1: 'Купон удалён',
                });

                setSelectedCouponId(null);
              } catch (err) {
                console.error('❌ Ошибка при удалении купона:', err);
                Toast.show({
                  type: 'error',
                  text1: 'Ошибка при удалении купона',
                });
              }
            },
          },
          {
            label: 'Отмена',
            action: () => setSelectedCouponId(null),
            type: 'grayBack' as const,
          },
        ]}
        buttonLayout="column"
      />

      {/* Модалка с описанием купона */}
        <CustomModal
          visible={!!activeCouponId}
          onClose={() => setActiveCouponId(null)}
          title={coupons.find(c => c._id === activeCouponId)?.title || ''}
          subtitle={coupons.find(c => c._id === activeCouponId)?.details || ''}
          description={coupons.find(c => c._id === activeCouponId)?.description || ''}
          modalImage={
            coupons.find(c => c._id === activeCouponId)?.subdivision?.avatar
              ? `${IMAGE_URL}${coupons.find(c => c._id === activeCouponId)?.subdivision.avatar}`
              : undefined
          }
          hideOptionIcons
          buttonLayout="column"
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    color: '#8B8B8B',
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
  },
  tabButton: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
    paddingBottom: 12,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderColor: '#000',
  },
  tabText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
  },
  activeTabText: {
    color: '#000',
  },
  couponContainer: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 40,
    overflow: 'hidden',
    height: 78,
  },
  backgroundImage: {
    borderRadius: 16,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 26,
  },
  textContainer: {
    flexShrink: 1,
  },
  couponName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  couponSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
  },
});

export default Coupons;
