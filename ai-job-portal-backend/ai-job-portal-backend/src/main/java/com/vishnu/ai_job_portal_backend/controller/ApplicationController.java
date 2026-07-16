package com.vishnu.ai_job_portal_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vishnu.ai_job_portal_backend.entity.Application;
import com.vishnu.ai_job_portal_backend.repository.ApplicationRepository;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;

    public ApplicationController(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    @PostMapping
    public ResponseEntity<?> applyJob(@RequestBody Application application) {

        boolean alreadyApplied =
                applicationRepository.existsByEmailAndJob_Id(
                        application.getEmail(),
                        application.getJob().getId());

        if (alreadyApplied) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("You have already applied for this job.");
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
}