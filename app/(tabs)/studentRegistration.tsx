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
import HeaderBar from '../../components/ui/HeaderBar';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import { validateName, validateBirthDate } from '../../utils/validation';
import { formatBirthDate, areFieldsValid } from '../../utils/form';

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
    router.push('/home');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <HeaderBar />

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
