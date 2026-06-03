import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../components/AppButton';
import TeamBadge from '../components/TeamBadge';
import { API_URL } from '../config/api';

export default function JogosScreen({ navigation, route }) {
  const { token } = route.params;
  const [jogos, setJogos] = useState([]);

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

  async function fetchJogos() {
    try {
      const res = await fetch(`${API_URL}/jogos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setJogos(data);
    } catch {}
  }

  useEffect(() => {
    fetchJogos();
    const unsubscribe = navigation.addListener('focus', fetchJogos);
    return unsubscribe;
  }, []);

  function handleDelete(id) {
    Alert.alert('Excluir', 'Deseja excluir este jogo?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: async () => {
          await fetch(`${API_URL}/jogos/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          fetchJogos();
        },
      },
    ]);
  }

  function renderJogo({ item }) {
    return (
      <View style={styles.card}>
        <View style={styles.colTeam}>
          <TeamBadge time={item.Time1} size={44} />
        </View>
        <View style={styles.colGols}>
          <Text style={styles.gols}>{item.gols_time1}</Text>
        </View>
        <View style={styles.colX}>
          <Text style={styles.x}>X</Text>
        </View>
        <View style={styles.colGols}>
          <Text style={styles.gols}>{item.gols_time2}</Text>
        </View>
        <View style={styles.colTeam}>
          <TeamBadge time={item.Time2} size={44} />
        </View>
        <View style={styles.colActions}>
          <TouchableOpacity
            style={styles.actionTop}
            onPress={() => navigation.navigate('RegisterJogo', { token, jogo: item })}
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
          title="Registrar Jogo"
          onPress={() => navigation.navigate('RegisterJogo', { token })}
        />
      </View>
      <FlatList
        data={jogos}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderJogo}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum jogo cadastrado.</Text>
        }
      />
      <View style={styles.bottomButtons}>
        <AppButton
          title="Times"
          variant="secondary"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.gap} />
        <AppButton
          title="Tabela"
          onPress={() => navigation.navigate('Tabela', { token })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topButton: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  bottomButtons: { flexDirection: 'row', paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 },
  gap: { width: 12 },
  list: { padding: 24, gap: 12 },
  card: {
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  colTeam: { width: 52, alignItems: 'center', justifyContent: 'center' },
  colGols: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  gols: { fontSize: 22, fontWeight: 'bold', color: '#000' },
  colX: { paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center' },
  x: { fontSize: 16, color: '#AAAAAA', fontWeight: '600' },
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
  actionEdit: { color: '#fff', fontWeight: '600', fontSize: 12 },
  actionDelete: { color: '#fff', fontWeight: '600', fontSize: 12 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
});