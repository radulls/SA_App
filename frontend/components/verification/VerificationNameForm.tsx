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
        <LockIcon/>
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
		marginTop: 186,
    color: '#fff',
    fontWeight: '700'
	},
  instructions: {
		fontSize: 12,
		marginTop: 10,
		marginBottom: 26,
    color: '#fff',
    fontWeight: '400'
	},
  lockTextContainer: {
		width: '90%',
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 22,
		zIndex: 999999,
		marginBottom: 20,
	},
  text: {
		fontSize: 10,
    color: '#fff',
    fontWeight: '500'
	},
})

export default VerificationNameForm;
