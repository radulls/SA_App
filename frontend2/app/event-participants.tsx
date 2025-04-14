import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getEventById, getEventParticipants } from '@/api/eventApi';
import { IMAGE_URL, getUserProfile, getUserProfileById } from '@/api';
import IconBack from '@/components/svgConvertedIcons/iconBack';
import EventChatIcon from '@/components/svgConvertedIcons/sosIcons/sosChat';
import getFullName from '@/utils/getFullName';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  profileImage?: string;
  hideLastName?: boolean;
}

const EventParticipantsScreen = () => {
  const params = useLocalSearchParams();
  const eventId = Array.isArray(params.eventId) ? params.eventId[0] : params.eventId;
  const router = useRouter();
  const [creator, setCreator] = useState<User | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      fetchEventDetails(eventId);
      fetchParticipants(eventId);
    }
    fetchCurrentUser();
  }, [eventId]);

  const fetchCurrentUser = async () => {
    try {
      const userProfile = await getUserProfile();
      if (userProfile?.id) {
        setCurrentUserId(userProfile.id.toString());
      }      
    } catch (error) {
      console.error("Ошибка загрузки текущего пользователя:", error);
    }
  };

  const fetchEventDetails = async (eventId: string) => {
    try {
      const event = await getEventById(eventId);
      if (event?.userId) {
        const user = await getUserProfileById(event.userId);
        setCreator({
          _id: user.id!,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          profileImage: user.profileImage,
          hideLastName: user.hideLastName ?? false,
        });
      }
    } catch (error) {
      console.error("❌ Ошибка загрузки мероприятия или создателя:", error);
    }
  };

  const fetchParticipants = async (eventId: string) => {
    try {
      const data = await getEventParticipants(eventId);
      setParticipants(data || []);
    } catch (error) {
      console.error("❌ Ошибка загрузки участников:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleProfilePress = (userId: string) => {
    if (!userId) {
      console.error("❌ Ошибка: userId отсутствует при переходе на профиль");
      return;
    }
    if (userId === currentUserId) {
      router.push('/home');
    } else {
      router.push({ pathname: '/profile/[userId]', params: { userId } });
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#F22C2C" />;

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.leftHeaderContainer}>
            <View style={styles.backButton} >
              <IconBack fill='#000' onPress={handleGoBack}/>
            </View>
          </View>

          <View style={styles.centerHeaderContainer}>
            <Text style={styles.title}>{`(${participants.length}) Участники`}</Text>
          </View>

          <View style={styles.rightHeaderContainer}>
            <EventChatIcon />
          </View>
        </View>

        <Text style={styles.labelTitle}>Создатель мероприятия</Text>
        {creator && (
          <TouchableOpacity onPress={() => handleProfilePress(creator._id)}>
            <View style={styles.card}>
              <Image
                source={{ uri: creator.profileImage ? `${IMAGE_URL}${creator.profileImage}` : 'https://via.placeholder.com/50' }}
                style={styles.profileImage}
              />
              <View>
                <Text style={styles.label}>{creator.username}</Text>
                <View>
                  {getFullName({
                    firstName: creator.firstName,
                    lastName: creator.lastName,
                    hideLastName: creator.hideLastName,
                  })}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        <View style={styles.divider} />
        <Text style={styles.labelTitle}>Участники</Text>

        {participants.length === 0 ? (
          <Text style={styles.noHelpersText}>Пока никто не участвует.</Text>
        ) : (
          <FlatList
            data={participants}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleProfilePress(item._id)}>
                <View style={styles.card}>
                  <Image
                    source={{ uri: item.profileImage ? `${IMAGE_URL}${item.profileImage}` : 'https://via.placeholder.com/50' }}
                    style={styles.profileImage}
                  />
                  <View>
                    <Text style={styles.label}>{item.username}</Text>
                    <View>
                      {getFullName({
                        firstName: item.firstName,
                        lastName: item.lastName,
                        hideLastName: item.hideLastName ?? false,
                      })}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  contentContainer: {
    maxWidth: 600,
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 55,
    paddingBottom: 42,
  },
  leftHeaderContainer: {
    width: 50, // Ширина 50 пикселей
    alignItems: 'flex-start', // Выравнивание по левому краю
  },
  centerHeaderContainer: {
    flex: 1, // Занимает всё доступное пространство между левым и правым контейнерами
    alignItems: 'center', // Выравнивание заголовка по центру
  },
  rightHeaderContainer: {
    width: 50, // Ширина 50 пикселей
    alignItems: 'flex-end', // Выравнивание по правому краю
  },
  backButton: {
    alignItems: 'flex-start', // Выравнивание кнопки назад по левому краю
  },
  title: {
    fontSize: 15,
    fontFamily: "SFUIDisplay-bold",
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: "SFUIDisplay-bold",
    paddingBottom: 4,
  },
  labelTitle: {
    fontSize: 14,
    fontFamily: "SFUIDisplay-bold",
    paddingBottom: 18,  
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingBottom: 20,
  },
  profileImage: {
    width: 38,
    height: 38,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#ECECEC',
  },
  name: {
    fontSize: 12,
    fontFamily: "SFUIDisplay-regular",
    color: '#000',
  },
  divider: {
    height: 0.5,
    backgroundColor: '#ECECEC',
    marginTop: 6,
    marginBottom: 26,
  },
  noHelpersText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

export default EventParticipantsScreen;
