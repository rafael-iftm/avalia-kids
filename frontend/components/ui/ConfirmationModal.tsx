import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';

interface Props {
  visible: boolean;
  newStudentName: string;
  newStudentBirthDate: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmationModal({
  visible,
  newStudentName,
  newStudentBirthDate,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirmar Cadastro</Text>

          {/* Campos preenchidos não editáveis */}
          <Text style={styles.label}>Nome</Text>
          <TextInput value={newStudentName} style={[styles.input, styles.disabledInput]} editable={false} />

          <Text style={styles.label}>Data de nascimento</Text>
          <TextInput value={newStudentBirthDate} style={[styles.input, styles.disabledInput]} editable={false} />

          {/* Botões */}
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#F9F9F9',
    marginBottom: 15,
  },
  disabledInput: {
    backgroundColor: '#E9ECEF', // cor de fundo para indicar campo desativado
    color: '#6C757D', // texto mais claro para diferenciar
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#1B3C87',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  confirmButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
