package com.vishnu.ai_job_portal_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vishnu.ai_job_portal_backend.entity.Application;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByEmail(String email);

    boolean existsByEmailAndJob_Id(String email, Long jobId);
}