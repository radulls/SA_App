import React, { useState } from 'react';
import { View,Text, StyleSheet, ScrollView, Image, Pressable, Dimensions } from 'react-native';
import TitleDescription from '../components/eventCreation/TitleDescription';
import InputField from '../components/eventCreation/InputField';
import ContinueButton from '../components/eventCreation/ContinueButton';

const EventCreationForm = () => {
  const [descriptionHeight, setDescriptionHeight] = useState(100);

  const handleDescriptionHeightChange = (newHeight) => {
    setDescriptionHeight(newHeight);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
      >
        <View style={styles.headerIcons}>
          <Pressable>
            <Image
              resizeMode="contain"
              source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/79908b091650bce0fbdeedac444a9417ae5c46510712ac9d9abedd2132d02e2f?placeholderIfAbsent=true&apiKey=f739d4c470a340468bd500c2bd45e954' }}
              style={[styles.backIcon, { tintColor: 'black' }]}
            />
          </Pressable>
          <Text style={styles.headerTitle}>Установить ID</Text>
          <Pressable>
            <Image
              resizeMode="contain"
              source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/0a13e0ad52753d545b099d0e0accb1ac1c6a1dde7d4b6ad6e8f0bc8f72a39188?placeholderIfAbsent=true&apiKey=f739d4c470a340468bd500c2bd45e954' }}
              style={[styles.menuIcon, { tintColor: 'black' }]}
            />
          </Pressable>
        </View>
        <View style={styles.formWrapper}>
          {/* <TitleDescription /> */}

          <InputField 
            label="ID" 
            onHeightChange={() => {}} // Placeholder
          />
         
        </View>
      </ScrollView>
      <View style={styles.ContinueButton}>
      <ContinueButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    alignItems: 'center', 
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    paddingBottom: 90,
    alignItems: 'center', 
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 22,
    marginTop: 55,
    width: '100%',
    maxWidth: 600,
  },
  backIcon: {
    width: 8,
    aspectRatio: 0.57,
  },
  menuIcon: {
    width: 18,
    aspectRatio: 1,
  },
  formWrapper: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 35,
    width: '100%',
    maxWidth: 600, 
  },
  ContinueButton: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 35,
    width: '100%',
    maxWidth: 600,
  }

});

export default EventCreationForm;



