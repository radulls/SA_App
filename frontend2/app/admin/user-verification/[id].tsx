import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator,  TouchableOpacity, Animated, PanResponder, Keyboard, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { UserDataProps, IMAGE_URL } from '@/api';
import { UserMatchResult, getUserMatches, getUserVerificationData, updateUserVerificationStatus } from '@/api/adminApi';
import Header from '@/components/common/Header';
import AdminProfileHeader from '@/components/admin/control/AdminProfileHeader';
import AdminUserInfo from '@/components/admin/control/AdminUserInfo';
import CustomModal from '@/components/admin/CustomModal';
import IconArrowSettings from '@/components/svgConvertedIcons/IconArrowSettings';


const UserVerification = () => {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<UserDataProps | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState<boolean>(true);
  const [decisionModalVisible, setDecisionModalVisible] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<'paymant' | 'rejected' | 'blocked' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const translateY = useRef(new Animated.Value(300)).current;
  const [selectedReason, setSelectedReason] = useState<'paymant' | 'rejected' | 'blocked' | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false); // Отслеживаем фокус инпута
  const router = useRouter();
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [matches, setMatches] = useState<UserMatchResult | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserVerificationData(id as string);
        setUser(userData);
    
        // Загружаем совпадения, если верификация активна
        const matchData = await getUserMatches(id as string);
        setMatches(matchData);
    
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [id]);

  const handleDecision = async () => {
    if (!selectedDecision) return;
    try {
      await updateUserVerificationStatus(id as string, selectedDecision, rejectionReason);
      setUser((prev) => prev ? { ...prev, verificationStatus: selectedDecision } : null);
      closeModal();
    } catch (error) {
      console.error('Ошибка при изменении статуса:', error);
    }
  };

  const onClose = () => {
    router.replace('/settings'); // или router.replace('/admin') — как тебе нужно
  };

  const openModal = () => {
    setDecisionModalVisible(true);
    Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: false }).start();
  };

  const closeModal = () => {
    Keyboard.dismiss(); // Закрываем клавиатуру перед анимацией
    Animated.timing(translateY, { toValue: 300, duration: 300, useNativeDriver: false }).start(() => {
      setDecisionModalVisible(false);
      setSelectedDecision(null);
      setRejectionReason('');
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isInputFocused, // НЕ реагируем, если фокус в инпуте
      onMoveShouldSetPanResponder: () => !isInputFocused,
      onPanResponderMove: (_, gestureState) => {
        if (!isInputFocused && gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (!isInputFocused) {
          if (gestureState.dy > 100) {
            closeModal();
          } else {
            Animated.timing(translateY, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start();
          }
        }
      },
    })
  ).current;
  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={styles.loader} />;
  }

  if (!user) {
    return <Text style={styles.errorText}>Пользователь не найден</Text>;
  }
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
      <Header title="Управление" onLeftPress={onClose} leftType="close" />
      <AdminProfileHeader user={user} />
      <AdminUserInfo user={user} visibleFields={['phone', 'email']} />
        <View style={styles.photoContainer}>
          {user.passportPhoto && (
            <View style={styles.imageContainer}>
              <Text style={styles.contactsLabel}>Паспорт</Text>
              <Image source={{ uri: `${IMAGE_URL}${user.passportPhoto}` }} style={styles.image} />
            </View>
          )}
  
          {user.selfiePhoto && (
            <View style={styles.imageContainer}>
              <Text style={styles.contactsLabel}>Фото</Text>
              <Image source={{ uri: `${IMAGE_URL}${user.selfiePhoto}` }} style={styles.image} />
            </View>
          )}
        </View>
        {matches && matches.totalMatches > 0 && (
          <View style={styles.matchesButtonContainer}>
            <TouchableOpacity
              style={styles.matchesButton}
              onPress={() => {
                if (user?._id) {
                  router.push({
                    pathname: '/admin/user-matches/[id]',
                    params: { id: user._id },
                  });
                }
              }}
            >
              <Text style={styles.matchesButtonText}>
                Найдено совпадений 
              </Text>
              <View style={styles.matches}>
                <Text style={[styles.matchesButtonText, styles.numbers]}>
                  {matches.totalMatches}
                </Text>              
                <IconArrowSettings fill='#F00'/>
              </View>
              
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
  
      {/* Кнопка решения */}
      <View style={styles.ContinueButton}>
        <TouchableOpacity style={styles.button} onPress={openModal}>
          <Text style={styles.buttonText}>
            {decisionModalVisible ? 'Применить' : 'Решение'}
          </Text>
        </TouchableOpacity>
      </View>

      <CustomModal
        visible={decisionModalVisible}
        onClose={closeModal}
        title="Выбери решение"
        selectOptions={[
          { label: 'Подтвердить', value: 'paymant' },
          { label: 'Отказать', value: 'rejected' },
          { label: 'Заблокировать', value: 'blocked' },
        ]}
        selectedOption={selectedReason}
        onSelectOption={(value) => {
          setSelectedReason(value as 'paymant' | 'rejected' | 'blocked');
        }}
        buttons={[
          {
            label: 'Применить',
            action: () => {
              if (selectedReason === 'rejected') {
                setSelectedDecision('rejected');
                setDecisionModalVisible(false);
                setTimeout(() => setShowRejectionModal(true), 300); // плавный переход
              } else if (selectedReason) {
                setSelectedDecision(selectedReason);
                handleDecision();
              }
            }
          }
        ]}
      />

      <CustomModal
        visible={selectedDecision === 'rejected' && showRejectionModal}
        onClose={() => {
          setShowRejectionModal(false);
          setSelectedDecision(null);
          setRejectionReason('');
        }}
        title="Отказ верификации аккаунта"
        input={{
          placeholder: 'Комментарий',
          value: rejectionReason,
          onChange: setRejectionReason,
          isLarge: true,
        }}
        buttons={[
          {
            label: 'Отмена',
            type: 'danger',
            action: () => {
              setShowRejectionModal(false);
              setSelectedDecision(null);
              setRejectionReason('');
            },
          },
          {
            label: 'Отказать',
            type: 'delete',
            action: handleDecision,
          }
        ]}
      />

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
    overflowY:'visible',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  userInfo: {
    marginBottom: 20,
  },
  name:{
    fontSize: 18,
    fontWeight: '700'
  },
  username:{
    fontSize: 14,
    fontWeight: '500',
    paddingTop: 5,
    paddingBottom: 10,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    backgroundColor: '#000',
    borderRadius: 4,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  locationIconText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  userLocation: {
    color: 'rgba(255, 255, 255, 1)',
    marginLeft: 3,
    fontSize: 14,
    fontWeight: '700',
  },
  roleStatusContainer:{
    paddingVertical: 22,
    borderBottomColor: '#ECECEC',
    borderBottomWidth: 0.5,
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    paddingRight: 4,
  },
  value: {
    fontSize: 12,
    fontWeight: '500',
  },
  contactsContainer:{
    paddingVertical: 26,
    gap: 26,
  },
  contactsItem:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactsLabel:{
    fontSize: 12,
    fontWeight: '700',
  },
  photoContainer:{
    flexDirection: 'row',
    gap: 14,
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: '100%', 
    height: undefined,
    aspectRatio: 1, 
    borderRadius: 8,
    resizeMode: 'cover', 
    marginTop: 7,
  },
  loader: {
    marginTop: 50,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 50,
  },
  ContinueButton: {
    paddingBottom: 40,
    width: '100%',
    maxWidth: 600,
    paddingHorizontal: 16
  },
  buttonContainer:{
    width: '100%',
    paddingTop: 33,
    paddingBottom: 40,
  },
  button: {
    borderRadius: 8,
    backgroundColor: '#000',
    paddingVertical: 14.5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContainer: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 20,
    alignItems: 'center' 
  },
  modalTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 10,
    marginTop: 23,
  },
  modalButton: { 
    paddingVertical: 12, 
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between' 
  },
  selectedButton: { 
   
  },
  modalButtonText: { 
    fontSize: 12,
    fontWeight: '700' 
  },
  input: { 
    borderRadius: 12, 
    backgroundColor: '#F3F3F3',
    height: 100,
    padding: 10, 
    marginTop: 10,
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }), 
  },
  touchableOverlay: { 
    flex: 1, 
    justifyContent: 'flex-end', 
    alignSelf: 'center', 
    width: '100%', 
    maxWidth: 600 
  },
  dragHandle: { 
    width: 36, 
    height: 4, 
    backgroundColor: '#DADBDA',
    borderRadius: 3,
  },
  modalActions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 15 
  },
  rejectActions:{
    flexDirection: 'row', 
    alignItems: 'center',
  },
  cancelButton: { 
    padding: 10,
    flex: 1, 
  },
  cancelButtonText: { 
    color: 'red',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    paddingVertical: 18, 
  },
  confirmButton: { 
    padding: 10,
    flex: 1,  
  },
  confirmButtonText: { 
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    paddingVertical: 18,
    backgroundColor: '#F00',
    borderRadius: 8, 
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E7E7E7',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle:{
    borderColor: '#000',
    borderWidth: 7,
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  rejectMenu: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },  
  rejectTitleContainer:{
    alignItems: 'center'
  },
  modalTitleReject:{
    fontSize: 15,
    fontWeight: '700',
    paddingTop: 20,
    paddingBottom: 26,
  },
  matchesButtonContainer: {
    marginTop: 16,
    marginBottom: 10,
    width: '100%',
    maxWidth: 600,
    paddingHorizontal: 16,
  },
  matchesButton: {
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  matchesButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F00',
  },
  numbers:{
    fontWeight: '500',
  },
  matches:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  }
  
});

export default UserVerification;
