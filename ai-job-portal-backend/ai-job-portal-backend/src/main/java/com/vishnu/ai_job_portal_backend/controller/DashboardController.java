package com.vishnu.ai_job_portal_backend.controller;

import com.vishnu.ai_job_portal_backend.dto.DashboardResponse;
import com.vishnu.ai_job_portal_backend.entity.Application;
import com.vishnu.ai_job_portal_backend.entity.SavedJob;
import com.vishnu.ai_job_portal_backend.repository.ApplicationRepository;
import com.vishnu.ai_job_portal_backend.repository.JobRepository;
import com.vishnu.ai_job_portal_backend.repository.SavedJobRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class DashboardController {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;

    public DashboardController(
            JobRepository jobRepository,
            ApplicationRepository applicationRepository,
            SavedJobRepository savedJobRepository) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.savedJobRepository = savedJobRepository;
    }

    @GetMapping("/me")
    public DashboardResponse getCandidateDashboard(Authentication authentication) {
        String email = authentication.getName();
        return computeDashboardForEmail(email);
    }

    @GetMapping("/{email}")
    public DashboardResponse getDashboardLegacy(@PathVariable String email, Authentication authentication) {
        // Prefer authenticated email over path variable for security
        String userEmail = (authentication != null && authentication.getName() != null)
                ? authentication.getName()
                : email;
        return computeDashboardForEmail(userEmail);
    }

    private DashboardResponse computeDashboardForEmail(String email) {
        long totalJobs = jobRepository.count();

        List<Application> applications = applicationRepository.findByEmail(email);
        List<SavedJob> savedJobsList = savedJobRepository.findByEmail(email);

        long appliedCount = applications.size();
        long savedCount = savedJobsList.size();

        DashboardResponse response = new DashboardResponse(totalJobs, appliedCount, savedCount);

        // 1. Calculate Real Monthly Application Distribution (Last 6 Months)
        List<DashboardResponse.ChartDataPoint> chartPoints = calculateMonthlyApplications(applications);
        response.setMonthlyApplicationChart(chartPoints);

        // 2. Calculate Real Recent Activities
        List<DashboardResponse.ActivityItem> activities = calculateRecentActivities(applications, savedJobsList);
        response.setRecentActivities(activities);

        return response;
    }

    private List<DashboardResponse.ChartDataPoint> calculateMonthlyApplications(List<Application> applications) {
        List<DashboardResponse.ChartDataPoint> points = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM");

        // Generate last 6 months in chronological order
        for (int i = 5; i >= 0; i--) {
            LocalDateTime monthDate = now.minusMonths(i);
            String monthName = monthDate.format(monthFormatter);
            int targetYear = monthDate.getYear();
            int targetMonth = monthDate.getMonthValue();

            long count = applications.stream()
                    .filter(a -> a.getAppliedAt() != null)
                    .filter(a -> a.getAppliedAt().getYear() == targetYear && a.getAppliedAt().getMonthValue() == targetMonth)
                    .count();

            points.add(new DashboardResponse.ChartDataPoint(monthName, count));
        }

        return points;
    }

    private List<DashboardResponse.ActivityItem> calculateRecentActivities(List<Application> applications, List<SavedJob> savedJobs) {
        List<DashboardResponse.ActivityItem> list = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        // 1. Add Job Applications
        for (Application app : applications) {
            String jobTitle = (app.getJob() != null && app.getJob().getTitle() != null)
                    ? app.getJob().getTitle()
                    : "Job Position";
            String company = (app.getJob() != null && app.getJob().getCompany() != null)
                    ? app.getJob().getCompany()
                    : "Company";

            String timeStr = formatRelativeTime(app.getAppliedAt(), now);

            list.add(new DashboardResponse.ActivityItem("Applied to " + jobTitle + " at " + company, timeStr));

            if (app.getStatus() != null && app.getStatus() != com.vishnu.ai_job_portal_backend.entity.ApplicationStatus.APPLIED) {
                list.add(new DashboardResponse.ActivityItem("Application status update: " + app.getStatus() + " for " + jobTitle, timeStr));
            }
        }

        // 2. Add Saved Jobs
        for (SavedJob saved : savedJobs) {
            String jobTitle = (saved.getJob() != null && saved.getJob().getTitle() != null)
                    ? saved.getJob().getTitle()
                    : "Job Position";
            list.add(new DashboardResponse.ActivityItem("Saved job: " + jobTitle, "Recently saved"));
        }

        // Sort or limit to top 5 recent activities
        if (list.size() > 5) {
            return list.subList(0, 5);
        }

        return list;
    }

    private String formatRelativeTime(LocalDateTime past, LocalDateTime now) {
        if (past == null) return "Recently";
        Duration duration = Duration.between(past, now);

        long seconds = duration.getSeconds();
        if (seconds < 60) return "Just now";
        long minutes = duration.toMinutes();
        if (minutes < 60) return minutes + " min ago";
        long hours = duration.toHours();
        if (hours < 24) return hours + " hours ago";
        long days = duration.toDays();
        if (days == 1) return "Yesterday";
        if (days < 30) return days + " days ago";
        return past.format(DateTimeFormatter.ofPattern("MMM d"));
    }
}