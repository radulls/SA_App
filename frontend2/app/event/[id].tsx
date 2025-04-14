import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { getEventById, toggleParticipationEvent } from '@/api/eventApi';
import { EventData, toggleLikeEvent } from '@/api/eventApi';
import { POST_IMAGE_URL } from '@/api/postApi';
import PhotoCarousel from '@/components/PhotoCarousel/PhotoCarousel';
import SosMapView from '@/components/sos/ViewMap/SosMapView';
import { differenceInCalendarDays } from 'date-fns';
import EventDateIcon from '@/components/svgConvertedIcons/EventsIcons/eventDateIcon';
import EventPlaceIcon from '@/components/svgConvertedIcons/EventsIcons/eventPlaceIcon';
import BaseIcon from '@/components/svgConvertedIcons/settings/baseIcon';
import { IMAGE_URL, getUserProfile } from '@/api';
import LikeIcon from '@/components/svgConvertedIcons/Posts/likeIcon';
import CommentIcon from '@/components/svgConvertedIcons/Posts/commentIcon';
import RepostIcon from '@/components/svgConvertedIcons/Posts/repostIcon';
import Toast from 'react-native-toast-message';
import EventCommentsBottomSheet from '@/components/events/EventCommentsBottomSheet';
import { getCommentsByEvent } from '@/api/eventComment';
import EventHeader from '@/components/events/EventHeader';

