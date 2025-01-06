import React, { useState, useEffect } from 'react';

import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

function VerificationReject({onCancel, onReject}) {
	const [message, setMessage] = useState('')
  return (
    <View style={styles.container}>
      <View style={styles.indicator} />
      <Text style={styles.title}>Отказ верификации аккаунта</Text>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Комментарий</Text>
        <TextInput
          style={styles.commentInput}
          multiline
		  onChangeText={value => setMessage(value)}
          numberOfLines={4}
          accessibilityLabel="Введите комментарий"
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Отмена</Text>
          </TouchableOpacity>
          <TouchableOpacity  onPress={e => {onReject(message)}} style={styles.rejectButton}>
            <Text style={styles.rejectButtonText}>Отказать</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 1)",
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    padding: 11,
    paddingBottom: 40,
  },
  indicator: {
    borderRadius: 2,
    backgroundColor: "rgba(218, 219, 218, 1)",
    width: 36,
    height: 4,
  },
  title: {
    color: "rgba(0, 0, 0, 1)",
    fontSize: 15,
    textAlign: "center",
    marginTop: 20,
  },
  formContainer: {
    alignSelf: "stretch",
    display: "flex",
    marginTop: 31,
    width: "100%",
    flexDirection: "column",
    alignItems: "stretch",
    padding: 16,
  },
  label: {
    color: "rgba(0, 0, 0, 1)",
    fontSize: 14,
    alignSelf: "flex-start",
  },
  commentInput: {
    borderRadius: 12,
    backgroundColor: "rgba(243, 243, 243, 1)",
    marginTop: 9,
    height: 100,
    textAlignVertical: "top",
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 41,
  },
  cancelButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "rgba(0, 0, 0, 1)",
    fontSize: 12,
  },
  rejectButton: {
    borderRadius: 8,
    backgroundColor: "rgba(255, 0, 0, 1)",
    padding: 18,
    paddingHorizontal: 35,
  },
  rejectButtonText: {
    color: "rgba(255, 255, 255, 1)",
    fontSize: 12,
    textAlign: "center",
  },
});

export default VerificationReject;