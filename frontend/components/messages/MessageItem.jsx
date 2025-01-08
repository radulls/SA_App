import * as React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

function MessageItem({ avatar, username, time, message }) {
  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        source={{ uri: avatar }}
        style={styles.avatar}
      />
      <View style={styles.messageContent}>
        <View style={styles.header}>
          <Text style={styles.username}>{username}</Text>
          {time && <Text style={styles.time}>{time}</Text>}
        </View>
        <Text style={styles.messageText}>{message}</Text>
      </View>
      <View style={styles.notificationDot} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  avatar: {
    width: 50,
    aspectRatio: 1,
  },
  messageContent: {
    flex: 1,
    fontFamily: "SF UI Display, sans-serif",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  username: {
    color: "rgba(0, 0, 0, 1)",
    fontSize: 14,
    fontWeight: "700",
  },
  time: {
    color: "rgba(105, 105, 105, 1)",
    fontSize: 12,
    fontWeight: "400",
  },
  messageText: {
    color: "rgba(0, 0, 0, 1)",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 14,
    marginTop: 7,
  },
  notificationDot: {
    borderRadius: 50,
    width: 8,
    height: 8,
    backgroundColor: "#000",
  },
});

export default MessageItem;