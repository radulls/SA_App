import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  addSubdivisionAdmin,
  updateSubdivisionAdmin,
  getSubdivisionAdminByUserId,
  removeSubdivisionAdmin,
} from '@/api/adminApi';
import CustomSwitch from '@/components/settings/CustomSwitch';
import Toast from 'react-native-toast-message'; // вверху, если не подключён

export interface AdminPermissionsProps {
  subdivisionId: string;
  userId: string;
  onBack: () => void;
  currentAdminIds?: string[];
}

const defaultPermissions = {
  assignAdmins: false,
  publishPosts: false,
  createEvents: false,
  messages: false,
  supportResponse: false,
  complaintResponse: false,
  addMembers: false,
  addMarket: false,
  manageLimits: false,
};

const AdminPermissions = forwardRef(({ subdivisionId, userId, onBack, currentAdminIds = [] }: AdminPermissionsProps, ref) => {
  const isEditMode = currentAdminIds.includes(userId);

  const [permissions, setPermissions] = useState(defaultPermissions);
  const [loading, setLoading] = useState(isEditMode); // показываем лоадер при редактировании
  const [adminId, setAdminId] = useState<string | null>(null);

  useEffect(() => {
    const fetchExistingPermissions = async () => {
      if (!isEditMode) return;
  
      try {
        const existing = await getSubdivisionAdminByUserId(subdivisionId, userId);
        if (existing?.permissions) {
          setPermissions(existing.permissions);
          setAdminId(existing._id); // 💥 вот это важно
        }
      } catch (err) {
        console.error('Не удалось загрузить текущие права:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchExistingPermissions();
  }, [isEditMode, subdivisionId, userId]);

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    if (!subdivisionId || !userId) {
      Alert.alert('Ошибка', 'Не удалось определить пользователя или подразделение.');
      return;
    }
    try {
      if (isEditMode) {
        if (!adminId) {
          Alert.alert('Ошибка', 'ID администратора не найден.');
          return;
        }
        await updateSubdivisionAdmin(adminId, permissions);
      } else {
        await addSubdivisionAdmin({ subdivisionId, userId, permissions });
      }
      

      onBack();
    } catch (error) {
      Alert.alert('Ошибка', `Не удалось ${isEditMode ? 'обновить' : 'добавить'} администратора`);
    }
  };

  const handleRemove = async () => {
    if (!adminId) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: 'ID администратора не найден.',
      });
      return;
    }
  
    try {
      await removeSubdivisionAdmin(adminId);
      Toast.show({
        type: 'success',
        text1: 'Администратор удалён',
      });
      onBack();
    } catch (error) {
      console.error('Ошибка удаления:', error);
      Toast.show({
        type: 'error',
        text1: 'Не удалось удалить администратора',
      });
    }
  }; 

  useImperativeHandle(ref, () => ({ handleSave }));

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Загрузка прав...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Настройки прав</Text>

      {Object.entries(permissions).map(([key, value]) => (
        <View key={key} style={styles.row}>
          <Text style={styles.label}>{getPermissionLabel(key)}</Text>
          <CustomSwitch
            value={value}
            onValueChange={() => togglePermission(key as keyof typeof permissions)}
          />
        </View>      
      ))}
       <TouchableOpacity onPress={handleRemove}>
        <Text style={[styles.label ,styles.removeButtonText]}>Убрать из администраторов</Text>
      </TouchableOpacity>
    </View>
  );
});

const getPermissionLabel = (key: string): string => {
  const labels: Record<string, string> = {
    assignAdmins: 'Назначать админов',
    publishPosts: 'Публиковать посты',
    createEvents: 'Создавать события',
    messages: 'Сообщения',
    supportResponse: 'Ответы в поддержке',
    complaintResponse: 'Ответы на жалобы',
    addMembers: 'Добавлять участников',
    addMarket: 'Добавлять маркет',
    manageLimits: 'Управлять лимитами',
  };
  return labels[key] || key;
};

const styles = StyleSheet.create({
  container: {
     flex: 1,
     paddingHorizontal: 16, 
    },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: { 
    fontSize: 12,
    fontWeight: '700', 
  },
  removeButtonText:{
    color: '#F00'
  }
});

export default AdminPermissions;
