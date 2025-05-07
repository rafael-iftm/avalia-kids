import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeAuthToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('authToken', token);
    console.log('Token armazenado com sucesso.');
  } catch (error) {
    console.log('Erro ao armazenar o token JWT:', error);
  }
};

export const getAuthToken = async (): Promise<string> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.');
    }
    return token;
  } catch (error) {
    throw new Error('Erro ao recuperar o token.');
  }
};
