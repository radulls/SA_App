import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CodeForm, { CodeFormRef } from '../components/register/Code';
import IDForm, { IDFormRef } from '../components/register/IDForm';
import PasswordForm, { PasswordFormRef } from '../components/register/PasswordForm';
import PhoneForm, { PhoneFormRef } from '../components/register/Phone';
import EmailForm, { EmailFormRef } from '../components/register/Email';
import CodeVerificationForm, { CodeVerificationFormRef } from '../components/register/CodeVerificationForm';
import CityForm from '../components/register/City';
import Button from '../components/Button';
import { Link } from 'expo-router';
import { router } from 'expo-router';
import { registerUser, updateUser, sendVerificationCode, verifyEmailCode } from '../api';
import IconBack from '@/components/svgConvertedIcons/iconBack';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ValueProps {
  value: string;
  onDataChange: (value: string) => void;
  email?: string; // Добавляем email как необязательный пропс
}

const RegistrationScreen: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isValid, setIsValid] = useState<boolean>(true);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const idFormRef = useRef<IDFormRef>(null);
  const emailFormRef = useRef<EmailFormRef>(null);
  const phoneFormRef = useRef<PhoneFormRef>(null);
  const passwordFormRef = useRef<PasswordFormRef>(null);
  const codeVerificationFormRef = useRef<CodeVerificationFormRef>(null);
  const codeFormRef = useRef<CodeFormRef>(null);

  const toggleCheckBox = () => {
    setIsChecked(!isChecked);
  };

  const handleDataChange = (data: Record<string, any>) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
  };

  const isNextEnabled = () => {
    switch (step) {
      case 0:
        return isChecked && formData.code?.trim().length > 0;
      case 1:
        return formData.username?.trim().length > 0;
      case 2:
        return formData.password?.trim().length > 0;
      case 3:
        return formData.phone?.trim().length > 0;
      case 4:
        return formData.email?.trim().length > 0;
      case 5:
        return formData.verificationCode?.trim().length > 0;
      case 6:
        return formData.city?.trim().length > 0;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    setIsTouched(true);

    try {
      if (!isNextEnabled()) {
        console.log('Кнопка "Далее" заблокирована');
        return;
      }

      if (completedSteps.has(step)) {
        setStep((prevStep) => prevStep + 1);
        setIsTouched(false);
        return;
      }

      if (step === 0 && codeFormRef.current) await codeFormRef.current.validateInput();
      if (step === 1 && idFormRef.current) await idFormRef.current.validateInput();
      if (step === 2 && passwordFormRef.current) await passwordFormRef.current.validateInput();
      if (step === 3 && phoneFormRef.current) await phoneFormRef.current.validateInput();
      if (step === 4 && emailFormRef.current) await emailFormRef.current.validateInput();
      if (step === 5 && codeVerificationFormRef.current) await codeVerificationFormRef.current.validateInput();

      if (step === 0) {
        const response = await registerUser(formData.code);
        setFormData((prevData) => ({ ...prevData, userId: response.userId }));
        await AsyncStorage.setItem('token', response.token);
      } else if (step === 1) {
        await updateUser({ username: formData.username });
      } else if (step === 2) {
        await updateUser({ password: formData.password });
      } else if (step === 3) {
        await updateUser({ phone: formData.phone });
      }if (step === 4 && emailFormRef.current) {
        await emailFormRef.current.validateInput();     
        // Отправляем код подтверждения, только если он еще не был отправлен
        if (!isCodeSent) {
          console.log('Отправка кода подтверждения...');
          await sendVerificationCode(formData.email);
          setIsCodeSent(true);
        }
      } else if (step === 5) {
        console.log('Проверка кода подтверждения...');
        // Если код уже проверен, не отправляем повторный запрос
        if (!isCodeSent) {
          await verifyEmailCode(formData.email, formData.verificationCode);
          setIsCodeSent(true); // После успешной проверки устанавливаем флаг
        }     
      } else if (step === 6) {
        await updateUser({ city: formData.city });
        await AsyncStorage.setItem('userId', formData.userId);
        router.push('/home');
        return;
      }

      setCompletedSteps((prev) => new Set(prev).add(step));
      setStep((prevStep) => prevStep + 1);
      setIsTouched(false);
    } catch (err: any) {
      // console.error(`Ошибка на шаге ${step}:`, err);
    }
  };

  const goBack = () => {
    setStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
    setIsTouched(false);
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <CodeForm
            ref={codeFormRef}
            value={formData.code || ''}
            isChecked={isChecked}
            onDataChange={(data) => handleDataChange({ code: data })}
            onCheckBoxToggle={toggleCheckBox}
          />
        );
        case 1:
          return (
            <IDForm
              ref={idFormRef}
              value={formData.username || ''}
              onDataChange={(data) => handleDataChange({ username: data })}
              isTouched={isTouched}
              onValidate={setIsValid} // Передаем функцию для onValidate
            />
          );
        
      case 2:
        return (
          <PasswordForm
            ref={passwordFormRef}
            value={formData.password || ''}
            onDataChange={(data) => handleDataChange({ password: data })}
          />
        );
      case 3:
        return (
          <PhoneForm
            ref={phoneFormRef}
            value={formData.phone || ''}
            onDataChange={(data) => handleDataChange({ phone: data })}
          />
        );
      case 4:
        return (
          <EmailForm
            ref={emailFormRef}
            value={formData.email || ''}
            onDataChange={(data) => handleDataChange({ email: data })}
          />
        );
      case 5:
        return (
          <CodeVerificationForm
            ref={codeVerificationFormRef}
            value={formData.verificationCode || ''}
            email={formData.email}
            onDataChange={(data) => handleDataChange({ verificationCode: data })}
          />
        );
      case 6:
        return (
          <CityForm
            value={formData.city || ''}
            onDataChange={(data) => handleDataChange({ city: data })}
          />
        );
      default:
        return <Text style={styles.footerText}>Ошибка: Неверный шаг!</Text>;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            {step !== 0 && (
              <View style={styles.backIconWrapper}>
                <IconBack onPress={goBack} />
              </View>
            )}
            <View style={styles.logo} />
          </View>
          {renderStepContent()}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              <Text style={styles.regularText}>Уже есть аккаунт?</Text>
              <Link style={styles.highlightText} href="/auth/login">
                Войти
              </Link>
            </Text>
            <Button title="Далее" onPress={handleNext} disabled={!isNextEnabled()} />
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
    paddingTop: 58,
    maxWidth: 600,
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  backIconWrapper: {
    position: 'absolute',
    left: 0,
    top: 0, 
    zIndex: 1,
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
    fontFamily: "SFUIDisplay-medium",
    marginRight: 3,
  },
  highlightText: {
    fontSize: 12,
    color: 'rgba(148,179,255,1)',
    fontFamily: "SFUIDisplay-bold",
  },
});

export default RegistrationScreen;
