import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import CustomHeaderBar from '@/components/ui/CustomHeaderBar';
import { routes } from '@/routes';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [inputError, setInputError] = useState('');

  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const validateInput = (value: string) => {
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      setInputError('Insira um e-mail válido.');
    } else {
      setInputError('');
    }
  };

  const isFormValid = () => {
    return email.trim() !== '' && inputError === '';
  };

  return (
    <View style={styles.container}>
      <CustomHeaderBar
        leftIcon={{ name: 'arrow-back-outline', route: routes.index }}
      />
      <View style={styles.content}>
        {/* Título */}
        <Text style={styles.title}>Recupere sua senha</Text>

        {/* Campo de e-mail */}
        <TextInput 
          placeholder="Email" 
          placeholderTextColor="#888888"
          style={styles.input} 
          value={email} 
          onChangeText={validateInput} 
        />
        {inputError ? <Text style={styles.errorText}>{inputError}</Text> : null}

        {/* Botão de continuar */}
        <TouchableOpacity 
          style={[styles.primaryButton, !isFormValid() && styles.buttonDisabled]} 
          disabled={!isFormValid()}
        >
          <Text style={styles.primaryButtonText}>Continuar</Text>
        </TouchableOpacity>

        {/* Link para registro */}
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.linkText}>Ainda não possui uma conta? Cadastre-se aqui</Text>
        </TouchableOpacity>
      </View>
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: -200,
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
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#1B3C87',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});
