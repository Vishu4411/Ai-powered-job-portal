package com.vishnu.ai_job_portal_backend.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class RankedApplicantDTO {

    private Long applicationId;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private String applicationStatus;
    private LocalDateTime appliedAt;

    private String headline;
    private String educationSummary;
    private int yearsOfExperience;

    private int overallMatchScore;
    private int skillMatchScore;
    private int experienceMatchScore;
    private int educationMatchScore;
    private int locationMatchScore;
    private int jobTypeMatchScore;

    private List<String> matchingSkills = new ArrayList<>();
    private List<String> missingSkills = new ArrayList<>();

    public RankedApplicantDTO() {}

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public Long getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }

    public void setCandidateEmail(String candidateEmail) {
        this.candidateEmail = candidateEmail;
    }

    public String getApplicationStatus() {
        return applicationStatus;
    }

    public void setApplicationStatus(String applicationStatus) {
        this.applicationStatus = applicationStatus;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getEducationSummary() {
        return educationSummary;
    }

    public void setEducationSummary(String educationSummary) {
        this.educationSummary = educationSummary;
    }

    public int getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(int yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
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
}
