import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../components/AppButton';
import TeamBadge from '../components/TeamBadge';
import { API_URL } from '../config/api';

function calcularTabela(times, jogos) {
  const stats = {};
  times.forEach(t => {
    stats[t.id] = { time: t, pontos: 0, gols_marcados: 0, gols_tomados: 0 };
  });
  jogos.forEach(j => {
    const t1 = stats[j.fk_id_time1];
    const t2 = stats[j.fk_id_time2];
    if (!t1 || !t2) return;
    t1.gols_marcados += j.gols_time1;
    t1.gols_tomados  += j.gols_time2;
    t2.gols_marcados += j.gols_time2;
    t2.gols_tomados  += j.gols_time1;
    if (j.gols_time1 > j.gols_time2)       t1.pontos += 3;
    else if (j.gols_time1 === j.gols_time2) { t1.pontos += 1; t2.pontos += 1; }
    else                                    t2.pontos += 3;
  });
  return Object.values(stats).sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    const sa = a.gols_marcados - a.gols_tomados;
    const sb = b.gols_marcados - b.gols_tomados;
    if (sb !== sa) return sb - sa;
    return b.gols_marcados - a.gols_marcados;
  });
}

export default function TabelaScreen({ navigation, route }) {
  const { token } = route.params;
  const [tabela, setTabela] = useState([]);

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

  async function fetchTabela() {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [resTimes, resJogos] = await Promise.all([
        fetch(`${API_URL}/times`, { headers }),
        fetch(`${API_URL}/jogos`, { headers }),
      ]);
      const [times, jogos] = await Promise.all([resTimes.json(), resJogos.json()]);
      if (resTimes.ok && resJogos.ok) setTabela(calcularTabela(times, jogos));
    } catch {}
  }

  useEffect(() => {
    fetchTabela();
    const unsubscribe = navigation.addListener('focus', fetchTabela);
    return unsubscribe;
  }, []);

  function renderHeader() {
    return (
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.colPos]}>#</Text>
        <Text style={[styles.headerCell, styles.colBadge]}> </Text>
        <Text style={[styles.headerCell, styles.colSigla]}>Time</Text>
        <Text style={[styles.headerCell, styles.colNum]}>Pts</Text>
        <Text style={[styles.headerCell, styles.colNum]}>SG</Text>
        <Text style={[styles.headerCell, styles.colNum]}>GM</Text>
      </View>
    );
  }

  function renderRow({ item, index }) {
    const saldo = item.gols_marcados - item.gols_tomados;
    const saldoStr = saldo > 0 ? `+${saldo}` : String(saldo);
    return (
      <View style={[styles.row, index % 2 === 1 && styles.rowAlt]}>
        <Text style={[styles.cell, styles.colPos]}>{index + 1}</Text>
        <View style={styles.colBadge}>
          <TeamBadge time={item.time} size={32} />
        </View>
        <Text style={[styles.cell, styles.colSigla]}>{item.time.sigla}</Text>
        <Text style={[styles.cell, styles.colNum, styles.bold]}>{item.pontos}</Text>
        <Text style={[styles.cell, styles.colNum]}>{saldoStr}</Text>
        <Text style={[styles.cell, styles.colNum]}>{item.gols_marcados}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tableWrapper}>
        {renderHeader()}
        <FlatList
          data={tabela}
          keyExtractor={(item) => String(item.time.id)}
          renderItem={renderRow}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum dado disponível.</Text>
          }
        />
      </View>
      <View style={styles.bottomButtons}>
        <AppButton
          title="Times"
          variant="secondary"
          onPress={() => navigation.navigate('Times', { token })}
        />
        <View style={styles.gap} />
        <AppButton
          title="Jogos"
          variant="secondary"
          onPress={() => navigation.navigate('Jogos', { token })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  tableWrapper: {
    flex: 1,
    margin: 24,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#4CAF50',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#388E3C',
    borderBottomWidth: 1.5,
    borderBottomColor: '#fff',
  },
  headerCell: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
  },
  rowAlt: {
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  cell: { color: '#fff', fontSize: 14 },
  bold: { fontWeight: 'bold' },
  colPos:   { width: 24 },
  colBadge: { width: 40, marginRight: 8, alignItems: 'center' },
  colSigla: { flex: 1 },
  colNum:   { width: 36, textAlign: 'center' },
  empty: { color: '#fff', textAlign: 'center', marginTop: 24, opacity: 0.7 },
  bottomButtons: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  gap: { width: 12 },
});