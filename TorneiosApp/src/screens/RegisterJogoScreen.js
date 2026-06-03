import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import { API_URL } from '../config/api';

export default function RegisterJogoScreen({ navigation, route }) {
  const { token, jogo } = route.params;
  const editing = !!jogo;

  const [times, setTimes]   = useState([]);
  const [time1, setTime1]   = useState(jogo?.fk_id_time1 ?? null);
  const [time2, setTime2]   = useState(jogo?.fk_id_time2 ?? null);
  const [gols1, setGols1]   = useState(jogo?.gols_time1?.toString() ?? '');
  const [gols2, setGols2]   = useState(jogo?.gols_time2?.toString() ?? '');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTimes() {
      try {
        const res = await fetch(`${API_URL}/times`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setTimes(data);
          if (!editing && data.length > 0) {
            setTime1(data[0].id);
            setTime2(data[0].id);
          }
        }
      } catch {}
    }
    fetchTimes();
  }, []);

  async function handleSubmit() {
    setError('');
    if (!time1 || !time2 || gols1 === '' || gols2 === '') {
        setError('Preencha todos os campos.');
        return;
    }
    if (time1 === time2) {
        setError('Time 1 e Time 2 devem ser diferentes.');
        return;
    }

    setLoading(true);
    try {
      const url = editing ? `${API_URL}/jogos/${jogo.id}` : `${API_URL}/jogos`;
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fk_id_time1: time1,
          fk_id_time2: time2,
          gols_time1: parseInt(gols1),
          gols_time2: parseInt(gols2),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Erro ao salvar jogo.');
        return;
      }
      navigation.goBack();
    } catch {
      setError('Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Time 1</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={time1} onValueChange={setTime1}>
            {times.map((t) => (
              <Picker.Item key={t.id} label={t.sigla} value={t.id} />
            ))}
          </Picker>
        </View>

        <AppTextInput
          label="Gols Time 1"
          value={gols1}
          onChangeText={setGols1}
          keyboardType="numeric"
          maxLength={3}
        />

        <AppTextInput
          label="Gols Time 2"
          value={gols2}
          onChangeText={setGols2}
          keyboardType="numeric"
          maxLength={3}
          error={error}
        />

        <Text style={styles.label}>Time 2</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={time2} onValueChange={setTime2}>
            {times.map((t) => (
              <Picker.Item key={t.id} label={t.sigla} value={t.id} />
            ))}
          </Picker>
        </View>

        <AppButton
          title={loading ? 'Salvando...' : editing ? 'Salvar' : 'Registrar'}
          onPress={handleSubmit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  form: { padding: 24 },
  label: { color: '#000', marginBottom: 4, fontWeight: '600' },
  pickerWrapper: {
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    borderRadius: 6,
    marginBottom: 16,
    overflow: 'hidden',
  },
});