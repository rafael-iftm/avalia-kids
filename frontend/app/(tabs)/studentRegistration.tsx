import React, { useEffect, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { getImageUrl } from '@/utils/storage';


export default function StudentRegistrationScreen() {
  const [studentName, setStudentName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem('name');
        if (storedName) {
          setUserName(storedName);
        } else {
          console.log('[Menu] Nome do usuário não encontrado no armazenamento.');
        }
      } catch (error) {
        console.log('[Menu] Erro ao recuperar o nome do usuário:', error);
      }
    };

    fetchUserName();
  }, []);


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
  
    Keyboard.dismiss();
    setModalVisible(true);
  };  
  
  const confirmRegistration = async () => {
    try {
      console.log('[Registro de Aluno] Iniciando o processo de registro do aluno...');
  
      const token = await getAuthToken();
      const parentId = await AsyncStorage.getItem('userId');
  
      if (!parentId) {
        Alert.alert('Erro', 'Não foi possível encontrar o ID do responsável.');
        return;
      }
  
      console.log('[Registro de Aluno] Token JWT obtido:', token);
      console.log('[Registro de Aluno] ID do responsável:', parentId);
      console.log('[Registro de Aluno] Enviando dados do aluno:', { studentName, birthDate });
  
      const response = await registerStudent(studentName, birthDate, token, parentId);
  
      console.log('[Registro de Aluno] Resposta do backend:', response);
      // Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
      setModalVisible(false);
      router.push('/home');
    } catch (error) {
      console.log('[Registro de Aluno] Erro durante o registro:', error);
  
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
          title="Cadastro"
          rightIcon={{ name: 'log-out-outline', route: routes.login }}
        />

        <View style={styles.content}>
          <Text style={styles.greeting}>Olá, {userName || 'Visitante'}!</Text>
          <Text style={styles.instructions}>
            Para começar, cadastre a criança que vai brincar e aprender com a gente!
          </Text>

          <Image
            source={getImageUrl({ folder: 'default', filename: 'student-registration' })}
            style={styles.studentRegistrationImage}
            contentFit="contain"
            cachePolicy="none"
          />

          <TextInput
            placeholder="Digite o nome da criança"
            placeholderTextColor="#888"
            style={styles.input}
            value={studentName}
            onChangeText={handleNameChange}
          />
          <TextInput
            placeholder="Digite a data de nascimento da criança"
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
            <Text style={styles.primaryButtonText}>Continuar</Text>
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
    marginBottom: 80,
  },
  studentRegistrationImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
    alignSelf: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
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
