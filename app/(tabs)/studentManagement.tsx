import React, { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import RegistrationModal from '../../components/ui/RegistrationModal';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import StudentListHeader from '../../components/ui/StudentListHeader';
import StudentItem from '../../components/ui/StudentItem';
import { sortStudents, searchStudents } from '../../utils/sortAndSearch';
import { studentsData } from '../../data/studentsData';
import { Student } from '../../types/Student';
import CustomHeaderBar from '@/components/ui/CustomHeaderBar';
import { routes } from '@/routes';

type SortBy = 'alfabetica' | 'turma';

export default function StudentManagementScreen() {
  const [students, setStudents] = useState<Student[]>(studentsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('alfabetica');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentBirthDate, setNewStudentBirthDate] = useState('');

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
    const filteredStudents = searchStudents(studentsData, query);
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
        onConfirm={handleAddStudent}
      />
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
});
