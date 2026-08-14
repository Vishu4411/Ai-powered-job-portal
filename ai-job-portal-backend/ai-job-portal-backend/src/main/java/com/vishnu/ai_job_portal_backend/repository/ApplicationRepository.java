package com.vishnu.ai_job_portal_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vishnu.ai_job_portal_backend.entity.Application;
import com.vishnu.ai_job_portal_backend.entity.ApplicationStatus;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByEmail(String email);

    List<Application> findByEmailAndStatus(String email, ApplicationStatus status);

    boolean existsByEmailAndJob_Id(String email, Long jobId);


    List<Application> findByJobId(Long jobId);

    List<Application> findByJobPostedByEmail(String email);

    long countByJobPostedByEmail(String email);

    long countByJobPostedByEmailAndStatus(String email, ApplicationStatus status);
}