import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { studentsData, totalQuestions } from '../../data/studentsData';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';

export default function StudentManagementScreen() {
  const [students, setStudents] = useState(studentsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('alfabetica');
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

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

  const sortStudents = (students: typeof studentsData) => {
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

  const renderStudentItem = ({ item }: { item: typeof studentsData[0] }) => (
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Ionicons name="log-out-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Título */}
      <Text style={styles.screenTitle}>Alunos</Text>

      {/* Título e resumo */}
      <View style={styles.summary}>
        <Ionicons name="people-circle-outline" size={60} color="#6FCF97" />
        <View style={styles.summaryText}>
          <Text style={styles.totalLabel}>Total de Alunos</Text>
          <Text style={styles.totalNumber}>{students.length}</Text>
        </View>
        <TouchableOpacity style={styles.newStudentButton}>
          <Text style={styles.newStudentButtonText}>Novo Aluno</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de busca e ordenação */}
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

      {/* Cabeçalho da tabela */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, styles.headerName]}>Aluno</Text>
        <Text style={[styles.tableHeaderText, styles.headerGrade]}>Turma</Text>
        <Text style={[styles.tableHeaderText, styles.headerScore]}>Acertos</Text>
      </View>
    </>
  );

  return (
    <FlatList
      data={students}
      keyExtractor={(item) => item.id}
      renderItem={renderStudentItem}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.listContainer}
    />
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
});
