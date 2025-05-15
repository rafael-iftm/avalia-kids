import axios from "axios";
import api from '../utils/api';

export const registerUser = async (name: string, email: string, password: string, role: string) => {
  const response = await api.post('/auth-service/auth/register', {
    name,
    email,
    password,
    role,
  });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const url = '/auth-service/auth/login';

  const curlCommand = `curl --location '${api.defaults.baseURL}${url}' \\
--header 'Content-Type: application/json' \\
--data-raw '{
  "email": "${email}",
  "password": "${password}"
}'`;

  // console.log("[DEBUG] Executando login com curl:\n", curlCommand);

  const response = await api.post(url, {
    email,
    password,
  });

  return response.data;
};

export const validateParentPassword = async (parentId: string, password: string) => {
  try {
    const response = await api.post(`/auth-service/auth/validate-password`, { parentId, password });

    return { isValid: response.data.isValid, message: "Senha correta! Acesso liberado." };
  } catch (error: unknown) {
    console.log("[Validação de Senha] Erro ao validar senha:", error);

    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message || "Erro ao validar a senha. Tente novamente mais tarde.";

      switch (status) {
        case 401:
          return { isValid: false, message: "Senha incorreta. Por favor, tente novamente." };
        case 404:
          return { isValid: false, message: "Responsável não encontrado. Verifique os dados." };
        default:
          return { isValid: false, message };
      }
    }

    // Se não for erro HTTP (por exemplo, erro de conexão)
    return { isValid: false, message: "Erro de conexão. Verifique sua internet." };
  }
};
