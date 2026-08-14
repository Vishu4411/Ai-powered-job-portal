package com.vishnu.ai_job_portal_backend.repository;

import com.vishnu.ai_job_portal_backend.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUserEmail(String email);
    Optional<UserProfile> findByUserId(Long userId);
}
