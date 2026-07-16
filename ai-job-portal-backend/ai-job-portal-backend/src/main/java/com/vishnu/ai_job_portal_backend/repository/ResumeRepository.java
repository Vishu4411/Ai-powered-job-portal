package com.vishnu.ai_job_portal_backend.repository;

import com.vishnu.ai_job_portal_backend.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
}
