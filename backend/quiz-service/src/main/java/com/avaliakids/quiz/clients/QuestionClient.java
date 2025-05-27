package com.avaliakids.quiz.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.avaliakids.quiz.config.FeignConfig;
import com.avaliakids.quiz.dto.QuestionDTO;

@FeignClient(name = "api-gateway", configuration = FeignConfig.class)
public interface QuestionClient {
    @GetMapping("/question-service/questions/id/{id}")
    QuestionDTO getQuestionById(@PathVariable("id") String id);
}