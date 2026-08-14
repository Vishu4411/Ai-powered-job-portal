package com.vishnu.ai_job_portal_backend.services;

import com.vishnu.ai_job_portal_backend.dto.ATSResumeAnalysisDTO;
import com.vishnu.ai_job_portal_backend.dto.UserProfileDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ATSScoringEngine {

    public ATSResumeAnalysisDTO calculateATSScore(UserProfileDTO candidate) {
        ATSResumeAnalysisDTO analysis = new ATSResumeAnalysisDTO();

        if (candidate == null) {
            analysis.setOverallScore(0);
            analysis.getWeaknesses().add("Candidate profile is empty.");
            analysis.getRecommendations().add("Complete your profile information to receive an ATS score.");
            analysis.setAiExplanation("No candidate profile data was found. Please populate your profile.");
            return analysis;
        }

        // 1. Profile Completeness (Weight: 15%)
        int profileScore = 0;
        if (candidate.getHeadline() != null && !candidate.getHeadline().trim().isEmpty()) profileScore += 25;
        if (candidate.getLocation() != null && !candidate.getLocation().trim().isEmpty()) profileScore += 25;
        if (candidate.getBio() != null && !candidate.getBio().trim().isEmpty()) profileScore += 25;
        if ((candidate.getLinkedinUrl() != null && !candidate.getLinkedinUrl().trim().isEmpty()) ||
            (candidate.getGithubUrl() != null && !candidate.getGithubUrl().trim().isEmpty()) ||
            (candidate.getPortfolioUrl() != null && !candidate.getPortfolioUrl().trim().isEmpty())) {
            profileScore += 25;
        }
        analysis.setProfileCompletenessScore(profileScore);

        // 2. Skills Coverage (Weight: 20%)
        int skillsScore = 0;
        if (candidate.getSkills() != null && !candidate.getSkills().trim().isEmpty()) {
            String[] skillArray = candidate.getSkills().split(",");
            int count = skillArray.length;
            if (count >= 5) skillsScore = 100;
            else if (count >= 3) skillsScore = 75;
            else skillsScore = 40;
        }
        analysis.setSkillsScore(skillsScore);

        // 3. Experience Quality (Weight: 20%)
        int expScore = 0;
        if (candidate.getExperienceList() != null && !candidate.getExperienceList().isEmpty()) {
            int count = candidate.getExperienceList().size();
            expScore = (count >= 2) ? 80 : 50;
            boolean hasDesc = candidate.getExperienceList().stream()
                    .anyMatch(e -> e.getDescription() != null && e.getDescription().trim().length() > 20);
            if (hasDesc) expScore += 20;
        }
        analysis.setExperienceScore(Math.min(100, expScore));

        // 4. Education Completeness (Weight: 10%)
        int eduScore = 0;
        if (candidate.getEducationList() != null && !candidate.getEducationList().isEmpty()) {
            eduScore = 80;
            boolean complete = candidate.getEducationList().stream()
                    .anyMatch(e -> e.getDegree() != null && e.getInstitution() != null);
            if (complete) eduScore = 100;
        }
        analysis.setEducationScore(eduScore);

        // 5. Projects Quality (Weight: 15%)
        int projScore = 0;
        if (candidate.getProjectList() != null && !candidate.getProjectList().isEmpty()) {
            int count = candidate.getProjectList().size();
            projScore = (count >= 2) ? 80 : 50;
            boolean hasTechStack = candidate.getProjectList().stream()
                    .anyMatch(p -> p.getTechStack() != null && !p.getTechStack().trim().isEmpty());
            if (hasTechStack) projScore += 20;
        }
        analysis.setProjectsScore(Math.min(100, projScore));

        // 6. Certifications Completeness (Weight: 5%)
        int certScore = 0;
        if (candidate.getCertificationList() != null && !candidate.getCertificationList().isEmpty()) {
            certScore = 100;
        }
        analysis.setCertificationsScore(certScore);

        // 7. Professional Summary Quality (Weight: 10%)
        int summaryScore = 0;
        if (candidate.getBio() != null && !candidate.getBio().trim().isEmpty()) {
            int len = candidate.getBio().trim().length();
            if (len >= 100) summaryScore = 100;
            else if (len >= 40) summaryScore = 70;
            else summaryScore = 40;
        }
        analysis.setSummaryScore(summaryScore);

        // 8. Keyword / Content Quality (Weight: 5%)
        int keywordScore = 30;
        String combinedContent = ((candidate.getSkills() != null ? candidate.getSkills() : "") + " " +
                                 (candidate.getBio() != null ? candidate.getBio() : "") + " " +
                                 (candidate.getHeadline() != null ? candidate.getHeadline() : "")).toLowerCase();

        String[] actionKeywords = {"developed", "built", "managed", "designed", "implemented", "lead", "optimized", "created", "engineered", "api", "database", "full stack", "cloud", "spring", "react", "java", "python", "mysql"};
        int matches = 0;
        for (String kw : actionKeywords) {
            if (combinedContent.contains(kw)) matches++;
        }
        if (matches >= 4) keywordScore = 100;
        else if (matches >= 2) keywordScore = 70;
        else if (matches >= 1) keywordScore = 50;

        analysis.setKeywordScore(keywordScore);

        // Weighted Overall ATS Score Calculation
        double overall = (profileScore * 0.15) +
                         (skillsScore * 0.20) +
                         (expScore * 0.20) +
                         (eduScore * 0.10) +
                         (projScore * 0.15) +
                         (certScore * 0.05) +
                         (summaryScore * 0.10) +
                         (keywordScore * 0.05);

        analysis.setOverallScore((int) Math.round(overall));

        // Generate Rule-Based Strengths, Weaknesses, Recommendations
        List<String> strengths = new ArrayList<>();
        List<String> weaknesses = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();

        if (skillsScore >= 70) strengths.add("Strong technical skill set listed (" + candidate.getSkills() + ").");
        else weaknesses.add("Limited technical skills listed on profile.");

        if (expScore >= 70) strengths.add("Solid work experience entries documented.");
        else recommendations.add("Add detailed work experience entries with bullet points highlighting accomplishments.");

        if (projScore >= 70) strengths.add("Relevant project portfolio entries included with technology stacks.");
        else recommendations.add("Include at least 2 portfolio projects with GitHub/live links and tech stacks.");

        if (summaryScore >= 70) strengths.add("Comprehensive professional bio provided.");
        else recommendations.add("Expand your professional bio/summary to highlight key competencies and career goals.");

        if (certScore > 0) strengths.add("Verified industry certifications included.");
        else recommendations.add("Add industry certifications (e.g. AWS, Java, Scrum) to increase recruiter visibility.");

        analysis.setStrengths(strengths);
        analysis.setWeaknesses(weaknesses);
        analysis.setRecommendations(recommendations);

        analysis.setAiExplanation(String.format(
                "Your resume profile achieved a deterministic ATS match score of %d%%. " +
                "Profile completeness is at %d%% and skills coverage is at %d%%. " +
                "Focus on expanding your experience entries and project descriptions to boost ATS indexability.",
                analysis.getOverallScore(), profileScore, skillsScore
        ));

        return analysis;
    }
}
