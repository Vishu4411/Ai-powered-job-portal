package com.vishnu.ai_job_portal_backend.services;

import com.vishnu.ai_job_portal_backend.dto.*;
import com.vishnu.ai_job_portal_backend.entity.Job;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class JobApplicationCopilotEngine {

    private final DeterministicScoringEngine scoringEngine;
    private final ATSScoringEngine atsScoringEngine;
    private final CareerReadinessEngine readinessEngine;
    private final AIProvider aiProvider;

    public JobApplicationCopilotEngine(DeterministicScoringEngine scoringEngine,
                                        ATSScoringEngine atsScoringEngine,
                                        CareerReadinessEngine readinessEngine,
                                        AIProvider aiProvider) {
        this.scoringEngine = scoringEngine;
        this.atsScoringEngine = atsScoringEngine;
        this.readinessEngine = readinessEngine;
        this.aiProvider = aiProvider;
    }

    public JobApplicationCopilotDTO generateCopilotStrategy(UserProfileDTO candidate, Job job) {
        JobApplicationCopilotDTO dto = new JobApplicationCopilotDTO();

        if (job == null) {
            dto.setJobTitle("Unknown Job");
            dto.setCompany("Unknown Company");
            dto.setApplicationReadinessScore(0);
            dto.setRecommendation("LOW_MATCH_CONSIDER_OTHER_ROLES");
            dto.setRecommendedNextAction("Select a valid job posting to analyze application copilot strategy.");
            dto.setApplicationStrategy("Job details unavailable.");
            return dto;
        }

        dto.setJobId(job.getId());
        dto.setJobTitle(job.getTitle() != null ? job.getTitle() : "Position");
        dto.setCompany(job.getCompany() != null ? job.getCompany() : "Hiring Company");

        // 1. Authoritative Match, ATS & Career Readiness Calculations
        JobMatchResultDTO matchResult = scoringEngine.calculateMatch(candidate, job);
        ATSResumeAnalysisDTO atsAnalysis = atsScoringEngine.calculateATSScore(candidate);
        CareerReadinessDTO readinessResult = readinessEngine.calculateReadiness(candidate);

        int matchScore = matchResult != null ? matchResult.getOverallMatchScore() : 0;
        int atsScore = atsAnalysis != null ? atsAnalysis.getOverallScore() : 0;
        int readinessScore = readinessResult != null ? readinessResult.getOverallScore() : 0;

        dto.setOverallMatchScore(matchScore);
        dto.setAtsScore(atsScore);
        dto.setCareerReadinessScore(readinessScore);

        // 2. Weighted Application Readiness Score Calculation
        int appReadiness = (int) Math.round((matchScore * 0.40) + (atsScore * 0.30) + (readinessScore * 0.30));
        appReadiness = Math.min(100, Math.max(0, appReadiness));
        dto.setApplicationReadinessScore(appReadiness);

        // 3. Deterministic Recommendation Logic
        if (appReadiness >= 80) {
            dto.setRecommendation("READY_TO_APPLY");
        } else if (appReadiness >= 55) {
            dto.setRecommendation("APPLY_AFTER_IMPROVEMENT");
        } else {
            dto.setRecommendation("LOW_MATCH_CONSIDER_OTHER_ROLES");
        }

        // 4. Strengths & Skill Gaps
        List<String> strengths = new ArrayList<>();
        if (matchResult != null && matchResult.getMatchingSkills() != null) {
            strengths.addAll(matchResult.getMatchingSkills());
        }
        if (candidate != null && candidate.getHeadline() != null && !candidate.getHeadline().isEmpty()) {
            strengths.add("Professional headline aligned (" + candidate.getHeadline() + ")");
        }

        List<String> skillGaps = new ArrayList<>();
        if (matchResult != null && matchResult.getMissingSkills() != null) {
            skillGaps.addAll(matchResult.getMissingSkills());
        }

        dto.setStrengths(strengths);
        dto.setSkillGaps(skillGaps);

        // 5. Resume Improvements
        List<String> resumeImprovements = new ArrayList<>();
        if (atsAnalysis != null && atsAnalysis.getWeaknesses() != null) {
            resumeImprovements.addAll(atsAnalysis.getWeaknesses());
        }
        if (!skillGaps.isEmpty()) {
            resumeImprovements.add("Incorporate missing keywords (" + String.join(", ", skillGaps) + ") into resume if genuinely experienced.");
        }
        if (atsScore < 70) {
            resumeImprovements.add("Quantify experience bullets with measurable metrics and action verbs.");
        }
        dto.setResumeImprovements(resumeImprovements);

        // 6. Actionable Checklist
        List<String> checklist = new ArrayList<>();
        checklist.add("Review target job requirements for " + dto.getJobTitle());
        if (!skillGaps.isEmpty()) {
            checklist.add("Address top skill gap keywords: " + String.join(", ", skillGaps.subList(0, Math.min(skillGaps.size(), 3))));
        } else {
            checklist.add("Verify core technical skills match position requirements");
        }
        checklist.add("Tailor professional summary and headline for " + dto.getCompany());
        checklist.add("Ensure latest PDF resume contains updated project tech stack");
        checklist.add("Verify contact details and LinkedIn/GitHub links");
        checklist.add("Submit job application with confidence");
        dto.setApplicationChecklist(checklist);

        // 7. Recommended Next Action
        if (atsScore < matchScore && atsScore < 65) {
            dto.setRecommendedNextAction("Optimize your resume keyword indexability to boost your ATS match before applying.");
        } else if (!skillGaps.isEmpty() && matchScore < 70) {
            dto.setRecommendedNextAction("Highlight relevant projects demonstrating missing skills (" + skillGaps.get(0) + ") before submitting.");
        } else if (appReadiness >= 80) {
            dto.setRecommendedNextAction("Your application profile is strongly aligned. Review job requirements once more and apply.");
        } else {
            dto.setRecommendedNextAction("Address top resume improvement items and skill gaps to maximize application success.");
        }

        // 8. Qualitative Strategy Enrichment (AI or Fallback)
        String strategyText = aiProvider.generateApplicationCopilotStrategy(candidate, job, matchResult, atsAnalysis);
        if (strategyText == null || strategyText.trim().isEmpty()) {
            strategyText = String.format(
                    "Your application readiness for %s at %s is %d%% (%s). " +
                    "Your job match score is %d%% and ATS resume score is %d%%. " +
                    "Focus on highlighting your matching strengths (%s) and addressing key keyword gaps (%s) to maximize recruiter visibility.",
                    dto.getJobTitle(), dto.getCompany(), appReadiness, dto.getRecommendation().replace("_", " "),
                    matchScore, atsScore,
                    strengths.isEmpty() ? "Core Profile Skills" : String.join(", ", strengths.subList(0, Math.min(strengths.size(), 3))),
                    skillGaps.isEmpty() ? "None" : String.join(", ", skillGaps.subList(0, Math.min(skillGaps.size(), 3)))
            );
        }
        dto.setApplicationStrategy(strategyText);

        return dto;
    }
}
