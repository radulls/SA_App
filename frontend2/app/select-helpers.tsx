import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Image, StyleSheet, Pressable } from 'react-native';
import { getSosHelpers, confirmHelpers } from '@/api/sos/sosApi';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IMAGE_URL } from '@/api';
import IconBack from '@/components/svgConvertedIcons/iconBack';
import CheckMarkIcon from '@/components/svgConvertedIcons/checkMarkIcon';
import getFullName from '@/utils/getFullName';

// Интерфейс для данных о помощниках
interface SosHelper {
  _id: string;
  sosId: string;
  createdAt: string;
  user: {
    _id: string;  
    username: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
    hideLastName?: boolean;
  } | null;
}

const SelectHelpersScreen = () => {
  const { sosId } = useLocalSearchParams();
  const router = useRouter();
  const parsedSosId = Array.isArray(sosId) ? sosId[0] : sosId; 
  const [helpers, setHelpers] = useState<SosHelper[]>([]);
  const [selectedHelpers, setSelectedHelpers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🆔 Полученный sosId:", parsedSosId);
    if (!parsedSosId) {
      console.error("❌ Ошибка: sosId отсутствует!");
      Alert.alert("Ошибка", "Некорректный ID сигнала.");
      setLoading(false);
      return;
    }
    fetchHelpers();
  }, [parsedSosId]);

  const fetchHelpers = async () => {
    console.log("📡 Запрашиваем помощников для sosId:", parsedSosId);
    if (!parsedSosId) return;

    try {
      const response = await getSosHelpers(parsedSosId);
      console.log("✅ Данные помощников:", response.data);

      if (!response.data || response.data.length === 0) {
        console.warn("⚠️ Нет откликнувшихся пользователей.");
      }

      setHelpers(response.data || []);
    } catch (error) {
      console.error("❌ Ошибка загрузки помощников:", error);
      Alert.alert("Ошибка", "Не удалось загрузить помощников.");
    } finally {
      setLoading(false);
    }
  };

  const toggleHelperSelection = (helperId: string) => {
    setSelectedHelpers((prev) =>
      prev.includes(helperId) ? prev.filter((id) => id !== helperId) : [...prev, helperId]
    );
  };

  const handleGoBack = () => {
    if (sosId) {
      router.push({
        pathname: "/sos-signal/[id]",
        params: { id: String(parsedSosId) },
      });      
    }
  };

  const toggleSelectAll = () => {
    if (selectedHelpers.length === helpers.length) {
      setSelectedHelpers([]); // ❌ Снять выбор со всех
    } else {
      setSelectedHelpers(helpers.map(helper => helper.user?._id || "")); // ✅ Выбрать всех
    }
  };
  
  const handleConfirm = async () => {
    if (!parsedSosId) {
      Alert.alert("Ошибка", "Некорректный ID сигнала.");
      return;
    }
    if (selectedHelpers.length === 0) {
      Alert.alert("Ошибка", "Выберите хотя бы одного помощника.");
      return;
    }
    try {
      await confirmHelpers(parsedSosId, selectedHelpers);
      Alert.alert("Успех", "Помощники подтверждены!");
      router.push('/home');
    } catch (error) {
      console.error("❌ Ошибка подтверждения помощников:", error);
      Alert.alert("Ошибка", "Не удалось подтвердить помощников.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!parsedSosId) {
    return (
      <View>
        <Text style={{ color: 'red' }}>❌ Ошибка: идентификатор отсутствует!</Text>
      </View>
    );
  }

  // http://localhost:8081/select-helpers?sosId=67b4f6e6215a6893702e34a7

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.backIconWrapper}>
            <IconBack fill='#000' onPress={handleGoBack} />
          </View>
          <Text style={styles.title}>Участники</Text>
          <Pressable onPress={toggleSelectAll} style={styles.allButton}>
            <Text style={styles.allText}>
              Все
            </Text>
          </Pressable>
        </View>
        <Text style={styles.subtitle}>
          Участники, которые прибыли на указанную локацию определяются автоматически, но есть и такие, которые помогали онлайн, выберете таких.
        </Text>
        {helpers.length === 0 ? (
          <Text>Нет откликнувшихся помощников.</Text>
        ) : (
          <FlatList
            data={helpers}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              if (!item.user) {
                console.error("❌ Ошибка: user отсутствует в объекте", item);
                return null;
              }
              return (
                <TouchableOpacity 
                  onPress={() => toggleHelperSelection(item.user!._id)}
                  activeOpacity={1} // ✅ Отключает уменьшение прозрачности при нажатии
                >
                  <View style={styles.cardContainer}>
                    <View style={styles.detailContainer}>
                      <Image source={{
                        uri: item.user.profileImage
                        ? `${IMAGE_URL}${item.user.profileImage}`
                        : ''
                      }}
                      style={styles.profileImage}/>   
                      <View style={styles.nameContainer}>
                        <Text style={styles.label}>
                          {item.user.username}
                        </Text>            
                        <View>
                          {getFullName({
                            firstName: item.user.firstName,
                            lastName: item.user.lastName,
                            hideLastName: item.user.hideLastName,
                          })}
                        </View>
                      </View>         
                    </View>   
                    <View style={[styles.radioCircle, selectedHelpers.includes(item.user._id) ? styles.activeCircle : '']}>
                      <View style={styles.checkedIcon}>
                        <CheckMarkIcon/>
                      </View>                      
                    </View>                                              
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
        <TouchableOpacity>
          <Pressable onPress={handleConfirm} style={styles.confirmButton}>
            <Text style={styles.buttonText}>Готово</Text>
          </Pressable>         
        </TouchableOpacity>
      </View>
    </View>
   
  );
};

const styles = StyleSheet.create({
  container:{
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  contentContainer:{
    maxWidth: 600,
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 30,
 
  },
  backIconWrapper: {
    marginLeft: -20,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle:{
    fontSize: 12,
    fontWeight: '400',
    color:'#888',
    textAlign: 'center',
    paddingBottom: 30,
  },
  allButton:{
    padding: 20,
    marginRight: -20,
  },
  allText:{
    fontSize: 14,
    fontWeight: '700',
  },
  cardContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  detailContainer:{
    flexDirection: 'row'
  },
  nameContainer:{
    flexDirection:'column',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    paddingBottom: 5,
  },
  name: {
    fontSize: 12,
    fontWeight: '400',
    color: '#000',
  },
  profileImage: {
    width: 38,
    height: 38,
    borderRadius: 25,
    marginRight: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle:{
    borderColor: '#000',
    backgroundColor: '#000',
  },
  checkedIcon:{
    position: 'relative',
    zIndex: 2
  },
  confirmButton:{
    marginVertical: 40,
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText:{
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  }
})

export default SelectHelpersScreen;