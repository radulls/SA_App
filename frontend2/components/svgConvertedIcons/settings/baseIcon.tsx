import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BaseIcon = () => {
  return (
    <View style={styles.locationIcon}>
      <Text style={styles.locationIconText}>sa</Text>
    </View>
  );
};

export default BaseIcon;

const styles = StyleSheet.create({
  locationIcon: {
    backgroundColor: "#000000",
    borderRadius: 4,
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  locationIconText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 2,
  },
});