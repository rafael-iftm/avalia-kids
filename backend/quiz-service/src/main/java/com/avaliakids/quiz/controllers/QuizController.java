package com.avaliakids.quiz.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.avaliakids.quiz.models.Quiz;
import com.avaliakids.quiz.services.QuizService;

@RestController
@RequestMapping("/quiz")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitAnswer(@RequestBody Quiz answer) {
        boolean alreadyAnswered = quizService.hasStudentAlreadyAnswered(answer.getStudentId(), answer.getQuestionId());
    
        if (alreadyAnswered) {
            return ResponseEntity.ok().body(Map.of("message", "Resposta já foi registrada anteriormente."));
        }
    
        quizService.saveAnswer(answer);
        return ResponseEntity.ok(Map.of("message", "Resposta registrada com sucesso."));
    }    

    @GetMapping("/results/{studentId}")
    public ResponseEntity<List<Quiz>> getStudentResults(@PathVariable String studentId) {
        List<Quiz> results = quizService.getAnswersByStudent(studentId);
        return ResponseEntity.ok(results);
    }
}
