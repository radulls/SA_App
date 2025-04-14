import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

type UserNameProps = {
  firstName?: string;
  lastName?: string;
  hideLastName?: boolean;
};

const getFullName = (user: UserNameProps): React.ReactElement => {
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';

  return (
    <View style={styles.row}>
      <Text style={styles.nameText}>{firstName}</Text>
      <View style={styles.lastNameContainer}>
        {user.hideLastName ? (
          Platform.OS === 'web' ? (
            <Text style={[styles.nameText, styles.webBlurText]}>
              {lastName}
            </Text>
          ) : (
            <View style={styles.blurWrapper}>
              <Text style={styles.nameText}>{lastName}</Text>
              <BlurView intensity={13} tint="light" style={styles.blurOverlay} />
            </View>
          )
        ) : (
          <Text style={styles.nameText}>{lastName}</Text>
        )}
      </View>
    </View>
  );
};

export default getFullName;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  lastNameContainer: {
    marginLeft: 5,
    position: 'relative',
  },
  blurWrapper: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // даёт контраст под блюром
    paddingHorizontal: 4,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    borderRadius: 8,
  },
  webBlurText: {
    filter: 'blur(5px)',
  } as any,
});
