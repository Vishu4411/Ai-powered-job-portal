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
public class MockInterviewSubmissionDTO {

    private Long jobId;
    private List<AnswerItem> answers = new ArrayList<>();

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnswerItem {
        private int questionId;
        private String questionText;
        private String category;
        private String candidateAnswer;
    }
}
