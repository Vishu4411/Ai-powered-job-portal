package com.vishnu.ai_job_portal_backend.services;

import com.vishnu.ai_job_portal_backend.dto.CandidateInsightsDTO;

import com.vishnu.ai_job_portal_backend.dto.JobMatchResultDTO;
import com.vishnu.ai_job_portal_backend.dto.RankedApplicantDTO;
import com.vishnu.ai_job_portal_backend.dto.RecruiterAnalyticsDTO;
import com.vishnu.ai_job_portal_backend.dto.RecruiterApplicantDTO;
import com.vishnu.ai_job_portal_backend.dto.UserProfileDTO;
import com.vishnu.ai_job_portal_backend.entity.Application;
import com.vishnu.ai_job_portal_backend.entity.ApplicationStatus;
import com.vishnu.ai_job_portal_backend.entity.Job;
import com.vishnu.ai_job_portal_backend.entity.JobStatus;
import com.vishnu.ai_job_portal_backend.repository.ApplicationRepository;
import com.vishnu.ai_job_portal_backend.repository.JobRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class RecruiterApplicationService {


    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final ProfileService profileService;
    private final DeterministicScoringEngine scoringEngine;
    private final AIProvider aiProvider;
    private final NotificationService notificationService;

    public RecruiterApplicationService(JobRepository jobRepository,
                                       ApplicationRepository applicationRepository,
                                       ProfileService profileService,
                                       DeterministicScoringEngine scoringEngine,
                                       AIProvider aiProvider,
                                       NotificationService notificationService) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.profileService = profileService;
        this.scoringEngine = scoringEngine;
        this.aiProvider = aiProvider;
        this.notificationService = notificationService;
    }


    public RecruiterAnalyticsDTO getRecruiterAnalytics(String recruiterEmail) {
        RecruiterAnalyticsDTO analytics = new RecruiterAnalyticsDTO();

        int totalJobs = (int) jobRepository.countByPostedByEmail(recruiterEmail);
        int activeJobs = (int) jobRepository.countByPostedByEmailAndStatus(recruiterEmail, JobStatus.OPEN);
        int closedJobs = (int) jobRepository.countByPostedByEmailAndStatus(recruiterEmail, JobStatus.CLOSED);

        analytics.setTotalJobs(totalJobs);
        analytics.setActiveJobs(activeJobs);
        analytics.setClosedJobs(closedJobs);

        List<Application> applications = applicationRepository.findByJobPostedByEmail(recruiterEmail);
        int totalApplicants = applications.size();
        analytics.setTotalApplicants(totalApplicants);

        if (totalApplicants == 0) {
            analytics.setAverageMatchScore(0);
            analytics.setTopMatchScore(0);
            analytics.setShortlistRate(0.0);
            analytics.setInterviewRate(0.0);
            analytics.setRejectionRate(0.0);
            return analytics;
        }

        int pendingCount = 0;
        int shortlistedCount = 0;
        int interviewCount = 0;
        int rejectedCount = 0;

        int scoreSum = 0;
        int maxScore = -1;
        RecruiterAnalyticsDTO.TopCandidateDTO topCandidate = null;

        Map<String, Integer> skillCountMap = new HashMap<>();
        List<RecruiterAnalyticsDTO.RecentApplicationDTO> recentList = new ArrayList<>();

        for (Application app : applications) {
            ApplicationStatus status = app.getStatus() != null ? app.getStatus() : ApplicationStatus.APPLIED;
            if (status == ApplicationStatus.APPLIED || status == ApplicationStatus.UNDER_REVIEW) {
                pendingCount++;
            } else if (status == ApplicationStatus.SHORTLISTED) {
                shortlistedCount++;
            } else if (status == ApplicationStatus.INTERVIEW_SCHEDULED) {
                interviewCount++;
            } else if (status == ApplicationStatus.REJECTED) {
                rejectedCount++;
            }

            UserProfileDTO profile = profileService.getProfileByUserEmail(app.getEmail());
            int matchScore = 0;
            if (profile != null && app.getJob() != null) {
                JobMatchResultDTO matchResult = scoringEngine.calculateMatch(profile, app.getJob());
                matchScore = matchResult.getOverallMatchScore();
            }
            scoreSum += matchScore;

            if (matchScore > maxScore) {
                maxScore = matchScore;
                topCandidate = new RecruiterAnalyticsDTO.TopCandidateDTO(
                        app.getApplicantName() != null ? app.getApplicantName() : app.getEmail(),
                        matchScore,
                        app.getJob() != null ? app.getJob().getTitle() : "Position",
                        status.name()
                );
            }

            if (profile != null && profile.getSkills() != null && !profile.getSkills().isBlank()) {
                String[] skillArr = profile.getSkills().split(",");
                for (String sk : skillArr) {
                    String cleanSkill = sk.trim();
                    if (!cleanSkill.isEmpty()) {
                        String normalizedKey = cleanSkill.substring(0, 1).toUpperCase() + cleanSkill.substring(1).toLowerCase();
                        skillCountMap.put(normalizedKey, skillCountMap.getOrDefault(normalizedKey, 0) + 1);
                    }
                }
            }

            recentList.add(new RecruiterAnalyticsDTO.RecentApplicationDTO(
                    app.getId(),
                    app.getApplicantName() != null ? app.getApplicantName() : app.getEmail(),
                    app.getJob() != null ? app.getJob().getTitle() : "Position",
                    status.name(),
                    app.getAppliedAt(),
                    matchScore
            ));
        }

        analytics.setPendingApplications(pendingCount);
        analytics.setShortlistedApplications(shortlistedCount);
        analytics.setInterviewScheduledApplications(interviewCount);
        analytics.setRejectedApplications(rejectedCount);

        double shortlistRate = Math.round((shortlistedCount * 100.0 / totalApplicants) * 100.0) / 100.0;
        double interviewRate = Math.round((interviewCount * 100.0 / totalApplicants) * 100.0) / 100.0;
        double rejectionRate = Math.round((rejectedCount * 100.0 / totalApplicants) * 100.0) / 100.0;

        analytics.setShortlistRate(shortlistRate);
        analytics.setInterviewRate(interviewRate);
        analytics.setRejectionRate(rejectionRate);

        analytics.setAverageMatchScore(Math.round((float) scoreSum / totalApplicants));
        analytics.setTopMatchScore(maxScore >= 0 ? maxScore : 0);
        analytics.setTopCandidate(topCandidate);

        List<RecruiterAnalyticsDTO.AnalyticsSkillDTO> topSkills = skillCountMap.entrySet().stream()
                .map(e -> new RecruiterAnalyticsDTO.AnalyticsSkillDTO(e.getKey(), e.getValue()))
                .sorted((a, b) -> Integer.compare(b.getCount(), a.getCount()))
                .limit(10)
                .collect(Collectors.toList());
        analytics.setTopSkills(topSkills);

        recentList.sort((a, b) -> {
            if (a.getAppliedAt() == null || b.getAppliedAt() == null) return 0;
            return b.getAppliedAt().compareTo(a.getAppliedAt());
        });
        analytics.setRecentApplications(recentList.stream().limit(10).collect(Collectors.toList()));

        return analytics;
    }


    public List<RecruiterApplicantDTO> getJobApplications(String recruiterEmail, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found: " + jobId));

        if (job.getPostedBy() == null || !job.getPostedBy().getEmail().equals(recruiterEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized: You do not own this job posting");
        }

        List<Application> applications = applicationRepository.findByJobId(jobId);
        return applications.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<RankedApplicantDTO> getRankedApplicants(String recruiterEmail, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found: " + jobId));

        if (job.getPostedBy() == null || !job.getPostedBy().getEmail().equals(recruiterEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized: You do not own this job posting");
        }

        List<Application> applications = applicationRepository.findByJobId(jobId);
        List<RankedApplicantDTO> rankedList = new ArrayList<>();

        for (Application app : applications) {
            UserProfileDTO profile = profileService.getProfileByUserEmail(app.getEmail());
            JobMatchResultDTO matchResult = scoringEngine.calculateMatch(profile, job);

            RankedApplicantDTO dto = new RankedApplicantDTO();
            dto.setApplicationId(app.getId());
            dto.setCandidateId(app.getCandidate() != null ? app.getCandidate().getId() : null);
            dto.setCandidateName(app.getApplicantName());
            dto.setCandidateEmail(app.getEmail());
            dto.setApplicationStatus(app.getStatus() != null ? app.getStatus().name() : "APPLIED");
            dto.setAppliedAt(app.getAppliedAt());

            if (profile != null) {
                dto.setHeadline(profile.getHeadline());
                dto.setYearsOfExperience(profile.getExperienceList() != null ? profile.getExperienceList().size() : 0);
                if (profile.getEducationList() != null && !profile.getEducationList().isEmpty()) {
                    dto.setEducationSummary(profile.getEducationList().get(0).getDegree() + " - " + profile.getEducationList().get(0).getInstitution());
                } else {
                    dto.setEducationSummary("Education details not specified");
                }
            }


            dto.setOverallMatchScore(matchResult.getOverallMatchScore());
            dto.setSkillMatchScore(matchResult.getSkillMatchScore());
            dto.setExperienceMatchScore(matchResult.getExperienceMatchScore());
            dto.setEducationMatchScore(matchResult.getEducationMatchScore());
            dto.setLocationMatchScore(matchResult.getLocationMatchScore());
            dto.setJobTypeMatchScore(matchResult.getJobTypeMatchScore());
            dto.setMatchingSkills(matchResult.getMatchingSkills());
            dto.setMissingSkills(matchResult.getMissingSkills());

            rankedList.add(dto);
        }

        // Sort descending by overall match score
        rankedList.sort((a, b) -> Integer.compare(b.getOverallMatchScore(), a.getOverallMatchScore()));
        return rankedList;
    }

    public CandidateInsightsDTO getCandidateInsights(String recruiterEmail, Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found: " + applicationId));

        Job job = application.getJob();
        if (job == null || job.getPostedBy() == null || !job.getPostedBy().getEmail().equals(recruiterEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized: You do not own the job for this application");
        }

        UserProfileDTO candidate = profileService.getProfileByUserEmail(application.getEmail());
        JobMatchResultDTO matchResult = scoringEngine.calculateMatch(candidate, job);

        CandidateInsightsDTO insights = new CandidateInsightsDTO();
        insights.setApplicationId(application.getId());
        insights.setCandidateName(application.getApplicantName());
        insights.setJobTitle(job.getTitle());
        insights.setCompany(job.getCompany() != null ? job.getCompany() : "Target Company");
        insights.setOverallMatchScore(matchResult.getOverallMatchScore());
        insights.setMatchingSkills(matchResult.getMatchingSkills());
        insights.setMissingSkills(matchResult.getMissingSkills());

        // Rule-based deterministic fallback insights
        insights.setExecutiveSummary("Candidate demonstrates a " + matchResult.getOverallMatchScore() + "% deterministic match for " + job.getTitle() + ", with alignment across key skills.");
        
        List<String> strengths = new ArrayList<>();
        if (!matchResult.getMatchingSkills().isEmpty()) {
            strengths.add("Strong alignment in required skills: " + String.join(", ", matchResult.getMatchingSkills()) + ".");
        } else {
            strengths.add("Relevant foundational technical background.");
        }
        strengths.add("Demonstrated practical background suitable for role requirements.");
        insights.setStrengths(strengths);

        List<String> weaknesses = new ArrayList<>();
        if (!matchResult.getMissingSkills().isEmpty()) {
            weaknesses.add("Candidate is missing required experience in: " + String.join(", ", matchResult.getMissingSkills()) + ".");
        } else {
            weaknesses.add("No critical technical skill gaps identified.");
        }
        insights.setWeaknesses(weaknesses);

        insights.setRoleFitAnalysis("Candidate presents a " + matchResult.getOverallMatchScore() + "% overall technical fit for position '" + job.getTitle() + "'.");

        // Exactly 5 structured interview questions
        List<String> questions = new ArrayList<>();
        String primarySkill = !matchResult.getMatchingSkills().isEmpty() ? matchResult.getMatchingSkills().get(0) : "software design";
        String missingSkill = !matchResult.getMissingSkills().isEmpty() ? matchResult.getMissingSkills().get(0) : "advanced tooling";

        questions.add("1. Explain a production system you designed using " + primarySkill + " and the key architectural trade-offs you evaluated.");
        questions.add("2. How do you approach quickly mastering missing technical stack requirements such as " + missingSkill + "?");
        questions.add("3. Walk us through a complex technical issue you debugged in your recent experience and the measurable result achieved.");
        questions.add("4. How do you optimize API performance and ensure database query efficiency under high workload?");
        questions.add("5. Describe a situation where you had to collaborate with cross-functional stakeholders to deliver a critical milestone on schedule.");

        insights.setInterviewQuestions(questions);

        // Enrich with Gemini AI if available
        return aiProvider.generateCandidateInsights(candidate, job, matchResult, insights);
    }

    public UserProfileDTO getCandidateProfileForApplication(String recruiterEmail, Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found: " + applicationId));

        Job job = application.getJob();
        if (job == null || job.getPostedBy() == null || !job.getPostedBy().getEmail().equals(recruiterEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized: You do not own the job for this application");
        }

        String candidateEmail = application.getEmail();
        return profileService.getProfileByUserEmail(candidateEmail);
    }

    public RecruiterApplicantDTO updateApplicationStatus(String recruiterEmail, Long applicationId, String statusStr) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found: " + applicationId));

        Job job = application.getJob();
        if (job == null || job.getPostedBy() == null || !job.getPostedBy().getEmail().equals(recruiterEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized: You do not own the job for this application");
        }

        ApplicationStatus oldStatus = application.getStatus();
        ApplicationStatus newStatus = ApplicationStatus.valueOf(statusStr.toUpperCase());

        if (oldStatus != newStatus) {
            application.setStatus(newStatus);
            Application saved = applicationRepository.save(application);
            notificationService.notifyCandidateStatusChange(saved, oldStatus, newStatus);
            return mapToDTO(saved);
        }

        return mapToDTO(application);
    }


    private RecruiterApplicantDTO mapToDTO(Application app) {
        RecruiterApplicantDTO dto = new RecruiterApplicantDTO();
        dto.setId(app.getId());
        dto.setApplicantName(app.getApplicantName());
        dto.setEmail(app.getEmail());
        dto.setCoverLetter(app.getCoverLetter());
        dto.setAppliedAt(app.getAppliedAt());
        dto.setStatus(app.getStatus() != null ? app.getStatus().name() : "APPLIED");
        if (app.getJob() != null) {
            dto.setJobId(app.getJob().getId());
            dto.setJobTitle(app.getJob().getTitle());
        }
        return dto;
    }
}

