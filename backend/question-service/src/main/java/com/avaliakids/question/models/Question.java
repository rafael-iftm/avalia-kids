package com.avaliakids.question.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "questions")
public class Question {

    @Id
    private String id;
    private String text;
    private List<String> options;
    private String correctOption;
    private String imageUrl; // URL da imagem armazenada (ex: Firebase Storage, S3, etc.)
    private String classLevel; // Exemplo: "1º Ano", "2º Ano"
    
    public Question(String text, List<String> options, String correctOption, String imageUrl, String classLevel) {
        this.text = text;
        this.options = options;
        this.correctOption = correctOption;
        this.imageUrl = imageUrl;
        this.classLevel = classLevel;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public String getCorrectOption() {
        return correctOption;
    }

    public void setCorrectOption(String correctOption) {
        this.correctOption = correctOption;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getClassLevel() {
        return classLevel;
    }

    public void setClassLevel(String classLevel) {
        this.classLevel = classLevel;
    }
}
