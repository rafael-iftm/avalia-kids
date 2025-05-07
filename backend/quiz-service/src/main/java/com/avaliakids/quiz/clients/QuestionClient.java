package com.avaliakids.quiz.clients;

import com.avaliakids.quiz.dto.QuestionDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "QUESTION-SERVICE", url = "http://localhost:8082")
public interface QuestionClient {
    @GetMapping("/questions/id/{id}")
    QuestionDTO getQuestionById(@PathVariable("id") String id);
}
