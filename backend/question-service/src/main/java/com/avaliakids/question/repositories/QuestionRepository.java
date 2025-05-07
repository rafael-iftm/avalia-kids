package com.avaliakids.question.repositories;

import com.avaliakids.question.models.Question;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;

public interface QuestionRepository extends MongoRepository<Question, String> {
    List<Question> findByClassLevel(String classLevel);
    Optional<Question> findById(ObjectId id);
}
