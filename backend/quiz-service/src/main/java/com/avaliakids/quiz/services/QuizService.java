package com.avaliakids.quiz.services;

import com.avaliakids.quiz.clients.QuestionClient;
import com.avaliakids.quiz.dto.QuestionDTO;
import com.avaliakids.quiz.models.Quiz;
import com.avaliakids.quiz.repositories.QuizRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionClient questionClient;

    public QuizService(QuizRepository quizRepository, QuestionClient questionClient) {
        this.quizRepository = quizRepository;
        this.questionClient = questionClient;
    }

    public boolean hasStudentAlreadyAnswered(String studentId, String questionId) {
        return quizRepository.existsByStudentIdAndQuestionId(studentId, questionId);
    }

    public boolean saveAnswer(Quiz answer) {
        if (hasStudentAlreadyAnswered(answer.getStudentId(), answer.getQuestionId())) {
            return false;
        }
    
        // Buscar questão no `question-service`
        QuestionDTO question = questionClient.getQuestionById(answer.getQuestionId());
        System.out.println("DEBUG: Question encontrada -> " + question);
    
        if (question == null) {
            throw new RuntimeException("Erro: Questão não encontrada no question-service para o ID " + answer.getQuestionId());
        }
    
        boolean isCorrect = question.getCorrectOption().trim().equalsIgnoreCase(answer.getSelectedOption().trim());
        answer.setCorrect(isCorrect);
        quizRepository.save(answer);
        return true;
    }    

    public List<Quiz> getAnswersByStudent(String studentId) {
        return quizRepository.findByStudentId(studentId);
    }
}
