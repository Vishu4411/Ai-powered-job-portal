package com.vishnu.ai_job_portal_backend.services;

import com.vishnu.ai_job_portal_backend.dto.RecruiterDashboardDTO;
import com.vishnu.ai_job_portal_backend.dto.RecruiterJobDTO;
import com.vishnu.ai_job_portal_backend.entity.*;
import com.vishnu.ai_job_portal_backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class RecruiterJobService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;

    public RecruiterJobService(UserRepository userRepository,
                               JobRepository jobRepository,
                               ApplicationRepository applicationRepository,
                               RecruiterProfileRepository recruiterProfileRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
    }

    public List<RecruiterJobDTO> getRecruiterJobs(String email) {
        List<Job> jobs = jobRepository.findByPostedByEmail(email);
        return jobs.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public RecruiterJobDTO createJob(String email, RecruiterJobDTO dto) {
        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Recruiter not found: " + email));

        Optional<RecruiterProfile> profileOpt = recruiterProfileRepository.findByUserEmail(email);

        Job job = new Job();
        job.setTitle(dto.getTitle());
        job.setLocation(dto.getLocation());
        job.setSalary(dto.getSalary());
        job.setExperience(dto.getExperience());
        job.setJobType(dto.getJobType());
        job.setDescription(dto.getDescription());
        job.setSkills(dto.getSkills());
        job.setPostedBy(recruiter);
        job.setStatus(dto.getStatus() != null ? JobStatus.valueOf(dto.getStatus()) : JobStatus.OPEN);

        if (profileOpt.isPresent() && profileOpt.get().getCompany() != null) {
            Company company = profileOpt.get().getCompany();
            job.setCompanyEntity(company);
            job.setCompany(company.getCompanyName());
        } else {
            job.setCompany(dto.getCompany() != null ? dto.getCompany() : "Company");
        }

        Job saved = jobRepository.save(job);
        return mapToDTO(saved);
    }

    public RecruiterJobDTO updateJob(String email, Long id, RecruiterJobDTO dto) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found: " + id));

        if (job.getPostedBy() == null || !job.getPostedBy().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized: You do not own this job posting");
        }

        job.setTitle(dto.getTitle());
        job.setLocation(dto.getLocation());
        job.setSalary(dto.getSalary());
        job.setExperience(dto.getExperience());
        job.setJobType(dto.getJobType());
        job.setDescription(dto.getDescription());
        job.setSkills(dto.getSkills());

        if (dto.getCompany() != null) {
            job.setCompany(dto.getCompany());
        }
        if (dto.getStatus() != null) {
            job.setStatus(JobStatus.valueOf(dto.getStatus()));
        }

        Job saved = jobRepository.save(job);
        return mapToDTO(saved);
    }

    public void deleteJob(String email, Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found: " + id));

        if (job.getPostedBy() == null || !job.getPostedBy().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized: You do not own this job posting");
        }

        jobRepository.delete(job);
    }

    public RecruiterDashboardDTO getRecruiterDashboardStats(String email) {
        long totalJobs = jobRepository.countByPostedByEmail(email);
        long activeJobs = jobRepository.countByPostedByEmailAndStatus(email, JobStatus.OPEN);
        long applicationsReceived = applicationRepository.countByJobPostedByEmail(email);
        long shortlisted = applicationRepository.countByJobPostedByEmailAndStatus(email, ApplicationStatus.SHORTLISTED);
        long pendingReview = applicationRepository.countByJobPostedByEmailAndStatus(email, ApplicationStatus.APPLIED);

        return new RecruiterDashboardDTO(activeJobs, totalJobs, applicationsReceived, shortlisted, pendingReview);
    }

    private RecruiterJobDTO mapToDTO(Job job) {
        RecruiterJobDTO dto = new RecruiterJobDTO();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setCompany(job.getCompany());
        dto.setCompanyId(job.getCompanyEntity() != null ? job.getCompanyEntity().getId() : null);
        dto.setLocation(job.getLocation());
        dto.setSalary(job.getSalary());
        dto.setExperience(job.getExperience());
        dto.setJobType(job.getJobType());
        dto.setDescription(job.getDescription());
        dto.setSkills(job.getSkills());
        dto.setStatus(job.getStatus() != null ? job.getStatus().name() : "OPEN");
        dto.setCreatedAt(job.getCreatedAt());
        dto.setApplicantCount(applicationRepository.findByJobId(job.getId()).size());
        return dto;
    }
}
