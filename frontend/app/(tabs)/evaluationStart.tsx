import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { getStudentsByParent } from '@/services/studentService';
import { validateParentPassword } from '@/services/authService';
import CustomHeaderBar from '@/components/ui/CustomHeaderBar';
import { routes } from '@/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Student } from '@/types/Student';
import { getAuthToken } from '@/utils/auth';
import { fetchStudentResults, fetchTotalQuestions } from '@/services/quizService';
import { Image } from 'expo-image';
import { getImageUrl, getPlaceholderUrl } from '@/utils/storage';

export default function EvaluationStartScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedStudentName, setSelectedStudentName] = useState('Selecione uma criança');
  const [password, setPassword] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();
  const { preSelectedStudentId, preSelectedStudentName, preSelectedClassLevel } =
    useLocalSearchParams<{ preSelectedStudentId?: string; preSelectedStudentName?: string; preSelectedClassLevel?: string }>();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  
  useEffect(() => {
    const fetchStudentsToEvaluate = async () => {
      try {
        setLoading(true);
        const parentId = await AsyncStorage.getItem('userId');
        const token = await getAuthToken();
  
        if (!parentId) {
          Alert.alert('Erro', 'ID do responsável não encontrado.');
          return;
        }
  
        if (!token) {
          Alert.alert('Erro', 'Usuário não autenticado.');
          return;
        }
  
        const studentsData = await getStudentsByParent(parentId);
  
        if (!studentsData || studentsData.length === 0) {
          Alert.alert('Erro', 'Nenhum estudante encontrado para este responsável.');
          return;
        }
  
        const studentsToEvaluate: Student[] = [];
  
        for (const student of studentsData) {
          try {
            const totalQuestions = await fetchTotalQuestions(student.className, token);
            const answeredQuestions = await fetchStudentResults(student.id, token);
            
            if (answeredQuestions.length < totalQuestions || totalQuestions == 0) {
              studentsToEvaluate.push(student);
            }
          } catch (error) {
            console.log(`[ERRO] Falha ao obter dados do aluno ${student.name}:`, error);
            studentsToEvaluate.push(student);
          }
        }
  
        if (studentsToEvaluate.length === 0) {
          Alert.alert('Aviso', 'Todos os alunos já realizaram a avaliação.');
        }
  
        setStudents(studentsToEvaluate);
      } catch (error) {
        console.log('[ERRO] Falha ao buscar alunos:', error);
        Alert.alert('Erro', 'Não foi possível carregar os alunos.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchStudentsToEvaluate();
  }, []);

  useEffect(() => {
  if (preSelectedStudentId && preSelectedStudentName && preSelectedClassLevel) {
    handleStudentSelection(preSelectedStudentId, preSelectedStudentName, preSelectedClassLevel);
  }
}, [preSelectedStudentId, preSelectedStudentName, preSelectedClassLevel]);

  
  const handleStudentSelection = async (studentId: string, studentName: string, classLevel: string) => {
    setSelectedStudent(studentId);
    setSelectedStudentName(studentName);
    setModalVisible(false);

    await AsyncStorage.setItem('selectedStudentId', studentId);
    await AsyncStorage.setItem('classLevel', classLevel);

    console.log(`[Storage] Student ID salvo: ${studentId}`);
    console.log(`[Storage] Class Level salvo: ${classLevel}`);
};

  const handleContinue = async () => {
    if (selectedStudent.trim() === '' || password.trim() === '') {
      Alert.alert('Erro', 'Selecione uma criança e insira a sua senha.');
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
        router.push('/quiz');
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
        <CustomHeaderBar
          title="Iniciar Avaliação"
          leftIcon={{ name: 'arrow-back-outline', route: routes.home }}
          rightIcon={{ name: 'log-out-outline', route: routes.login }}
        />

        <View style={styles.content}>
          <Image
            source={getImageUrl({ folder: 'default', filename: 'evaluation-start' })}
            placeholder={getPlaceholderUrl({ folder: 'default', filename: 'evaluation-start' })}
            style={styles.evaluationImage}
            contentFit="contain"
            cachePolicy="none"
          />

          <Text style={styles.sectionText}>1. Escolha qual criança será avaliada:</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.pickerButtonText}>{selectedStudentName}</Text>
            <Ionicons name="chevron-down-outline" size={20} color="#333" />
          </TouchableOpacity>

          <Modal visible={isModalVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <FlatList
                  data={students}
                  keyExtractor={(item) => item.id}
                  style={styles.flatList}
                  contentContainerStyle={{ flexGrow: 1 }}
                  showsVerticalScrollIndicator={true}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => handleStudentSelection(item.id, item.name, item.className)}
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

          <Text style={styles.sectionText}>2. Confirme com a sua senha para continuar:</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Digite sua senha"
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


          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
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
    marginBottom: 50,
  },
  evaluationImage: {
    width: 250,
    height: 250,
    marginBottom: 30,
    alignSelf: 'center',
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
  continueButton: {
    backgroundColor: '#1B3C87',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
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
    maxHeight: '60%',  // 🔹 Limita a altura para evitar que o botão "Cancelar" suma
  },
  flatList: {
    maxHeight: 200,  // 🔹 Define a altura máxima antes de ativar o scroll
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
    padding: 10,
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#333',
    fontSize: 16,
  },
});
