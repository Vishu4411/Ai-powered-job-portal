package com.vishnu.ai_job_portal_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MockInterviewFeedbackDTO {

    private int overallScore;
    private int technicalAccuracyScore;
    private int completenessScore;
    private int communicationScore;
    private String keyTakeaway;

    private List<QuestionFeedbackItem> questionFeedback = new ArrayList<>();

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionFeedbackItem {
        private int questionId;
        private String questionText;
        private String category;
        private String candidateAnswer;
        private int score;
        private List<String> strengths = new ArrayList<>();
        private List<String> missingConcepts = new ArrayList<>();
        private String modelAnswerAdvice;
    }
}
