package com.vishnu.ai_job_portal_backend.dto;

import java.util.ArrayList;
import java.util.List;

public class ATSResumeAnalysisDTO {

    private int overallScore;
    private int profileCompletenessScore;
    private int skillsScore;
    private int experienceScore;
    private int educationScore;
    private int projectsScore;
    private int certificationsScore;
    private int summaryScore;
    private int keywordScore;

    private List<String> strengths = new ArrayList<>();
    private List<String> weaknesses = new ArrayList<>();
    private List<String> recommendations = new ArrayList<>();
    private String aiExplanation;

    public ATSResumeAnalysisDTO() {}

    public int getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(int overallScore) {
        this.overallScore = overallScore;
    }

    public int getProfileCompletenessScore() {
        return profileCompletenessScore;
    }

    public void setProfileCompletenessScore(int profileCompletenessScore) {
        this.profileCompletenessScore = profileCompletenessScore;
    }

    public int getSkillsScore() {
        return skillsScore;
    }

    public void setSkillsScore(int skillsScore) {
        this.skillsScore = skillsScore;
    }

    public int getExperienceScore() {
        return experienceScore;
    }

    public void setExperienceScore(int experienceScore) {
        this.experienceScore = experienceScore;
    }

    public int getEducationScore() {
        return educationScore;
    }

    public void setEducationScore(int educationScore) {
        this.educationScore = educationScore;
    }

    public int getProjectsScore() {
        return projectsScore;
    }

    public void setProjectsScore(int projectsScore) {
        this.projectsScore = projectsScore;
    }

    public int getCertificationsScore() {
        return certificationsScore;
    }

    public void setCertificationsScore(int certificationsScore) {
        this.certificationsScore = certificationsScore;
    }

    public int getSummaryScore() {
        return summaryScore;
    }

    public void setSummaryScore(int summaryScore) {
        this.summaryScore = summaryScore;
    }

    public int getKeywordScore() {
        return keywordScore;
    }

    public void setKeywordScore(int keywordScore) {
        this.keywordScore = keywordScore;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }

    public List<String> getWeaknesses() {
        return weaknesses;
    }

    public void setWeaknesses(List<String> weaknesses) {
        this.weaknesses = weaknesses;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }

    public String getAiExplanation() {
        return aiExplanation;
    }

    public void setAiExplanation(String aiExplanation) {
        this.aiExplanation = aiExplanation;
    }
}
