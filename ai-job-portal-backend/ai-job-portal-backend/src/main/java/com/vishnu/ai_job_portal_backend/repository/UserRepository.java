package com.vishnu.ai_job_portal_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vishnu.ai_job_portal_backend.entity.User;

public interface UserRepository extends JpaRepository<User,Long>{

    Optional<User> findByEmail(String email);

}