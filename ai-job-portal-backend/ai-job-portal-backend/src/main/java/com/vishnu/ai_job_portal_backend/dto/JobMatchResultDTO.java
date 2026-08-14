package com.vishnu.ai_job_portal_backend.dto;

import java.util.ArrayList;
import java.util.List;

public class JobMatchResultDTO {
    private Long jobId;
    private int overallMatchScore;
    private int skillMatchScore;
    private int experienceMatchScore;
    private int educationMatchScore;
    private int locationMatchScore;
    private int jobTypeMatchScore;

    private List<String> matchingSkills = new ArrayList<>();
    private List<String> missingSkills = new ArrayList<>();
    private String aiExplanation;
    private List<String> aiSuggestions = new ArrayList<>();

    public JobMatchResultDTO() {}

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public int getOverallMatchScore() {
        return overallMatchScore;
    }

    public void setOverallMatchScore(int overallMatchScore) {
        this.overallMatchScore = overallMatchScore;
    }

    public int getSkillMatchScore() {
        return skillMatchScore;
    }

    public void setSkillMatchScore(int skillMatchScore) {
        this.skillMatchScore = skillMatchScore;
    }

    public int getExperienceMatchScore() {
        return experienceMatchScore;
    }

    public void setExperienceMatchScore(int experienceMatchScore) {
        this.experienceMatchScore = experienceMatchScore;
    }

    public int getEducationMatchScore() {
        return educationMatchScore;
    }

    public void setEducationMatchScore(int educationMatchScore) {
        this.educationMatchScore = educationMatchScore;
    }

    public int getLocationMatchScore() {
        return locationMatchScore;
    }

    public void setLocationMatchScore(int locationMatchScore) {
        this.locationMatchScore = locationMatchScore;
    }

    public int getJobTypeMatchScore() {
        return jobTypeMatchScore;
    }

    public void setJobTypeMatchScore(int jobTypeMatchScore) {
        this.jobTypeMatchScore = jobTypeMatchScore;
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

    public String getAiExplanation() {
        return aiExplanation;
    }

    public void setAiExplanation(String aiExplanation) {
        this.aiExplanation = aiExplanation;
    }

    public List<String> getAiSuggestions() {
        return aiSuggestions;
    }

    public void setAiSuggestions(List<String> aiSuggestions) {
        this.aiSuggestions = aiSuggestions;
    }
}
