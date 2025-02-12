import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Alert, Text } from 'react-native';
import Header from '../../components/Header';
import QuestionCard from '../../components/ui/QuestionCard';
import AnswerButton from '../../components/ui/AnswerButton';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import ConfettiCannon from 'react-native-confetti-cannon';
import CustomHeaderBar from '@/components/ui/CustomHeaderBar';
import { routes } from '@/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getQuestionsByClassLevel } from '@/services/questionService';
import { Question } from '@/types/Question';

export default function QuizScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const classLevel = await AsyncStorage.getItem('classLevel');
        if (!classLevel) {
          Alert.alert('Erro', 'Não foi possível determinar o nível da turma.');
          return;
        }

        console.log(`[Quiz] Buscando questões para: ${classLevel}`);
        const fetchedQuestions = await getQuestionsByClassLevel(classLevel);

        if (!fetchedQuestions || fetchedQuestions.length === 0) {
          Alert.alert('Erro', 'Nenhuma questão disponível para esta turma.');
          return;
        }

        setQuestions(fetchedQuestions);
      } catch (error) {
        console.log('[Quiz] Erro ao buscar questões:', error);
        Alert.alert('Erro', 'Erro ao carregar as questões.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#1B3C87" style={styles.loader} />;
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <CustomHeaderBar title="Avaliação" />
        <Text style={styles.errorText}>Nenhuma questão disponível para sua turma.</Text>
      </View>
    );
  }

  const totalQuestions = questions.length;
  const question = questions[currentQuestionIndex];

  const handleAnswerPress = (option: string) => {
    setSelectedAnswer(option);

    if (option === question.correctOption) {
      setShowConfetti(true);
    } else {
      setDisabledOptions([...disabledOptions, option]);
    }

    if (option === question.correctOption) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setSelectedAnswer(null);
          setDisabledOptions([]);
        } else {
          router.replace('/evaluationEnd');
        }
      }, 1500);
    }
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
        <Image source={{ uri: question.imageUrl }} style={styles.image} />

        {/* Pergunta */}
        <QuestionCard question={question.text} />

        {/* Botões de Resposta */}
        {question.options.map((option, index) => (
          <AnswerButton
            key={index}
            label={option}
            onPress={() => !disabledOptions.includes(option) && handleAnswerPress(option)}
            style={
              selectedAnswer === option && option === question.correctOption
                ? styles.correctButton
                : disabledOptions.includes(option) || (selectedAnswer === option && option !== question.correctOption)
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
