package com.vishnu.ai_job_portal_backend.repository;

import com.vishnu.ai_job_portal_backend.entity.UserCertification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCertificationRepository extends JpaRepository<UserCertification, Long> {
}
