export interface Student {
  id: string;
  name: string;
  birthDate: string;
  className: string;
  parentId: string;
  score: number | null;
  totalQuestions?: number;
}
