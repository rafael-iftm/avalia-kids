package com.avaliakids.quiz.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "quizzes")
public class Quiz {

    @Id
    private String id;
    private String studentId;
    private String questionId;
    private String selectedOption;
    private boolean isCorrect;

    public Quiz() {}

    public Quiz(String studentId, String questionId, String selectedOption, boolean isCorrect) {
        this.studentId = studentId;
        this.questionId = questionId;
        this.selectedOption = selectedOption;
        this.isCorrect = isCorrect;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getQuestionId() { return questionId; }
    public void setQuestionId(String questionId) { this.questionId = questionId; }

    public String getSelectedOption() { return selectedOption; }
    public void setSelectedOption(String selectedOption) { this.selectedOption = selectedOption; }

    public boolean isCorrect() { return isCorrect; }
    public void setCorrect(boolean correct) { isCorrect = correct; }
}
