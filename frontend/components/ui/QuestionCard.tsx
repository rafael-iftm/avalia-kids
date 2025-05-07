import { View, Text, StyleSheet } from 'react-native';

interface QuestionCardProps {
  question: string;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{question}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
