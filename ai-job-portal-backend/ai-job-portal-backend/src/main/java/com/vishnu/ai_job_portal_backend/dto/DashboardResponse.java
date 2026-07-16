package com.vishnu.ai_job_portal_backend.dto;

public class DashboardResponse {

    private long totalJobs;
    private long appliedJobs;
    private long savedJobs;

    public DashboardResponse() {
    }

    public DashboardResponse(long totalJobs, long appliedJobs, long savedJobs) {
        this.totalJobs = totalJobs;
        this.appliedJobs = appliedJobs;
        this.savedJobs = savedJobs;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public long getAppliedJobs() {
        return appliedJobs;
    }

    public void setAppliedJobs(long appliedJobs) {
        this.appliedJobs = appliedJobs;
    }

    public long getSavedJobs() {
        return savedJobs;
    }

    public void setSavedJobs(long savedJobs) {
        this.savedJobs = savedJobs;
    }
}