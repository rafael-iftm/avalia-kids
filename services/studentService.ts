import api from '../utils/api';

export const registerStudent = async (name: string, birthDate: string, token: string) => {
  const response = await api.post(
    '/students/register',
    new URLSearchParams({
      name,
      birthDate,
    }),
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data;
};
