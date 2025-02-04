import { View, Image, StyleSheet } from 'react-native';
import Header from '../../components/Header';
import QuestionCard from '../../components/ui/QuestionCard';
import AnswerButton from '../../components/ui/AnswerButton';
import { useState } from 'react';
import quizData from '../../data/quizData';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';

export default function QuizScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const totalQuestions = quizData.length;
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Avaliação' });
  }, [navigation]);

  const question = quizData[currentQuestionIndex];

  const handleAnswerPress = (option: string) => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      router.replace('/result');
    }
  };

  // Lógica para calcular o progresso
  const progress = ((currentQuestionIndex) / totalQuestions) * 100;

  return (
    <View style={styles.container}>
      {/* Header com o progresso */}
      <Header
        title={`Pergunta ${currentQuestionIndex + 1}`}
        progress={progress}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
      />

      {/* Imagem central associada à pergunta */}
      <Image
        source={question.image}
        style={styles.image}
      />

      {/* Pergunta */}
      <QuestionCard question={question.text} />

      {/* Botões de Resposta */}
      {question.options.map((option, index) => (
        <AnswerButton
          key={index}
          label={option}
          onPress={() => handleAnswerPress(option)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginVertical: 20,
    borderRadius: 10,
  },
});