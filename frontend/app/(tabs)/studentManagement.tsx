import ConfirmationModal from "@/components/ui/ConfirmationModal";
import CustomHeaderBar from "@/components/ui/CustomHeaderBar";
import RegistrationModal from "@/components/ui/RegistrationModal";
import StudentItem from "@/components/ui/StudentItem";
import StudentListHeader from "@/components/ui/StudentListHeader";
import { routes } from "@/routes";
import { getStudentsByParent, registerStudent } from "@/services/studentService";
import { Student } from "@/types/Student";
import { searchStudents, sortStudents } from "@/utils/sortAndSearch";
import { getAuthToken } from "@/utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Keyboard, StyleSheet } from "react-native";
import axios from "axios";
import { fetchStudentResults, fetchTotalQuestions } from "@/services/quizService";

type SortBy = "alfabetica" | "turma";

export default function StudentManagementScreen() {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
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
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const parentId = await AsyncStorage.getItem("userId");
      const token = await getAuthToken();
  
      if (!parentId || !token) {
        Alert.alert("Erro", "ID do responsável ou autenticação inválida.");
        return;
      }
  
      const studentsData = await getStudentsByParent(parentId);
  
      const updatedStudents = await Promise.all(
        studentsData.map(async (student: Student) => {
          const totalQuestions = await fetchTotalQuestions(student.className, token);
          const studentResults = await fetchStudentResults(student.id, token);
  
          // Conta quantas respostas foram corretas
          const correctAnswers = studentResults.filter((answer: any) => answer.correct).length;
  
          // 🔹 Define se o aluno completou o quiz
          const hasCompletedQuiz = studentResults.length === totalQuestions;
  
          return { ...student, totalQuestions, score: hasCompletedQuiz ? correctAnswers : null };
        })
      );
  
      // 🔹 Ordenação alfabética
      const sortedStudents = updatedStudents.sort((a, b) =>
        a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
      );
  
      setAllStudents(sortedStudents);
      setStudents(sortedStudents);
    } catch (error) {
      console.log("[Gerenciamento de Alunos] Erro ao buscar alunos:", error);
      Alert.alert("Erro", "Erro ao carregar os alunos.");
    } finally {
      setLoading(false);
    }
  };  

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setStudents(sortStudents(allStudents, sortBy));
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

  const handleEvaluate = async (student: Student) => {
    try {
      await AsyncStorage.setItem('selectedStudentId', student.id);
      await AsyncStorage.setItem('classLevel', student.className);
  
      console.log(`[Storage] Student ID salvo: ${student.id}`);
      console.log(`[Storage] Class Level salvo: ${student.className}`);
  
      router.push({
        pathname: "/evaluationStart",
        params: {
          preSelectedStudentId: student.id,
          preSelectedStudentName: student.name,
          preSelectedClassLevel: student.className,
        },
      });
    } catch (error) {
      console.log("[Gerenciamento de Alunos] Erro ao armazenar aluno selecionado:", error);
      Alert.alert("Erro", "Não foi possível iniciar a avaliação.");
    }
  };
  
  const confirmRegistration = async () => {
    try {
      console.log("[Registro de Aluno] Iniciando o processo de registro do aluno...");

      const token = await getAuthToken();
      const parentId = await AsyncStorage.getItem("userId");

      if (!parentId) {
        Alert.alert("Erro", "Não foi possível encontrar o ID do responsável.");
        return;
      }

      console.log("[Registro de Aluno] Token JWT obtido:", token);
      console.log("[Registro de Aluno] ID do responsável:", parentId);
      console.log("[Registro de Aluno] Enviando dados do aluno:", { newStudentName, newStudentBirthDate });

      await registerStudent(newStudentName, newStudentBirthDate, token, parentId);

      console.log("[Registro de Aluno] Aluno cadastrado com sucesso!");

      await fetchStudents();

      setConfirmationVisible(false);
      setModalVisible(false);
      
    } catch (error) {
      console.log("[Registro de Aluno] Erro durante o registro:", error);

      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const message = error.response.data.message || "Erro ao registrar o aluno.";
        console.log("[Registro de Aluno] Erro HTTP", { status, message });

        Alert.alert("Erro", message);
      } else {
        console.log("[Registro de Aluno] Erro de conexão ou erro desconhecido.");
        Alert.alert("Erro", "Erro de conexão. Verifique sua internet.");
      }
    }
  };

  return (
    <>
      <CustomHeaderBar
        title="Alunos"
        leftIcon={{ name: "arrow-back-outline", route: routes.menu }}
        rightIcon={{ name: "log-out-outline", route: routes.login }}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1B3C87" style={styles.loader} />
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StudentItem 
              student={item} 
              onEvaluate={() => handleEvaluate(item)} 
              totalQuestions={item.totalQuestions} 
            />
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
        onConfirm={confirmRegistration}
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
