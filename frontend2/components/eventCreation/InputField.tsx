import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';

type InputFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  maxLength?: number;
  isLarge?: boolean;
  secureTextEntry?: boolean;
  editable?: boolean; 
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  multiline = false,
  maxLength = 150,
  isLarge = false,
  secureTextEntry = false,
}) => {
  const [inputHeight, setInputHeight] = useState(isLarge ? 100 : 48);
  const inputRef = useRef<TextInput>(null);

  const handleContentSizeChange = (event: any) => {
    if (Platform.OS !== 'web') {
      const contentHeight = event.nativeEvent.contentSize.height;
      setInputHeight(contentHeight);
    }
  };

  // 🧠 Web: ручной пересчёт высоты через DOM
  useEffect(() => {
    if (Platform.OS === 'web' && inputRef.current) {
      const input = inputRef.current as unknown as HTMLTextAreaElement;
      if (input) {
        input.style.height = 'auto'; // сначала сбрасываем
        input.style.height = input.scrollHeight + 'px';
        setInputHeight(input.scrollHeight);
      }
    }
  }, [value]);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          {
            height: inputHeight,
            minHeight: isLarge ? 100 : 48,
            maxHeight: 300,
          },
        ]}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        value={value ?? ''}
        onChangeText={(text) => {
          if (isLarge && text.length > maxLength) return;
          onChangeText(text);
        }}
        maxLength={isLarge ? maxLength : undefined}
        numberOfLines={multiline ? undefined : 1}
        accessibilityLabel={label}
        onContentSizeChange={handleContentSizeChange}
        placeholderTextColor="rgba(0, 0, 0, 0.5)"
      />
      {isLarge && <Text style={styles.charCount}>{`${(value || '').length}/${maxLength}`}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 14,
  },
  label: {
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    borderRadius: 12,
    backgroundColor: 'rgba(243, 243, 243, 1)',
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 14,
    paddingBottom: 14,
    color: 'rgba(0, 0, 0, 1)',
    textAlignVertical: 'top',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  charCount: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontWeight: '400',
    color: '#000',
    marginTop: 4,
  },
});

export default InputField;
