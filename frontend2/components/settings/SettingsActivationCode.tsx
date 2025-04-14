import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import { generateCode, getInvitedUsers, getUserCodes } from '@/api/activeCodes';
import { styles } from './SettingsStyle';
import { ScrollView } from 'react-native-gesture-handler';
import CopyCodeIcon from '../svgConvertedIcons/copyCodeIcon';
import Toast from 'react-native-toast-message';
import * as Clipboard from 'expo-clipboard';
import IconArrowSettings from '../svgConvertedIcons/IconArrowSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsActivationCodeProps {
  userRole: 'creator' | 'admin' | 'user';
  onBack: () => void;
  goToSetting: (setting: string) => void;
}

interface UserCode {
  code: string;
  isUsed: boolean;
  usedAt?: string;
  type: 'user' | 'admin'; // ✅ Добавляем поле type
}

const SettingsActivationCode: React.FC<SettingsActivationCodeProps> = ({ userRole, onBack, goToSetting }) => {
  const [selectedType, setSelectedType] = useState<'user' | 'admin'>(userRole === 'creator' ? 'user' : userRole === 'admin' ? 'user' : 'user');
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [invitedCount, setInvitedCount] = useState<number>(0);
  const [userCodes, setUserCodes] = useState<UserCode[]>([]);

  useEffect(() => {
    if (userRole === 'user') {
      const fetchUserCodes = async () => {
        try {
          const codes: UserCode[] = await getUserCodes();
          const filteredCodes = codes.filter((c: UserCode) => c.type === 'user').slice(0, 3);
          setUserCodes(filteredCodes);
        } catch (error) {
          console.error('Ошибка при загрузке кодов пользователя:', error);
        }
      };
      fetchUserCodes();
    } else {
      const fetchInvitedUsers = async () => {
        try {
          const users = await getInvitedUsers(); // ✅ Загружаем список приглашённых
          setInvitedCount(users.length); // ✅ Устанавливаем количество приглашённых
        } catch (error) {
          console.error('Ошибка при загрузке приглашённых пользователей:', error);
        }
      };
      fetchInvitedUsers();
    }
  }, [userRole]);
  
  
  const handleGenerateCode = async () => {
    if (!selectedType) {
      setError('Выберите тип кода!');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await generateCode(selectedType);
      if (response?.code) {
        setCode(response.code);
      } else {
        setError('Ошибка при получении кода');
      }
    } catch (err) {
      setError('Ошибка при генерации кода');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async (copyText: string) => {
    try {
      if (Platform.OS === 'web') {
        await navigator.clipboard.writeText(copyText);
      } else {
        await Clipboard.setStringAsync(copyText);
      }
      Toast.show({
        type: 'success',
        text1: 'Код скопирован!',
        position: 'bottom'
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Не удалось скопировать код.',
        position: 'bottom'
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.formWrapper}>
          {/* 🎭 Разные интерфейсы в зависимости от роли */}
          {userRole === 'creator' && (
            <>
              <View style={styles.buttonRow}>
                <View style={styles.buttonRowItem}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      selectedType === 'user' && styles.activeTypeButton,
                    ]}
                    onPress={() => setSelectedType('user')}
                  >
                    <Text style={[styles.buttonRowText, selectedType === 'user' && styles.buttonRowTextSelected]}>
                      С подпиской
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonRowItem}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      selectedType === 'admin' && styles.activeTypeButton,
                    ]}
                    onPress={() => setSelectedType('admin')}
                  >
                    <Text style={[styles.buttonRowText, selectedType === 'admin' && styles.buttonRowTextSelected]}>
                      Без подписки
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {userRole !== 'user' && (
            <>
              <Text style={styles.label}>Код</Text>
              <View style={styles.inputCopy}>
                <TextInput
                  style={[styles.input, { width: '80%' }]}
                  value={code || ''}
                  editable={false}
                />
                <TouchableOpacity style={styles.copyIcon} onPress={() => code && handleCopyCode(code)}>
                  <CopyCodeIcon fill='black' />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.generateButton} onPress={handleGenerateCode}>
                <Text style={styles.generateButtonText}>Сгенерировать код</Text>
              </TouchableOpacity>
            </>
          )}

          {userRole === 'user' && (
            <>
              <Text style={styles.subtitle}>Здесь отображены активационные коды, используйте их, чтобы приглашать своих друзей.</Text>
              <Text style={styles.label}>Доступные коды</Text>
              {userCodes.map((c, index) => (
                <View key={index} style={styles.userCodeContainer}>
                  <Text style={styles.codeNumber}>{index + 1}</Text> 
                  <View>                   
                    {c.isUsed && c.usedAt ? (
                      <View style={styles.usedCodeContainer}>
                        <Text style={styles.usedCode}>{c.code}</Text>
                        <Text style={styles.usedDate}>
                          {new Date(c.usedAt).toLocaleDateString()}
                        </Text>
                      </View>  
                    ) : (  
                       <Text style={styles.userCode}>{c.code}</Text>              
                    )}
                  </View>
                  <View>
                  {c.isUsed ? (
                    <Text style={styles.usedDateText}>
                      Присвоен
                    </Text>
                  ) : (
                  <TouchableOpacity style={[styles.copyIcon, styles.userCopyIcon]} onPress={() => handleCopyCode(c.code)}>
                    <CopyCodeIcon fill='black' />
                  </TouchableOpacity>
                  )}
                  </View>                  
                </View>
              ))}
            </>
          )}

          {(userRole === 'creator' || userRole === 'admin') && (
            <TouchableOpacity style={[styles.showSurnameContainer, { paddingTop: 40 }]} onPress={() => goToSetting('addedUsers')}>
              <Text style={styles.showSurnameText}>Добавленные вами</Text>
              <View style={styles.rightItems}>
                <Text style={styles.invitedNumbers}>{invitedCount}</Text>
                <IconArrowSettings />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsActivationCode;
