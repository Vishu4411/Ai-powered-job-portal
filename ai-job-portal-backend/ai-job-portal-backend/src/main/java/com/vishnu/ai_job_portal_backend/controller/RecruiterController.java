package com.vishnu.ai_job_portal_backend.controller;

import com.vishnu.ai_job_portal_backend.dto.*;
import com.vishnu.ai_job_portal_backend.services.RecruiterApplicationService;
import com.vishnu.ai_job_portal_backend.services.RecruiterJobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/recruiter")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class RecruiterController {

    private final RecruiterJobService recruiterJobService;
    private final RecruiterApplicationService recruiterApplicationService;

    public RecruiterController(RecruiterJobService recruiterJobService,
                               RecruiterApplicationService recruiterApplicationService) {
        this.recruiterJobService = recruiterJobService;
        this.recruiterApplicationService = recruiterApplicationService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<RecruiterDashboardDTO> getDashboard(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(recruiterJobService.getRecruiterDashboardStats(email));
    }

    @GetMapping("/analytics")
    public ResponseEntity<RecruiterAnalyticsDTO> getAnalytics(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(recruiterApplicationService.getRecruiterAnalytics(email));
    }


    @GetMapping("/jobs")
    public ResponseEntity<List<RecruiterJobDTO>> getMyJobs(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(recruiterJobService.getRecruiterJobs(email));
    }

    @PostMapping("/jobs")
    public ResponseEntity<RecruiterJobDTO> createJob(@RequestBody RecruiterJobDTO dto,
                                                     Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(recruiterJobService.createJob(email, dto));
    }

    @PutMapping("/jobs/{id}")
    public ResponseEntity<RecruiterJobDTO> updateJob(@PathVariable Long id,
                                                     @RequestBody RecruiterJobDTO dto,
                                                     Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(recruiterJobService.updateJob(email, id, dto));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id,
                                       Authentication authentication) {
        String email = authentication.getName();
        recruiterJobService.deleteJob(email, id);
        return ResponseEntity.ok("Job deleted successfully");
    }

    @GetMapping("/jobs/{jobId}/applications")
    public ResponseEntity<List<RecruiterApplicantDTO>> getJobApplications(@PathVariable Long jobId,
                                                                           Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(recruiterApplicationService.getJobApplications(email, jobId));
    }

    @GetMapping("/jobs/{jobId}/ranked-applicants")
    public ResponseEntity<List<RankedApplicantDTO>> getRankedApplicants(@PathVariable Long jobId,
                                                                         Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(recruiterApplicationService.getRankedApplicants(email, jobId));
    }


    @GetMapping("/applications/{applicationId}/candidate-profile")
    public ResponseEntity<UserProfileDTO> getCandidateProfile(@PathVariable Long applicationId,
                                                              Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(recruiterApplicationService.getCandidateProfileForApplication(email, applicationId));
    }

    @PutMapping("/applications/{applicationId}/status")
    public ResponseEntity<RecruiterApplicantDTO> updateApplicationStatus(@PathVariable Long applicationId,
                                                                          @RequestBody Map<String, String> body,
                                                                          Authentication authentication) {
        String email = authentication.getName();
        String status = body.get("status");
        return ResponseEntity.ok(recruiterApplicationService.updateApplicationStatus(email, applicationId, status));
    }
}
