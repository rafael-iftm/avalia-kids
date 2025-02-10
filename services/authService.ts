import api from '../utils/api';

export const registerUser = async (name: string, email: string, password: string, role: string) => {
  const response = await api.post('/auth/register', {
    name,
    email,
    password,
    role,
  });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/auth/login', null, {
    params: {
      email,
      password,
    },
  });
  return response.data;
};
