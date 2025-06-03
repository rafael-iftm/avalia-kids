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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStudentsByParent } from '@/services/studentService';
import { Image } from 'expo-image';
import { getImageUrl } from '@/utils/storage';

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
      const userId = response.userId;
      const name = response.name;

  
      console.log('[Login] Token JWT recebido:', token);
      console.log('[Login] ID do usuário recebido:', userId);
      console.log('[Login] Nome do usuário recebido:', name);
  
      await storeAuthToken(token);
      await AsyncStorage.setItem('userId', userId);
      await AsyncStorage.setItem('name', name);
  
      console.log('[Login] Dados de autenticação armazenados com sucesso.');

      try {
        const students = await getStudentsByParent(userId);

        if (students.length > 0) {
          console.log('[Login] Usuário PARENT tem estudantes cadastrados, redirecionando para Home.');
          router.push('/home');
        } else {
          console.log('[Login] Usuário PARENT não tem estudantes, redirecionando para Student Registration.');
          router.push('/studentRegistration');
        }
      } catch (error) {
        console.log('[Login] Erro ao buscar estudantes do PARENT:', error);
        Alert.alert('Erro', 'Erro ao buscar alunos. Verifique sua conexão.');
      }
    } catch (error) {
      console.log('[Login] Erro durante o login:', error);
  
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const message = error.response.data.message || 'Erro inesperado.';
        console.log('[Login] Erro HTTP', { status, message });
  
        switch (status) {
          case 401:
            Alert.alert('Erro', 'Credenciais inválidas. Por favor, tente novamente.');
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
          title="Entrar"
          leftIcon={{ name: 'arrow-back-outline', route: routes.index }}
        />

        <View style={styles.content}>
          <Image
            source={getImageUrl({ folder: 'default', filename: 'login' })}
            style={styles.loginImage}
            contentFit="contain"
            cachePolicy="none"
          />

          {/* Campo de e-mail */}
          <TextInput
            placeholder="Digite seu e-mail"
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
              placeholder="Digite sua senha"
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
            {/* <TouchableOpacity onPress={() => router.push('/forgotPassword')}>
              <Text style={styles.linkText}>Esqueceu sua senha? [REMOVER NA V2]</Text>
            </TouchableOpacity> */}
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
    marginBottom: 80,
  },
  loginImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
    alignSelf: 'center',
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
