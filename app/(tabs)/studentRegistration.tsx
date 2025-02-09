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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

export default function StudentRegistrationScreen() {
  const [studentName, setStudentName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Valida o nome para aceitar apenas letras, acentos e espaços
  const handleNameChange = (text: string) => {
    if (/^[A-Za-zÀ-ÿ\s]*$/.test(text)) {
      setStudentName(text);
    }
  };

  // Função para mascarar a data e validar no formato DD/MM/AAAA
  const handleBirthDateChange = (text: string) => {
    let cleanText = text.replace(/\D/g, ''); // Remove qualquer caractere não numérico

    if (cleanText.length > 8) cleanText = cleanText.slice(0, 8); // Limita a 8 números (DDMMAAAA)

    let formattedDate = cleanText;
    if (cleanText.length > 2) {
      formattedDate = cleanText.slice(0, 2) + '/' + cleanText.slice(2);
    }
    if (cleanText.length > 4) {
      formattedDate = cleanText.slice(0, 2) + '/' + cleanText.slice(2, 4) + '/' + cleanText.slice(4);
    }

    setBirthDate(formattedDate);
  };

  // Verifica se a data de nascimento é válida
  const isValidBirthDate = (date: string) => {
    if (date.length !== 10) return false;

    const [day, month, year] = date.split('/').map(Number);
    const today = new Date();
    const enteredDate = new Date(year, month - 1, day);

    if (
      !day ||
      !month ||
      !year ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31 ||
      enteredDate > today ||
      year < 1900
    ) {
      return false;
    }
    return enteredDate.getDate() === day && enteredDate.getMonth() === month - 1;
  };

  // Verifica se o formulário está válido
  const isFormValid = () => {
    return studentName.trim() !== '' && isValidBirthDate(birthDate);
  };

  const handleRegisterStudent = () => {
    if (!isFormValid()) {
      Alert.alert('Erro', 'Por favor, insira um nome válido e uma data de nascimento válida.');
      return;
    }
    setModalVisible(true);
  };

  const confirmRegistration = () => {
    console.log('Aluno confirmado:', { studentName, birthDate });
    setModalVisible(false);
    router.push('/studentManagement');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Header com os ícones */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Ionicons name="log-out-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Conteúdo principal */}
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

        {/* Modal de confirmação */}
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
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
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
