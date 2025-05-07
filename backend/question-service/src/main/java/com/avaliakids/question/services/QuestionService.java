package com.avaliakids.question.services;

import com.avaliakids.question.models.Question;
import com.avaliakids.question.repositories.QuestionRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import org.bson.types.ObjectId;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public List<Question> getQuestionsByClassLevel(String classLevel) {
        return questionRepository.findByClassLevel(classLevel);
    }

    public Question addQuestion(Question question) {
        return questionRepository.save(question);
    }

    public Optional<Question> getQuestionById(String id) {
        try {
            return questionRepository.findById(new ObjectId(id));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }
    
    
}