const EventDetailsPage = () => {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<EventData | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const formatDateTime = (value?: string) => {
    return value ? value.slice(0, 16).replace('T', ', ') : '–';
  };
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isLongDescription, setIsLongDescription] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isParticipating, setIsParticipating] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);
  
  const daysUntilStart = useMemo(() => {
    if (!event?.startDateTime) return null;
    const now = new Date();
    const start = new Date(event.startDateTime);
    const diff = differenceInCalendarDays(start, now);
  
    if (diff < 0) return 'Мероприятие уже началось';
    if (diff === 0) return 'Мероприятие уже сегодня';
    if (diff === 1) return 'Завтра';
    return `Через ${diff} ${diff === 1 ? 'день' : diff < 5 ? 'дня' : 'дней'}`;
  }, [event?.startDateTime]);
  
  useEffect(() => {
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
    fetchCurrentUser();
  }, []);
  
  useEffect(() => {
    if (typeof id !== 'string') return;

    const fetchEvent = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data);
      } catch (err) {
        console.error('❌ Ошибка при получении события:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (!event?._id) return;
  
    const fetchComments = async () => {
      try {
        const comments = await getCommentsByEvent(event._id); // 👈 реализуй, если нет
        setCommentsCount(comments.length);
      } catch (error) {
        console.error('Ошибка загрузки комментариев:', error);
      }
    };
  
    fetchComments();
  }, [event?._id]);

  useEffect(() => {
    if (!event || !currentUserId) return;
    setIsLiked(event.likes?.includes(currentUserId));
    setLikesCount(event.likes?.length || 0);
  }, [event, currentUserId]);
  
  useEffect(() => {
    if (!event || !currentUserId) return;
    setIsParticipating(!!event.participants?.includes(currentUserId));
    setParticipantsCount(event.participants?.length || 0);
  }, [event, currentUserId]);
  

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size='large' />;
  }

  if (!event) {
    return (
      <View style={styles.centered}>
        <Text>Мероприятие не найдено</Text>
      </View>
    );
  }

  const handlePartnerPress = (partner: any) => {
    if (!partner || !partner._id) {
      console.error('❌ Ошибка: отсутствует ID партнёра');
      return;
    }
  
    const isUser = 'username' in partner;
  
    if (isUser) {
      // переход в профиль пользователя
      if (partner._id === currentUserId) {
        router.push('/home');
      } else {
        router.push({ pathname: '/profile/[userId]', params: { userId: partner._id } });
      }
    } else {
      // переход в профиль маркета
      router.push({ pathname: '/market/[marketId]', params: { marketId: partner._id } });
    }
  };

  const handleLike = async () => {
    if (!event || !currentUserId) return;
  
    try {
      const res = await toggleLikeEvent(event._id);
  
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
  
      setLikesCount(prev =>
        newIsLiked ? prev + 1 : Math.max(0, prev - 1)
      );
  
      Toast.show({ type: 'success', text1: res.message, position: 'bottom' });
    } catch (err) {
      console.error("Ошибка лайка:", err);
      Toast.show({ type: 'error', text1: 'Не удалось поставить лайк', position: 'bottom' });
    }
  };

  const handleParticipation = async () => {
    if (!event) return;
  
    try {
      const res = await toggleParticipationEvent(event._id);
      const newIsParticipating = !isParticipating;
  
      setIsParticipating(newIsParticipating);
      setParticipantsCount(prev =>
        newIsParticipating ? prev + 1 : Math.max(0, prev - 1)
      );
  
      Toast.show({ type: 'success', text1: res.message, position: 'bottom' });
    } catch (err) {
      console.error("Ошибка участия:", err);
      Toast.show({ type: 'error', text1: 'Не удалось изменить участие', position: 'bottom' });
    }
  };
  
  

  const cityName =
  event.from === 'subdivision'
    ? event.subdivision?.city || 'Город не указан'
    : event.user?.city || 'Город не указан';

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.wrapper}>
      <View style={styles.coverWrapper}>
        <Image
          source={{ uri: `${POST_IMAGE_URL}${event.cover}` }}
          style={styles.coverImage}
        />
        <EventHeader eventId={event._id} onBack={() => router.back()} />
      </View>

        {/* Блок с инфой на жёлтом фоне */}
        <View style={styles.infoCardContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.city}><BaseIcon/> {cityName}</Text>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>{event.isFree ? 'Бесплатно' : `${event.price} ₽`}</Text>
            </View>
            <View style={styles.dateContainer}>
              <EventDateIcon/>
              <View>
                <Text style={styles.label}>Срок</Text>
                <Text style={styles.text}>
                  {formatDateTime(event.startDateTime)} — {formatDateTime(event.endDateTime)}
                </Text>
                {daysUntilStart && (
              <Text style={[styles.text, { fontWeight: '700', fontSize: 12, margin: 0}]}>
                {daysUntilStart}
              </Text>
            )}
              </View>
            </View>
            <View style={styles.placeContainer}>
              <EventPlaceIcon/>
              <View>
                <Text style={styles.label}>Локация</Text>
                <Text style={[styles.text, { marginBottom: 0}]}>{event.isOnline ? 'Онлайн' : event.location?.address}</Text>
                {!event.isOnline && event.location?.latitude && event.location?.longitude && (
                <TouchableOpacity onPress={() => {
                  if (event.location) {
                    router.push(
                      `/event/${event._id}/map?lat=${event.location.latitude}&lng=${event.location.longitude}&address=${encodeURIComponent(event.location.address)}`
                    );
                  }                                          
                }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#000', marginTop: 4 }}>
                    Показать на карте
                  </Text>
                </TouchableOpacity>
              )}
              </View>
          
            </View>

          </View>
        </View>
       
        {/* Карта */}
        {event.location?.address && event.location.latitude && event.location.longitude && (
          <View style={styles.locationBlock}>
            <View style={styles.mapWrapper}>
              <View style={styles.mapContainer}>
                <SosMapView location={{ latitude: event.location.latitude, longitude: event.location.longitude }} customIcon="eventGeotag"/>
              </View>
            </View>
          </View>
        )}

  
        {/* Фото */}
        {event.photos?.length > 0 && (
          <PhotoCarousel photos={event.photos.map(photo => `${POST_IMAGE_URL}${photo}`)} />
        )}
  
        {/* Описание */}
        {event.description && (
          <View style={styles.descriptionBlock}>
            <Text style={styles.label}>Описание</Text>

            <View
              onLayout={(e) => {
                const { height } = e.nativeEvent.layout;
                const lineHeight = 20; // подгони под fontSize
                const linesCount = Math.round(height / lineHeight);
                if (linesCount > 4 && !isLongDescription) {
                  setIsLongDescription(true);
                }
              }}
            >
              <Text
                style={[styles.text, !showFullDescription && { height: 4 * 20, overflow: 'hidden' }]}
              >
                {event.description}
              </Text>
            </View>

            {isLongDescription && (
              <TouchableOpacity onPress={() => setShowFullDescription(prev => !prev)}>
                <Text style={{ color: '#000', fontWeight: '700', marginTop: 4 }}>
                  {showFullDescription ? 'Скрыть' : 'Читать полностью'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Партнёры */}
        {(event.partnersUsers?.length > 0 || event.partnersMarkets?.length > 0) && (
          <View style={styles.partnersBlock}>
            <Text style={styles.label}>Партнёры</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.partnersContainer}>
              {[...event.partnersUsers, ...event.partnersMarkets].map((partner: any) => {
                console.log('🧩 partner:', partner); 
                const isUser = 'username' in partner;
                const avatar = partner.profileImage || partner.avatar;
                const name = isUser
                  ? `${partner.firstName} ${partner.lastName}`
                  : partner.name;
                const subtitle = isUser ? `@${partner.username}` : partner._id;

                return (
                  <View key={partner._id} style={styles.partnerCardNew}>
                    {avatar && (
                      <Image
                        source={{ uri: `${IMAGE_URL}${avatar}` }}
                        style={styles.partnerAvatar}
                      />
                    )}
                    <Text
                      style={styles.partnerName}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {name}
                    </Text>
                    <Text
                      style={styles.partnerUsername}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {subtitle}
                    </Text>

                    <TouchableOpacity onPress={() => handlePartnerPress(partner)} style={styles.viewButton}>
                      <Text style={styles.viewButtonText}>Посмотреть</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
        <View style={styles.postFooter}>
          <View style={styles.actionsRow}>
            <TouchableOpacity onPress={handleLike}>
              <LikeIcon fill={isLiked ? '#F00' : '#000'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsCommentsVisible(true)}>
              <CommentIcon />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <RepostIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.countsRow}>
            <Text style={styles.countText}>Нравится: <Text style={styles.number}>{likesCount}</Text></Text>
            <Text style={styles.countText}>Ответов: <Text style={styles.number}>{commentsCount}</Text></Text>
				  </View>
        </View>
        {/* Кнопка */}
        <TouchableOpacity style={[styles.button, isParticipating ? styles.buttonParticipating : '']} onPress={handleParticipation}>
          <Text style={[styles.buttonText, isParticipating ? styles.buttonTextParticipating : '']}>
            {isParticipating ? 'Вы участник' : 'Принять участие'}
          </Text>
        </TouchableOpacity>


        <EventCommentsBottomSheet
          isVisible={isCommentsVisible}
          onClose={() => setIsCommentsVisible(false)}
          eventId={event._id}
          currentUserId={currentUserId || ''}
        />
      </View>
    </ScrollView>
  );
};  

const styles = StyleSheet.create({
  centered:{

  },
  page: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 40,
    position: 'relative'
  },
  wrapper: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#fff',
    position: 'relative'
  },
  coverWrapper: {
    position: 'relative',
    width: '100%',
    height: 250,
    marginBottom: -80, // сколько нужно перекрыть карточкой
  },
  coverImage: {
    width: '100%',
    height: 250,
    marginBottom: -80, // 👈 на сколько карточка залезает
  },  
  infoCardContainer: {
    paddingHorizontal: 16,
    marginTop: -10, // 👈 наезжает на картинку
    zIndex: 2,
  },  
  infoCard: {
    backgroundColor: '#F8FFD0',
    padding: 16,
    borderRadius: 16,
  },  
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  city: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 7,
  },
  priceTag: {
    marginTop: 20,
    backgroundColor: '#000',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  priceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  dateContainer:{
    flexDirection: 'row',
    gap: 14,
    marginTop: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  text: {
    fontSize: 14,
    marginVertical: 10,
    fontWeight: '400',
    color: '#000',
  },
  placeContainer:{
    flexDirection: 'row',
    gap: 14,
    marginTop: 20,
  },
  map: {
    width: '100%',
    height: 200,
    marginTop: 8,
  },
  descriptionBlock: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  partnersBlock: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  partnersContainer:{
    marginTop: 12,
  },
  partnerCard: {
    backgroundColor: '#eee',
    padding: 10,
    marginRight: 10,
    borderRadius: 8,
  },
  partnerType: {
    fontWeight: 'bold',
  },
  partnerId: {
    fontSize: 12,
    color: '#666',
  },
  button: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 40,
    marginHorizontal: 16,
  },
  buttonParticipating:{
    backgroundColor: '#F1F1F1',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonTextParticipating:{
    color: '#000',
  },
  locationBlock: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  mapWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 8,
  },
  mapContainer: {
    height: 150,
    width: '100%',
  },
  partnerCardNew: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 10,
    width: 150,
    height: 200,
  },
  partnerAvatar: {
    width: 90,
    height: 90,
    borderRadius: 36,
    backgroundColor: '#ccc',
  },
  partnerName: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    maxWidth: '100%',
  },
  partnerUsername: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    maxWidth: '100%',
  },
  viewButton: {
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  viewButtonText: {
    fontWeight: '700',
    fontSize: 12,
    color: '#000',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 15,
    alignItems: 'center',
  },
  postFooter: {
    marginVertical: 40,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
    alignItems: 'center'
  },
  countsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 10,
	},
	countText: {
		fontSize: 12,
		color: '#999',
		fontWeight: '400',
	},
	number:{
		fontWeight: '600'
	},
});


export default EventDetailsPage;
