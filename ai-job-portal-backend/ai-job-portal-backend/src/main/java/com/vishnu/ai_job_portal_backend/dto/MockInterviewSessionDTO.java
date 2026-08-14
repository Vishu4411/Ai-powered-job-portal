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
public class MockInterviewSessionDTO {

    private Long jobId;
    private String jobTitle;
    private String company;
    private String candidateName;
    private String candidateSkills;
    private List<QuestionDTO> questions = new ArrayList<>();

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionDTO {
        private int id;
        private String questionText;
        private String category;
        private String hint;
    }
}
