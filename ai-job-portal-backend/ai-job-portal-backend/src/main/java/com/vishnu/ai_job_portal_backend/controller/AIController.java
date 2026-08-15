package com.vishnu.ai_job_portal_backend.controller;

import com.vishnu.ai_job_portal_backend.dto.ATSResumeAnalysisDTO;
import com.vishnu.ai_job_portal_backend.dto.CandidateInsightsDTO;
import com.vishnu.ai_job_portal_backend.dto.CareerActionPlanDTO;
import com.vishnu.ai_job_portal_backend.dto.CareerReadinessDTO;
import com.vishnu.ai_job_portal_backend.dto.JobApplicationCopilotDTO;
import com.vishnu.ai_job_portal_backend.dto.JobMatchResultDTO;
import com.vishnu.ai_job_portal_backend.dto.JobRecommendationDTO;
import com.vishnu.ai_job_portal_backend.dto.MockInterviewFeedbackDTO;
import com.vishnu.ai_job_portal_backend.dto.MockInterviewSessionDTO;
import com.vishnu.ai_job_portal_backend.dto.MockInterviewSubmissionDTO;
import com.vishnu.ai_job_portal_backend.dto.PostApplicationCoachDTO;
import com.vishnu.ai_job_portal_backend.dto.SkillGapRoadmapDTO;
import com.vishnu.ai_job_portal_backend.dto.UserProfileDTO;
import com.vishnu.ai_job_portal_backend.entity.Job;
import com.vishnu.ai_job_portal_backend.entity.JobStatus;
import com.vishnu.ai_job_portal_backend.repository.JobRepository;
import com.vishnu.ai_job_portal_backend.services.AIProvider;
import com.vishnu.ai_job_portal_backend.services.ATSScoringEngine;
import com.vishnu.ai_job_portal_backend.services.CareerActionPlanEngine;
import com.vishnu.ai_job_portal_backend.services.CareerReadinessEngine;
import com.vishnu.ai_job_portal_backend.services.DeterministicScoringEngine;
import com.vishnu.ai_job_portal_backend.services.JobApplicationCopilotEngine;
import com.vishnu.ai_job_portal_backend.services.MockInterviewEngine;
import com.vishnu.ai_job_portal_backend.services.PostApplicationCoachEngine;
import com.vishnu.ai_job_portal_backend.services.ProfileService;
import com.vishnu.ai_job_portal_backend.services.RecruiterApplicationService;
import com.vishnu.ai_job_portal_backend.services.SkillRoadmapEngine;
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
    private final ATSScoringEngine atsScoringEngine;
    private final SkillRoadmapEngine roadmapEngine;
    private final RecruiterApplicationService recruiterApplicationService;
    private final CareerReadinessEngine careerReadinessEngine;
    private final MockInterviewEngine mockInterviewEngine;
    private final CareerActionPlanEngine careerActionPlanEngine;
    private final JobApplicationCopilotEngine copilotEngine;
    private final PostApplicationCoachEngine postApplicationCoachEngine;

    public AIController(ProfileService profileService,
                        JobRepository jobRepository,
                        DeterministicScoringEngine scoringEngine,
                        AIProvider aiProvider,
                        ATSScoringEngine atsScoringEngine,
                        SkillRoadmapEngine roadmapEngine,
                        RecruiterApplicationService recruiterApplicationService,
                        CareerReadinessEngine careerReadinessEngine,
                        MockInterviewEngine mockInterviewEngine,
                        CareerActionPlanEngine careerActionPlanEngine,
                        JobApplicationCopilotEngine copilotEngine,
                        PostApplicationCoachEngine postApplicationCoachEngine) {
        this.profileService = profileService;
        this.jobRepository = jobRepository;
        this.scoringEngine = scoringEngine;
        this.aiProvider = aiProvider;
        this.atsScoringEngine = atsScoringEngine;
        this.roadmapEngine = roadmapEngine;
        this.recruiterApplicationService = recruiterApplicationService;
        this.careerReadinessEngine = careerReadinessEngine;
        this.mockInterviewEngine = mockInterviewEngine;
        this.careerActionPlanEngine = careerActionPlanEngine;
        this.copilotEngine = copilotEngine;
        this.postApplicationCoachEngine = postApplicationCoachEngine;
    }



    @GetMapping("/career/action-plan")
    public ResponseEntity<CareerActionPlanDTO> getCareerActionPlan(Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO candidate = profileService.getProfileByUserEmail(email);

        CareerActionPlanDTO basePlan = careerActionPlanEngine.generateActionPlan(candidate);
        CareerActionPlanDTO fullPlan = aiProvider.generateCareerActionPlanCoaching(candidate, basePlan);

        return ResponseEntity.ok(fullPlan);
    }


    @PostMapping("/interview-simulator/start")
    public ResponseEntity<MockInterviewSessionDTO> startMockInterview(@RequestBody(required = false) Map<String, Long> body,
                                                                      Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO candidate = profileService.getProfileByUserEmail(email);

        Long jobId = (body != null) ? body.get("jobId") : null;
        Job job = null;
        if (jobId != null) {
            job = jobRepository.findById(jobId).orElse(null);
        }

        MockInterviewSessionDTO session = mockInterviewEngine.generateSession(candidate, job);
        return ResponseEntity.ok(session);
    }

    @PostMapping("/interview-simulator/evaluate")
    public ResponseEntity<MockInterviewFeedbackDTO> evaluateMockInterview(@RequestBody MockInterviewSubmissionDTO submission,
                                                                           Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO candidate = profileService.getProfileByUserEmail(email);

        Job job = null;
        if (submission != null && submission.getJobId() != null) {
            job = jobRepository.findById(submission.getJobId()).orElse(null);
        }

        MockInterviewFeedbackDTO baseFeedback = mockInterviewEngine.evaluateSubmission(candidate, job, submission);
        MockInterviewFeedbackDTO fullFeedback = aiProvider.evaluateMockInterviewAnswers(candidate, job, submission, baseFeedback);

        return ResponseEntity.ok(fullFeedback);
    }

    @GetMapping("/career/readiness")
    public ResponseEntity<CareerReadinessDTO> getCareerReadiness(Authentication authentication) {

        String email = authentication.getName();
        UserProfileDTO candidate = profileService.getProfileByUserEmail(email);
        CareerReadinessDTO readiness = careerReadinessEngine.calculateReadiness(candidate);
        return ResponseEntity.ok(readiness);
    }


    @GetMapping("/recruiter/applications/{applicationId}/insights")
    public ResponseEntity<CandidateInsightsDTO> getCandidateInsights(@PathVariable Long applicationId,
                                                                      Authentication authentication) {
        String email = authentication.getName();
        CandidateInsightsDTO insights = recruiterApplicationService.getCandidateInsights(email, applicationId);
        return ResponseEntity.ok(insights);
    }


    @PostMapping("/jobs/{jobId}/skill-roadmap")
    public ResponseEntity<SkillGapRoadmapDTO> getJobSkillRoadmap(@PathVariable Long jobId,
                                                                 Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO candidate = profileService.getProfileByUserEmail(email);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        JobMatchResultDTO matchResult = scoringEngine.calculateMatch(candidate, job);
        SkillGapRoadmapDTO baseRoadmap = roadmapEngine.generateBaseRoadmap(candidate, job, matchResult);
        SkillGapRoadmapDTO fullRoadmap = aiProvider.generateSkillRoadmap(candidate, job, matchResult, baseRoadmap);

        return ResponseEntity.ok(fullRoadmap);
    }


    @PostMapping("/resume/ats-analyze")
    public ResponseEntity<ATSResumeAnalysisDTO> analyzeResumeATS(Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO candidate = profileService.getProfileByUserEmail(email);

        ATSResumeAnalysisDTO baseAnalysis = atsScoringEngine.calculateATSScore(candidate);
        ATSResumeAnalysisDTO fullAnalysis = aiProvider.analyzeResumeATS(candidate, baseAnalysis);

        return ResponseEntity.ok(fullAnalysis);
    }


    @GetMapping("/jobs/recommended")
    public ResponseEntity<List<JobRecommendationDTO>> getRecommendedJobs(Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO candidate = profileService.getProfileByUserEmail(email);

        List<Job> allJobs = jobRepository.findAll();
        List<Job> openJobs = allJobs.stream()
                .filter(j -> j.getStatus() == null || j.getStatus() == JobStatus.OPEN)
                .toList();

        List<JobRecommendationDTO> recommendations = openJobs.stream()
                .map(job -> {
                    JobMatchResultDTO match = scoringEngine.calculateMatch(candidate, job);
                    JobRecommendationDTO dto = new JobRecommendationDTO();
                    dto.setJobId(job.getId());
                    dto.setTitle(job.getTitle());
                    dto.setCompany(job.getCompanyEntity() != null ? job.getCompanyEntity().getCompanyName() : job.getCompany());
                    dto.setLocation(job.getLocation());
                    dto.setSalary(job.getSalary());
                    dto.setExperience(job.getExperience());
                    dto.setJobType(job.getJobType());
                    dto.setSkills(job.getSkills());

                    dto.setOverallMatchScore(match.getOverallMatchScore());
                    dto.setSkillMatchScore(match.getSkillMatchScore());
                    dto.setExperienceMatchScore(match.getExperienceMatchScore());
                    dto.setEducationMatchScore(match.getEducationMatchScore());
                    dto.setLocationMatchScore(match.getLocationMatchScore());
                    dto.setJobTypeMatchScore(match.getJobTypeMatchScore());
                    dto.setMatchingSkills(match.getMatchingSkills());
                    dto.setMissingSkills(match.getMissingSkills());
                    return dto;
                })
                .sorted((a, b) -> Integer.compare(b.getOverallMatchScore(), a.getOverallMatchScore()))
                .limit(20)
                .toList();

        return ResponseEntity.ok(recommendations);
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

    @PostMapping("/jobs/{jobId}/application-copilot")
    public ResponseEntity<JobApplicationCopilotDTO> getApplicationCopilot(@PathVariable Long jobId,
                                                                           Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO candidate = profileService.getProfileByUserEmail(email);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        JobApplicationCopilotDTO copilot = copilotEngine.generateCopilotStrategy(candidate, job);
        return ResponseEntity.ok(copilot);
    }

    @GetMapping("/applications/{applicationId}/post-application-coach")
    public ResponseEntity<PostApplicationCoachDTO> getPostApplicationCoach(@PathVariable Long applicationId,
                                                                          Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO candidate = profileService.getProfileByUserEmail(email);

        PostApplicationCoachDTO dto = postApplicationCoachEngine.generatePostApplicationCoaching(applicationId, candidate, email);
        return ResponseEntity.ok(dto);
    }
}


