package com.vishnu.ai_job_portal_backend.services;

import com.vishnu.ai_job_portal_backend.dto.ATSResumeAnalysisDTO;
import com.vishnu.ai_job_portal_backend.dto.CareerReadinessDTO;
import com.vishnu.ai_job_portal_backend.dto.UserProfileDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CareerReadinessEngine {

    private final ATSScoringEngine atsScoringEngine;

    public CareerReadinessEngine(ATSScoringEngine atsScoringEngine) {
        this.atsScoringEngine = atsScoringEngine;
    }

    public CareerReadinessDTO calculateReadiness(UserProfileDTO candidate) {
        CareerReadinessDTO dto = new CareerReadinessDTO();

        if (candidate == null) {
            dto.setOverallScore(0);
            dto.getImprovementAreas().add("Complete your candidate profile to compute your Career Readiness Score.");
            dto.setRecommendedNextAction("Add your headline, bio, location, and technical skills in your profile.");
            return dto;
        }

        // 1. Profile Completeness (Weight: 15%)
        int profileScore = 0;
        if (candidate.getHeadline() != null && !candidate.getHeadline().trim().isEmpty()) profileScore += 20;
        if (candidate.getLocation() != null && !candidate.getLocation().trim().isEmpty()) profileScore += 20;
        if (candidate.getPhone() != null && !candidate.getPhone().trim().isEmpty()) profileScore += 15;
        if (candidate.getBio() != null && !candidate.getBio().trim().isEmpty()) profileScore += 20;
        if ((candidate.getLinkedinUrl() != null && !candidate.getLinkedinUrl().trim().isEmpty()) ||
            (candidate.getGithubUrl() != null && !candidate.getGithubUrl().trim().isEmpty()) ||
            (candidate.getPortfolioUrl() != null && !candidate.getPortfolioUrl().trim().isEmpty())) {
            profileScore += 25;
        }
        dto.setProfileScore(Math.min(100, profileScore));

        // 2. Skills Coverage (Weight: 20%)
        int skillsScore = 0;
        if (candidate.getSkills() != null && !candidate.getSkills().trim().isEmpty()) {
            String[] skillArray = candidate.getSkills().split(",");
            int count = skillArray.length;
            if (count >= 5) skillsScore = 100;
            else if (count >= 3) skillsScore = 75;
            else if (count >= 1) skillsScore = 40;
        }
        dto.setSkillsScore(skillsScore);

        // 3. Experience Quality (Weight: 20%)
        int experienceScore = 0;
        if (candidate.getExperienceList() != null && !candidate.getExperienceList().isEmpty()) {
            int count = candidate.getExperienceList().size();
            experienceScore = (count >= 2) ? 80 : 50;
            boolean hasDesc = candidate.getExperienceList().stream()
                    .anyMatch(e -> e.getDescription() != null && e.getDescription().trim().length() > 20);
            if (hasDesc) experienceScore += 20;
        }
        dto.setExperienceScore(Math.min(100, experienceScore));

        // 4. Education Completeness (Weight: 10%)
        int educationScore = 0;
        if (candidate.getEducationList() != null && !candidate.getEducationList().isEmpty()) {
            educationScore = 80;
            boolean complete = candidate.getEducationList().stream()
                    .anyMatch(e -> e.getDegree() != null && e.getInstitution() != null);
            if (complete) educationScore = 100;
        }
        dto.setEducationScore(educationScore);

        // 5. Projects Quality (Weight: 15%)
        int projectsScore = 0;
        if (candidate.getProjectList() != null && !candidate.getProjectList().isEmpty()) {
            int count = candidate.getProjectList().size();
            projectsScore = (count >= 2) ? 80 : 50;
            boolean hasTech = candidate.getProjectList().stream()
                    .anyMatch(p -> p.getTechStack() != null && !p.getTechStack().trim().isEmpty());
            if (hasTech) projectsScore += 20;
        }
        dto.setProjectsScore(Math.min(100, projectsScore));

        // 6. Certifications (Weight: 5%)
        int certificationsScore = 0;
        if (candidate.getCertificationList() != null && !candidate.getCertificationList().isEmpty()) {
            certificationsScore = 100;
        }
        dto.setCertificationsScore(certificationsScore);

        // 7. Resume / ATS Score (Weight: 15%)
        ATSResumeAnalysisDTO atsAnalysis = atsScoringEngine.calculateATSScore(candidate);
        int resumeATSScore = atsAnalysis != null ? atsAnalysis.getOverallScore() : 0;
        if (candidate.getResumeUrl() != null && !candidate.getResumeUrl().trim().isEmpty()) {
            resumeATSScore = Math.max(70, resumeATSScore);
        }
        dto.setResumeATSScore(Math.min(100, resumeATSScore));

        // Weighted Overall Score
        double overall = (dto.getProfileScore() * 0.15) +
                         (dto.getSkillsScore() * 0.20) +
                         (dto.getExperienceScore() * 0.20) +
                         (dto.getEducationScore() * 0.10) +
                         (dto.getProjectsScore() * 0.15) +
                         (dto.getCertificationsScore() * 0.05) +
                         (dto.getResumeATSScore() * 0.15);

        dto.setOverallScore((int) Math.round(overall));

        // Deterministic Strengths
        List<String> strengths = new ArrayList<>();
        if (dto.getProfileScore() >= 75) strengths.add("Detailed personal and professional profile.");
        if (dto.getSkillsScore() >= 75) strengths.add("Strong technical skill coverage.");
        if (dto.getExperienceScore() >= 70) strengths.add("Solid work experience documented.");
        if (dto.getEducationScore() >= 80) strengths.add("Complete education history documented.");
        if (dto.getProjectsScore() >= 70) strengths.add("Robust project portfolio entries.");
        if (dto.getCertificationsScore() > 0) strengths.add("Verified professional certifications listed.");
        if (dto.getResumeATSScore() >= 75) strengths.add("High resume ATS indexability score.");

        if (strengths.isEmpty()) {
            strengths.add("Account created and active on Career Compass.");
        }
        dto.setStrengths(strengths);

        // Deterministic Improvement Areas
        List<String> improvementAreas = new ArrayList<>();
        if (dto.getSkillsScore() < 75) improvementAreas.add("Add more relevant technical skills to improve career readiness.");
        if (dto.getExperienceScore() < 70) improvementAreas.add("Add detailed experience entries with measurable accomplishments.");
        if (dto.getProjectsScore() < 70) improvementAreas.add("Add at least two relevant portfolio projects.");
        if (dto.getEducationScore() < 80) improvementAreas.add("Complete your education details including degree and institution.");
        if (dto.getCertificationsScore() == 0) improvementAreas.add("Consider adding relevant professional certifications.");
        if (dto.getProfileScore() < 75) improvementAreas.add("Complete missing profile links (LinkedIn, GitHub, Portfolio).");
        if (dto.getResumeATSScore() < 75) improvementAreas.add("Upload and optimize your resume for ATS parsing.");

        dto.setImprovementAreas(improvementAreas);

        // Determine Recommended Next Action from lowest scoring component
        String nextAction;
        int minScore = dto.getSkillsScore();
        nextAction = "Add top relevant technical skills for your target role to your profile.";

        if (dto.getExperienceScore() < minScore) {
            minScore = dto.getExperienceScore();
            nextAction = "Add detailed work experience entries with key achievements and responsibilities.";
        }
        if (dto.getProjectsScore() < minScore) {
            minScore = dto.getProjectsScore();
            nextAction = "Add two relevant portfolio projects with technologies and measurable outcomes.";
        }
        if (dto.getResumeATSScore() < minScore) {
            minScore = dto.getResumeATSScore();
            nextAction = "Upload your updated resume PDF/Word document to boost ATS indexing.";
        }
        if (dto.getProfileScore() < minScore) {
            minScore = dto.getProfileScore();
            nextAction = "Add your headline, professional bio, location, and social profile links.";
        }
        if (dto.getEducationScore() < minScore) {
            minScore = dto.getEducationScore();
            nextAction = "Add your degree and university education information.";
        }
        if (dto.getCertificationsScore() < minScore && dto.getCertificationsScore() == 0) {
            nextAction = "Consider adding industry certifications (e.g. AWS, Java, Scrum) to stand out to recruiters.";
        }

        if (dto.getOverallScore() >= 85) {
            nextAction = "Your career profile is highly optimized! Keep applying for top recommended jobs.";
        }

        dto.setRecommendedNextAction(nextAction);

        return dto;
    }
}
