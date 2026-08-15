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
public class PostApplicationCoachDTO {

    private Long applicationId;
    private Long jobId;
    private String jobTitle;
    private String company;
    private String status;

    private int matchScore;
    private int atsScore;
    private int stageReadinessScore;

    private String stageGuidance;
    private String recommendedFollowUpDate;

    private List<String> focusInterviewTopics = new ArrayList<>();
    private List<String> stageActionChecklist = new ArrayList<>();
    private List<String> skillPivotRecommendations = new ArrayList<>();

    private String recommendedNextAction;
}
