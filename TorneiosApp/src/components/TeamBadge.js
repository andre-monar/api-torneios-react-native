import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { API_URL } from '../config/api';

export default function TeamBadge({ time, size = 44 }) {
  if (time?.imagem) {
    return (
      <Image
        source={{ uri: `${API_URL}/uploads/${time.imagem}` }}
        style={{ width: size, height: size, borderRadius: 4 }}
      />
    );
  }
  return (
    <View style={[styles.placeholder, { width: size, height: size }]}>
      <Text style={styles.label}>Sigla</Text>
      <Text style={styles.sigla}>{time?.sigla}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    borderRadius: 4,
    backgroundColor: '#D0D0D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 9, color: '#777' },
  sigla: { fontSize: 11, fontWeight: '700', color: '#444' },
});