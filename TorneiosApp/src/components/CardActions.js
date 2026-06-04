import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CardActions({ onEdit, onDelete }) {
  return (
    <View style={styles.colActions}>
      <TouchableOpacity style={styles.actionTop} onPress={onEdit}>
        <Text style={styles.actionEdit}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionBottom} onPress={onDelete}>
        <Text style={styles.actionDelete}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  colActions: { width: 64, marginLeft: 8 },
  actionTop: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  actionBottom: {
    flex: 1,
    backgroundColor: '#e53935',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionEdit:   { color: '#fff', fontWeight: '600', fontSize: 12 },
  actionDelete: { color: '#fff', fontWeight: '600', fontSize: 12 },
});
