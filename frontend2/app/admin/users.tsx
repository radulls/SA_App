import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import PendingParticipants from '@/components/admin/participants/PendingParticipants';
import VerifiedParticipants from '@/components/admin/participants/VerifiedParticipants';

interface ParticipantListProps {
  members: string[];
  cityId: string;
  pendingRequests: string[];
  onBack: () => void;
}

const ParticipantList: React.FC<ParticipantListProps> = ({ members, cityId, pendingRequests, onBack }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'verified'>('pending');

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <ScrollView style={styles.scrollView}>

        {/* Переключение вкладок */}
        <View style={styles.buttonRow}>
          <View style={styles.buttonRowItem}>
            <TouchableOpacity
              onPress={() => setActiveTab('verified')}
              style={[styles.typeButton, activeTab === 'verified' && styles.activeTypeButton]}
            >
              <Text style={[styles.buttonRowText, activeTab === 'verified' && styles.buttonRowTextSelected]}>
                Участники
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRowItem}>
            <TouchableOpacity
              onPress={() => setActiveTab('pending')}
              style={[styles.typeButton, activeTab === 'pending' && styles.activeTypeButton]}
            >
              <Text style={[styles.buttonRowText, activeTab === 'pending' && styles.buttonRowTextSelected]}>
                Завявки
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {activeTab === 'pending' ? (
            <PendingParticipants pendingRequests={pendingRequests} cityId={cityId} />
          ) : (
            <VerifiedParticipants members={members} cityId={cityId} />
          )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    overflowX:'visible',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 55,
    paddingBottom: 25,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 15,
    color: '#000',
  },
  menuIconPlaceholder: {
    width: 22,
    height: 22,
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

export default ParticipantList;
