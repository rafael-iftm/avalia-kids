import { Student } from '../types/Student';

/**
 * Ordena a lista de alunos com base no critério especificado.
 * 
 * @param students - Array de estudantes a serem ordenados.
 * @param sortBy - O critério de ordenação: 'alfabetica' para ordenar por nome ou 'turma' para ordenar pela turma.
 * @returns Um novo array de estudantes ordenado de acordo com o critério especificado.
 */
export const sortStudents = (students: Student[], sortBy: 'alfabetica' | 'turma'): Student[] => {
  return [...students].sort((a, b) => {
    if (sortBy === 'alfabetica') {
      return a.name.localeCompare(b.name); // Ordena os nomes em ordem alfabética
    } else if (sortBy === 'turma') {
      return a.className.localeCompare(b.className); // Ordena pela turma
    }
    return 0;
  });
};

/**
 * Filtra a lista de estudantes com base na consulta de pesquisa.
 * 
 * @param students - Array de estudantes a serem filtrados.
 * @param query - O texto da consulta de pesquisa (ignora maiúsculas/minúsculas).
 * @returns Um novo array de estudantes cujo nome contém a consulta de pesquisa.
 */
export const searchStudents = (students: Student[], query: string): Student[] => {
  if (!query.trim()) return students; // Retorna a lista completa se a consulta estiver vazia
  return students.filter(student => 
    student.name.toLowerCase().includes(query.toLowerCase()) // Verifica se o nome contém a consulta
  );
};
