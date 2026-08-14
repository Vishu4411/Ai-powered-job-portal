package com.vishnu.ai_job_portal_backend.repository;

import com.vishnu.ai_job_portal_backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserEmailOrderByCreatedAtDesc(String email);

    List<Notification> findByUserEmailAndReadFalseOrderByCreatedAtDesc(String email);

    long countByUserEmailAndReadFalse(String email);

    Optional<Notification> findByIdAndUserEmail(Long id, String email);
}
