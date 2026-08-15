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
public class JobApplicationCopilotDTO {

    private Long jobId;
    private String jobTitle;
    private String company;

    private int applicationReadinessScore;
    private String recommendation; // READY_TO_APPLY, APPLY_AFTER_IMPROVEMENT, LOW_MATCH_CONSIDER_OTHER_ROLES

    private int overallMatchScore;
    private int atsScore;
    private int careerReadinessScore;

    private List<String> strengths = new ArrayList<>();
    private List<String> skillGaps = new ArrayList<>();
    private List<String> resumeImprovements = new ArrayList<>();
    private List<String> applicationChecklist = new ArrayList<>();

    private String applicationStrategy;
    private String recommendedNextAction;
}
