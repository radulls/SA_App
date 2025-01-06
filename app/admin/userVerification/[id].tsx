import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Helper from '../../../components/Helper';
import VerificationReject from '../../../components/VerificationReject';

const VerificationScreen = () => {
  const { id } = useLocalSearchParams();
  console.log('verificated', id)
  const [user, setUser] = useState([]);
  const [isRejecting, setIsRejecting] = useState(false)
	useEffect(() => {
		const dbUser = Helper.get('users/get',{id}).catch(console.error).then(dbUser => {
			console.log('dbUser', dbUser);
			setUser(dbUser)
		})
		// setUser(dbUser) 
	}, []);

  const approve = async () => {
    console.log('approve')
    setUser({...user, status: 'active'})
    let res = await Helper.post('users/update', {
      id: user._id,
      data: {status: 'active'}
    })
  }
  const reject = async message => {
    console.log('reject', message)
    setUser({...user, status: 'verification_reject', verification_response: message})
    setIsRejecting(false)
    let res = await Helper.post('users/update', {
      id: user._id,
      data: {status: 'verification_reject', verification_response: message}
    })
  }
  return (
    <View style={styles.container}>
      {isRejecting && <View style={{zIndex: 999, position: 'absolute', bottom: 0, left: 0, width: '100%', minWidth: 380}}>
        <VerificationReject onCancel={e => {setIsRejecting(false)}} onReject={message => reject(message)}></VerificationReject>
        </View>}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.userNameContainer}>
            <Image
              resizeMode="contain"
              source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/32678be4679c6e10f7de86fa7a632578fa53e0c57f182ad5d7448b1777db44fe?placeholderIfAbsent=true&apiKey=f739d4c470a340468bd500c2bd45e954" }}
              style={styles.backIcon}
            />
            <View>
              <Text style={styles.screenTitle}>Верификация</Text>
            </View>
          </View>
          <Text style={styles.userName}>{ user.first_name } { user.last_name }</Text>
          <Text style={styles.userHandle}>@{ user.id_login }</Text>
          <View style={styles.locationContainer}>
            <View style={styles.locationIcon}>
              <Text style={styles.locationIconText}>sa</Text>
            </View>
            <Text style={styles.locationText}>{ user.city }</Text>
          </View>
        </View>
        <Image
          resizeMode="contain"
          source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/d9a25611923556924c4f051bfca88b8dbc9a8ba8b120ad04298b54ba81fef5ef?placeholderIfAbsent=true&apiKey=f739d4c470a340468bd500c2bd45e954" }}
          style={styles.userAvatar}
        />
      </View>
      <View style={styles.userRole}>
        <Text>
          Роль: <Text style={styles.boldText}>{ user.role == 'user' ? 'Пользователь':'Администратор' }</Text>
        </Text>
      </View>
      <View style={styles.userStatus}>
        <Text>
          Статус: <Text style={styles.boldText}>
          { user.status == 'active' ? 'Активен':'' }
          { user.status == 'verification_request' ? 'Подтверждение верификации':'' }
          { user.status == 'verification_reject' ? 'Отказ в верификации: ' + user.verification_response:'' }
          {/* Подтверждение верификации */}
            </Text>
        </Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.formContainer}>
        <Text style={styles.label}>Имя</Text>
        <View style={styles.input}>
          <Text>{ user.first_name }</Text>
        </View>
        <Text style={styles.label}>Фамилия</Text>
        <View style={styles.input}>
          <Text>{ user.last_name }</Text>
        </View>
        <View style={styles.documentContainer}>
          <View style={styles.documentSection}>
            <Text style={styles.label}>Паспорт</Text>
            <View style={styles.documentPlaceholder} />
          </View>
          <View style={styles.documentSection}>
            <Text style={styles.label}>Фото</Text>
            <View style={styles.documentPlaceholder} />
          </View>
        </View>
      </View>
      {user.status == 'verification_request' && <View style={styles.actionButtons}>
        <TouchableOpacity onPress={e => {setIsRejecting(true)}} style={styles.rejectButton}>
          <Text style={styles.rejectButtonText}>Отказать</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={approve} style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Подтвердить</Text>
        </TouchableOpacity>
      </View>}
      
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    flex: 1,
    padding: 16,
    paddingTop: 64
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  userInfo: {
    flex: 1,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backIcon: {
    width: 12,
    aspectRatio: 1,
    marginRight: 20,
  },
  screenTitle: {
    fontSize: 15,
    color: "rgba(0, 0, 0, 1)",
  },
  userName: {
    color: "rgba(0, 0, 0, 1)",
    fontSize: 18,
    marginBottom: 10,
  },
  userHandle: {
    color: "rgba(0, 0, 0, 1)",
    fontWeight: "500",
    marginBottom: 13,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    borderRadius: 4,
    backgroundColor: "rgba(0, 0, 0, 1)",
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 3,
  },
  locationIconText: {
    color: "rgba(255, 255, 255, 1)",
    fontSize: 12,
  },
  locationText: {
    color: "rgba(0, 0, 0, 1)",
  },
  userAvatar: {
    width: 68,
    aspectRatio: 1,
    borderRadius: 34,
  },
  userRole: {
    marginBottom: 16,
  },
  userStatus: {
    marginBottom: 26,
  },
  boldText: {
    fontWeight: "500",
    fontSize: 12,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(236, 236, 236, 1)",
    marginBottom: 23,
  },
  formContainer: {
    marginBottom: 132,
  },
  label: {
    color: "rgba(0, 0, 0, 1)",
    marginBottom: 12,
  },
  input: {
    borderRadius: 12,
    backgroundColor: "rgba(243, 243, 243, 1)",
    padding: 18,
    marginBottom: 18,
  },
  documentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  documentSection: {
    flex: 1,
    marginRight: 14,
  },
  documentPlaceholder: {
    borderRadius: 10,
    backgroundColor: "rgba(243, 243, 243, 1)",
    height: 184,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rejectButton: {
    padding: 17,
  },
  rejectButtonText: {
    color: "rgba(0, 0, 0, 1)",
    fontSize: 12,
  },
  confirmButton: {
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 1)",
    padding: 17,
  },
  confirmButtonText: {
    color: "rgba(255, 255, 255, 1)",
    fontSize: 12,
  },
});

export default VerificationScreen;