package com.vishnu.ai_job_portal_backend.controller;

import com.vishnu.ai_job_portal_backend.entity.Application;
import com.vishnu.ai_job_portal_backend.entity.ApplicationStatus;
import com.vishnu.ai_job_portal_backend.repository.ApplicationRepository;
import com.vishnu.ai_job_portal_backend.services.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private NotificationService notificationService;

    @PostMapping
    public ResponseEntity<?> applyJob(@RequestBody Application application, Authentication authentication) {

        String candidateEmail = null;
        if (authentication != null && authentication.getName() != null) {
            candidateEmail = authentication.getName();
        } else if (application.getEmail() != null) {
            candidateEmail = application.getEmail().trim().toLowerCase();
        }

        if (candidateEmail == null || candidateEmail.isEmpty()) {
            return ResponseEntity.badRequest().body("Candidate email is required");
        }

        if (application.getJob() == null || application.getJob().getId() == null) {
            return ResponseEntity.badRequest().body("Job ID is required");
        }

        Long jobId = application.getJob().getId();

        boolean alreadyApplied = applicationRepository.existsByEmailAndJob_Id(candidateEmail, jobId);

        if (alreadyApplied) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("You have already applied for this job.");
        }

        application.setEmail(candidateEmail);

        if (application.getApplicantName() == null || application.getApplicantName().trim().isEmpty()) {
            application.setApplicantName(candidateEmail);
        }

        if (application.getStatus() == null) {
            application.setStatus(ApplicationStatus.APPLIED);
        }

        Application saved = applicationRepository.save(application);
        notificationService.notifyApplicationSubmitted(saved);

        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications(Authentication authentication) {
        if (authentication != null && authentication.getName() != null && !authentication.getName().equals("anonymousUser")) {
            return ResponseEntity.ok(applicationRepository.findByEmail(authentication.getName()));
        }
        return ResponseEntity.ok(applicationRepository.findAll());
    }

    @GetMapping("/interviews")
    public ResponseEntity<List<Application>> getCandidateInterviews(Authentication authentication) {
        String email = authentication.getName();
        List<Application> interviews = applicationRepository.findByEmailAndStatus(
                email,
                ApplicationStatus.INTERVIEW_SCHEDULED
        );
        return ResponseEntity.ok(interviews);
    }

    @GetMapping("/{email}")
    public List<Application> getApplications(@PathVariable String email) {
        return applicationRepository.findByEmail(email);
    }
}