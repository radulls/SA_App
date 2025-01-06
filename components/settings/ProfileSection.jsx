import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';

const ProfileSection = ({label, value, onclick}) => {
  const profileData = [
    { label: label, value: value },
  ];

  return (
    <TouchableOpacity onPress={onclick} style={styles.container}>
      {profileData.map((item, index) => (
        <View style={styles.profileContainer} key={index}>
          <Text style={styles.label}>{item.label}</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{item.value}</Text>
            <Image
              source={require('../../assets/settings_arrow.png')}
              style={styles.arrowIcon}
            />
          </View>
        </View>
      ))}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
  },
  label: {
    flex: 1,
    fontWeight: '700',
    // fontFamily: "SFUIDisplay-Bold",
    color: 'rgba(0, 0, 0, 1)',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontWeight: '500',
    marginRight: 8,
    // fontFamily: "SFUIDisplay-Medium",
    textAlign: 'right',
    color: 'rgba(0, 0, 0, 1)',
  },
  arrowIcon: {
    width: 10,
    height: 16,
    tintColor: 'black',
  },
});

export default ProfileSection;
