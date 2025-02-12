import api from '../utils/api';

export const getQuestionsByClassLevel = async (classLevel: string) => {
  try {
    const response = await api.get(`/questions/${encodeURIComponent(classLevel)}`);
    return response.data;
  } catch (error) {
    console.error('[Quiz] Erro ao buscar questões:', error);
    throw error;
  }
};
