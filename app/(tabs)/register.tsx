import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Responsável');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const isFormValid = () => {
    return (
      name.trim() !== '' &&
      email.trim() !== '' &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      password === confirmPassword &&
      isChecked &&
      nameError === '' &&
      emailError === ''
    );
  };

  const validateName = (value: string) => {
    const nameRegex = /^[A-Za-zÀ-ú\s~]+$/;
    if (!nameRegex.test(value)) {
      setNameError('Nome só pode conter letras, acentos, espaços e til.');
    } else {
      setNameError('');
    }
    setName(value);
  };
  
  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Insira um e-mail válido.');
    } else {
      setEmailError('');
    }
    setEmail(value);
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Ícone de voltar */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        {/* Título */}
        <Text style={styles.title}>Cadastro</Text>

        {/* Campo de nome */}
        <TextInput 
          placeholder="Nome" 
          placeholderTextColor="#888888"
          style={styles.input} 
          value={name} 
          onChangeText={validateName} 
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

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
            placeholder="Crie sua senha"
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

        {/* Campo de confirmação de senha */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Confirme sua senha"
            placeholderTextColor="#888888"
            secureTextEntry={!confirmPasswordVisible}
            style={styles.passwordInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <Ionicons name={confirmPasswordVisible ? 'eye-off' : 'eye'} size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Seleção de usuário */}
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, selectedRole === 'Responsável' && styles.roleSelected]}
            onPress={() => setSelectedRole('Responsável')}
          >
            <Text style={[styles.roleText, selectedRole === 'Responsável' && styles.roleTextSelected]}>
              Responsável
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, selectedRole === 'Professor' && styles.roleSelected]}
            onPress={() => setSelectedRole('Professor')}
          >
            <Text style={[styles.roleText, selectedRole === 'Professor' && styles.roleTextSelected]}>
              Professor
            </Text>
          </TouchableOpacity>
        </View>

        {/* Aceitação de termos */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={() => setIsChecked(!isChecked)} style={styles.checkbox}>
            <Ionicons
              name={isChecked ? 'checkbox' : 'square-outline'}
              size={24}
              color={isChecked ? '#1B3C87' : '#666'}
            />
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Aceito os termos e condições de uso</Text>
        </View>

        {/* Botão de continuar */}
        <TouchableOpacity 
          style={[styles.primaryButton, !isFormValid() && styles.buttonDisabled]} 
          disabled={!isFormValid()}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.primaryButtonText}>Continuar</Text>
        </TouchableOpacity>

        {/* Link de login */}
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.loginLink}>Já possui uma conta? Clique aqui para entrar</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
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
  loginLink: {
    color: '#1B3C87',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  roleButton: {
    minWidth: 140,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#1B3C87',
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  roleSelected: {
    backgroundColor: '#1B3C87',
  },
  roleText: {
    color: '#1B3C87',
    fontWeight: 'bold',
    fontSize: 16,
  },
  roleTextSelected: {
    color: '#FFFFFF',
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
