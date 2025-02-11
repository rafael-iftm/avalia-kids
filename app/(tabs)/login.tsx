import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { validateEmail } from '../../utils/validation';
import CustomHeaderBar from '@/components/ui/CustomHeaderBar';
import { routes } from '@/routes';
import { loginUser } from '@/services/authService';
import { Alert } from 'react-native';
import axios from 'axios';
import { storeAuthToken } from '@/utils/auth';

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

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError(validateEmail(value) ? '' : 'Insira um e-mail válido.');
  };

  const isFormValid = () => {
    return validateEmail(email) && password.trim() !== '';
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setEmailError('Insira um e-mail válido.');
      console.log('[Login] E-mail inválido:', email);
      return;
    }
  
    try {
      console.log('[Login] Tentando fazer login com:', email);
  
      const response = await loginUser(email, password);
      console.log('[Login] Resposta do login:', response);
  
      const token = response.token;
      if (!token) {
        throw new Error('Token não recebido do servidor.');
      }
  
      console.log('[Login] Token JWT recebido:', token);
  
      await storeAuthToken(token);
      console.log('[Login] Token armazenado com sucesso.');
  
      Alert.alert('Sucesso', 'Login bem-sucedido!');
      router.push('/studentRegistration');
    } catch (error) {
      console.error('[Login] Erro durante o login:', error);
  
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const message = error.response.data.message || 'Erro inesperado.';
        console.log('[Login] Erro HTTP', { status, message });
  
        switch (status) {
          case 401:
            Alert.alert('Erro', 'Credenciais inválidas.');
            break;
          case 400:
            Alert.alert('Erro', 'Requisição inválida. Verifique os dados informados.');
            break;
          case 500:
            Alert.alert('Erro', 'Erro interno no servidor. Tente novamente mais tarde.');
            break;
          default:
            Alert.alert('Erro', message);
            break;
        }
      } else {
        Alert.alert('Erro', 'Erro de rede ou erro desconhecido.');
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <CustomHeaderBar
          leftIcon={{ name: 'arrow-back-outline', route: routes.index }}
        />

        <View style={styles.content}>
        {/* Título */}
        <Text style={styles.title}>Entrar</Text>

        {/* Campo de e-mail */}
        <TextInput
          placeholder="Email"
          placeholderTextColor="#888888"
          style={styles.input}
          value={email}
          onChangeText={handleEmailChange}
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
          onPress={handleLogin}
        >
          <Text style={styles.primaryButtonText}>Continuar</Text>
        </TouchableOpacity>

        {/* Links para registro e recuperação de senha */}
        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.linkText}>Ainda não possui uma conta? Cadastre-se aqui</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/forgotPassword')}>
            <Text style={styles.linkText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    marginTop: -200,
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
