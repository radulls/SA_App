import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Platform } from 'react-native';

interface SosFormProps {
  location: { latitude: number; longitude: number; address: string };
  goBackToMap: () => void;
  title: string;
  setTitle: (text: string) => void;
  description: string;
  setDescription: (text: string) => void;
  tags: string[];
  setTags: (tags: string[] | ((prevTags: string[]) => string[])) => void;
  availableTags: string[];
}

const SosForm: React.FC<SosFormProps> = ({
  location,
  goBackToMap,
  title,
  setTitle,
  description,
  setDescription,
  tags,
  setTags,
  availableTags
}) => {

  // 📌 Функция для выбора тега
  const toggleTag = (tag: string) => {
    setTags((prevTags: string[]) =>
      prevTags.includes(tag) ? prevTags.filter((t: string) => t !== tag) : [...prevTags, tag]
    );
  };

  return (
    <View>
      <Text style={styles.label}>Локация</Text>
      <TouchableOpacity onPress={goBackToMap} style={styles.adressContainer}>
        <Text style={styles.address}>{location.address}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Готовые теги</Text>
      <FlatList
        style={styles.tagContainer}
        data={availableTags}
        keyExtractor={(item) => item}
        contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.tagButton, tags.includes(item) && styles.selectedTag]}
            onPress={() => toggleTag(item)}
          >
            <Text style={[styles.tagText, tags.includes(item) && styles.selectedTagText]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.label}>Заголовок</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} />

      <Text style={styles.label}>Детали</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        multiline
        style={[styles.input, styles.description]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontFamily: "SFUIDisplay-bold",
    paddingBottom: 6,
  },
  adressContainer: {
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#F3F3F3',
  },
  address: {
    fontSize: 14,
    fontFamily: "SFUIDisplay-regular",
  },
  tagContainer: {
    marginBottom: 18,
  },
  tagButton: {
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 12,
    paddingVertical: 7.5,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 12,
    alignItems: 'center',
    flex: 1,
  },
  selectedTag: {
    backgroundColor: '#F22C2C',
  },
  tagText: {
    fontSize: 12,
    fontFamily: "SFUIDisplay-semibold",
    color: '#000',
  },
  selectedTagText: {
    color: '#fff',
  },
  input: {
    fontSize: 14,
    fontWeight: '400',
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#F3F3F3',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  description: {
    height: 100,
    paddingVertical: 16,
    marginBottom: 20,
  },
});

export default SosForm;
