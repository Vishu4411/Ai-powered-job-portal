package com.vishnu.ai_job_portal_backend.services;

import com.vishnu.ai_job_portal_backend.dto.*;
import com.vishnu.ai_job_portal_backend.entity.Job;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class DeterministicScoringEngine {

    public JobMatchResultDTO calculateMatch(UserProfileDTO candidate, Job job) {
        JobMatchResultDTO result = new JobMatchResultDTO();
        result.setJobId(job.getId());

        // 1. Skill Match Calculation (Weight 50%)
        List<String> jobSkills = parseSkills(job.getSkills());
        Set<String> candidateSkillSet = collectCandidateSkills(candidate);

        List<String> matching = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String skill : jobSkills) {
            if (candidateSkillSet.contains(skill.toLowerCase())) {
                matching.add(skill);
            } else {
                missing.add(skill);
            }
        }

        result.setMatchingSkills(matching);
        result.setMissingSkills(missing);

        int skillScore;
        if (jobSkills.isEmpty()) {
            skillScore = 100;
        } else {
            double ratio = (double) matching.size() / jobSkills.size();
            skillScore = (int) Math.round(ratio * 100);
        }
        result.setSkillMatchScore(Math.min(100, Math.max(0, skillScore)));

        // 2. Experience Match Calculation (Weight 20%)
        int expScore = calculateExperienceScore(candidate, job.getExperience());
        result.setExperienceMatchScore(expScore);

        // 3. Education Match Calculation (Weight 10%)
        int eduScore = calculateEducationScore(candidate);
        result.setEducationMatchScore(eduScore);

        // 4. Location Match Calculation (Weight 10%)
        int locScore = calculateLocationScore(candidate.getLocation(), job.getLocation(), job.getJobType());
        result.setLocationMatchScore(locScore);

        // 5. Job Type Match Calculation (Weight 10%)
        int jobTypeScore = calculateJobTypeScore(candidate, job.getJobType());
        result.setJobTypeMatchScore(jobTypeScore);

        // Weighted Overall Score
        double overall = (0.50 * skillScore) + (0.20 * expScore) + (0.10 * eduScore) + (0.10 * locScore) + (0.10 * jobTypeScore);
        int overallMatch = (int) Math.round(overall);
        result.setOverallMatchScore(Math.min(100, Math.max(0, overallMatch)));

        return result;
    }

    private List<String> parseSkills(String rawSkills) {
        if (rawSkills == null || rawSkills.trim().isEmpty()) {
            return Collections.emptyList();
        }
        List<String> list = new ArrayList<>();
        for (String s : rawSkills.split(",")) {
            String trimmed = s.trim();
            if (!trimmed.isEmpty()) {
                list.add(trimmed);
            }
        }
        return list;
    }

    private Set<String> collectCandidateSkills(UserProfileDTO candidate) {
        Set<String> set = new HashSet<>();
        if (candidate.getSkills() != null) {
            for (String s : candidate.getSkills().split(",")) {
                if (!s.trim().isEmpty()) {
                    set.add(s.trim().toLowerCase());
                }
            }
        }
        if (candidate.getProjectList() != null) {
            for (ProjectDTO proj : candidate.getProjectList()) {
                if (proj.getTechStack() != null) {
                    for (String s : proj.getTechStack().split(",")) {
                        if (!s.trim().isEmpty()) {
                            set.add(s.trim().toLowerCase());
                        }
                    }
                }
            }
        }
        return set;
    }

    private int calculateExperienceScore(UserProfileDTO candidate, String jobExperienceReq) {
        int reqMonths = parseRequiredExperienceMonths(jobExperienceReq);
        int candidateMonths = calculateCandidateTotalMonths(candidate.getExperienceList());

        if (reqMonths == 0) {
            return 100; // Job accepts freshers
        }

        if (candidateMonths >= reqMonths) {
            return 100;
        }

        if (candidateMonths > 0) {
            double ratio = (double) candidateMonths / reqMonths;
            return (int) Math.round(50 + (50 * ratio));
        }

        return 40; // No logged work experience for an experienced role requirement
    }

    private int parseRequiredExperienceMonths(String req) {
        if (req == null || req.trim().isEmpty()) return 0;
        String lower = req.toLowerCase().trim();
        if (lower.contains("fresher") || lower.contains("entry") || lower.contains("0")) return 0;

        // Try extracting numbers, e.g., "2-5 Years" -> 2 years = 24 months
        Scanner scanner = new Scanner(lower).useDelimiter("[^0-9]+");
        if (scanner.hasNextInt()) {
            int years = scanner.nextInt();
            return years * 12;
        }
        return 24; // Default assumption 2 years if unparseable
    }

    private int calculateCandidateTotalMonths(List<ExperienceDTO> experiences) {
        if (experiences == null || experiences.isEmpty()) return 0;
        int totalMonths = 0;
        for (ExperienceDTO exp : experiences) {
            totalMonths += 12; // Base 1 year per experience entry logged by candidate
        }
        return totalMonths;
    }

    private int calculateEducationScore(UserProfileDTO candidate) {
        if (candidate.getEducationList() == null || candidate.getEducationList().isEmpty()) {
            return 50;
        }
        boolean hasMasterOrHigher = false;
        boolean hasBachelor = false;

        for (EducationDTO edu : candidate.getEducationList()) {
            String degree = edu.getDegree() != null ? edu.getDegree().toLowerCase() : "";
            if (degree.contains("master") || degree.contains("m.tech") || degree.contains("mba") || degree.contains("phd")) {
                hasMasterOrHigher = true;
            } else if (degree.contains("bachelor") || degree.contains("b.tech") || degree.contains("b.e") || degree.contains("bca") || degree.contains("b.sc")) {
                hasBachelor = true;
            }
        }

        if (hasMasterOrHigher) return 100;
        if (hasBachelor) return 90;
        return 75;
    }

    private int calculateLocationScore(String candidateLoc, String jobLoc, String jobType) {
        if ((jobType != null && jobType.equalsIgnoreCase("Remote")) ||
            (jobLoc != null && jobLoc.toLowerCase().contains("remote"))) {
            return 100;
        }

        if (candidateLoc != null && !candidateLoc.trim().isEmpty() && jobLoc != null && !jobLoc.trim().isEmpty()) {
            String candLower = candidateLoc.toLowerCase().trim();
            String jobLower = jobLoc.toLowerCase().trim();
            if (candLower.contains(jobLower) || jobLower.contains(candLower)) {
                return 100;
            }
            return 50;
        }

        return 60;
    }

    private int calculateJobTypeScore(UserProfileDTO candidate, String jobType) {
        if (jobType == null || jobType.equalsIgnoreCase("Full-time") || jobType.equalsIgnoreCase("Remote")) {
            return 100;
        }
        if (jobType.equalsIgnoreCase("Internship")) {
            return (candidate.getEducationList() != null && !candidate.getEducationList().isEmpty()) ? 100 : 80;
        }
        return 90;
    }
}
