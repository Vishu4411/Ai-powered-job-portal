package com.vishnu.ai_job_portal_backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vishnu.ai_job_portal_backend.entity.Application;
import com.vishnu.ai_job_portal_backend.entity.ApplicationStatus;
import com.vishnu.ai_job_portal_backend.entity.User;
import com.vishnu.ai_job_portal_backend.repository.ApplicationRepository;
import com.vishnu.ai_job_portal_backend.repository.UserRepository;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public ApplicationController(ApplicationRepository applicationRepository,
                                 UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> applyJob(@RequestBody Application application,
                                      Authentication authentication) {

        String email = (authentication != null && authentication.getName() != null)
                ? authentication.getName()
                : application.getEmail();

        boolean alreadyApplied =
                applicationRepository.existsByEmailAndJob_Id(
                        email,
                        application.getJob().getId());

        if (alreadyApplied) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("You have already applied for this job.");
        }

        application.setEmail(email);

        Optional<User> candidateOpt = userRepository.findByEmail(email);
        if (candidateOpt.isPresent()) {
            User candidate = candidateOpt.get();
            application.setCandidate(candidate);
            if (application.getApplicantName() == null || application.getApplicantName().trim().isEmpty()) {
                application.setApplicantName(candidate.getFullName());
            }
        }

        if (application.getStatus() == null) {
            application.setStatus(ApplicationStatus.APPLIED);
        }

        Application saved = applicationRepository.save(application);

        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    @GetMapping("/{email}")
    public List<Application> getApplications(@PathVariable String email) {
        return applicationRepository.findByEmail(email);
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
}
