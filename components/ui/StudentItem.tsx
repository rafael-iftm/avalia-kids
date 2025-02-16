import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Student } from '../../types/Student';

interface StudentItemProps {
  student: Student;
  onEvaluate: () => void;
  totalQuestions?: number;
}

const StudentItem: React.FC<StudentItemProps> = ({ student, onEvaluate, totalQuestions }) => {
  const hasCompletedQuiz = totalQuestions && student.score !== null;

  return (
    <View style={styles.studentRow}>
      <Text style={[styles.studentCell, styles.studentCellName]}>{student.name}</Text>
      <Text style={[styles.studentCell, styles.studentCellGrade]}>{student.className}</Text>

      {hasCompletedQuiz ? (
        <Text style={[styles.studentCell, styles.studentCellScore]}>
          {student.score}/{totalQuestions}
        </Text>
      ) : (
        <TouchableOpacity style={styles.evaluateButton} onPress={onEvaluate}>
          <Text style={styles.evaluateButtonText}>Avaliar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  },
  studentCell: {
    fontSize: 14,
    color: '#333',
  },
  studentCellName: {
    width: '40%',
  },
  studentCellGrade: {
    width: '30%',
    textAlign: 'center',
  },
  studentCellScore: {
    width: '30%',
    textAlign: 'center',
  },
  evaluateButton: {
    backgroundColor: '#1B3C87',
    borderRadius: 8,
    flex: 1,
  },
  evaluateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default StudentItem;
