package com.vishnu.ai_job_portal_backend.repository;

import com.vishnu.ai_job_portal_backend.entity.RecruiterProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecruiterProfileRepository extends JpaRepository<RecruiterProfile, Long> {
    Optional<RecruiterProfile> findByUserEmail(String email);
    Optional<RecruiterProfile> findByUserId(Long userId);
}
