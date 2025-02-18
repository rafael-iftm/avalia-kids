import { getAuthToken } from '@/utils/auth';
import api from '../utils/api';

export const registerStudent = async (name: string, birthDate: string, token: string, parentId: string) => {
  const response = await api.post('/student-service/students/register', null, {
    params: {
      name,
      birthDate,
      parentId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getStudentsByParent = async (parentId: string) => {
  try {
    console.log('[Gerenciamento de Alunos] Buscando alunos do responsável:', parentId);

    const token = await getAuthToken();
    if (!token) {
      console.log('[Gerenciamento de Alunos] Erro: Token JWT não encontrado no AsyncStorage.');
      throw new Error('Token JWT não encontrado.');
    }

    const response = await api.get(`/student-service/students/by-parent/${parentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    //console.log('[Gerenciamento de Alunos] Resposta do backend:', response.data);
    return response.data;
  } catch (error) {
    console.log('[Gerenciamento de Alunos] Erro ao buscar alunos:', error);
    throw error;
  }
};
