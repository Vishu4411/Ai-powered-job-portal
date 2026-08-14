package com.vishnu.ai_job_portal_backend.dto;

import java.util.ArrayList;
import java.util.List;

public class JobRecommendationDTO {
    private Long jobId;
    private String title;
    private String company;
    private String location;
    private String salary;
    private String experience;
    private String jobType;
    private String skills;

    private int overallMatchScore;
    private int skillMatchScore;
    private int experienceMatchScore;
    private int educationMatchScore;
    private int locationMatchScore;
    private int jobTypeMatchScore;

    private List<String> matchingSkills = new ArrayList<>();
    private List<String> missingSkills = new ArrayList<>();

    public JobRecommendationDTO() {}

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSalary() {
        return salary;
    }

    public void setSalary(String salary) {
        this.salary = salary;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
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
