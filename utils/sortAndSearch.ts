import { Student } from '../types/Student';

export const sortStudents = (students: Student[], sortBy: string): Student[] => {
  return [...students].sort((a, b) => {
    if (sortBy === 'alfabetica') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'turma') {
      return a.grade.localeCompare(b.grade);
    }
    return 0;
  });
};

export const searchStudents = (students: Student[], query: string): Student[] => {
  if (!query.trim()) return students;
  return students.filter(student => student.name.toLowerCase().includes(query.toLowerCase()));
};
