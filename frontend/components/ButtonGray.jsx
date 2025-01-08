import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
} from "react-native";

export default function MessageContainer() {
  return (
    <View style={styles.messageWrapper}>
      <View style={styles.messageContent}>
        <Text>Сообщение</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageWrapper: {
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: 'center',
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10,
    // width: '100%',
    borderRadius: 8,
    fontFamily: "SF UI Display, sans-serif",
    fontSize: 12,
    backgroundColor: '#F1F1F1',
    color: "rgba(0, 0, 0, 1)",
    fontWeight: "700",
    textAlign: "center",
  },
  messageContent: {
    borderRadius: 8,
    width: "100%", 
    display: "flex",
    alignItems: "center",
    justifyContent: 'center',
    fontWeight: 600,
    textAlign: 'center',
    paddingLeft: 70,
    paddingRight: 70,
    paddingTop: 11,
    paddingBottom: 11,
  },
});