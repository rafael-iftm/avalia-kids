import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import { validateName, validateBirthDate } from '../../utils/validation';
import { formatBirthDate, areFieldsValid } from '../../utils/form';
import CustomHeaderBar from '@/components/ui/CustomHeaderBar';
import { routes } from '@/routes';
import { registerStudent } from '@/services/studentService';
import { getAuthToken } from '@/utils/auth';
import axios from 'axios';


export default function StudentRegistrationScreen() {
  const [studentName, setStudentName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleNameChange = (text: string) => {
    if (text === '' || validateName(text)) {
      setStudentName(text);
    }
  };

  const handleBirthDateChange = (text: string) => {
    setBirthDate(formatBirthDate(text));
  };

  const isFormValid = () => {
    return areFieldsValid([studentName.trim() !== '', validateBirthDate(birthDate)]);
  };

  const isAgeWithinRange = (birthDate: string): boolean => {
    const currentYear = new Date().getFullYear();
    const birthYear = new Date(birthDate.split('/').reverse().join('-')).getFullYear();
    const age = currentYear - birthYear;
  
    if (age < 5 || age > 12) {
      Alert.alert(
        'Idade inválida',
        'A idade permitida para cadastro é entre 5 e 12 anos.'
      );
      return false;
    }
  
    if (age < 6 || age > 10) {
      Alert.alert(
        'Idade fora da faixa recomendada',
        'A idade recomendada é entre 6 e 10 anos.'
      );
    }
  
    return true;
  };
  
  const handleRegisterStudent = () => {
    if (!isFormValid()) {
      Alert.alert('Erro', 'Por favor, insira um nome válido e uma data de nascimento válida.');
      return;
    }
  
    if (!isAgeWithinRange(birthDate)) {
      return;
    }
  
    setModalVisible(true);
  };
  
  const confirmRegistration = async () => {
    try {
      console.log('[Registro de Aluno] Iniciando o processo de registro do aluno...');
  
      const token = await getAuthToken();
      console.log('[Registro de Aluno] Token JWT obtido:', token);
  
      console.log('[Registro de Aluno] Enviando dados do aluno:', { studentName, birthDate });
      const response = await registerStudent(studentName, birthDate, token);
  
      console.log('[Registro de Aluno] Resposta do backend:', response);
      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
      setModalVisible(false);
      router.push('/home');
    } catch (error) {
      console.error('[Registro de Aluno] Erro durante o registro:', error);
  
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const message = error.response.data.message || 'Erro ao registrar o aluno.';
        console.log('[Registro de Aluno] Erro HTTP', { status, message });
  
        Alert.alert('Erro', message);
      } else {
        console.log('[Registro de Aluno] Erro de conexão ou erro desconhecido.');
        Alert.alert('Erro', 'Erro de conexão. Verifique sua internet.');
      }
    }
  };
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <CustomHeaderBar
          leftIcon={{ name: 'settings-outline', route: routes.settings }}
          rightIcon={{ name: 'log-out-outline', route: routes.login }}
        />

        <View style={styles.content}>
          <Text style={styles.greeting}>Olá, {`{Nome}`}</Text>
          <Text style={styles.instructions}>
            Antes de realizar alguma avaliação, você deve cadastrar os alunos que serão avaliados:
          </Text>

          <TextInput
            placeholder="Nome do Aluno"
            placeholderTextColor="#888"
            style={styles.input}
            value={studentName}
            onChangeText={handleNameChange}
          />
          <TextInput
            placeholder="Data de Nascimento (DD/MM/AAAA)"
            placeholderTextColor="#888"
            style={styles.input}
            value={birthDate}
            onChangeText={handleBirthDateChange}
            keyboardType="numeric"
            maxLength={10}
          />

          <TouchableOpacity
            style={[styles.primaryButton, !isFormValid() && styles.buttonDisabled]}
            disabled={!isFormValid()}
            onPress={handleRegisterStudent}
          >
            <Text style={styles.primaryButtonText}>Cadastre seu Aluno</Text>
          </TouchableOpacity>
        </View>

        <ConfirmationModal
          visible={isModalVisible}
          newStudentName={studentName}
          newStudentBirthDate={birthDate}
          onCancel={() => setModalVisible(false)}
          onConfirm={confirmRegistration}
        />
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
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: -200,
  },
  instructions: {
    fontSize: 16,
    color: '#666',
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
    marginBottom: 15,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#1B3C87',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
