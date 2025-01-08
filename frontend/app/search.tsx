import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, ScrollView, TouchableOpacity } from 'react-native';
import ParticipantItem from '../components/ParticipantItem';
import Helper from '../components/Helper';
import { router } from 'expo-router';

const ParticipantList = () => {
  const [users, setUsers] = useState([]);
	useEffect(() => {
		const dbUser = Helper.get('users').catch(console.error).then(dbUsers => {
			console.log('dbUsers', dbUsers);
      dbUsers = dbUsers.filter(u => u.status == 'active')
			setUsers(dbUsers)
		})
		// setUser(dbUser) 
	}, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          resizeMode="contain"
          source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/1646d5036ca5573616a871e9171f0f1bc565b7b86fedd3682cfb80a1f4f3afe0?placeholderIfAbsent=true&apiKey=f739d4c470a340468bd500c2bd45e954" }}
          style={styles.backIcon}
        />
        <Text style={styles.headerTitle}>Поиск</Text>
        <Image
          resizeMode="contain"
          source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/98b40a73d7d7a9073b8e92330ed21da52b2dab34ee7555b406a03467dd094ba0?placeholderIfAbsent=true&apiKey=f739d4c470a340468bd500c2bd45e954" }}
          style={styles.menuIcon}
        />
      </View>
      <View style={styles.tabContainer}>
        <View style={styles.activeTab}>
          <Text style={styles.activeTabText}>Люди</Text>
        </View>
        <TouchableOpacity style={styles.inactiveTab}>
          <Text style={styles.inactiveTabText}>Посты</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabIndicator} />
      <View style={styles.divider} />
      <View style={styles.searchContainer}>
        <Image
          resizeMode="contain"
          source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/6264eba7a4fd6e43dd93d5f5121a378b1c6c1bc514b795d6e175bfc5fc82815a?placeholderIfAbsent=true&apiKey=f739d4c470a340468bd500c2bd45e954" }}
          style={styles.searchIcon}
        />
      </View>
      <ScrollView style={styles.participantList}>
        {users.map((participant, index) => (
          <ParticipantItem key={index} user={participant} />
        ))}
      </ScrollView>
      <View style={styles.bottomIndicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    display: "flex",
    maxWidth: 480,
    width: "100%",
    flexDirection: "column",
    overflow: "hidden",
    alignItems: "stretch",
    margin: "0 auto",
  },
  header: {
    alignSelf: "center",
    display: "flex",
    width: "100%",
    maxWidth: 382,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingTop: 55,
    paddingBottom: 25,
  },
  backIcon: {
    width: 8,
    aspectRatio: 0.57,
  },
  headerTitle: {
    color: "rgba(0, 0, 0, 1)",
    fontWeight: "700",
    fontSize: 15,
    //fontFamily: "SF UI Display, sans-serif",
  },
  menuIcon: {
    width: 22,
    aspectRatio: 1,
  },
  tabContainer: {
    alignSelf: "center",
    display: "flex",
    marginTop: 25,
    width: 262,
    maxWidth: "100%",
    alignItems: "stretch",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  activeTab: {
    color: "rgba(0, 0, 0, 1)",
  },
  activeTabText: {
    fontWeight: "700",
    fontSize: 12,
    //fontFamily: "SF UI Display, sans-serif",
  },
  inactiveTab: {
    color: "rgba(153, 153, 153, 1)",
  },
  inactiveTabText: {
    fontWeight: "700",
    fontSize: 12,
    //fontFamily: "SF UI Display, sans-serif",
  },
  tabIndicator: {
    borderRadius: 1,
    backgroundColor: "rgba(0, 0, 0, 1)",
    zIndex: 10,
    display: "flex",
    marginTop: 18,
    width: 207,
    height: 2,
    alignSelf: "flex-start",
    marginLeft: 16,
  },
  divider: {
    borderRadius: 1,
    backgroundColor: "rgba(236, 236, 236, 1)",
    display: "flex",
    minHeight: 1,
    width: "100%",
  },
  searchContainer: {
    borderRadius: 12,
    backgroundColor: "rgba(243, 243, 243, 1)",
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 11,
    marginTop: 25,
    marginHorizontal: 16,
  },
  searchIcon: {
    width: 18,
    aspectRatio: 1,
  },
  participantList: {
    marginTop: 25,
    paddingHorizontal: 16,
  },
  bottomIndicator: {
    borderRadius: 3,
    backgroundColor: "rgba(38, 38, 38, 1)",
    alignSelf: "center",
    display: "flex",
    marginTop: 20,
    marginBottom: 8,
    width: 148,
    height: 5,
  },
});

export default ParticipantList;