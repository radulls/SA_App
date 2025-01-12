import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, Pressable, ScrollView, Dimensions } from 'react-native';

const ProfileQRCard = () => {
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(Dimensions.get('window').width);
    };

    const subscription = Dimensions.addEventListener('change', updateScreenWidth);

    return () => {
      subscription?.remove();
    };
  }, []);

  const shareOptions = [
    { icon: '2', text: 'Копировать ссылку' },
    { icon: '1', text: 'Поделиться через…' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.headerIcons}>
          <Image
            resizeMode="contain"
            source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/79908b091650bce0fbdeedac444a9417ae5c46510712ac9d9abedd2132d02e2f?placeholderIfAbsent=true&apiKey=f739d4c470a340468bd500c2bd45e954' }}
            style={styles.backIcon}
          />
          <Image
            resizeMode="contain"
            source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/0a13e0ad52753d545b099d0e0accb1ac1c6a1dde7d4b6ad6e8f0bc8f72a39188?placeholderIfAbsent=true&apiKey=f739d4c470a340468bd500c2bd45e954' }}
            style={styles.menuIcon}
          />
        </View>

        <View style={styles.header}>
          <Image
            resizeMode="contain"
            source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/c8dff49fff808a8a87287d07a0be9c8a10985ea044f6a4f7440c033c6fccb14f?placeholderIfAbsent=true&apiKey=f739d4c470a340468bd500c2bd45e954' }}
            style={styles.profilePicture}
          />
          <Text style={styles.userName}>Екатерина Котова</Text>
          <View style={styles.userInfoContainer}>
            <View style={styles.userInfoBadge}>
              <Text style={styles.userInfoBadgeText}>sa</Text>
            </View>
            <Text style={styles.userLocation}>Воронеж</Text>
          </View>
          <View style={styles.qrCodeContainer}>
            <Image
              resizeMode="contain"
              source={require('../assets/images/qr.png')}
              style={styles.qrCode}
            />
          </View>
        </View>

        <View style={styles.shareOptionsContainer}>
          {shareOptions.map((option, index) => (
            <Pressable key={index} style={styles.shareOption}>
              <Image
                resizeMode="contain"
                source={{ uri: option.icon }}
                style={styles.shareIcon}
              />
              <Text style={styles.shareText}>{option.text}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 24,
    backgroundColor: 'rgba(255, 210, 0, 1)', 
  },
  container: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  headerIcons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 22,
    marginTop: 55,
    width: '100%',
  },
  backIcon: {
    width: 8,
    aspectRatio: 0.57,
  },
  menuIcon: {
    width: 22,
    aspectRatio: 1,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 40,
    marginTop: 76,
    width: '100%',
  },
  profilePicture: {
    width: 68,
    aspectRatio: 1,
    alignSelf: 'flex-start',
  },
  userName: {
    color: 'rgba(255, 255, 255, 1)',
    marginTop: 10,
    fontSize: 18,
    fontWeight: '700',
    alignSelf: 'flex-start',
  },
  userInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  userInfoBadge: {
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoBadgeText: {
    color: 'rgba(0, 0, 0, 1)',
    // fontFamily: "SFUIDisplay-Bold",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 2,
  },
  userLocation: {
    color: 'rgba(255, 255, 255, 1)',
    // fontFamily: "SFUIDisplay-Bold",
    marginLeft: 3,
    fontSize: 14,
    marginBottom: 2,
  },
  qrCodeContainer: {
    borderRadius: 20,
    backgroundColor: "rgba(246, 246, 246, 1)",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.15)",
    alignSelf: "center",
    marginTop: 24,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
    width: "100%",
    paddingHorizontal: 42,
  },
  
  qrCode: {
    width: '100%', 
    height: '100%', 
  },
  shareOptionsContainer: {
    alignSelf: 'center',
    display: 'flex',
    marginTop: 25,
    marginBottom: 65,
    width: '100%',
    maxWidth: 304,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: 75,
  },
  shareOption: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  shareIcon: {
    width: 22,
    aspectRatio: 1,
  },
  shareText: {
    marginTop: 8,
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ProfileQRCard;