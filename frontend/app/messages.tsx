import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, ScrollView, TouchableOpacity } from 'react-native';
import ParticipantItem from '../components/ParticipantItem';
import Helper from '../components/Helper';
import MessageItem from '../components/messages/MessageItem';
import { router } from 'expo-router';

const ParticipantList = () => {
  const [users, setUsers] = useState([]);
	useEffect(() => {
		const dbUser = Helper.get('users').catch(console.error).then(dbUsers => {
			console.log('dbUsers', dbUsers);
			setUsers([{
        avatar: "https://cdn.builder.io/api/v1/image/assets/f739d4c470a340468bd500c2bd45e954/4598ab92255e07c07300228df41787426711821e5e03da5276dc47fd588d62e3?apiKey=f739d4c470a340468bd500c2bd45e954&",
        username: "theandy",
        time: "2ч.",
        message: "Привет, ну как ты там?",
      },
      {
        avatar: "https://cdn.builder.io/api/v1/image/assets/f739d4c470a340468bd500c2bd45e954/c076d6bfb190b687762533ae7947ed7f473f3c2270d1bfd8c4a4b33b7f367b12?apiKey=f739d4c470a340468bd500c2bd45e954&",
        username: "vladislav13",
        message: "Ну и тогда я подписал договор и начали работу",
      },])
		})
		// setUser(dbUser) 
	}, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
			  <TouchableOpacity onPress={() => {router.back() }}>
          <Image
            resizeMode="contain"
            source={ require('../assets/images/back.png') }
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Уведомления</Text>
        <Image
          resizeMode="contain"
          source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/98b40a73d7d7a9073b8e92330ed21da52b2dab34ee7555b406a03467dd094ba0?placeholderIfAbsent=true&apiKey=f739d4c470a340468bd500c2bd45e954" }}
          style={styles.menuIcon}
        />
      </View>
      <View style={styles.tabContainer}>
        <View style={styles.activeTab}>
          <Text style={styles.activeTabText}>Активность</Text>
        </View>
        <View style={styles.inactiveTab}>
          <Text style={styles.inactiveTabText}>Сообщения</Text>
        </View>
      </View>
      <View style={styles.tabIndicator} />
      <View style={styles.divider} />
      
      <ScrollView style={styles.participantList}>
      <View style={styles.messageContainer}>
        {users.map((message, index) => (
          <MessageItem key={index} avatar={message.avatar} username={message.username} time={message.time} message={message.message} />
        ))}
        </View>
      </ScrollView>
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
    marginHorizontal: "auto",
  },
  messageContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    minHeight: 600
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
    marginLeft: 16,
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
    alignSelf: "flex-end",
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