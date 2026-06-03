import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function AppButton({ title, onPress, variant = 'primary' }) {
  return (
    <TouchableOpacity
      style={[styles.button, variant === 'secondary' && styles.secondary]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, variant === 'secondary' && styles.textSecondary]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  secondary: {
    backgroundColor: '#EEEEEE',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  textSecondary: {
    color: '#000',
  },
});