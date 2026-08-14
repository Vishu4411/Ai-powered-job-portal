package com.vishnu.ai_job_portal_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String company; // String company name retained for backward compatibility

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company companyEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "posted_by_user_id")
    private User postedBy;

    private String location;

    private String salary;

    private String experience;

    @Column(name = "job_type")
    private String jobType;

    private String description;

    private String skills;

    @Enumerated(EnumType.STRING)
    private JobStatus status = JobStatus.OPEN;

    private LocalDateTime createdAt = LocalDateTime.now();
}