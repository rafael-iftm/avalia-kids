import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import RegistrationModal from '../../components/ui/RegistrationModal';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import StudentListHeader from '../../components/ui/StudentListHeader';
import StudentItem from '../../components/ui/StudentItem';
import { sortStudents, searchStudents } from '../../utils/sortAndSearch';
import CustomHeaderBar from '@/components/ui/CustomHeaderBar';
import { routes } from '@/routes';
import { getStudentsByParent } from '@/services/studentService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import axios from 'axios';
import { Student } from '@/types/Student';

type SortBy = 'alfabetica' | 'turma';

export default function StudentManagementScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('alfabetica');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentBirthDate, setNewStudentBirthDate] = useState('');
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const parentId = await AsyncStorage.getItem('userId');
        if (!parentId) {
          Alert.alert('Erro', 'ID do responsável não encontrado.');
          return;
        }
        const studentsData = await getStudentsByParent(parentId);
        setStudents(studentsData);
      } catch (error) {
        console.log('[Gerenciamento de Alunos] Erro ao buscar alunos:', error);
        Alert.alert('Erro', 'Erro ao carregar os alunos. Verifique sua conexão.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchStudents();
  }, []);
  
  

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filteredStudents = searchStudents(students, query);
    setStudents(sortStudents(filteredStudents, sortBy));
  };

  const toggleSort = () => {
    const newSortBy: SortBy = sortBy === 'alfabetica' ? 'turma' : 'alfabetica';
    setSortBy(newSortBy);
    setStudents(sortStudents(students, newSortBy));
  };

  return (
    <>
      <CustomHeaderBar
        title='Alunos'
        leftIcon={{ name: 'arrow-back-outline', route: routes.home }}
        rightIcon={{ name: 'log-out-outline', route: routes.login }}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1B3C87" style={styles.loader} />
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StudentItem student={item} onEvaluate={() => router.push('/quiz')} />
          )}
          ListHeaderComponent={
            <StudentListHeader
              studentsCount={students.length}
              searchQuery={searchQuery}
              onSearch={handleSearch}
              onSortToggle={toggleSort}
              sortBy={sortBy}
              onNewStudentPress={() => setModalVisible(true)}
            />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}

      <RegistrationModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={(name, birthDate) => {
          setNewStudentName(name);
          setNewStudentBirthDate(birthDate);
          setModalVisible(false);
          setConfirmationVisible(true);
        }}
      />

      <ConfirmationModal
        visible={isConfirmationVisible}
        newStudentName={newStudentName}
        newStudentBirthDate={newStudentBirthDate}
        onCancel={() => {
          setConfirmationVisible(false);
          setModalVisible(true);
        }}
        onConfirm={() => {
          console.log('[Gerenciamento de Alunos] Novo aluno confirmado:', newStudentName);
          setConfirmationVisible(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
