package com.vishnu.ai_job_portal_backend.controller;

import com.vishnu.ai_job_portal_backend.dto.JobMatchResultDTO;
import com.vishnu.ai_job_portal_backend.dto.UserProfileDTO;
import com.vishnu.ai_job_portal_backend.entity.Job;
import com.vishnu.ai_job_portal_backend.repository.JobRepository;
import com.vishnu.ai_job_portal_backend.services.AIProvider;
import com.vishnu.ai_job_portal_backend.services.DeterministicScoringEngine;
import com.vishnu.ai_job_portal_backend.services.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AIController {

    private final ProfileService profileService;
    private final JobRepository jobRepository;
    private final DeterministicScoringEngine scoringEngine;
    private final AIProvider aiProvider;

    public AIController(ProfileService profileService,
                        JobRepository jobRepository,
                        DeterministicScoringEngine scoringEngine,
                        AIProvider aiProvider) {
        this.profileService = profileService;
        this.jobRepository = jobRepository;
        this.scoringEngine = scoringEngine;
        this.aiProvider = aiProvider;
    }

    @GetMapping("/jobs/{jobId}/match")
    public ResponseEntity<JobMatchResultDTO> getJobMatch(@PathVariable Long jobId,
                                                         Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO candidate = profileService.getProfileByUserEmail(email);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        JobMatchResultDTO matchResult = scoringEngine.calculateMatch(candidate, job);
        return ResponseEntity.ok(matchResult);
    }

    @PostMapping("/jobs/{jobId}/explanation")
    public ResponseEntity<Map<String, Object>> getJobMatchExplanation(@PathVariable Long jobId,
                                                                       Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO candidate = profileService.getProfileByUserEmail(email);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        JobMatchResultDTO matchResult = scoringEngine.calculateMatch(candidate, job);
        String explanation = aiProvider.generateMatchExplanation(candidate, job, matchResult);
        matchResult.setAiExplanation(explanation);

        return ResponseEntity.ok(Map.of(
                "jobId", jobId,
                "overallMatchScore", matchResult.getOverallMatchScore(),
                "aiExplanation", explanation,
                "matchingSkills", matchResult.getMatchingSkills(),
                "missingSkills", matchResult.getMissingSkills()
        ));
    }

    @PostMapping("/skill-gap")
    public ResponseEntity<Map<String, Object>> getSkillGapAnalysis(@RequestBody Map<String, Long> body,
                                                                   Authentication authentication) {
        Long jobId = body.get("jobId");
        if (jobId == null) {
            throw new RuntimeException("jobId is required");
        }

        String email = authentication.getName();
        UserProfileDTO candidate = profileService.getProfileByUserEmail(email);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        JobMatchResultDTO matchResult = scoringEngine.calculateMatch(candidate, job);
        String analysis = aiProvider.generateSkillGapAnalysis(candidate, job, matchResult);

        return ResponseEntity.ok(Map.of(
                "jobId", jobId,
                "jobTitle", job.getTitle(),
                "matchingSkills", matchResult.getMatchingSkills(),
                "missingSkills", matchResult.getMissingSkills(),
                "analysis", analysis
        ));
    }

    @PostMapping("/career-advice")
    public ResponseEntity<Map<String, String>> getCareerAdvice(Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO candidate = profileService.getProfileByUserEmail(email);

        String advice = aiProvider.generateCareerAdvice(candidate);
        return ResponseEntity.ok(Map.of("advice", advice));
    }

    @PostMapping("/cover-letter/generate")
    public ResponseEntity<Map<String, String>> generateCoverLetter(@RequestBody Map<String, Long> body,
                                                                   Authentication authentication) {
        Long jobId = body.get("jobId");
        if (jobId == null) {
            throw new RuntimeException("jobId is required");
        }

        String email = authentication.getName();
        UserProfileDTO candidate = profileService.getProfileByUserEmail(email);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        String coverLetter = aiProvider.generateCoverLetter(candidate, job);
        return ResponseEntity.ok(Map.of("coverLetter", coverLetter));
    }

    @PostMapping("/interview-prep/generate")
    public ResponseEntity<Map<String, Object>> generateInterviewPrep(@RequestBody Map<String, Long> body,
                                                                     Authentication authentication) {
        Long jobId = body.get("jobId");
        if (jobId == null) {
            throw new RuntimeException("jobId is required");
        }

        String email = authentication.getName();
        UserProfileDTO candidate = profileService.getProfileByUserEmail(email);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        List<String> questions = aiProvider.generateInterviewQuestions(candidate, job);
        return ResponseEntity.ok(Map.of("jobId", jobId, "questions", questions));
    }
}
