package com.vishnu.ai_job_portal_backend.repository;

import com.vishnu.ai_job_portal_backend.entity.UserProject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProjectRepository extends JpaRepository<UserProject, Long> {
}
