import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getAllUsers, UserDataProps } from '@/api';
import { getMonthlyTopUsers, getUserData } from '@/api/adminApi';
import { useRouter } from 'expo-router';
import UserAvatar from '@/components/UserAvatar';
import { styles } from './ParticipantsStyles';
import SearchAdmin from '../settings/SearchAdmin';
import CustomModal from '../CustomModal';

const rewardOptions = [
  { label: 'Награда 1', value: 'reward1' },
  { label: 'Награда 2', value: 'reward2' },
  { label: 'Награда 3', value: 'reward3' },
];

interface VerifiedParticipantsProps {
  members: string[];
  cityId: string;
}

const VerifiedParticipants: React.FC<VerifiedParticipantsProps> = ({ members, cityId }) => {
  const [users, setUsers] = useState<UserDataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const [winnerByRating, setWinnerByRating] = useState<UserDataProps | null>(null);
  const [winnerByTasks, setWinnerByTasks] = useState<UserDataProps | null>(null);
  const [winnerBySOS, setWinnerBySOS] = useState<UserDataProps | null>(null);

  const [rewardModalVisible, setRewardModalVisible] = useState(false);
  const [selectedReward, setSelectedReward] = useState<string>('');
  const [rewardUser, setRewardUser] = useState<UserDataProps | null>(null);

  const isEndOfMonth = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.getDate() === 25;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allUsers = await getAllUsers();
        if (!Array.isArray(allUsers)) return;

        const verifiedUsers = allUsers.filter((user) => {
          const isVerified = user.verificationStatus === 'verified';
          const isNotCreator = user.role !== 'creator';
          const isInSubdivision = members.includes(String(user._id || user.id));
        
          let userCityId: string | undefined;
          if (typeof user.city === 'string') {
            userCityId = user.city;
          } else if (user.city && typeof user.city === 'object' && '_id' in user.city) {
            userCityId = (user.city as any)._id; // 👈 безопасно вытаскиваем _id
          }
        
          const isInCity = userCityId === cityId;
        
          return isVerified && isNotCreator && isInSubdivision && isInCity;
        });
        
        
        setUsers(verifiedUsers);

        if (isEndOfMonth()) {
          const top = await getMonthlyTopUsers();

          if (top.topByRating[0]) {
            const full = await getUserData(top.topByRating[0].id);
            setWinnerByRating(full);
          }

          if (top.topByTasks[0]) {
            const full = await getUserData(top.topByTasks[0].id);
            setWinnerByTasks(full);
          }

          if (top.topBySOS[0]) {
            const full = await getUserData(top.topBySOS[0].id);
            setWinnerBySOS(full);
          }
        }
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const username = user.username?.toLowerCase() || '';
    return fullName.includes(query) || username.includes(query);
  });

  const openRewardModal = (user: UserDataProps) => {
    setRewardUser(user);
    setSelectedReward('');
    setRewardModalVisible(true);
  };

  const applyReward = () => {
    if (rewardUser && selectedReward) {
      const selected = rewardOptions.find((opt) => opt.value === selectedReward);
      console.log(`🎁 Наградить ${rewardUser.username} — ${selected?.label}`);
      setRewardModalVisible(false);
    }
  };  

  const renderUserCard = (user: UserDataProps, label?: string, showRewardButton?: boolean) => (
    <View key={user.id || user._id}>
      {label && <Text style={{ fontWeight: '700', fontSize: 14, marginBottom: 4 }}>{label}</Text>}
      <TouchableOpacity
        style={[styles.userCard, styles.verifiedUserCard]}
        onPress={() =>
          router.push({
            pathname: '/admin/control/[id]',
            params: { id: String(user.id || user._id) },
          })
        }
      >
        <UserAvatar user={user} />
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{user.username || 'Без имени'}</Text>
          <Text style={styles.name}>
            {`${user.firstName || ''} ${user.lastName || ''}`.trim()}
          </Text>
          <View style={styles.item}>
            <Text style={styles.label}>Рейтинг: </Text>
            <Text style={[styles.value, styles.ratingBackground]}>
              {Number(user.rating ?? 0).toFixed(1)}
            </Text>
          </View>
        </View>
        {showRewardButton && (
          <View style={{ justifyContent: 'center', paddingLeft: 8 }}>
            <TouchableOpacity
              onPress={() => openRewardModal(user)}
              style={styles.presentButton}
            >
              <Text style={{ fontWeight: 'bold' }}>Наградить</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  if (users.length === 0) {
    return <Text style={styles.noUsers}>Нет верифицированных участников</Text>;
  }

  const topIds = [winnerByRating?.id, winnerByTasks?.id, winnerBySOS?.id].filter(Boolean);
  const otherUsers = filteredUsers.filter(
    (user) => !topIds.includes(String(user.id || user._id))
  );

  return (
    <View style={styles.container}>
      <SearchAdmin
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder=""
      />

      {isEndOfMonth() && (
        <>
          <View style={{ marginBottom: 20 }}>
            {winnerByRating && renderUserCard(winnerByRating, '🏆 Лидер рейтинга', true)}
            {winnerByTasks && renderUserCard(winnerByTasks, '🛠 Лидер общего дела', true)}
            {winnerBySOS && renderUserCard(winnerBySOS, '🚨 Лидер SOS', true)}
          </View>
          <Text style={{ fontWeight: '700', fontSize: 14, marginBottom: 4 }}>Все участники</Text>
        </>
      )}

      {otherUsers.map((user) => renderUserCard(user))}

      <CustomModal
        visible={rewardModalVisible}
        title="Выберите награду"
        selectOptions={rewardOptions}
        selectedOption={selectedReward}
        onSelectOption={setSelectedReward}
        onClose={() => setRewardModalVisible(false)}
        buttons={[
          {
            label: 'Применить',
            action: applyReward,
            type: 'full'
          },
        ]}
      />
    </View>
  );
};

export default VerifiedParticipants;
