import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const navigationItems = [
  { id: 1, title: "Основа" },
  { id: 2, title: "Трибуна" },
  { id: 3, title: "Дружина" }
];

const NavigationButton = ({ title, style, textStyle }) => (
  <TouchableOpacity style={style}>
    <Text style={[styles.buttonText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

export default function NavigationButtons() {
  return (
    <View style={styles.navigationContainer}>
      {navigationItems.map((item, index) => (
        <NavigationButton
          key={item.id}
          title={item.title}
          style={[
            styles.navigationButton,
            index === 0 && styles.activeButton,
          ]}
          textStyle={[
            styles.buttonText,
            index === 0 && styles.activeButtonText,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  navigationContainer: {
    borderRadius: 8,
    display: "flex",
    flexDirection: 'row',
    alignItems: "stretch",
    gap: 10,
    width: '100%',
    paddingTop: 10,
    paddingLeft: 5,
    
    fontFamily: "SF UI Display, sans-serif",
    fontSize: 12,
    color: "rgba(0, 0, 0, 1)",
    fontWeight: "700",
    textAlign: "center",
  },
  navigationButton: {
    borderRadius: 8,
    borderColor: "rgba(217, 217, 217, 1)",
    borderStyle: "solid",
    borderWidth: 1,
    maxWidth: '33%',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  activeButton: {
    backgroundColor: "#000",
  },
  buttonText: {
    color: "#000",
    fontWeight: "700",
    textAlign: "center",
  },
  activeButtonText: {
    color: 'white',
  }
});