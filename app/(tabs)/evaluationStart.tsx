import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
  ActionSheetIOS,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { getStudentsByParent } from '@/services/studentService';
import { validateParentPassword } from '@/services/authService';
import CustomHeaderBar from '@/components/ui/CustomHeaderBar';
import { routes } from '@/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Student } from '@/types/Student';

export default function EvaluationStartScreen() {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [students, setStudents] = useState<Student[]>([]);  
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedStudentName, setSelectedStudentName] = useState('Selecione um aluno');
  const [password, setPassword] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const parentId = await AsyncStorage.getItem('userId');
        if (!parentId) {
          Alert.alert('Erro', 'ID do responsável não encontrado.');
          return;
        }
        const studentsData: Student[] = await getStudentsByParent(parentId);
        setAllStudents(studentsData);
        setStudents(studentsData);
      } catch (error) {
        console.log('[Início da Avaliação] Erro ao buscar alunos:', error);
        Alert.alert('Erro', 'Erro ao carregar os alunos.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleStudentSelection = (studentId: string, studentName: string) => {
    setSelectedStudent(studentId);
    setSelectedStudentName(studentName);
    setModalVisible(false);
  };

  const showPickerIOS = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancelar', ...students.map((s) => s.name)],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex !== 0) {
          const selectedStudent = students[buttonIndex - 1];
          setSelectedStudent(selectedStudent.id);
          setSelectedStudentName(selectedStudent.name);
        }
      }
    );
  };

  const handleContinue = async () => {
    if (selectedStudent.trim() === '' || password.trim() === '') {
      Alert.alert('Erro', 'Selecione um aluno e insira a senha do responsável.');
      return;
    }
  
    try {
      const parentId = await AsyncStorage.getItem('userId');
      if (!parentId) {
        Alert.alert('Erro', 'ID do responsável não encontrado.');
        return;
      }
  
      const { isValid, message } = await validateParentPassword(parentId, password);
  
      if (isValid) {
        //Alert.alert('Sucesso', message);
        router.push(`/welcome`);
      } else {
        Alert.alert('Erro', message);
      }
    } catch (error: unknown) {
      console.log('[Início da Avaliação] Erro ao validar senha:', error);
      Alert.alert('Erro', 'Erro inesperado ao validar senha.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <CustomHeaderBar leftIcon={{ name: 'arrow-back-outline', route: routes.home }} />

        <View style={styles.content}>
          <Text style={styles.title}>Iniciar Avaliação</Text>

          <Text style={styles.sectionText}>1. Identifique o aluno que será avaliado:</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={Platform.OS === 'ios' ? showPickerIOS : () => setModalVisible(true)}
          >
            <Text style={styles.pickerButtonText}>{selectedStudentName}</Text>
            <Ionicons name="chevron-down-outline" size={20} color="#333" />
          </TouchableOpacity>

          <Modal visible={isModalVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Selecione um aluno</Text>
                <FlatList
                  data={students}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => handleStudentSelection(item.id, item.name)}
                    >
                      <Text style={styles.modalItemText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Text style={styles.sectionText}>2. Use a senha do responsável para iniciar</Text>
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#888888"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.continueButton, (!selectedStudent || !password) && styles.buttonDisabled]}
            disabled={!selectedStudent || !password}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>Continuar</Text>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 150,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  sectionText: {
    fontSize: 16,
    color: '#1B3C87',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    width: '100%',
    marginBottom: 20,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    width: '100%',
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: '#1B3C87',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontSize: 16,
  },
});

