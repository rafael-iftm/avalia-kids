import ConfirmationModal from "@/components/ui/ConfirmationModal";
import CustomHeaderBar from "@/components/ui/CustomHeaderBar";
import RegistrationModal from "@/components/ui/RegistrationModal";
import StudentItem from "@/components/ui/StudentItem";
import StudentListHeader from "@/components/ui/StudentListHeader";
import { routes } from "@/routes";
import { getStudentsByParent } from "@/services/studentService";
import { Student } from "@/types/Student";
import { searchStudents, sortStudents } from "@/utils/sortAndSearch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet } from "react-native";

// Definição do tipo SortBy
type SortBy = "alfabetica" | "turma";

export default function StudentManagementScreen() {
  const [allStudents, setAllStudents] = useState<Student[]>([]); // Lista original
  const [students, setStudents] = useState<Student[]>([]); // Lista filtrada
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("alfabetica");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentBirthDate, setNewStudentBirthDate] = useState("");
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
        const parentId = await AsyncStorage.getItem("userId");
        if (!parentId) {
          Alert.alert("Erro", "ID do responsável não encontrado.");
          return;
        }
        const studentsData = await getStudentsByParent(parentId);
        setAllStudents(studentsData); // Guarda a lista original
        setStudents(studentsData); // Define a lista inicial
      } catch (error) {
        console.log("[Gerenciamento de Alunos] Erro ao buscar alunos:", error);
        Alert.alert("Erro", "Erro ao carregar os alunos. Verifique sua conexão.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setStudents(sortStudents(allStudents, sortBy)); // Restaura a lista original ao apagar a busca
    } else {
      const filteredStudents = searchStudents(allStudents, query);
      setStudents(sortStudents(filteredStudents, sortBy));
    }
  };

  const toggleSort = () => {
    const newSortBy: SortBy = sortBy === "alfabetica" ? "turma" : "alfabetica";
    setSortBy(newSortBy);
    setStudents(sortStudents(allStudents, newSortBy));
  };

  return (
    <>
      <CustomHeaderBar
        title="Alunos"
        leftIcon={{ name: "arrow-back-outline", route: routes.home }}
        rightIcon={{ name: "log-out-outline", route: routes.login }}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1B3C87" style={styles.loader} />
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StudentItem student={item} onEvaluate={() => router.push("/quiz")} />
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
          console.log("[Gerenciamento de Alunos] Novo aluno confirmado:", newStudentName);
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
    justifyContent: "center",
    alignItems: "center",
  },
});
