import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Pressable } from 'react-native';
import EmailStep, { EmailStepRef } from '../components/resetPassword/EmailStep';
import CodeVerificationStep, { CodeVerificationStepRef } from '../components/resetPassword/CodeVerificationStep';
import PasswordStep, { PasswordStepRef } from '../components/resetPassword/PasswordStep';
import Button from '../components/Button';
import { sendResetPasswordCode, verifyEmailCode, changePassword } from '@/api/mockApi' ;
import { useRouter } from 'expo-router';
import IconBack from '@/components/svgConvertedIcons/iconBack';
import SuccessMessage from '@/components/SuccessMessage';

const ResetPasswordScreen: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<{ email?: string; code?: string; password?: string }>({});
  const emailStepRef = useRef<EmailStepRef>(null);
  const codeStepRef = useRef<CodeVerificationStepRef>(null);
  const passwordStepRef = useRef<PasswordStepRef>(null);
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleDataChange = (data: Record<string, any>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = async () => {
    if (isProcessing || completedSteps.has(step)) return;
    setIsProcessing(true);

    try {
      if (step === 0 && emailStepRef.current) {
        emailStepRef.current.setError(null); // Сброс ошибки
        await emailStepRef.current.validateInput();

        try {
          await sendResetPasswordCode(formData.email!);
          setSuccessMessage(`Код отправлен на ${formData.email}`);

          // Скрыть сообщение через 3 секунды
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);
        } catch (err) {
          if (err instanceof Error) {
            emailStepRef.current.setError(err.message === 'Пользователь не найден'
              ? 'Пользователь не найден'
              : 'Произошла ошибка. Попробуйте снова.'
            );
          } else {
            emailStepRef.current.setError('Неизвестная ошибка. Попробуйте снова.');
          }
          throw err;
        }
      } else if (step === 1 && codeStepRef.current) {
        codeStepRef.current.setError(null); // Сброс ошибки
        await codeStepRef.current.validateInput();
        setSuccessMessage('Код успешно подтверждён.');

        // Скрыть сообщение через 3 секунды
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else if (step === 2 && passwordStepRef.current) {
        passwordStepRef.current.setError(null); // Сброс ошибки
        await passwordStepRef.current.validateInput();
        await changePassword(formData.email!, formData.code!, formData.password!);

        // Успешное сообщение после изменения пароля
        setSuccessMessage(`Пароль успешно изменён для пользователя: ${formData.email}`);
        setTimeout(() => {
          setSuccessMessage(null);
          router.push('/auth/login'); // Перенаправление на страницу входа
        }, 3000);

        return; // Останавливаем выполнение, чтобы избежать перехода на следующий шаг
      }

      setStep((prev) => prev + 1); // Переход на следующий шаг
    } catch (err) {
      // console.error(`Ошибка на шаге ${step}:`, err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
    setSuccessMessage(null); // Сбрасываем сообщение при возврате
  };

  const renderStep = () => {
    if (step === 0) {
      return (
        <EmailStep
          ref={emailStepRef}
          value={formData.email || ''}
          onDataChange={(data) => handleDataChange({ email: data })}
          onNext={handleNext}
        />
      );
    }
    if (step === 1) {
      return (
        <CodeVerificationStep
          ref={codeStepRef}
          value={formData.code || ''}
          email={formData.email || ''}
          onDataChange={(data) => handleDataChange({ code: data })}
        />
      );
    }
    if (step === 2) {
      return (
        <PasswordStep
          ref={passwordStepRef}
          value={formData.password || ''}
          onDataChange={(data) => handleDataChange({ password: data })}
        />
      );
    }
    return null;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            {step > 0 && (
              <Pressable style={styles.backIconWrapper}>
                <IconBack onPress={handleBack} />
              </Pressable>
            )}
            <View style={styles.logo} />
            {successMessage && <SuccessMessage message={successMessage} />}
          </View>
          
          {renderStep()}
          <View style={styles.footer}>
            <Button title="Далее" onPress={handleNext} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexGrow: 1,
    width: '100%',
  },
  wrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  content: {
    backgroundColor: '#000',
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
    left: -30,
    zIndex: 1,
  },
  logo: {
    marginTop: 30,
    backgroundColor: '#444',
    width: 186,
    height: 240,
  },
  footer: {
    marginTop: 20,
  },
});

export default ResetPasswordScreen;
