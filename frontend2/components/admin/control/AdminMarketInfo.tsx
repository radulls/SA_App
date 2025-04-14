import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { updateMarketVerificationStatus } from '@/api/marketApi';
import { styles } from './AdminControlStyles';
import CustomModal from '../CustomModal';
import Toast from 'react-native-toast-message';
import { MarketDataProps } from '@/types/market';

interface Props {
  market: MarketDataProps | null;
  status?: string;
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Не указана';
  const date = new Date(dateString);
  return `${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

const AdminMarketInfo: React.FC<Props> = ({ market, status }) => {
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  if (!market) return null;

  const handleApprove = async () => {
    try {
      await updateMarketVerificationStatus(market._id || market.id, 'verified');
      Toast.show({
        type: 'success',
        text1: 'Маркет подтверждён',
      });
      // 👉 если нужно — перезагрузи данные тут
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Не удалось подтвердить маркет',
      });
    }
  };
  
  const handleReject = async () => {
    try {
      await updateMarketVerificationStatus(market._id || market.id, 'rejected', rejectionReason);
      Toast.show({
        type: 'success',
        text1: 'Маркет отклонён',
      });
      setRejectModalVisible(false);
      // 👉 если нужно — перезагрузи данные тут
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Не удалось отклонить маркет',
      });
    }
  };

  const isPending = market?.verificationStatus === 'pending';

  return (
    <View>
      <View style={styles.container}>
      {!isPending && (
        <>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Название:</Text>
          <Text style={styles.value}>{market.name || 'Не указано'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Номер ОГРН:</Text>
          <Text style={styles.value}>{market.ogrn || 'Не указан'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Ссылки:</Text>
          <Text style={styles.value}>
            {market.links?.length ? market.links.join(', ') : 'Нет данных'}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Лояльность:</Text>
          <Text style={styles.value}>{market.loyalty}%</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Исполнил сделок:</Text>
          <Text style={styles.value}>{market.completedDeals}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Дата регистрации:</Text>
          <Text style={styles.value}>{formatDate(market.createdAt)}</Text>
        </View>
        </>
        )}
      {isPending && (
        <>
          <View style={localStyles.infoItem}>
            <Text style={localStyles.label}>Номер ОГРН</Text>
            <TextInput
              style={localStyles.value}
              value={market.ogrn || 'Не указан'}
              editable={false}
            />
          </View>
          <View style={localStyles.infoItem}>
            <Text style={localStyles.label}>Название</Text>
            <TextInput
              style={localStyles.value}
              value={market.name || 'Не указано'}
              editable={false}
            />
          </View>
          <View style={localStyles.infoItem}>
            <Text style={localStyles.label}>Ссылки</Text>
            <TextInput
              style={localStyles.value}
              value={market.links?.length ? market.links.join(', ') : 'Нет данных'}
              editable={false}
            />
          </View>
        </>
      )}
      {isPending && (
        <View style={localStyles.buttonContainer}>
          <TouchableOpacity style={[localStyles.button ,localStyles.rejectButton]} onPress={() => setRejectModalVisible(true)}>
            <Text style={localStyles.rejectButtonText}>Отказать</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[localStyles.button ,localStyles.approveButton]} onPress={handleApprove}>
            <Text style={localStyles.approveButtonText}>Подтвердить</Text>
          </TouchableOpacity>
        </View>
      )}
      </View>

      {/* Модалка причины отказа */}
      <CustomModal
        visible={rejectModalVisible}
        onClose={() => setRejectModalVisible(false)}
        title="Причина отказа"
        input={{
          placeholder: 'Укажите причину',
          value: rejectionReason,
          onChange: setRejectionReason,
          isLarge: true,
        }}
        buttons={[
          { label: 'Отмена', action: () => setRejectModalVisible(false), type: 'danger' },
          { label: 'Отказать', action: handleReject, type: 'delete' },
        ]}
      />
    </View>
  );
};

export default AdminMarketInfo;

const localStyles = StyleSheet.create({
  buttonContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingTop: 40,
  },
  button:{
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center',
    width: 124,
    height: 44,
  },
  rejectButton:{

  },
  rejectButtonText:{  
    fontSize: 12,
    fontWeight: '700',
    color: '#000'
  },
  approveButton:{
    backgroundColor: '#000'
  },
  approveButtonText:{
    fontSize: 12,
    fontWeight: '700',
    color: '#fff'
  },
  infoItem:{
  },
  label:{
    fontSize: 14,
    fontWeight: '700',
    paddingBottom: 8,
  },
  value:{
    backgroundColor: '#f3f3f3',
    height: 48,
    width: '100%',
    borderRadius: 12,
    paddingHorizontal: 16,
  }
})