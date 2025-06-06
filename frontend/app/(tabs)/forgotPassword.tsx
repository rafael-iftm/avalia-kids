import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import CustomHeaderBar from '@/components/ui/CustomHeaderBar';
import { routes } from '@/routes';
import { Image } from 'expo-image';
import { getImageUrl, getPlaceholderUrl } from '@/utils/storage';
import { validateEmail } from '@/utils/validation';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
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
    return validateEmail(email);
  };

  return (
    <View style={styles.container}>
      <CustomHeaderBar
        title="Recuperar Senha"
        leftIcon={{ name: 'arrow-back-outline', route: routes.login }}
      />

      <View style={styles.content}>
        <Image
          source={getImageUrl({ folder: 'default', filename: 'forgot-password' })}
          placeholder={getPlaceholderUrl({ folder: 'default', filename: 'forgot-password' })}
          style={styles.forgotPasswordImage}
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
    marginBottom: 100,
  },
  forgotPasswordImage: {
    width: 300,
    height: 300,
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
