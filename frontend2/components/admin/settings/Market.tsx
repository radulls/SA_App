import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MarketDataProps, getAllMarkets } from '@/api/marketApi';
import { styles } from '../participants/ParticipantsStyles';
import UserAvatar from '@/components/UserAvatar';
import { IMAGE_URL } from '@/api';
import { useRouter } from 'expo-router';
import { UserDataProps } from '@/api';

interface MarketProps {
  onBack: () => void;
  cityId?: string;
  marketIds?: string[];
}

const Market: React.FC<MarketProps> = ({ onBack, cityId, marketIds }) => {
  const [markets, setMarkets] = useState<MarketDataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'verified' | 'pending'>('verified');
  const router = useRouter();

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const allMarkets = await getAllMarkets();
        if (!Array.isArray(allMarkets)) return;

        setMarkets(allMarkets);
      } catch (error) {
        console.error('Ошибка при получении маркетов:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, []);

  const filteredMarkets = markets.filter((market) => {
    const isValidStatus = market.verificationStatus === activeTab;

    const isInCurrentCity =
      typeof market.city === 'string'
        ? market.city === cityId
        : market.city?._id === cityId;

    const isInSubdivision = !marketIds || marketIds.includes(market._id);

    return isValidStatus && isInCurrentCity && isInSubdivision;
  });

  return (
    <View style={[styles.container, styles.paddingHorizontalContainer]}>
      <ScrollView style={localStyles.scrollView}>
        <View style={localStyles.buttonRow}>
          <View style={localStyles.buttonRowItem}>
            <TouchableOpacity
              onPress={() => setActiveTab('verified')}
              style={[localStyles.typeButton, activeTab === 'verified' && localStyles.activeTypeButton]}
            >
              <Text style={[localStyles.buttonRowText, activeTab === 'verified' && localStyles.buttonRowTextSelected]}>
                Маркет
              </Text>
            </TouchableOpacity>
          </View>
          <View style={localStyles.buttonRowItem}>
            <TouchableOpacity
              onPress={() => setActiveTab('pending')}
              style={[localStyles.typeButton, activeTab === 'pending' && localStyles.activeTypeButton]}
            >
              <Text style={[localStyles.buttonRowText, activeTab === 'pending' && localStyles.buttonRowTextSelected]}>
                Заявки
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.contentContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : filteredMarkets.length > 0 ? (
            filteredMarkets.map((market) => {
              const user = typeof market.userId === 'object' ? market.userId as UserDataProps : null;

              return (
                <TouchableOpacity
                  key={market._id}
                  style={[styles.marketCard, styles.verifiedUserCard]}
                  onPress={() =>
                    user?._id &&
                    router.push(`/admin/control/${user._id}?tab=market&status=${market.verificationStatus}`)
                  }
                >
                  {user && (
                    <View style={styles.marketUserInfo}>
                      <UserAvatar user={user} />
                      <View>
                        <Text style={styles.username}>@{user.username || 'Без username'}</Text>
                        <Text style={styles.name}>
                          {`${user.firstName || ''} ${user.lastName || ''}`.trim()}
                        </Text>
                      </View>
                    </View>
                  )}
                  <View style={styles.marketContainer}>
                    {market.marketPhoto ? (
                      <Image
                        source={{ uri: `${IMAGE_URL}${market.marketPhoto}` }}
                        style={styles.marketPhoto}
                      />
                    ) : (
                      <View style={styles.marketPhotoFallback}>
                        <Text style={styles.marketPhotoInitial}>
                          {market.name?.[0]?.toUpperCase() || '?'}
                        </Text>
                      </View>
                    )}
                    <Text style={styles.marketName}>{market.name}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={styles.noUsers}>Нет данных</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Market;

const localStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingTop: 20,
  },
  buttonRowItem: {
    justifyContent: 'center',
    flex: 1,
  },
  typeButton: {
    borderBottomWidth: 0.5,
    borderColor: '#ECECEC',
  },
  activeTypeButton: {
    borderBottomWidth: 2,
    borderColor: '#000',
  },
  buttonRowText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#ECECEC',
    paddingBottom: 12,
  },
  buttonRowTextSelected: {
    color: '#000',
  },
});
