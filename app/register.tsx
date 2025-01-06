import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import Code from '../components/register/Code';
import RegistrationForm from '../components/register/RegistrationForm';
import IDForm from '../components/register/IDForm';
import PasswordForm from '../components/register/PasswordForm';
import Phone from '../components/register/Phone';
import Email from '../components/register/Email';
import City from '../components/register/City';
import Button from '../components/Button';
import { Link } from 'expo-router';
import { router } from 'expo-router';
import Helper from '../components/Helper';

const RegistrationScreen = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleNext = async () => {
    let nextStep = step + 1;

    if (nextStep > 6) {
      let newUserResponse =  await Helper.post('users/add', formData)
      console.log('newUserResponse', newUserResponse)
      router.push('/verification');
    } else {
      setStep(nextStep);
    }
  };

  const handleBack = () => {
    let prevStep = step - 1;
    if (prevStep >= 0) {
      setStep(prevStep);
    }
  };

  const handleDataChange = (data) => {
    console.log('handleDataChange', data, formData)
    setFormData({ ...formData, ...data });
  };

  const renderStepContent = () => {
    switch (step) {
      case 0: return <Code onDataChange={handleDataChange} />;
      case 1: return <RegistrationForm onDataChange={handleDataChange} />;
      case 2: return <IDForm onDataChange={handleDataChange} />;
      case 3: return <PasswordForm onDataChange={handleDataChange} />;
      case 4: return <Phone onDataChange={handleDataChange} />;
      case 5: return <Email onDataChange={handleDataChange} />;
      case 6: return <City onDataChange={handleDataChange} />;
      default: return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            {step !== 0 && (
              <Pressable onPress={handleBack} style={styles.backIconWrapper}>
                <Image
                  resizeMode="contain"
                  source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/79908b091650bce0fbdeedac444a9417ae5c46510712ac9d9abedd2132d02e2f?placeholderIfAbsent=true&apiKey=f739d4c470a340468bd500c2bd45e954' }}
                  style={styles.backIcon}
                />
              </Pressable>
            )}
            <View style={styles.logo} />
          </View>
          {renderStepContent()}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              <Text style={styles.regularText}>Уже есть аккаунт? </Text>
              <Link style={styles.highlightText} href="/auth/login">Войти</Link>
            </Text>
            <Button title="Далее" onPress={handleNext} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    flexGrow: 1,
    width: '100%',
  },
  wrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 100)',
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 100)',
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 59,
    maxWidth: 600,
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  backIconWrapper: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  backIcon: {
    width: 8,
    aspectRatio: 0.57,
  },
  logo: {
    backgroundColor: 'rgba(67, 67, 67, 1)',
    width: 186,
    height: 240,
  },
  footer: {
    marginTop: 20,
    paddingBottom: 41,
  },
  footerText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  regularText: {
    fontSize: 12,
    color: 'rgba(139, 139, 139, 1)',
    fontWeight: '500',
  },
  highlightText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(148,179,255,1)',
  },
});

export default RegistrationScreen;
