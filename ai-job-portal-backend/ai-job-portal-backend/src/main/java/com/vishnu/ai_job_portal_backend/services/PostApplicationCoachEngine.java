package com.vishnu.ai_job_portal_backend.services;

import com.vishnu.ai_job_portal_backend.dto.*;
import com.vishnu.ai_job_portal_backend.entity.Application;
import com.vishnu.ai_job_portal_backend.entity.ApplicationStatus;
import com.vishnu.ai_job_portal_backend.entity.Job;
import com.vishnu.ai_job_portal_backend.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class PostApplicationCoachEngine {

    private final ApplicationRepository applicationRepository;
    private final DeterministicScoringEngine scoringEngine;
    private final ATSScoringEngine atsScoringEngine;
    private final CareerReadinessEngine readinessEngine;
    private final AIProvider aiProvider;

    public PostApplicationCoachEngine(ApplicationRepository applicationRepository,
                                       DeterministicScoringEngine scoringEngine,
                                       ATSScoringEngine atsScoringEngine,
                                       CareerReadinessEngine readinessEngine,
                                       AIProvider aiProvider) {
        this.applicationRepository = applicationRepository;
        this.scoringEngine = scoringEngine;
        this.atsScoringEngine = atsScoringEngine;
        this.readinessEngine = readinessEngine;
        this.aiProvider = aiProvider;
    }

    public PostApplicationCoachDTO generatePostApplicationCoaching(Long applicationId, UserProfileDTO candidate, String authEmail) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));

        // Ownership Security Verification
        boolean isOwner = (application.getCandidate() != null && authEmail.equalsIgnoreCase(application.getCandidate().getEmail()))
                || (application.getEmail() != null && authEmail.equalsIgnoreCase(application.getEmail()));

        if (!isOwner) {
            throw new SecurityException("Access denied: You do not own this application.");
        }

        Job job = application.getJob();
        PostApplicationCoachDTO dto = new PostApplicationCoachDTO();

        dto.setApplicationId(application.getId());
        dto.setJobId(job != null ? job.getId() : null);
        dto.setJobTitle(job != null && job.getTitle() != null ? job.getTitle() : "Applied Position");
        dto.setCompany(job != null && job.getCompany() != null ? job.getCompany() : "Hiring Company");

        ApplicationStatus status = application.getStatus() != null ? application.getStatus() : ApplicationStatus.APPLIED;
        dto.setStatus(status.name());

        // 1. Authoritative Match, ATS & Readiness Calculations
        JobMatchResultDTO matchResult = (job != null) ? scoringEngine.calculateMatch(candidate, job) : new JobMatchResultDTO();
        ATSResumeAnalysisDTO atsAnalysis = atsScoringEngine.calculateATSScore(candidate);
        CareerReadinessDTO readinessResult = readinessEngine.calculateReadiness(candidate);

        int matchScore = matchResult.getOverallMatchScore();
        int atsScore = atsAnalysis.getOverallScore();
        int careerReadiness = readinessResult.getOverallScore();

        dto.setMatchScore(matchScore);
        dto.setAtsScore(atsScore);

        // 2. Stage Readiness Score Calculation
        int stageReadiness = 50;
        switch (status) {
            case APPLIED:
                stageReadiness = (int) Math.round((matchScore * 0.50) + (atsScore * 0.30) + (careerReadiness * 0.20));
                dto.setRecommendedFollowUpDate("Follow up in 5–7 business days");
                break;
            case UNDER_REVIEW:
                stageReadiness = (int) Math.round((matchScore * 0.40) + (atsScore * 0.40) + (careerReadiness * 0.20));
                dto.setRecommendedFollowUpDate("Monitor portal & check email daily");
                break;
            case SHORTLISTED:
                stageReadiness = (int) Math.round((matchScore * 0.30) + (careerReadiness * 0.40) + 30);
                dto.setRecommendedFollowUpDate("Prepare immediately for screening call");
                break;
            case INTERVIEW_SCHEDULED:
                stageReadiness = (int) Math.round((careerReadiness * 0.60) + (matchScore * 0.40));
                dto.setRecommendedFollowUpDate("Final preparation before interview date");
                break;
            case REJECTED:
                stageReadiness = Math.max(20, matchScore);
                dto.setRecommendedFollowUpDate("Pivot skill learning roadmap now");
                break;
        }
        stageReadiness = Math.min(100, Math.max(0, stageReadiness));
        dto.setStageReadinessScore(stageReadiness);

        // 3. Technical & Behavioral Interview Focus Topics
        List<String> interviewTopics = new ArrayList<>();
        if (job != null && job.getSkills() != null && !job.getSkills().trim().isEmpty()) {
            String[] reqSkills = job.getSkills().split(",");
            for (String s : reqSkills) {
                interviewTopics.add("Core " + s.trim() + " Technical Deep Dive");
            }
        } else {
            interviewTopics.add("Core Technical Architecture & System Design");
            interviewTopics.add("Database Optimization & SQL Queries");
        }
        interviewTopics.add("STAR Behavioral Method: Complex Technical Challenges & Team Leadership");
        dto.setFocusInterviewTopics(interviewTopics);

        // 4. Stage Action Checklist
        List<String> checklist = new ArrayList<>();
        switch (status) {
            case APPLIED:
                checklist.add("Review target job requirements for " + dto.getJobTitle());
                checklist.add("Prepare 60-second professional elevator pitch");
                checklist.add("Ensure GitHub & LinkedIn portfolio links are live");
                checklist.add("Mark calendar for 5-day recruiter follow-up check");
                dto.setStageGuidance("Your application has been submitted successfully. Focus on strengthening your core project portfolio while waiting for recruiter review.");
                dto.setRecommendedNextAction("Prepare your project elevator pitch and monitor application status.");
                break;
            case UNDER_REVIEW:
                checklist.add("Review likely technical interview questions for " + dto.getJobTitle());
                checklist.add("Brush up on core framework fundamentals listed in job description");
                checklist.add("Prepare detailed STAR stories for recent project achievements");
                checklist.add("Check spam & email folders daily for interview invitations");
                dto.setStageGuidance("A recruiter is reviewing your application! Reinforce your core technical competencies and prepare for an initial screening call.");
                dto.setRecommendedNextAction("Review core technical topics for " + dto.getJobTitle() + " to prepare for screening.");
                break;
            case SHORTLISTED:
                checklist.add("Complete an AI Mock Interview simulation for " + dto.getJobTitle());
                checklist.add("Review technical focus topics (" + String.join(", ", interviewTopics.subList(0, Math.min(interviewTopics.size(), 2))) + ")");
                checklist.add("Research company background, product line, and recent news for " + dto.getCompany());
                checklist.add("Prepare 3 intelligent questions to ask the hiring manager");
                dto.setStageGuidance("Congratulations! You have been shortlisted for " + dto.getJobTitle() + " at " + dto.getCompany() + ". Start targeted interview practice immediately!");
                dto.setRecommendedNextAction("Start an AI Mock Interview practice session for this specific role now.");
                break;
            case INTERVIEW_SCHEDULED:
                checklist.add("Run full AI Mock Interview simulation for " + dto.getJobTitle());
                checklist.add("Rehearse STAR answers for technical challenges & system design");
                checklist.add("Review resume line-by-line for all listed skills & dates");
                checklist.add("Test video call equipment, background, and internet connection");
                dto.setStageGuidance("Your interview is scheduled! Focus on high-intensity mock interview practice and technical question rehearsal.");
                dto.setRecommendedNextAction("Complete a full AI Mock Interview session and review your technical topics.");
                break;
            case REJECTED:
                checklist.add("Analyze missing skill keywords (" + (matchResult.getMissingSkills() != null && !matchResult.getMissingSkills().isEmpty() ? String.join(", ", matchResult.getMissingSkills()) : "Advanced Frameworks") + ")");
                checklist.add("Update your Personal Career Action Plan with priority learning tasks");
                checklist.add("Build a hands-on project demonstrating missing skill competencies");
                checklist.add("Explore higher-match recommended positions on Career Compass");
                dto.setStageGuidance("Don't be discouraged — use this feedback to pivot your learning roadmap! Addressing key missing skills will boost your next application match.");
                dto.setRecommendedNextAction("Update your Career Action Plan to focus on missing skills for your next application.");
                break;
        }
        dto.setStageActionChecklist(checklist);

        // 5. Skill Pivot Recommendations (For Rejected or Weak Applications)
        List<String> pivotRecs = new ArrayList<>();
        if (matchResult.getMissingSkills() != null && !matchResult.getMissingSkills().isEmpty()) {
            for (String gap : matchResult.getMissingSkills()) {
                pivotRecs.add("Master " + gap + " through hands-on portfolio implementation.");
            }
        } else {
            pivotRecs.add("Expand full-stack deployment and cloud architecture experience.");
        }
        dto.setSkillPivotRecommendations(pivotRecs);

        // 6. Qualitative AI Enrichment (With Fallback)
        String aiCoaching = aiProvider.generatePostApplicationCoaching(candidate, job, application, dto);
        if (aiCoaching != null && !aiCoaching.trim().isEmpty()) {
            dto.setStageGuidance(aiCoaching.trim());
        }

        return dto;
    }
}
