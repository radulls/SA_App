import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputField from '../InputField'; // Компонент для текстовых полей
import Button from '../Button';
import LockIcon from '../svgConvertedIcons/LockIcon';

interface VerificationNameFormProps {
  value: { firstName: string; lastName: string };
  onDataChange: (data: { firstName?: string; lastName?: string }) => void;
  onSubmit: () => void;
}

const VerificationNameForm: React.FC<VerificationNameFormProps> = ({ value, onDataChange, onSubmit }) => {
  return (
    <View>
      <Text style={styles.stepIndicator}>Шаг 1 из 2</Text>
      <Text style={styles.instructions}>
        Укажите реальные имя и фамилию, для построения безопасной среды, необходимо знать своих друзей.
      </Text>
      <InputField
        label="Имя"
        value={value.firstName || ''}
        onChange={(val) => onDataChange({ firstName: val })}
      />
      <InputField
        label="Фамилия"
        value={value.lastName || ''}
        onChange={(val) => onDataChange({ lastName: val })}
      />
      <View style={styles.lockTextContainer}>
        <View style={styles.iconContainer}>
        <LockIcon />
        </View>
        <Text style={styles.text}>
          После верификации аккаунта, информация удаляется, не передаётся и не хранится на серверах, в целях нашей и вашей безопасности.
        </Text>
      </View>
      <Button title="Далее" onPress={onSubmit} disabled={!value.firstName || !value.lastName} />
    </View>
  );
};

const styles = StyleSheet.create({
	stepIndicator: {
		fontSize: 18,
		marginTop: 150,
    color: '#fff',
    fontFamily: "SFUIDisplay-Bold",
	},
	instructions: {
		fontSize: 12,
		fontFamily: "SFUIDisplay-Regular",
    color: '#fff',
		marginTop: 10,
		marginBottom: 26,
	},
  lockTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', 
    marginTop: 22,
    marginBottom: 20,
  },
  iconContainer: {
    width: 22, 
    height: 22, 
    marginRight: 8, 
    flexShrink: 0, 
  },
  text: {
    fontSize: 10,
    color: '#fff',
    fontFamily: "SFUIDisplay-medium",
    flexShrink: 1,
    flexGrow: 1, 
  },
})

export default VerificationNameForm;
