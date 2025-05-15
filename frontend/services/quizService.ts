import api from "../utils/api";
import { getAuthToken } from "@/utils/auth";

// Enviar resposta para a API
export const submitAnswer = async (
  studentId: string,
  questionId: string,
  selectedOption: string
) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      console.log("[Quiz] Erro: Token de autenticação não encontrado.");
      throw new Error("Usuário não autenticado.");
    }

    const response = await api.post(
      "/quiz-service/quiz/submit",
      {
        studentId,
        questionId,
        selectedOption,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("[Quiz] Erro ao enviar resposta:", error);
    throw error;
  }
};

export const fetchStudentResults = async (studentId: string, token: string) => {
  try {
    const response = await api.get(`/quiz-service/quiz/results/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` },
      validateStatus: () => true,
    });

    console.log(`Resposta da API para aluno ${studentId}: HTTP ${response.status}`);

    if (response.status === 200) {
      return response.data;
    }

    console.warn(`[WARN] Resposta inesperada: HTTP ${response.status}`);
    return [];
  } catch (error) {
    console.error("[Quiz] Erro ao buscar resultados do aluno:", error);
    return [];
  }
};

export const fetchTotalQuestions = async (classLevel: string) => {
  try {
    const response = await api.get(`/question-service/questions/${classLevel}`);
    return response.data.length;
  } catch (error) {
    console.log("[Quiz] Erro ao buscar total de perguntas:", error);
    return 0;
  }
};