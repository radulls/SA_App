import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import FreezeActionModal from "./Freeze/FreezeActionModal";
import CustomModal from "../CustomModal";
import { styles } from "./AdminControlStyles";
import { getDeleteAccountReasons, deleteEntity, getUserFreezes } from "@/api/adminApi";
import IconArrowSettings from "@/components/svgConvertedIcons/IconArrowSettings";
import Toast from 'react-native-toast-message';

interface AdminUserLimitsProps {
  userId: string;
  marketId?: string;
}

const AdminUserLimits: React.FC<AdminUserLimitsProps> = ({ userId, marketId }) => {
  const [isFreezeModalVisible, setFreezeModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteType, setDeleteType] = useState<"user" | "market" | null>(null);
  const [deleteReasons, setDeleteReasons] = useState<{ label: string; value: string }[]>([]);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [isDeleteReasonModalVisible, setDeleteReasonModalVisible] = useState(false); // 👈 модалка выбора причины
  const [freezeCount, setFreezeCount] = useState<number>(0);

  // Загружаем причины удаления
  useEffect(() => {
    const fetchDeleteReasons = async () => {
      try {
        console.log("🚀 [AdminUserLimits] Запрос причин удаления...");
        const reasons = await getDeleteAccountReasons();
        console.log("✅ [AdminUserLimits] Причины удаления получены:", reasons);
        setDeleteReasons(reasons.map((reason) => ({ label: reason.name, value: reason._id })));
      } catch (error) {
        console.error("❌ [AdminUserLimits] Ошибка при загрузке причин удаления:", error);
      }
    };
  
    fetchDeleteReasons();
  }, []);

  useEffect(() => {
    const fetchFreezes = async () => {
      try {
        const data = await getUserFreezes(userId);
        const activeFreezes = data.filter((f: any) => new Date(f.endDate) >= new Date());
        setFreezeCount(activeFreezes.length);
      } catch (error) {
        console.error("Ошибка при загрузке заморозок:", error);
      }
    };
  
    fetchFreezes();
  }, []);  
  
  // Открытие модалки удаления
  const handleDelete = (type: "user" | "market") => {
    setDeleteType(type);
    setDeleteModalVisible(true);
  };

  console.log("👉 marketId:", marketId);


  // Подтверждение удаления
  const confirmDelete = async () => {
    if (!deleteType || !selectedReason) return;
  
    const entityId = deleteType === "user" ? userId : marketId;
    if (!entityId) {
      console.error("❌ Не указан ID для удаления");
      return;
    }
    console.log("👉 marketId:", marketId);

    try {
      await deleteEntity(entityId, deleteType, selectedReason);
      Toast.show({
        type: 'success',
        text1: `${deleteType === "user" ? "Аккаунт" : "Маркет"} успешно удалён`,
      });
      setDeleteModalVisible(false);
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      Toast.show({
        type: 'error',
        text1: 'Ошибка при удалении',
      });
    }    
  };

  return (
    <View style={styles.container}>
      {/* Заморозка аккаунта */}
      <TouchableOpacity onPress={() => setFreezeModalVisible(true)} style={styles.infoItem}>
        <Text style={styles.label}>Заморозка аккаунта</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.value, {marginRight: 5}]}>{freezeCount}</Text>
          <IconArrowSettings fill="#000" />
        </View>
      </TouchableOpacity>


      {/* Удаление маркета */}
      <TouchableOpacity 
        style={[styles.infoItem, !marketId && { opacity: 0.5 }]}
        onPress={() => marketId && handleDelete("market")}
        disabled={!marketId}
      >
        <Text style={[styles.label, styles.labelDelete]}>
          Удаление маркета
        </Text>
      </TouchableOpacity>

      {/* Удаление аккаунта */}
      <TouchableOpacity style={styles.infoItem} onPress={() => handleDelete("user")}>
        <Text style={[styles.label, styles.labelDelete]}>Удаление аккаунта</Text>
      </TouchableOpacity>

      {/* Модальное окно выбора заморозки */}
      <Modal visible={isFreezeModalVisible} animationType="slide" transparent>
        <FreezeActionModal userId={userId} onClose={() => setFreezeModalVisible(false)} />
      </Modal>
      <CustomModal
        visible={isDeleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        title={deleteType === 'user' ? 'Удаление аккаунта' : 'Удаление маркета'}
        input={{
          placeholder: 'Причина',
          value: deleteReasons.find(r => r.value === selectedReason)?.label || ' ',
          onPress: () => setDeleteReasonModalVisible(true), // открываем 2-ую модалку
          showArrowIcon: true, 
        }}
        buttons={[
          { label: 'Отмена', action: () => setDeleteModalVisible(false), type: 'danger' },
          { label: 'Удалить', action: confirmDelete, type: 'delete' },
        ]}
      />
      {/* Модалка выбора причины (2 — с радио-кнопками) */}
      <CustomModal
        visible={isDeleteReasonModalVisible}
        onClose={() => setDeleteReasonModalVisible(false)}
        title={`Причина удаления ${deleteType === 'user' ? 'аккаунта' : 'маркета'}`}
        selectOptions={deleteReasons}
        selectedOption={selectedReason}
        hideOptionIcons={true}
        optionTextStyle={{ fontWeight: '400', fontSize: 14 }}
        onSelectOption={(value) => {
          setSelectedReason(value);
          setDeleteReasonModalVisible(false);
        }}
      />

    </View>
  );
};

export default AdminUserLimits;
