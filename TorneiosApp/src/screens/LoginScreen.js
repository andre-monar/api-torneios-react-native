import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import { API_URL } from '../config/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail]     = useState('');
  const [senha, setSenha]     = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError('');
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Credenciais inválidas!');
        return;
      }
      navigation.navigate('Home');
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
          error={error}
        />
        <AppButton title={loading ? 'Entrando...' : 'Login'} onPress={handleLogin} />
        <View style={styles.gap} />
        <AppButton title="Registrar" variant="secondary" onPress={() => {}} />
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