import React from 'react';
import { View, TextInput, StyleSheet, Platform } from 'react-native';
import SearchAdminIcon from '@/components/svgConvertedIcons/settings/searchAdminIcon';

interface SearchAdminProps {
  searchQuery: string;
  setSearchQuery: (text: string) => void;
  placeholder?: string;
}

const SearchAdmin: React.FC<SearchAdminProps> = ({ searchQuery, setSearchQuery, placeholder = 'Поиск...' }) => {
  return (
    <View style={[styles.inputSearchContainer, styles.inputAdded]}>
      <SearchAdminIcon/>
      <TextInput
        style={styles.inputSearch}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
      />
    </View>
  );
};

export default SearchAdmin;

export const styles = StyleSheet.create({
  inputSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  inputSearch: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingLeft: 10,
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  inputAdded:{
    marginBottom: 20,
  },
});
