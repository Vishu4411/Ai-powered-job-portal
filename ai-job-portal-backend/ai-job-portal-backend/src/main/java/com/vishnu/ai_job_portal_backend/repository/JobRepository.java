package com.vishnu.ai_job_portal_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vishnu.ai_job_portal_backend.entity.Job;

public interface JobRepository extends JpaRepository<Job, Long> {
}