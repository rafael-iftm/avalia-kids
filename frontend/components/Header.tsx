import { View, Text, StyleSheet } from 'react-native';
import ProgressBar from './ui/ProgressBar';

interface HeaderProps {
  title: string;
  progress: number; // Progresso em %
  currentQuestion: number;
  totalQuestions: number;
}

export default function Header({ title, progress, currentQuestion, totalQuestions }: HeaderProps) {
  return (
    <View>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.questionCounter}>{`Pergunta ${currentQuestion} de ${totalQuestions}`}</Text>
      </View>
      <ProgressBar progress={progress} />
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  questionCounter: {
    fontSize: 14,
    color: '#666',
  },
});