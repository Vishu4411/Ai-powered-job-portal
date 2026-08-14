package com.vishnu.ai_job_portal_backend.dto;

import java.util.ArrayList;
import java.util.List;

public class SkillGapRoadmapDTO {

    private Long jobId;
    private String jobTitle;
    private String company;
    private int overallMatchScore;

    private List<String> matchingSkills = new ArrayList<>();
    private List<String> missingSkills = new ArrayList<>();

    private String roadmapSummary;
    private List<String> weeklyRoadmap = new ArrayList<>();
    private String recommendedProject;
    private String estimatedPreparation;

    public SkillGapRoadmapDTO() {}

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public int getOverallMatchScore() {
        return overallMatchScore;
    }

    public void setOverallMatchScore(int overallMatchScore) {
        this.overallMatchScore = overallMatchScore;
    }

    public List<String> getMatchingSkills() {
        return matchingSkills;
    }

    public void setMatchingSkills(List<String> matchingSkills) {
        this.matchingSkills = matchingSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public String getRoadmapSummary() {
        return roadmapSummary;
    }

    public void setRoadmapSummary(String roadmapSummary) {
        this.roadmapSummary = roadmapSummary;
    }

    public List<String> getWeeklyRoadmap() {
        return weeklyRoadmap;
    }

    public void setWeeklyRoadmap(List<String> weeklyRoadmap) {
        this.weeklyRoadmap = weeklyRoadmap;
    }

    public String getRecommendedProject() {
        return recommendedProject;
    }

    public void setRecommendedProject(String recommendedProject) {
        this.recommendedProject = recommendedProject;
    }

    public String getEstimatedPreparation() {
        return estimatedPreparation;
    }

    public void setEstimatedPreparation(String estimatedPreparation) {
        this.estimatedPreparation = estimatedPreparation;
    }
}
