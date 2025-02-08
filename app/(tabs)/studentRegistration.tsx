import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';

export default function StudentRegistrationScreen() {
  const [studentName, setStudentName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const isFormValid = () => {
    return studentName.trim() !== '' && birthDate.trim() !== '';
  };

  const handleRegisterStudent = () => {
    setModalVisible(true);
  };

  const confirmRegistration = () => {
    console.log('Aluno confirmado:', { studentName, birthDate });
    setModalVisible(false);
    router.push('/quiz');
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
            onChangeText={setStudentName}
          />
          <TextInput
            placeholder="Data de Nascimento"
            placeholderTextColor="#888"
            style={styles.input}
            value={birthDate}
            onChangeText={setBirthDate}
            keyboardType="numeric"
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
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Confirmar Cadastro</Text>
              <Text style={styles.modalText}>Nome: {studentName}</Text>
              <Text style={styles.modalText}>Data de Nascimento: {birthDate}</Text>

              <View style={styles.modalButtonsContainer}>
                {/* Botão de voltar */}
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Botão de confirmar */}
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={confirmRegistration}
                >
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    marginBottom: 10,
    marginTop: -200
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#B0BEC5',
    padding: 10,
    borderRadius: 8,
  },
  confirmButton: {
    backgroundColor: '#1B3C87',
    padding: 12,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
