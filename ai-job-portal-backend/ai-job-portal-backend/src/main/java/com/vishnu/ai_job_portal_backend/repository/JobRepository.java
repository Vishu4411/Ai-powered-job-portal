package com.vishnu.ai_job_portal_backend.repository;

import com.vishnu.ai_job_portal_backend.entity.Job;
import com.vishnu.ai_job_portal_backend.entity.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByPostedByEmail(String email);
    List<Job> findByCompanyEntityId(Long companyId);
    long countByPostedByEmailAndStatus(String email, JobStatus status);
    long countByPostedByEmail(String email);
}