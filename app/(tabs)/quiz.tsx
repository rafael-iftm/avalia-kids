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
import CustomHeaderBar from '@/components/ui/CustomHeaderBar';
import { routes } from '@/routes';

export default function QuizScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);
  const totalQuestions = quizData.length;
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const question = quizData[currentQuestionIndex];

  const handleAnswerPress = (option: string) => {
    setSelectedAnswer(option);

    if (option === question.correct) {
      setShowConfetti(true);
    } else {
      setDisabledOptions([...disabledOptions, option]);
    }
  
    if (option === question.correct) {
      setShowConfetti(true);
      setTimeout(() => {
        if (option === question.correct) {
          setShowConfetti(false);
          if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setDisabledOptions([]);
          } else {
            router.replace('/evaluationEnd');
          }
        }
      }, 1500);
    };
};

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <View style={styles.container}>
      <CustomHeaderBar
        title="Avaliação"
        leftIcon={{ name: 'arrow-back-outline', route: routes.welcome }}
      />
      <View style={styles.content}>
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
              selectedAnswer === option && option === question.correct
                ? styles.correctButton
                : disabledOptions.includes(option) || (selectedAnswer === option && option !== question.correct)
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginVertical: 20,
    borderRadius: 10,
  },
  correctButton: {
    backgroundColor: '#4CAF50',
  },
  incorrectButton: {
    backgroundColor: '#A0AEC0',
    opacity: 0.4,
  },
});
