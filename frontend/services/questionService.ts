import api from '../utils/api';

export const getQuestionsByClassLevel = async (classLevel: string, token: string) => {
  try {
    const response = await api.get(`/question-service/questions/${encodeURIComponent(classLevel)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.log('[Quiz] Erro ao buscar questões:', error);
    throw error;
  }
};
