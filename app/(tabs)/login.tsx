import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState('');

  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const validateEmail = (value: string) => {
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Insira um e-mail válido.');
    } else {
      setEmailError('');
    }
  };

  const isFormValid = () => {
    return email.trim() !== '' && password.trim() !== '' && emailError === '';
  };

  return (
    <View style={styles.container}>
      {/* Ícone de voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.title}>Entrar</Text>

      {/* Campo de e-mail */}
      <TextInput 
        placeholder="Email" 
        placeholderTextColor="#888888"
        style={styles.input} 
        value={email} 
        onChangeText={validateEmail} 
        keyboardType="email-address"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      {/* Campo de senha */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#888888"
          secureTextEntry={!passwordVisible}
          style={styles.passwordInput}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Botão de continuar */}
      <TouchableOpacity 
        style={[styles.primaryButton, !isFormValid() && styles.buttonDisabled]} 
        disabled={!isFormValid()}
        onPress={() => router.push('/quiz')}
      >
        <Text style={styles.primaryButtonText}>Continuar</Text>
      </TouchableOpacity>

      {/* Links para registro e recuperação de senha */}
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.linkText}>Ainda não possui uma conta? Cadastre-se aqui</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/forgot-password')}>
          <Text style={styles.linkText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      padding: 20,
      justifyContent: 'center',
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
      marginBottom: 40,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: '#CCCCCC',
      backgroundColor: '#F9F9F9',
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 12,
      fontSize: 16,
    },
    errorText: {
      color: 'red',
      fontSize: 14,
      marginBottom: 10,
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#CCCCCC',
      backgroundColor: '#F9F9F9',
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 15,
    },
    passwordInput: {
      flex: 1,
      height: 50,
      fontSize: 16,
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
    linksContainer: {
      alignItems: 'center',
      marginTop: 10,
    },
    linkText: {
      color: '#1B3C87',
      fontSize: 14,
      textDecorationLine: 'underline',
      marginBottom: 8,
    },
  });
  
