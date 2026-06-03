import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function AppTextInput({ label, error, ...props }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="#999"
        {...props}
      />
      <Text style={styles.errorText}>{error ?? ''}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 4,
  },
  label: {
    color: '#000',
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    borderRadius: 6,
    padding: 10,
    color: '#000',
  },
  inputError: {
    borderColor: '#e53935',
  },
  errorText: {
    color: '#e53935',
    fontWeight: 'bold',
    fontSize: 12,
    minHeight: 18,
    marginTop: 4,
  },
});