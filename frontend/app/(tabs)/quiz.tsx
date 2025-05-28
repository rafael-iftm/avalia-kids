import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
} from "react-native";
import Header from "../../components/Header";
import QuestionCard from "../../components/ui/QuestionCard";
import AnswerButton from "../../components/ui/AnswerButton";
import { useRouter } from "expo-router";
import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import ConfettiCannon from "react-native-confetti-cannon";
import CustomHeaderBar from "@/components/ui/CustomHeaderBar";
import { routes } from "@/routes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getQuestionsByClassLevel } from "@/services/questionService";
import { Question } from "@/types/Question";
import { submitAnswer } from "@/services/quizService";
import { getAuthToken } from "@/utils/auth";
import { Image } from 'expo-image';

export default function QuizScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<
    Record<string, boolean>
  >({}); // 🔹 Guarda quais questões já foram registradas no back-end
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const fetchQuestions = async () => {
        try {
            const classLevel = await AsyncStorage.getItem("classLevel");
            const storedStudentId = await AsyncStorage.getItem("selectedStudentId");
            const token = await getAuthToken();

            if (!classLevel || !storedStudentId) {
                Alert.alert("Erro", "Informações do aluno ou nível da turma não encontradas.");
                return;
            }

            console.log(`[Quiz] Buscando questões para: ${classLevel}`);
            console.log(`[Quiz] ID do estudante carregado: ${storedStudentId}`);

            setStudentId(storedStudentId);

            const fetchedQuestions = await getQuestionsByClassLevel(classLevel.trim(), token);

            if (!fetchedQuestions || fetchedQuestions.length === 0) {
                return;
            }

            setQuestions(fetchedQuestions);
        } catch (error) {
            console.log("[Quiz] Erro ao buscar questões:", error);
            Alert.alert("Erro", "Erro ao carregar as questões.");
        } finally {
            setLoading(false);
        }
    };

    fetchQuestions();
}, []);


  const submitAnswerToAPI = async (questionId: string, selectedOption: string) => {
    if (!studentId) {
      console.log("[Quiz] ID do estudante não encontrado.");
      return;
    }

    if (answeredQuestions[questionId]) {
      console.log("[Quiz] Resposta já registrada, não será enviada novamente.");
      return;
    }

    try {
      console.log(`[Quiz] Enviando resposta para API:
        Student ID: ${studentId},
        Questão: ${questionId},
        Resposta: ${selectedOption}`);

      await submitAnswer(studentId, questionId, selectedOption);

      setAnsweredQuestions((prev) => ({
        ...prev,
        [questionId]: true, // 🔹 Marca a questão como já enviada ao back-end
      }));
    } catch (error) {
      console.log("[Quiz] Erro ao enviar resposta:", error);
    }

     console.log(`[Quiz] Resposta salva`)
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#1B3C87" style={styles.loader} />;
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <CustomHeaderBar
          title="Avaliação"
          leftIcon={{ name: "arrow-back-outline", route: routes.home }}
        />
        <View style={styles.emptyContent}>
        <Image
          source="https://firebasestorage.googleapis.com/v0/b/avaliakids.firebasestorage.app/o/no-questions.png?alt=media"
          style={styles.emptyImage}
          contentFit="contain"
        />
          <Text style={styles.emptyTitle}>Sem questões cadastradas</Text>
          <Text style={styles.emptySubtitle}>
            Nenhuma questão foi encontrada para a turma do aluno selecionado.
          </Text>
        </View>
      </View>
    );
  }

  const totalQuestions = questions.length;
  const question = questions[currentQuestionIndex];

  const handleAnswerPress = (option: string) => {
    setSelectedAnswer(option);
    submitAnswerToAPI(question.id, option);

    if (option === question.correctOption) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setSelectedAnswer(null);
          setDisabledOptions([]);
        } else {
          router.replace("/evaluationEnd");
        }
      }, 1500);
    } else {
      setDisabledOptions([...disabledOptions, option]);
    }
  };

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <View style={styles.container}>
      <CustomHeaderBar
        title="Avaliação"
        leftIcon={{ name: "arrow-back-outline", route: routes.welcome }}
      />
      <View style={styles.content}>
        <Header
          title={`Pergunta ${currentQuestionIndex + 1}`}
          progress={progress}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
        />

        <Image
          source={question.imageUrl}
          style={styles.image}
          contentFit="contain"
        />

        <QuestionCard question={question.text} />

        {question.options.map((option, index) => (
          <AnswerButton
            key={index}
            label={option}
            onPress={() => !disabledOptions.includes(option) && handleAnswerPress(option)}
            style={
              selectedAnswer === option && option === question.correctOption
                ? styles.correctButton
                : disabledOptions.includes(option) ||
                  (selectedAnswer === option && option !== question.correctOption)
                ? styles.incorrectButton
                : {}
            }
          />
        ))}

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
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 100,
  },
  emptyImage: {
    width: 250,
    height: 250,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B3C87',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#4A5568',
  },
});
