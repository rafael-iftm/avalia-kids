import api from '../utils/api';

export const registerStudent = async (name: string, birthDate: string, token: string, parentId: string) => {
  const response = await api.post('/students/register', null, {
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
