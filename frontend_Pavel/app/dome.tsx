import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';
import Post from '../components/profile/Post';
import BottomNavigation from '../components/BottomNavigation';
import NavigationButtons from '../components/NavigationButtons';
import ButtonGray from '../components/ButtonGray';
import SosShortNoty from '../components/SosShortNoty';
import { mockUser } from '@/components/TestData/testdata';

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState(mockUser); // Сразу инициализируем с тестовыми данными

  return (
    <View style={styles.container}>
      {user.status === 'verification_request' && (
        <View style={styles.verificationContainer}>
          {/* Компонент для обработки верификации */}
        </View>
      )}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentContainer}>
          <View style={styles.locationContainer}>
            <View style={styles.locationContainerItem}>
              <View style={styles.locationIcon}>
                <Text style={styles.locationIconText}>sa</Text>
              </View>
              <Text style={styles.locationText}>{user.city}</Text>
            </View>            
          </View>
          <View style={styles.line}/>
          <NavigationButtons />
          <ProfileHeader user={user} />
          {/* <ProfileStats user={user} /> */}
          <Text style={{ padding: 16 }}>
            Официальная страница Бьюти салона Светланы Чигриной SA в {user.city}
          </Text>
          <View style={styles.divider} />
          <ButtonGray />
          <SosShortNoty />
					<View style={styles.postsContainer}>
						<Post postType="image" />
						<Post postType="video" />
					</View>       
        </View>
      </ScrollView>
      <BottomNavigation />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    flex: 1,
  },
  verificationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    zIndex: 999999,
  },
  scrollViewContent: {
    alignItems: 'center',
    width: '100%',
		paddingTop: 49,
    paddingBottom: 86,
  },
	postsContainer: {
		alignItems: 'center',
	},	
  contentContainer: {
    maxWidth: 600,
    width: '100%',
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
    marginLeft: 16,
  },
  locationContainerItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,  // Ширина нижней границы
    borderBottomColor: '#000',  // Цвет нижней границы
    borderStyle: 'solid', 
    paddingBottom: 8
  },
  locationIcon: {
    backgroundColor: "#000000",
    borderRadius: 4,
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  locationText: {
    marginLeft: 3,
  },  
  locationIconText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 2,
  },
  line: {
    height: 1,
    backgroundColor: '#ECECEC'
  },
  divider: {
    backgroundColor: "rgba(236, 236, 236, 1)",
    minHeight: 0.5,
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
  },
});

export default ProfileScreen;
