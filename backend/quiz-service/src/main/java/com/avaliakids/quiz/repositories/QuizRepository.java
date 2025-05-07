package com.avaliakids.quiz.repositories;

import com.avaliakids.quiz.models.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface QuizRepository extends MongoRepository<Quiz, String> {
    boolean existsByStudentIdAndQuestionId(String studentId, String questionId);
    List<Quiz> findByStudentId(String studentId);
}
