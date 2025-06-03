import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { validateEmail } from '../../utils/validation';
import CustomHeaderBar from '@/components/ui/CustomHeaderBar';
import { routes } from '@/routes';
import { registerUser } from '@/services/authService';
import { Alert } from 'react-native';
import axios from 'axios';
import { Image } from 'expo-image';
import { getImageUrl } from '@/utils/storage';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleNameChange = (value: string) => {
    const cleanedValue = value.replace(/[^A-Za-zÀ-ÿ\s~]/g, '');
    setName(cleanedValue);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError('Insira um e-mail válido.');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (confirmPassword !== '' && value !== confirmPassword) {
      setPasswordError('As senhas não coincidem.');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (password !== value) {
      setPasswordError('As senhas não coincidem.');
    } else {
      setPasswordError('');
    }
  };

  const isFormValid = () => {
    return (
      name.trim() !== '' &&
      validateEmail(email) &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      password === confirmPassword &&
      passwordError === '' &&
      isChecked
    );
  };

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      setEmailError('Por favor, insira um e-mail válido.');
      console.log('[Register] E-mail inválido:', email);
      return;
    }
  
    if (password !== confirmPassword) {
      setPasswordError('As senhas não coincidem.');
      console.log('[Register] Senhas não coincidem:', { password, confirmPassword });
      return;
    }
  
    const role = 'PARENT';
    console.log('[Register] Tentando registrar o usuário:', { name, email, role });
  
    try {
      const response = await registerUser(name, email, password, role);
      console.log('[Register] Registro bem-sucedido. Resposta do backend:', response);
  
      // Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
      router.push('/login');
    } catch (error) {
      console.log('[Register] Erro durante o registro:', error);
  
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const message = error.response.data.message || 'Erro inesperado.';
        console.log('[Register] Erro HTTP', { status, message });
  
        switch (status) {
          case 400:
            Alert.alert('Erro', 'Dados inválidos. Verifique as informações fornecidas.');
            break;
          case 409:
            Alert.alert('Erro', 'Este e-mail já está registrado.');
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
          title="Cadastro"
          leftIcon={{ name: 'arrow-back-outline', route: routes.index }}
        />

        <View style={styles.content}>
          <Image
            source={getImageUrl({ folder: 'default', filename: 'register' })}
            style={styles.registerImage}
            contentFit="contain"
            cachePolicy="none"
          />

          {/* Campo de nome */}
          <TextInput
            placeholder="Digite seu nome"
            placeholderTextColor="#888888"
            style={styles.input}
            value={name}
            onChangeText={handleNameChange}
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
              placeholder="Crie sua senha"
              placeholderTextColor="#888888"
              secureTextEntry={!passwordVisible}
              style={styles.passwordInput}
              value={password}
              onChangeText={handlePasswordChange}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Campo de confirmação de senha */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Confirme sua senha"
              placeholderTextColor="#888888"
              secureTextEntry={!confirmPasswordVisible}
              style={styles.passwordInput}
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
            />
            <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
              <Ionicons name={confirmPasswordVisible ? 'eye-off' : 'eye'} size={20} color="#666" />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          {/* Aceitação de termos */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity onPress={() => setIsChecked(!isChecked)} style={styles.checkbox}>
              <Ionicons name={isChecked ? 'checkbox' : 'square-outline'} size={24} color={isChecked ? '#1B3C87' : '#666'} />
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>Aceito os termos e condições de uso</Text>
          </View>

          {/* Botão de continuar */}
          <TouchableOpacity
            style={[styles.primaryButton, !isFormValid() && styles.buttonDisabled]}
            disabled={!isFormValid()}
            onPress={handleRegister}
          >
            <Text style={styles.primaryButtonText}>Continuar</Text>
          </TouchableOpacity>

          {/* Link de login */}
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.loginLink}>Já possui uma conta? Clique aqui para entrar</Text>
          </TouchableOpacity>
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
  registerImage: {
    width: 200,
    height: 200,
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
  loginLink: {
    color: '#1B3C87',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    color: '#666',
    fontSize: 14,
  },
});
