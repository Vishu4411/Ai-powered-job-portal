package com.vishnu.ai_job_portal_backend.services;

import com.vishnu.ai_job_portal_backend.dto.JobMatchResultDTO;
import com.vishnu.ai_job_portal_backend.dto.SkillGapRoadmapDTO;
import com.vishnu.ai_job_portal_backend.dto.UserProfileDTO;
import com.vishnu.ai_job_portal_backend.entity.Job;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SkillRoadmapEngine {

    public SkillGapRoadmapDTO generateBaseRoadmap(UserProfileDTO candidate, Job job, JobMatchResultDTO matchResult) {
        SkillGapRoadmapDTO dto = new SkillGapRoadmapDTO();
        dto.setJobId(job.getId());
        dto.setJobTitle(job.getTitle());
        dto.setCompany(job.getCompanyEntity() != null ? job.getCompanyEntity().getCompanyName() : job.getCompany());
        dto.setOverallMatchScore(matchResult.getOverallMatchScore());
        dto.setMatchingSkills(matchResult.getMatchingSkills());
        dto.setMissingSkills(matchResult.getMissingSkills());

        List<String> missing = matchResult.getMissingSkills();
        List<String> weekly = new ArrayList<>();

        if (missing == null || missing.isEmpty()) {
            dto.setEstimatedPreparation("0 Weeks (Interview Ready!)");
            dto.setRoadmapSummary(String.format(
                    "Congratulations! You meet 100%% of the core technical skill requirements for '%s' at %s. Focus on interview prep and system design.",
                    job.getTitle(), dto.getCompany() != null ? dto.getCompany() : "target company"
            ));
            weekly.add("Week 1 → Mock technical interview practice & core system architecture review.");
            weekly.add("Week 2 → Behavioral interview preparation and deep dive into project achievements.");
            dto.setRecommendedProject(String.format(
                    "Refactor your existing portfolio projects to showcase clean architecture using %s.",
                    job.getSkills() != null ? job.getSkills() : "your primary tech stack"
            ));
        } else if (missing.size() == 1) {
            String skill = missing.get(0);
            dto.setEstimatedPreparation("1–2 Weeks");
            dto.setRoadmapSummary(String.format(
                    "You are a strong candidate (%d%% match). Acquiring proficiency in %s will bring your match score to 100%%.",
                    matchResult.getOverallMatchScore(), skill
            ));
            weekly.add(String.format("Week 1 → Fundamentals of %s: Core concepts, syntax, and hands-on tutorials.", skill));
            weekly.add(String.format("Week 2 → Advanced %s: Integrate into existing projects and deploy a working feature.", skill));
            dto.setRecommendedProject(String.format(
                    "Build a mini-application that integrates %s with your existing %s skills.",
                    skill, matchResult.getMatchingSkills().isEmpty() ? "full-stack" : String.join(", ", matchResult.getMatchingSkills())
            ));
        } else {
            int weeksNeeded = Math.min(6, Math.max(2, missing.size()));
            dto.setEstimatedPreparation(weeksNeeded + "–" + (weeksNeeded + 1) + " Weeks");
            dto.setRoadmapSummary(String.format(
                    "To reach 100%% match readiness for '%s', focus on bridging your %d missing skill gaps: %s.",
                    job.getTitle(), missing.size(), String.join(", ", missing)
            ));

            for (int i = 0; i < missing.size() && i < 4; i++) {
                String s = missing.get(i);
                weekly.add(String.format("Week %d → %s: Fundamentals, hands-on exercises, and real-world usage patterns.", (i + 1), s));
            }
            if (missing.size() > 4) {
                weekly.add(String.format("Week %d → Advanced Integration: Combine %s into a unified solution.", (weekly.size() + 1), String.join(", ", missing.subList(3, missing.size()))));
            }

            dto.setRecommendedProject(String.format(
                    "Develop and deploy a full-stack portfolio application incorporating %s.",
                    String.join(", ", missing)
            ));
        }

        dto.setWeeklyRoadmap(weekly);
        return dto;
    }
}
