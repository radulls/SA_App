import React, { useState, useRef, useEffect } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, TextInput, Modal, Animated, PanResponder,
  KeyboardAvoidingView, Platform, Keyboard, ScrollView, Image
} from 'react-native';
import Slider from '@react-native-community/slider'; // ✅ импорт правильного компонента
import IconArrowSettings from '../svgConvertedIcons/IconArrowSettings';
import DeleteAdressIcon from '../svgConvertedIcons/MapIcons/deleteAdressIcon';
import SearchAdminIcon from '../svgConvertedIcons/settings/searchAdminIcon';
import CheckMarkIcon from '../svgConvertedIcons/checkMarkIcon';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  buttons?: { label: string; action: () => void; type?: 'primary' | 'danger' | 'delete' | 'grayBack' | 'full' | 'redText' | 'extraBold' }[];
  hideOptionIcons?: boolean;
  optionTextStyle?: object; // 👈 стиль для текста в selectOptions
  buttonLayout?: 'row' | 'column'; // 👈 добавить сюда
  modalImage?: any; // может быть require или uri
  subtitle?: string;
  description?: string;
  multiple?: boolean; // включает множественный выбор
  selectedOptions?: string[]; // список выбранных значений
  onToggleOption?: (value: string) => void; // функция переключения чекбоксов

  input?: {
    placeholder: string;
    value: string;
    onChange?: (text: string) => void;
    onPress?: () => void;
    showArrowIcon?: boolean; 
    showSearchIcon?: boolean,
    isLarge?: boolean; 
  };  

  selectOptions?: { label: string; value: string }[];
  selectedOption?: string | null;
  onSelectOption?: (value: string) => void;
  onPress?: () => void; // 👈 добавлено
  slider?: { min: number; max: number; value: number; onChange: (val: number) => void };
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible, onClose, title, buttons = [], input, selectOptions, selectedOption, onSelectOption, slider, onPress, hideOptionIcons, optionTextStyle, selectedOptions, buttonLayout, modalImage, subtitle, description, multiple, onToggleOption, 
}) => {
  const translateY = useRef(new Animated.Value(300)).current;
  const [isInputFocused, setIsInputFocused] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(visible);

  const closeModal = () => {
    Keyboard.dismiss();
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 300,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      })
    ]).start(() => onClose());
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isInputFocused,
      onMoveShouldSetPanResponder: () => !isInputFocused,
      onPanResponderMove: (_, gestureState) => {
        if (!isInputFocused && gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (!isInputFocused) {
          if (gestureState.dy > 100) {
            closeModal();
          } else {
            Animated.timing(translateY, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start();
          }
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 300,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        })
      ]).start(() => setShouldRender(false)); // 👈 ждём завершения, потом убираем из DOM
    }
  }, [visible]);
  
  if (!shouldRender) return null;

  return (
    <Modal  transparent visible={shouldRender}>
      <Animated.View style={[styles.modalOverlay, { opacity: overlayOpacity }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  style={{ flex: 1, width: '100%', alignItems: 'center'}}>
          <View style={styles.touchableOverlay}>
            {/* Затемнение для закрытия по нажатию вне модалки */}
            <TouchableOpacity
              style={styles.overlayTouchableArea}
              activeOpacity={1}
              onPress={closeModal}
            />
    
            {/* Модальное окно */}
            <Animated.View
              style={[styles.modalContainer, { transform: [{ translateY }] }]}
              {...panResponder.panHandlers}
            >
              <View style={styles.topItems}>
                <View style={styles.dragHandle} />
                {modalImage && (
                  <Image
                    source={typeof modalImage === 'string' ? { uri: modalImage } : modalImage}
                    style={{ width: 68, height: 68, borderRadius: 12, marginVertical: 10 }}
                  />
                )}
                <Text style={styles.modalTitle}>{title}</Text>
                {subtitle && (
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#000', textAlign: 'center', marginVertical: 20 }}>
                    {subtitle}
                  </Text>
                )}
                {description && (
                  <Text style={{ fontSize: 14, color: '#000', textAlign: 'center', fontWeight: '400',}}>
                    {description}
                  </Text>
                )}
              </View>       
              <ScrollView contentContainerStyle={styles.contentContainer}>
                {/* Инпут */}
                {input && (
                  <>
                    <Text style={styles.label}>{input.placeholder}</Text>
                    {input.onPress ? (
                     <TouchableOpacity style={styles.input} onPress={input.onPress}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: input.value ? '#000' : '#888', flex: 1 }}>
                          {input.value || input.placeholder}
                        </Text>
                        {input.showArrowIcon && (
                          <View style={{ transform: [{rotate: '90deg'}] }}>
                            <IconArrowSettings fill="#000" />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                    ) : (
                      <View style={{ position: 'relative' }}>
                      <View style={styles.inputSearchContainer}>
                      {input.showSearchIcon && (
                        <SearchAdminIcon />
                      )}
                        <TextInput
                          style={[styles.inputSearch]}
                          placeholder={input.placeholder}
                          value={input.value}
                          onFocus={() => setIsInputFocused(true)}
                          onBlur={() => setIsInputFocused(false)}
                          onChangeText={input.onChange}
                          multiline={input.isLarge}
                          numberOfLines={input.isLarge ? 5 : 1}
                        />
                      </View>      
                      {/* Кнопка удаления (крестик) */}
                      {input.value?.length > 0 && input.onChange && !input.onPress && (
                        <TouchableOpacity
                          onPress={() => input.onChange?.('')}
                          style={{
                            position: 'absolute',
                            right: 10,
                            top: 17,
                            zIndex: 10,
                          }}
                        >
                          <DeleteAdressIcon />
                        </TouchableOpacity>
                      )}
                    </View>
                    )}
                  </>
                )}
                {/* Селект (радио-кнопки) */}
                {selectOptions && (
                  selectOptions.map(option => {
                    if ((option as any).isTitle) {
                      return (
                        <Text
                          key={option.value}
                          style={{
                            fontSize: 12,
                            fontWeight: '600',
                            marginTop: 20,
                            marginBottom: 8,
                            color: '#999',
                          }}
                        >
                          {option.label}
                        </Text>
                      );
                    }

                    const isSelected = multiple
                      ? selectedOptions?.includes(option.value)
                      : selectedOption === option.value;

                    return (
                      <TouchableOpacity
                        key={option.value}
                        style={styles.modalButton}
                        onPress={() => {
                          if (multiple && onToggleOption) {
                            onToggleOption(option.value);
                          } else if (onSelectOption) {
                            onSelectOption(option.value);
                          }
                        }}
                      >
                        <Text
                          style={[
                            styles.modalButtonText,
                            typeof optionTextStyle === 'function'
                              ? optionTextStyle(option.value)
                              : optionTextStyle,
                            (option as any).isOtherCity && { fontWeight: '400', color: '#000' },
                          ]}
                        >
                          {option.label}
                        </Text>
                        {!hideOptionIcons && (
                          <View
                            style={[
                              styles.radioCircle,
                              isSelected && styles.activeCircle,
                              multiple && {
                                borderWidth: 2,
                                borderColor: isSelected ? '#000' : '#DFDFDF',
                                backgroundColor: isSelected ? '#000' : 'transparent',
                              },
                            ]}
                          >
                            {multiple && isSelected && <CheckMarkIcon width={10} fill="#fff" />}
                            {!multiple && isSelected && <View style={styles.radioInnerCircle} />}
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })
                )}

                {/* Слайдер */}
                {slider && (
                  <View style={{ marginTop: 20 }}>
                    <Slider
                      style={{ width: '100%', height: 40 }}
                      minimumValue={slider.min}
                      maximumValue={slider.max}
                      step={1}
                      value={slider.value}
                      onValueChange={slider.onChange}
                      minimumTrackTintColor="#000"
                      maximumTrackTintColor="#ccc"
                      thumbTintColor="#000"
                    />
                    <Text style={{ textAlign: 'left', marginBottom: 10, fontSize: 14, fontWeight: '600' }}>
                      {slider.value} дней
                    </Text>
                  </View>
                )}
                {/* Кнопки */}
                {buttons.length > 0 && (
                  <View
                  style={[
                    styles.buttonContainer,
                    buttonLayout === 'column' && styles.buttonContainerColumn // 👈 применяем стиль для колонок
                  ]}
                >                
                    {buttons.map((button, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[styles.button, button.type === 'danger' && styles.dangerButton, button.type === 'delete' && styles.deleteButton, button.type === 'grayBack' && styles.grayBackButton, button.type === 'full' && styles.fullButton, button.type === 'redText' && styles.grayBackButton]}
                        onPress={button.action}
                      >
                        <Text style={[styles.buttonText, button.type === 'danger' && styles.buttonTextDanger, button.type === 'grayBack' && styles.grayBackText, button.type === 'redText' && styles.redText, button.type === 'extraBold' && styles.extraBoldText]}>{button.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </ScrollView>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%', 
  },
  touchableOverlay: { 
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center' ,
    width: '100%',
    maxWidth: 600,
    borderRadius: 10,
  },
  overlayTouchableArea: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    maxWidth: 600,
  },  
  modalContainer: { 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20, 
    width: '100%'
  },
  topItems:{
    alignItems: 'center',
  },
  dragHandle: { 
    width: 36, 
    height: 4, 
    backgroundColor: '#DADBDA', 
    borderRadius: 3, 
    marginBottom: 10, 
  },
  modalTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  contentContainer: { 
    paddingBottom: 20, 

  },
  modalButton: { 
    paddingVertical: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  modalButtonText: { 
    fontSize: 14, 
    fontWeight: '700' 
  },
  selectedButton: { 
    // backgroundColor: '#F3F3F3', 
    // borderRadius: 8 
  },
  radioCircle: { 
    width: 22, 
    height: 22, 
    borderRadius: 15, 
    borderWidth: 2, 
    borderColor: '#E7E7E7', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  activeCircle: { 
    borderColor: '#000', 
    borderWidth: 7 
  },
  radioInnerCircle: {
    width: 10,
    height: 10, 
    borderRadius: 5 
  },
  label: { 
    fontSize: 14, 
    fontWeight: '700', 
    marginTop: 10 
  },
  input: { 
    borderRadius: 12, 
    backgroundColor: '#F3F3F3', 
    height: 40, 
    padding: 10, 
    marginTop: 5,
    borderColor: 'transparent',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
    // alignItems: 'center',
  },
  buttonContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingTop: 40,
  },
  buttonContainerColumn: {
    flexDirection: 'column',
    gap: 12,
    paddingTop: 0,
    alignItems: 'flex-start'
  },  
  button: { 
    borderRadius: 8, 
    backgroundColor: '#000', 
    alignItems: 'center', 
    justifyContent: 'center',
    width: 124,
    height: 44,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 12, 
    fontWeight: '700' 
  },
  dangerButton: { 
    backgroundColor: '#fff' 
  },
  buttonTextDanger:{
    color: '#000'
  },
  deleteButton:{
    backgroundColor: '#f00', 
  },
  grayBackButton:{
    width: '100%',
    alignItems: 'flex-start',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  fullButton:{
    width: '100%'
  },
  grayBackText:{
    color: '#000',
    paddingLeft: 16,
  },
  redText:{
    color: '#F00',
    paddingLeft: 16,
  },
  extraBoldText:{
    fontSize: 12,
    fontWeight: '800',
  },
  inputWithIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputIcon: {
    marginLeft: 8,
  },
  largeInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    marginTop: 5,
    marginBottom: 10,
  },
  inputSearch: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    paddingLeft: 10,
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
    
});

export default CustomModal;
