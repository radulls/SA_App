import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

interface BottomSheetMenuProps {
  isVisible: boolean;
  onClose: () => void;
  buttons: { label: string; onPress: () => void; icon?: JSX.Element | null; isRowButton?: boolean }[];
}

const BottomSheetMenu: React.FC<BottomSheetMenuProps> = ({ isVisible, onClose, buttons }) => {
  const translateY = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start(() => setIsAnimating(false));
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 300, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => {
        setIsAnimating(false);
        onClose();
      });
    }
  }, [isVisible]);

  const handleClose = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      Animated.parallel([
        Animated.timing(translateY, { toValue: 300, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => {
        setIsAnimating(false);
        onClose();
      });
    }
  };

  const handleButtonPress = (onPress: () => void) => {
    handleClose();
    setTimeout(() => {
      onPress();
    }, 200);
  };

  return (
    <Modal visible={isVisible} transparent>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
      <TouchableOpacity style={styles.touchableOverlay} activeOpacity={1} onPress={handleClose}>
        <Animated.View style={[styles.menuContainer, { transform: [{ translateY }] }]}>        
          
          {/* Блок для кнопок "Копировать" и "Поделиться" */}
          <View style={styles.rowButtons}>
            {buttons
              .filter(button => button.isRowButton)
              .map((button, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.rowButton} 
                  onPress={() => handleButtonPress(button.onPress)}
                >
                  {button.icon && <View style={styles.icon}>{button.icon}</View>}
                  <Text style={styles.rowButtonText}>{button.label}</Text>
                </TouchableOpacity>
              ))}
          </View>

          {/* Остальные кнопки в столбик */}
          <View style={styles.columnButtons}>
            {buttons
              .filter(button => !button.isRowButton)
              .map((button, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.menuButton} 
                  onPress={() => handleButtonPress(button.onPress)}
                >
                  {button.icon && <View style={styles.icon}>{button.icon}</View>}
                  <Text style={styles.buttonText}>{button.label}</Text>
                </TouchableOpacity>
              ))}
          </View>

          {/* Кнопка "Отмена" */}
          <TouchableOpacity style={styles.menuButton} onPress={handleClose}>
            <Text style={styles.buttonText}>Отмена</Text>
          </TouchableOpacity>

        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  touchableOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rowButton: {
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  columnButtons: {
    flexDirection: 'column',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 17,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 12,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '700',
  },
  rowButtonText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
    paddingTop: 10,
  },
});

export default BottomSheetMenu;
