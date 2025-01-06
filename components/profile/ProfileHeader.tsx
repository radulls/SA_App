import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { UserDataProps } from '../TestData/testdata';

interface UserProps {
  user: UserDataProps | null;
}

const ProfileHeader: React.FC<UserProps> = ({ user }) => {
  // Проверяем, что `user` не null
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Данные пользователя не загружены</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>
            {user.first_name}
            {user.last_name}
          </Text>
          <Text style={styles.username}>@{user.id_login}</Text>
          <View style={styles.locationContainer}>
            <View style={styles.locationIcon}>
              <Text style={styles.locationIconText}>sa</Text>
            </View>
            <Text style={styles.locationText}>{user.city}</Text>
          </View>
        </View>
        <View style={styles.imageContainer}>
          <Image
            resizeMode="contain"
            source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/215e864e9ff79bab2be218f930df30061764f9fedd439706cd5d1785045d38cb?placeholderIfAbsent=true&apiKey=f739d4c470a340468bd500c2bd45e954" }}
            style={styles.profileImage}
            accessibilityLabel="Profile picture of Катя Котова"
          />
        </View>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
        {user.intro}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    paddingLeft: 16,
    paddingRight: 16,
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  label: {
    fontSize: 12,
    color: "rgba(153, 153, 153, 1)",
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "flex-start",
  },
  nameContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginRight: 10,
    flex: 1,
  },
  name: {
    // fontFamily: "SFUIDisplay-Bold",
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    flexWrap: "wrap",
  },
  username: {
    // fontFamily: "SFUIDisplay-medium",
    fontSize: 14,
    color: "#000000",
    fontWeight: "medium",
    marginTop: 2,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
  },
  locationIcon: {
    backgroundColor: "#000000",
    borderRadius: 4,
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  locationIconText: {
    // fontFamily: "SFUIDisplay-Bold",
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 2,
  },
  locationText: {
    // fontFamily: "SFUIDisplay-Bold",
    marginLeft: 3,
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 2,
  },
  imageContainer: {
    flexShrink: 0,
    height: 68,
  },
  profileImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#D2D2D2",
  },
  descriptionContainer: {
    marginTop: 12,
    width: "100%",
  },
  description: {
    // fontFamily: "SFUIDisplay-regular",
    fontSize: 14,
    color: "#000000",
    width: "100%",
    fontWeight: "regular",
  },
});

export default ProfileHeader;
