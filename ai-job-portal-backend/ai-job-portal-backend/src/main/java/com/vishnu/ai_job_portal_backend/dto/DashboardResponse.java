package com.vishnu.ai_job_portal_backend.dto;

import java.util.ArrayList;
import java.util.List;

public class DashboardResponse {

    private long totalJobs;
    private long appliedJobs;
    private long savedJobs;

    private List<ChartDataPoint> monthlyApplicationChart = new ArrayList<>();
    private List<ActivityItem> recentActivities = new ArrayList<>();

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

    public List<ChartDataPoint> getMonthlyApplicationChart() {
        return monthlyApplicationChart;
    }

    public void setMonthlyApplicationChart(List<ChartDataPoint> monthlyApplicationChart) {
        this.monthlyApplicationChart = monthlyApplicationChart;
    }

    public List<ActivityItem> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(List<ActivityItem> recentActivities) {
        this.recentActivities = recentActivities;
    }

    public static class ChartDataPoint {
        private String month;
        private long applications;

        public ChartDataPoint() {}

        public ChartDataPoint(String month, long applications) {
            this.month = month;
            this.applications = applications;
        }

        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }

        public long getApplications() { return applications; }
        public void setApplications(long applications) { this.applications = applications; }
    }

    public static class ActivityItem {
        private String title;
        private String time;

        public ActivityItem() {}

        public ActivityItem(String title, String time) {
            this.title = title;
            this.time = time;
        }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getTime() { return time; }
        public void setTime(String time) { this.time = time; }
    }
}