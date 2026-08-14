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
public class CareerActionPlanDTO {

    private int overallReadinessScore;
    private String priorityLevel; // CRITICAL, HIGH, MODERATE, ON_TRACK
    private String nextBestAction;
    private String topPriorityFocus;
    private String executiveSummary;
    private String estimatedTimeline;

    private List<ActionTask> skillTasks = new ArrayList<>();
    private List<ActionTask> resumeTasks = new ArrayList<>();
    private List<ActionTask> projectTasks = new ArrayList<>();
    private List<ActionTask> interviewTasks = new ArrayList<>();
    private List<WeeklyMilestone> weeklyRoadmap = new ArrayList<>();

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActionTask {
        private String taskId;
        private String category;
        private String title;
        private String description;
        private String impact; // HIGH, MEDIUM, LOW
        private String effort; // LOW_EFFORT, MODERATE, HIGH_EFFORT
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeeklyMilestone {
        private int weekNumber;
        private String title;
        private String focusArea;
        private List<String> goals = new ArrayList<>();
    }
}
