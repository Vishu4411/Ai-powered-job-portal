package com.vishnu.ai_job_portal_backend.dto;

import java.time.LocalDateTime;

public class RecruiterApplicantDTO {
    private Long id;
    private String applicantName;
    private String email;
    private String coverLetter;
    private LocalDateTime appliedAt;
    private String status;
    private Long jobId;
    private String jobTitle;
    private UserProfileDTO candidateProfile;

    public RecruiterApplicantDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

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

    public UserProfileDTO getCandidateProfile() {
        return candidateProfile;
    }

    public void setCandidateProfile(UserProfileDTO candidateProfile) {
        this.candidateProfile = candidateProfile;
    }
}
