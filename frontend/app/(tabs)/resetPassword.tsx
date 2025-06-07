// app/reset-password.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CustomHeaderBar from '@/components/ui/CustomHeaderBar';
import { resetPassword } from '@/services/authService';
import { routes } from '@/routes';
import SuccessModal from '@/components/ui/SuccessModal';

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const validate = () => {
    if (newPassword.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
    if (newPassword !== confirmPassword) return 'As senhas não coincidem.';
    return '';
  };

  const handleReset = async () => {
    const validationError = validate();
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    try {
      await resetPassword(token, newPassword);
      setSuccessModalVisible(true);
    } catch (err) {
      Alert.alert('Erro', 'Falha ao redefinir a senha. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeaderBar title="Redefinir Senha" leftIcon={{ name: 'arrow-back-outline', route: routes.login }} />
      
      <View style={styles.content}>
        <TextInput
          placeholder="Nova senha"
          secureTextEntry
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TextInput
          placeholder="Confirmar nova senha"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleReset}
        >
          <Text style={styles.primaryButtonText}>Redefinir senha</Text>
        </TouchableOpacity>
      </View>

      <SuccessModal
        visible={successModalVisible}
        onClose={() => {
          setSuccessModalVisible(false);
          router.push('/login');
        }}
        message="Senha redefinida com sucesso!"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#1B3C87',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
