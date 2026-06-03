import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import { API_URL } from '../config/api';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail]               = useState('');
  const [senha, setSenha]               = useState('');
  const [confirmarSenha, setConfirmar]  = useState('');
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);

  async function handleRegister() {
    setError('');
    if (senha !== confirmarSenha) {
      setError('As senhas não conferem.');
      return;
    }
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Erro ao registrar.');
        return;
      }
      navigation.navigate('Login');
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Servidor indisponível. Tente novamente.');
      } else {
        setError('Não foi possível conectar ao servidor.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.form}>
        <AppTextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <AppTextInput
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        <AppTextInput
          label="Confirmar senha"
          value={confirmarSenha}
          onChangeText={setConfirmar}
          secureTextEntry
          error={error}
        />
        <AppButton title={loading ? 'Registrando...' : 'Registrar'} onPress={handleRegister} />
        <View style={styles.gap} />
        <AppButton title="Já tenho conta" variant="secondary" onPress={() => navigation.navigate('Login')} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  form: {
    paddingHorizontal: 24,
  },
  gap: {
    height: 10,
  },
});
