import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

interface RegistrationModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, birthDate: string) => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ visible, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');

  // Máscara para o nome (somente letras, acentos e espaços)
  const handleNameChange = (text: string) => {
    const regex = /^[A-Za-zÀ-ÿ\s]*$/;
    if (regex.test(text)) {
      setName(text);
    }
  };

  // Máscara para a data de nascimento no formato (DD/MM/AAAA)
  const handleBirthDateChange = (text: string) => {
    let cleanText = text.replace(/\D/g, '');
    if (cleanText.length > 8) cleanText = cleanText.slice(0, 8);

    let formattedDate = cleanText;
    if (cleanText.length > 2) {
      formattedDate = cleanText.slice(0, 2) + '/' + cleanText.slice(2);
    }
    if (cleanText.length > 4) {
      formattedDate = cleanText.slice(0, 2) + '/' + cleanText.slice(2, 4) + '/' + cleanText.slice(4);
    }

    setBirthDate(formattedDate);
  };

  // Verifica se os campos estão preenchidos corretamente
  const isFormValid = () => {
    return name.trim() !== '' && isValidBirthDate(birthDate);
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

  // Função para verificar se a data é válida e não está no futuro
  const isValidBirthDate = (date: string): boolean => {
    const [day, month, year] = date.split('/').map(Number);
    const today = new Date();

    if (!day || !month || !year || day > 31 || month > 12 || year < 1900) {
      return false;
    }

    const birthDate = new Date(year, month - 1, day);
    return birthDate <= today && birthDate.toString() !== 'Invalid Date';
  };

  const handleSubmit = () => {
    if (!isValidBirthDate(birthDate)) {
      Alert.alert('Data inválida', 'A data de nascimento não pode ser futura ou inválida.');
      return;
    }
  
    if (!isAgeWithinRange(birthDate)) {
      return;
    }

    onSubmit(name, birthDate);
    setName('');
    setBirthDate('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Cadastrar Criança</Text>
          <TextInput
            placeholder="Digite o nome da criança"
            placeholderTextColor="#A0A0A0"
            value={name}
            onChangeText={handleNameChange}
            style={styles.input}
          />
          <TextInput
            placeholder="Digite a data de nascimento da criança"
            placeholderTextColor="#A0A0A0"
            value={birthDate}
            onChangeText={handleBirthDateChange}
            style={styles.input}
            keyboardType="numeric"
            maxLength={10}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, !isFormValid() && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!isFormValid()}
            >
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#F9F9F9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    flex: 1,
    marginRight: 5,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#1B3C87',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  buttonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default RegistrationModal;
