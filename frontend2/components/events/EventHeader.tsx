import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import IconBack from '@/components/svgConvertedIcons/iconBack';
import MoreOptionsIcon from '@/components/svgConvertedIcons/MoreOptionsIcon';
import EventParticipantsIcon from '@/components/svgConvertedIcons/sosIcons/sosHelpersIcon';
import { getEventParticipants } from '@/api/eventApi';
import HelperEventMenu from './HelperEventMenu';

interface EventHeaderProps {
  eventId: string;
  onBack: () => void;
  mode: 'owner' | 'options';
  onEdit?: () => void;
  onDelete?: () => void;
  onPin?: () => void;
}


const EventHeader: React.FC<EventHeaderProps> = ({ eventId, onBack, mode, onEdit, onDelete, onPin }) => {
  const [participantCount, setParticipantCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchParticipants();
  }, [eventId]);

  const fetchParticipants = async () => {
    try {
      const response = await getEventParticipants(eventId);
      setParticipantCount(response.length);
    } catch (error) {
      console.error("❌ Ошибка загрузки участников:", error);
    }
  };

  const navigateToParticipants = () => {
    router.push({
      pathname: '/event-participants',
      params: { eventId },
    });
  };

  return (
    <View style={styles.topItems}>
      <View style={styles.leftContainer}>
        <TouchableOpacity style={styles.closeIcon} onPress={onBack}>
          <IconBack fill="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}></View>

      <View style={styles.rightContainer}>
        <View style={styles.options}>
          <View style={styles.helpers}>
            <TouchableOpacity style={styles.closeIcon} onPress={navigateToParticipants}>
              <EventParticipantsIcon fill="#fff"/>
            </TouchableOpacity>
            {participantCount > 0 && <Text style={styles.participantsCount}>{participantCount}</Text>}
          </View>

          <TouchableOpacity style={[styles.closeIcon, styles.moreOptions]} onPress={() => setIsModalVisible(true)}>
            <MoreOptionsIcon fill="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <HelperEventMenu
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        eventId={eventId}
        mode={mode}
        onEdit={onEdit}
        onDelete={onDelete}
        onPin={onPin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  topItems: {
    paddingHorizontal: 16,
    paddingTop: 55,
    paddingBottom: 56,
    width: '100%',
    maxWidth: 600,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute'
  },
  leftContainer: {
    width: 110,
    justifyContent: 'center',
  },
  closeIcon: {
    zIndex: 20,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContainer: {
    width: 110,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  options: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantsCount: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'SFUIDisplay-bold',
    paddingLeft: 6,
  },
  helpers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreOptions: {
    marginLeft: 20,
  },
});

export default EventHeader;
