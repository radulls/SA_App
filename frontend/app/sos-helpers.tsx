import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getSosHelpers, getSosSignalById } from '@/api/sos/sosApi';
import { IMAGE_URL } from '@/api/index';
import IconBack from '@/components/svgConvertedIcons/iconBack';
import SosChatIcon from '@/components/svgConvertedIcons/sosIcons/sosChat';
import { getUserProfile } from '@/api';
import { getFullName } from '@/utils/getFullName';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  profileImage?: string;
}

interface Helper {
  _id: string;
  userId: string;
  user: User | null;
}

const SosHelpersScreen = () => {
  const params = useLocalSearchParams();
  const sosId = Array.isArray(params.sosId) ? params.sosId[0] : params.sosId;
  const router = useRouter();
  const [creator, setCreator] = useState<User | null>(null);
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (sosId) {
      fetchSosDetails(sosId);
      fetchHelpers(sosId);
    }
    fetchCurrentUser();
  }, [sosId]);

  const fetchCurrentUser = async () => {
    try {
      const userProfile = await getUserProfile();
      if (userProfile.id) {
        setCurrentUserId(userProfile.id.toString());
      } else {
        console.error("❌ Ошибка: ID текущего пользователя отсутствует");
      }
    } catch (error) {
      console.error("Ошибка загрузки текущего пользователя:", error);
    }
  };

  const fetchSosDetails = async (sosId: string) => {
    try {
      const response = await getSosSignalById(sosId);
      console.log("✅ Данные создателя SOS:", response.data.user);

      let userData = response.data.user?.user || response.data.user;

      if (!userData) {
        console.error("❌ Ошибка: Данные пользователя отсутствуют");
        return;
      }

      const creatorId = userData.id || userData._id; // Поддержка разных форматов ID
      if (creatorId && userData.firstName && userData.lastName && userData.username) {
        setCreator({
          _id: creatorId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username,
          profileImage: userData.profileImage || '',
        });
      } else {
        console.error("❌ Ошибка структуры данных пользователя:", userData);
      }
    } catch (error) {
      console.error("❌ Ошибка загрузки SOS-сигнала:", error);
    }
  };

  const fetchHelpers = async (sosId: string) => {
    try {
      const response = await getSosHelpers(sosId);
      setHelpers(response.data || []);
    } catch (error) {
      console.error("❌ Ошибка загрузки помощников:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    if (sosId) {
      router.push({
        pathname: "/sos-signal/[id]",
        params: { id: sosId },
      });
    }
  };

  const handleProfilePress = (userId: string | undefined) => {
    if (!userId) {
      console.error("❌ Ошибка: userId отсутствует при переходе на профиль");
      return;
    }

    console.log("📡 Переход на профиль пользователя с ID:", userId);

    if (userId === currentUserId) {
      router.push("/home");
    } else {
      router.push({ pathname: "/profile/[userId]", params: { userId } });
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#F22C2C" />;
  }

  return (
    <View style={styles.container}>
  <View style={styles.contentContainer}>
    {/* Контейнер для хэдера */}
    <View style={styles.headerContainer}>
      {/* Левый контейнер для кнопки назад */}
      <View style={styles.leftHeaderContainer}>
        <TouchableOpacity style={styles.backButton}>
          <IconBack fill='#000' onPress={handleGoBack}/>
        </TouchableOpacity>
      </View>

      {/* Центральный контейнер для заголовка */}
      <View style={styles.centerHeaderContainer}>
        <Text style={styles.title}>{`(${helpers.length}) Участники`}</Text>
      </View>

      {/* Правый контейнер для иконки чата */}
      <View style={styles.rightHeaderContainer}>
        <SosChatIcon />
      </View>
    </View>

    {/* Остальной контент */}
    <Text style={styles.labelTitle}>Создатель сигнала</Text>
    {creator && (
      <TouchableOpacity onPress={() => handleProfilePress(creator._id)}>
        <View style={styles.card}>
          <Image
            source={{
              uri: creator.profileImage
                ? `${IMAGE_URL}${creator.profileImage}`
                : 'https://via.placeholder.com/50',
            }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.label}>{creator.username}</Text>
            <Text style={styles.name}>{getFullName(creator)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )}
    <View style={styles.divider} />
    <Text style={styles.labelTitle}>Участники</Text>
    {helpers.length === 0 ? (
      <Text style={styles.noHelpersText}>Пока никто не откликнулся.</Text>
    ) : (
      <FlatList
        data={helpers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const user = item.user;
          if (!user || !user._id) {
            console.error("❌ Ошибка: Отсутствует user или его ID", user);
            return null;
          }

          return (
            <TouchableOpacity onPress={() => handleProfilePress(user._id)}>
              <View style={styles.card}>
                <Image
                  source={{
                    uri: user.profileImage
                      ? `${IMAGE_URL}${user.profileImage}`
                      : 'https://via.placeholder.com/50',
                  }}
                  style={styles.profileImage}
                />
                <View>
                  <Text style={styles.label}>{user.username}</Text>
                  <Text style={styles.name}>{getFullName(user)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
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

export default SosHelpersScreen;