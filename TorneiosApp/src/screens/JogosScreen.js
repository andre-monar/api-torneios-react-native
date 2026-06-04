import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, Alert, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../components/AppButton';
import CardActions from '../components/CardActions';
import TeamBadge from '../components/TeamBadge';
import { shared } from '../styles/shared';
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
      <View style={shared.card}>
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
        <CardActions
          onEdit={() => navigation.navigate('RegisterJogo', { token, jogo: item })}
          onDelete={() => handleDelete(item.id)}
        />
      </View>
    );
  }

  return (
    <View style={shared.container}>
      <View style={shared.topButton}>
        <AppButton
          title="Registrar Jogo"
          onPress={() => navigation.navigate('RegisterJogo', { token })}
        />
      </View>
      <FlatList
        data={jogos}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderJogo}
        contentContainerStyle={shared.list}
        ListEmptyComponent={
          <Text style={shared.empty}>Nenhum jogo cadastrado.</Text>
        }
      />
      <View style={shared.bottomButtons}>
        <AppButton
          title="Times"
          variant="secondary"
          onPress={() => navigation.goBack()}
        />
        <View style={shared.gap} />
        <AppButton
          title="Tabela"
          onPress={() => navigation.navigate('Tabela', { token })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  colTeam: { width: 52, alignItems: 'center', justifyContent: 'center' },
  colGols: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  gols:    { fontSize: 22, fontWeight: 'bold', color: '#000' },
  colX:    { paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center' },
  x:       { fontSize: 16, color: '#AAAAAA', fontWeight: '600' },
});