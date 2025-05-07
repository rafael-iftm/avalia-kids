package com.avaliakids.quiz.controllers;

import com.avaliakids.quiz.models.Quiz;
import com.avaliakids.quiz.services.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
