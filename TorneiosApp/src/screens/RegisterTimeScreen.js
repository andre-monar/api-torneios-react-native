import React, { useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView,
  Platform, Image, TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import { API_URL } from '../config/api';

export default function RegisterTimeScreen({ navigation, route }) {
  const { token, time } = route.params;
  const editing = !!time;

  const [imagem, setImagem]           = useState(null);
  const [existingImage] = useState(time?.imagem ?? null);
  const [sigla, setSigla]             = useState(time?.sigla ?? '');
  const [nome, setNome]               = useState(time?.nome ?? '');
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setImagem(result.assets[0]);
  }

  function getImageSource() {
    if (imagem) return { uri: imagem.uri };
    if (existingImage) return { uri: `${API_URL}/uploads/${existingImage}` };
    return null;
  }

  async function handleSubmit() {
    setError('');
    if (!sigla || !nome) {
      setError('Sigla e Nome são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('sigla', sigla);
      formData.append('nome', nome);
      if (imagem) {
        const filename = imagem.uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        formData.append('imagem', { uri: imagem.uri, name: filename, type });
      }

      const url = editing ? `${API_URL}/times/${time.id}` : `${API_URL}/times`;
      const method = editing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Erro ao salvar time.');
        return;
      }
      navigation.goBack();
    } catch {
      setError('Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  }

  const imageSource = getImageSource();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.form}>
        <Text style={styles.label}>Imagem (opcional)</Text>
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {imageSource ? (
            <Image source={imageSource} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imagePickerText}>Toque para escolher</Text>
          )}
        </TouchableOpacity>

        <AppTextInput
          label="Sigla"
          value={sigla}
          onChangeText={setSigla}
          autoCapitalize="characters"
          maxLength={3}
        />
        <AppTextInput
          label="Nome"
          value={nome}
          onChangeText={setNome}
          maxLength={50}
          error={error}
        />
        <AppButton
          title={loading ? 'Salvando...' : editing ? 'Salvar' : 'Registrar'}
          onPress={handleSubmit}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center' },
  form: { paddingHorizontal: 24 },
  label: { color: '#000', marginBottom: 4, fontWeight: '600' },
  imagePicker: {
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  imagePickerText: { color: '#999' },
  imagePreview: { width: '100%', height: '100%', borderRadius: 6 },
});