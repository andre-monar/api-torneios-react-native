import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View, Text, FlatList, Image, StyleSheet,
  TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../components/AppButton';
import { API_URL } from '../config/api';

export default function TimesScreen({ navigation, route }) {
  const { token } = route.params;
  const [times, setTimes] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() =>
            Alert.alert('Deslogar', 'Deseja deslogar?', [
              { text: 'Não', style: 'cancel' },
              {
                text: 'Sim',
                onPress: () =>
                  navigation.reset({ index: 0, routes: [{ name: 'Login' }] }),
              },
            ])
          }
          style={{ marginLeft: 4 }}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  async function fetchTimes() {
    try {
      const res = await fetch(`${API_URL}/times`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setTimes(data);
    } catch {}
  }

  useEffect(() => {
    fetchTimes();
    const unsubscribe = navigation.addListener('focus', fetchTimes);
    return unsubscribe;
  }, []);

  function handleDelete(id) {
    Alert.alert('Excluir', 'Deseja excluir este time?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: async () => {
          await fetch(`${API_URL}/times/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          fetchTimes();
        },
      },
    ]);
  }

  function renderTime({ item }) {
    return (
      <View style={styles.card}>
        <View style={styles.colImage}>
          {item.imagem ? (
            <Image
              source={{ uri: `${API_URL}/uploads/${item.imagem}` }}
              style={styles.image}
            />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
        </View>
        <View style={styles.colSigla}>
          <Text style={styles.cardLabel}>Sigla</Text>
          <Text style={styles.cardValue}>{item.sigla}</Text>
        </View>
        <View style={styles.colNome}>
          <Text style={styles.cardLabel}>Nome</Text>
          <Text style={styles.cardValue}>{item.nome}</Text>
        </View>
        <View style={styles.colActions}>
          <TouchableOpacity
            style={styles.actionTop}
            onPress={() => navigation.navigate('RegisterTime', { token, time: item })}
          >
            <Text style={styles.actionEdit}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBottom}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.actionDelete}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topButton}>
        <AppButton
          title="Registrar Time"
          onPress={() => navigation.navigate('RegisterTime', { token })}
        />
      </View>
      <FlatList
        data={times}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderTime}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum time cadastrado.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topButton: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  list: { padding: 24, gap: 12 },
  card: {
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  colImage: { width: 56, marginRight: 12, justifyContent: 'center' },
  image: { width: 56, height: 56, borderRadius: 4 },
  imagePlaceholder: { width: 56, height: 56, borderRadius: 4, backgroundColor: '#D0D0D0' },
  colSigla: { width: 72, marginRight: 12, justifyContent: 'center' },
  colNome: { flex: 1, justifyContent: 'center' },
  cardLabel: { fontSize: 11, color: '#777', marginBottom: 2 },
  cardValue: { fontSize: 15, fontWeight: '600', color: '#000' },
  colActions: { width: 64, marginLeft: 12 },
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
  actionEdit: { color: '#fff', fontWeight: '600', fontSize: 12 },
  actionDelete: { color: '#fff', fontWeight: '600', fontSize: 12 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
});