import React from 'react';
import { View, StyleSheet, Image, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

const ParticipantItem = ({ user, username, fullName, rating }) => {
  return (
    <Pressable onPress={e => router.push('/admin/userVerification/'+ user._id)} style={styles.container}>
      <Image
        resizeMode="contain"
        source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/682e0b4cded19d19af2644869eb249cc3f891850e97d317d621bbf1836a50e3d?placeholderIfAbsent=true&apiKey=f739d4c470a340468bd500c2bd45e954" }}
        style={styles.avatar}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.username}>{user.id_login}</Text>
        <Text style={styles.fullName}>{user.first_name} {user.last_name}</Text>
        <Text style={styles.rating}>
          <Text style={styles.ratingLabel}>Рейтинг: </Text>
          <Text style={styles.ratingValue}>{user.rating}</Text>
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    marginBottom: 28,
    alignItems: "flex-start",
    flexDirection: "row",
  },
  avatar: {
    borderRadius: 19,
    width: 38,
    aspectRatio: 1,
    marginRight: 11,
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  username: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "SF UI Display, sans-serif",
  },
  fullName: {
    marginTop: 7,
    fontSize: 12,
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "SF UI Display, sans-serif",
  },
  rating: {
    marginTop: 15,
    fontSize: 12,
    fontFamily: "SF UI Display, sans-serif",
  },
  ratingLabel: {
    color: "rgba(153, 153, 153, 1)",
  },
  ratingValue: {
    fontWeight: "700",
    color: "rgba(0, 0, 0, 1)",
  },
});

export default ParticipantItem;