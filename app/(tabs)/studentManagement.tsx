import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { studentsData, totalQuestions } from '../../data/studentsData';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';

interface Student {
  id: string;
  name: string;
  grade: string;
  score: number | null;
}

export default function StudentManagementScreen() {
  const [students, setStudents] = useState<Student[]>(studentsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('alfabetica');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentBirthDate, setNewStudentBirthDate] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);

  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleAddStudent = () => {
    const newStudent: Student = {
      id: (students.length + 1).toString(),
      name: newStudentName,
      grade: '1º Ano',
      score: null,
    };
    setStudents((prev) => [...prev, newStudent]);
    setNewStudentName('');
    setNewStudentBirthDate('');
    setConfirmationVisible(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setStudents(sortStudents(studentsData));
    } else {
      setStudents(
        sortStudents(
          studentsData.filter((student) =>
            student.name.toLowerCase().includes(query.toLowerCase())
          )
        )
      );
    }
  };

  const sortStudents = (students: Student[]) => {
    return [...students].sort((a, b) => {
      if (sortBy === 'alfabetica') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'turma') {
        return a.grade.localeCompare(b.grade);
      }
      return 0;
    });
  };

  const toggleSort = () => {
    setSortBy((prev) => (prev === 'alfabetica' ? 'turma' : 'alfabetica'));
    setStudents(sortStudents(students));
  };

  const renderStudentItem = ({ item }: { item: Student }) => (
    <View style={styles.studentRow}>
      <Text style={[styles.studentCell, styles.studentCellName]}>{item.name}</Text>
      <Text style={[styles.studentCell, styles.studentCellGrade]}>{item.grade}</Text>
      {item.score !== null ? (
        <Text style={[styles.studentCell, styles.studentCellScore]}>{item.score}/{totalQuestions}</Text>
      ) : (
        <TouchableOpacity
          style={styles.evaluateButton}
          onPress={() => router.push('/quiz')}
        >
          <Text style={styles.evaluateButtonText}>Avaliar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Ionicons name="log-out-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.screenTitle}>Alunos</Text>

      <View style={styles.summary}>
        <Ionicons name="people-circle-outline" size={60} color="#6FCF97" />
        <View style={styles.summaryText}>
          <Text style={styles.totalLabel}>Total de Alunos</Text>
          <Text style={styles.totalNumber}>{students.length}</Text>
        </View>
        <TouchableOpacity style={styles.newStudentButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.newStudentButtonText}>Novo Aluno</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquise um aluno"
            placeholderTextColor="#A0A0A0"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity style={styles.sortButton} onPress={toggleSort}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.sortButtonText}>
            Ordenar: {sortBy === 'alfabetica' ? 'Alfabética' : 'Turma'}
          </Text>
          <Ionicons name="chevron-down-outline" size={16} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, styles.headerName]}>Aluno</Text>
        <Text style={[styles.tableHeaderText, styles.headerGrade]}>Turma</Text>
        <Text style={[styles.tableHeaderText, styles.headerScore]}>Acertos</Text>
      </View>
    </>
  );

  return (
    <>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderStudentItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal de cadastro */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Seta de voltar no modal */}
            <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="arrow-back-outline" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Cadastrar aluno</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nome completo do aluno"
              placeholderTextColor="#A0A0A0"
              value={newStudentName}
              onChangeText={setNewStudentName}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Data de Nascimento"
              placeholderTextColor="#A0A0A0"
              value={newStudentBirthDate}
              onChangeText={setNewStudentBirthDate}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                setModalVisible(false);
                setConfirmationVisible(true);
              }}
            >
              <Text style={styles.primaryButtonText}>Cadastre seu Aluno</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmação */}
      <Modal visible={isConfirmationVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Cadastro</Text>
            <Text style={styles.modalText}>Nome: {newStudentName}</Text>
            <Text style={styles.modalText}>Data de nascimento: {newStudentBirthDate}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setConfirmationVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleAddStudent}>
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    paddingTop: 55,
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryText: {
    marginLeft: 15,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalNumber: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  newStudentButton: {
    backgroundColor: '#6FCF97',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  newStudentButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: '50%',
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 16,
  },
  sortButton: {
    flexDirection: 'row',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#333',
    marginRight: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  headerName: {
    width: '40%',
  },
  headerGrade: {
    width: '30%',
    textAlign: 'center',
  },
  headerScore: {
    width: '30%',
    textAlign: 'center',
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  },
  studentCell: {
    fontSize: 14,
    color: '#333',
  },
  studentCellName: {
    width: '40%',
  },
  studentCellGrade: {
    width: '30%',
    textAlign: 'center',
  },
  studentCellScore: {
    width: '30%',
    textAlign: 'center',
  },
  evaluateButton: {
    backgroundColor: '#1B3C87',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    flex: 1,
  },
  evaluateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
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
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  modalInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#000',
  },
  confirmButton: {
    backgroundColor: '#1B3C87',
    padding: 10,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#FFF',
  },
  primaryButton: {
    backgroundColor: '#1B3C87',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
