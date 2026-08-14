package com.vishnu.ai_job_portal_backend.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class RecruiterAnalyticsDTO {

    private int totalJobs;
    private int activeJobs;
    private int closedJobs;

    private int totalApplicants;

    private int averageMatchScore;
    private int topMatchScore;

    private int pendingApplications;
    private int shortlistedApplications;
    private int interviewScheduledApplications;
    private int rejectedApplications;

    private double shortlistRate;
    private double interviewRate;
    private double rejectionRate;

    private TopCandidateDTO topCandidate;
    private List<AnalyticsSkillDTO> topSkills = new ArrayList<>();
    private List<RecentApplicationDTO> recentApplications = new ArrayList<>();

    public RecruiterAnalyticsDTO() {}

    public int getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(int totalJobs) {
        this.totalJobs = totalJobs;
    }

    public int getActiveJobs() {
        return activeJobs;
    }

    public void setActiveJobs(int activeJobs) {
        this.activeJobs = activeJobs;
    }

    public int getClosedJobs() {
        return closedJobs;
    }

    public void setClosedJobs(int closedJobs) {
        this.closedJobs = closedJobs;
    }

    public int getTotalApplicants() {
        return totalApplicants;
    }

    public void setTotalApplicants(int totalApplicants) {
        this.totalApplicants = totalApplicants;
    }

    public int getAverageMatchScore() {
        return averageMatchScore;
    }

    public void setAverageMatchScore(int averageMatchScore) {
        this.averageMatchScore = averageMatchScore;
    }

    public int getTopMatchScore() {
        return topMatchScore;
    }

    public void setTopMatchScore(int topMatchScore) {
        this.topMatchScore = topMatchScore;
    }

    public int getPendingApplications() {
        return pendingApplications;
    }

    public void setPendingApplications(int pendingApplications) {
        this.pendingApplications = pendingApplications;
    }

    public int getShortlistedApplications() {
        return shortlistedApplications;
    }

    public void setShortlistedApplications(int shortlistedApplications) {
        this.shortlistedApplications = shortlistedApplications;
    }

    public int getInterviewScheduledApplications() {
        return interviewScheduledApplications;
    }

    public void setInterviewScheduledApplications(int interviewScheduledApplications) {
        this.interviewScheduledApplications = interviewScheduledApplications;
    }

    public int getRejectedApplications() {
        return rejectedApplications;
    }

    public void setRejectedApplications(int rejectedApplications) {
        this.rejectedApplications = rejectedApplications;
    }

    public double getShortlistRate() {
        return shortlistRate;
    }

    public void setShortlistRate(double shortlistRate) {
        this.shortlistRate = shortlistRate;
    }

    public double getInterviewRate() {
        return interviewRate;
    }

    public void setInterviewRate(double interviewRate) {
        this.interviewRate = interviewRate;
    }

    public double getRejectionRate() {
        return rejectionRate;
    }

    public void setRejectionRate(double rejectionRate) {
        this.rejectionRate = rejectionRate;
    }

    public TopCandidateDTO getTopCandidate() {
        return topCandidate;
    }

    public void setTopCandidate(TopCandidateDTO topCandidate) {
        this.topCandidate = topCandidate;
    }

    public List<AnalyticsSkillDTO> getTopSkills() {
        return topSkills;
    }

    public void setTopSkills(List<AnalyticsSkillDTO> topSkills) {
        this.topSkills = topSkills;
    }

    public List<RecentApplicationDTO> getRecentApplications() {
        return recentApplications;
    }

    public void setRecentApplications(List<RecentApplicationDTO> recentApplications) {
        this.recentApplications = recentApplications;
    }

    public static class TopCandidateDTO {
        private String candidateName;
        private int overallMatchScore;
        private String jobTitle;
        private String applicationStatus;

        public TopCandidateDTO() {}

        public TopCandidateDTO(String candidateName, int overallMatchScore, String jobTitle, String applicationStatus) {
            this.candidateName = candidateName;
            this.overallMatchScore = overallMatchScore;
            this.jobTitle = jobTitle;
            this.applicationStatus = applicationStatus;
        }

        public String getCandidateName() {
            return candidateName;
        }

        public void setCandidateName(String candidateName) {
            this.candidateName = candidateName;
        }

        public int getOverallMatchScore() {
            return overallMatchScore;
        }

        public void setOverallMatchScore(int overallMatchScore) {
            this.overallMatchScore = overallMatchScore;
        }

        public String getJobTitle() {
            return jobTitle;
        }

        public void setJobTitle(String jobTitle) {
            this.jobTitle = jobTitle;
        }

        public String getApplicationStatus() {
            return applicationStatus;
        }

        public void setApplicationStatus(String applicationStatus) {
            this.applicationStatus = applicationStatus;
        }
    }

    public static class AnalyticsSkillDTO {
        private String skill;
        private int count;

        public AnalyticsSkillDTO() {}

        public AnalyticsSkillDTO(String skill, int count) {
            this.skill = skill;
            this.count = count;
        }

        public String getSkill() {
            return skill;
        }

        public void setSkill(String skill) {
            this.skill = skill;
        }

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }
    }

    public static class RecentApplicationDTO {
        private Long applicationId;
        private String candidateName;
        private String jobTitle;
        private String status;
        private LocalDateTime appliedAt;
        private int matchScore;

        public RecentApplicationDTO() {}

        public RecentApplicationDTO(Long applicationId, String candidateName, String jobTitle, String status, LocalDateTime appliedAt, int matchScore) {
            this.applicationId = applicationId;
            this.candidateName = candidateName;
            this.jobTitle = jobTitle;
            this.status = status;
            this.appliedAt = appliedAt;
            this.matchScore = matchScore;
        }

        public Long getApplicationId() {
            return applicationId;
        }

        public void setApplicationId(Long applicationId) {
            this.applicationId = applicationId;
        }

        public String getCandidateName() {
            return candidateName;
        }

        public void setCandidateName(String candidateName) {
            this.candidateName = candidateName;
        }

        public String getJobTitle() {
            return jobTitle;
        }

        public void setJobTitle(String jobTitle) {
            this.jobTitle = jobTitle;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public LocalDateTime getAppliedAt() {
            return appliedAt;
        }

        public void setAppliedAt(LocalDateTime appliedAt) {
            this.appliedAt = appliedAt;
        }

        public int getMatchScore() {
            return matchScore;
        }

        public void setMatchScore(int matchScore) {
            this.matchScore = matchScore;
        }
    }
}
