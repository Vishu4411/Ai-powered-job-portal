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
public class CareerReadinessDTO {

    private int overallScore;
    private int profileScore;
    private int skillsScore;
    private int experienceScore;
    private int educationScore;
    private int projectsScore;
    private int certificationsScore;
    private int resumeATSScore;

    private List<String> strengths = new ArrayList<>();
    private List<String> improvementAreas = new ArrayList<>();
    private String recommendedNextAction;
}
