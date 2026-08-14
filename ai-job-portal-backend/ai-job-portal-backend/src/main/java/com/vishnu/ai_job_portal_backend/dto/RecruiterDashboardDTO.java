package com.vishnu.ai_job_portal_backend.dto;

public class RecruiterDashboardDTO {
    private long activeJobs;
    private long totalJobs;
    private long applicationsReceived;
    private long shortlisted;
    private long pendingReview;

    public RecruiterDashboardDTO() {}

    public RecruiterDashboardDTO(long activeJobs, long totalJobs, long applicationsReceived, long shortlisted, long pendingReview) {
        this.activeJobs = activeJobs;
        this.totalJobs = totalJobs;
        this.applicationsReceived = applicationsReceived;
        this.shortlisted = shortlisted;
        this.pendingReview = pendingReview;
    }

    public long getActiveJobs() {
        return activeJobs;
    }

    public void setActiveJobs(long activeJobs) {
        this.activeJobs = activeJobs;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public long getApplicationsReceived() {
        return applicationsReceived;
    }

    public void setApplicationsReceived(long applicationsReceived) {
        this.applicationsReceived = applicationsReceived;
    }

    public long getShortlisted() {
        return shortlisted;
    }

    public void setShortlisted(long shortlisted) {
        this.shortlisted = shortlisted;
    }

    public long getPendingReview() {
        return pendingReview;
    }

    public void setPendingReview(long pendingReview) {
        this.pendingReview = pendingReview;
    }
}
