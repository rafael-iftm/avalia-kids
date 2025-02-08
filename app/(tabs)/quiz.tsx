import { View, Image, StyleSheet } from 'react-native';
import Header from '../../components/Header';
import QuestionCard from '../../components/ui/QuestionCard';
import AnswerButton from '../../components/ui/AnswerButton';
import { useState } from 'react';
import quizData from '../../data/quizData';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function QuizScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);
  const totalQuestions = quizData.length;
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Avaliação',
      headerBackVisible: false,
    });
  }, [navigation]);

  const question = quizData[currentQuestionIndex];

  const handleAnswerPress = (option: string) => {
    setSelectedAnswer(option);

    if (option === question.correct) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
          setDisabledOptions([]);
        } else {
          router.replace('/result');
        }
      }, 1500);
    } else {
      setDisabledOptions([...disabledOptions, option]);
    }
  };

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

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
          onPress={() => !disabledOptions.includes(option) && handleAnswerPress(option)}
          style={
            disabledOptions.includes(option)
              ? styles.incorrectButton
              : selectedAnswer === option && option !== question.correct
              ? styles.incorrectButton
              : {}
          }
        />
      ))}

      {/* Animação de confetes */}
      {showConfetti && (
        <ConfettiCannon
          count={200}
          origin={{ x: 0, y: 0 }}
          fadeOut={true}
          explosionSpeed={500}
          fallSpeed={1500}
        />
      )}
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
  incorrectButton: {
    backgroundColor: '#B0BEC5',
    opacity: 0.4
  },
});
