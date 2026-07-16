package com.vishnu.ai_job_portal_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vishnu.ai_job_portal_backend.entity.SavedJob;
import com.vishnu.ai_job_portal_backend.repository.SavedJobRepository;

@RestController
@RequestMapping("/saved-jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class SavedJobController {

    private final SavedJobRepository savedJobRepository;

    public SavedJobController(SavedJobRepository savedJobRepository) {
        this.savedJobRepository = savedJobRepository;
    }

    @PostMapping
    public ResponseEntity<?> saveJob(@RequestBody SavedJob savedJob) {

        boolean exists = savedJobRepository.existsByEmailAndJob_Id(
                savedJob.getEmail(),
                savedJob.getJob().getId());

        if (exists) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Job already saved.");
        }

        return ResponseEntity.ok(savedJobRepository.save(savedJob));
    }

    @GetMapping("/{email}")
    public List<SavedJob> getSavedJobs(@PathVariable String email) {
        return savedJobRepository.findByEmail(email);
    }

    @DeleteMapping("/{id}")
    public void deleteSavedJob(@PathVariable Long id) {
        savedJobRepository.deleteById(id);
    }
}