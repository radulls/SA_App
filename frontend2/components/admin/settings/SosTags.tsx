import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet
} from 'react-native';
import { getSosTags, createSosTag, deleteSosTag, SosTag } from '@/api/sos/sosApi';
import DeleteSosTagIcon from '@/components/svgConvertedIcons/settings/deleteSosTagIcon';
import AddSosTagIcon from '@/components/svgConvertedIcons/settings/addSosTagIcon';
import CustomModal from '../CustomModal';
import Toast from 'react-native-toast-message';

const SosTags = ({ onBack }: { onBack: () => void }) => {
  const [tags, setTags] = useState<SosTag[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const data = await getSosTags();
      setTags(data);
    } catch (error) {
      console.log('❌ Ошибка при загрузке тегов:', error);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
  
    setLoading(true);
    try {
      const created = await createSosTag(newTagName.trim());
      setTags(prev => [...prev, created]);
      setNewTagName('');
      setModalVisible(false);
  
      Toast.show({
        type: 'success',
        text1: 'Тег создан',
        text2: `Тег "${created.name}" успешно добавлен.`,
      });
    } catch (error: any) {
      console.log('❌ Ошибка при создании тега:', error.message);
      Toast.show({
        type: 'error',
        text1: error.message || 'Не удалось создать тег.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteTag = async (tagId: string) => {
    try {
      await deleteSosTag(tagId);
      setTags(prev => prev.filter(tag => tag._id !== tagId));
      setSelectedTagId(null);
  
      Toast.show({
        type: 'success',
        text1: 'Тег успешно удалён.',
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message;
  
      Toast.show({
        type: 'error',
        text1:
          errorMessage.includes('используется') || errorMessage.includes('использован')
            ? 'Этот тег уже используется и не может быть удалён.'
            : errorMessage,
      });
  
      console.log("❌ Ошибка при удалении тега:", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Готовые теги</Text>

      <View style={styles.tagsContainer}>
        {tags.map((tag) => {
          const isSelected = selectedTagId === tag._id;
          return (
            <TouchableOpacity
              key={tag._id}
              style={[
                styles.tagWrapper,
                isSelected && styles.tagWrapperSelected
              ]}
              onPress={() =>
                isSelected ? setSelectedTagId(null) : setSelectedTagId(tag._id)
              }
            >
              <Text style={styles.tagText}>{tag.name}</Text>

              {isSelected && (
                <TouchableOpacity
                  style={styles.deleteIconWrapper}
                  onPress={() => handleDeleteTag(tag._id)}
                >
                  <DeleteSosTagIcon />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addTag}>
        <AddSosTagIcon />
        <Text style={styles.title}>Создать тег</Text>
      </TouchableOpacity>

      {/* 🔽 МОДАЛЬНОЕ ОКНО СОЗДАНИЯ ТЕГА */}
      <CustomModal
      visible={modalVisible}
      onClose={() => {
        setModalVisible(false);
        setNewTagName('');
      }}
      title="Создать тег"
      input={{
        placeholder: 'Название тега',
        value: newTagName,
        onChange: setNewTagName,
        showArrowIcon: false,
        showSearchIcon: false,
      }}
      buttons={[
        {
          label: 'Готово',
          action: handleCreateTag
        }
      ]}
    />

    </View>
  );
};

export default SosTags;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  tagWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 12,
    position: 'relative',
  },
  tagWrapperSelected: {
    backgroundColor: '#CECECE',
  },
  tagText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '700',
  },
  deleteIconWrapper: {
    position: 'absolute',
    top: -12,
    right: -12,
    padding: 2,
  },
  addTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 16,
  },
});