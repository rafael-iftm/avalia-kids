package com.avaliakids.quiz.dto;

import java.util.List;

public class QuestionDTO {
    private String id;
    private String text;
    private List<String> options;
    private String correctOption;
    private String imageUrl;
    private String classLevel;

    public QuestionDTO() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }

    public String getCorrectOption() { return correctOption; }
    public void setCorrectOption(String correctOption) { this.correctOption = correctOption; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getClassLevel() { return classLevel; }
    public void setClassLevel(String classLevel) { this.classLevel = classLevel; }
}
