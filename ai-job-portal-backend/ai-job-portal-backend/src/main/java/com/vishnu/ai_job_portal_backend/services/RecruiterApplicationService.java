package com.vishnu.ai_job_portal_backend.services;

import com.vishnu.ai_job_portal_backend.dto.RecruiterApplicantDTO;
import com.vishnu.ai_job_portal_backend.dto.UserProfileDTO;
import com.vishnu.ai_job_portal_backend.entity.Application;
import com.vishnu.ai_job_portal_backend.entity.ApplicationStatus;
import com.vishnu.ai_job_portal_backend.entity.Job;
import com.vishnu.ai_job_portal_backend.repository.ApplicationRepository;
import com.vishnu.ai_job_portal_backend.repository.JobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RecruiterApplicationService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final ProfileService profileService;

    public RecruiterApplicationService(JobRepository jobRepository,
                                       ApplicationRepository applicationRepository,
                                       ProfileService profileService) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.profileService = profileService;
    }

    public List<RecruiterApplicantDTO> getJobApplications(String recruiterEmail, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        if (job.getPostedBy() == null || !job.getPostedBy().getEmail().equals(recruiterEmail)) {
            throw new RuntimeException("Unauthorized: You do not own this job posting");
        }

        List<Application> applications = applicationRepository.findByJobId(jobId);
        return applications.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public UserProfileDTO getCandidateProfileForApplication(String recruiterEmail, Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found: " + applicationId));

        Job job = application.getJob();
        if (job.getPostedBy() == null || !job.getPostedBy().getEmail().equals(recruiterEmail)) {
            throw new RuntimeException("Unauthorized: You do not own the job for this application");
        }

        String candidateEmail = application.getEmail();
        return profileService.getProfileByUserEmail(candidateEmail);
    }

    public RecruiterApplicantDTO updateApplicationStatus(String recruiterEmail, Long applicationId, String statusStr) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found: " + applicationId));

        Job job = application.getJob();
        if (job.getPostedBy() == null || !job.getPostedBy().getEmail().equals(recruiterEmail)) {
            throw new RuntimeException("Unauthorized: You do not own the job for this application");
        }

        ApplicationStatus status = ApplicationStatus.valueOf(statusStr.toUpperCase());
        application.setStatus(status);
        Application saved = applicationRepository.save(application);

        return mapToDTO(saved);
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
