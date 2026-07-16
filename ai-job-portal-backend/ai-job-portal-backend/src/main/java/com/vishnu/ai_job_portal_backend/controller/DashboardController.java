package com.vishnu.ai_job_portal_backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vishnu.ai_job_portal_backend.dto.DashboardResponse;
import com.vishnu.ai_job_portal_backend.repository.ApplicationRepository;
import com.vishnu.ai_job_portal_backend.repository.JobRepository;
import com.vishnu.ai_job_portal_backend.repository.SavedJobRepository;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
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

    @GetMapping("/{email}")
    public DashboardResponse getDashboard(@PathVariable String email) {

        long totalJobs = jobRepository.count();

        long appliedJobs = applicationRepository.findByEmail(email).size();

        long savedJobs = savedJobRepository.findByEmail(email).size();

        return new DashboardResponse(
                totalJobs,
                appliedJobs,
                savedJobs
        );
    }
}