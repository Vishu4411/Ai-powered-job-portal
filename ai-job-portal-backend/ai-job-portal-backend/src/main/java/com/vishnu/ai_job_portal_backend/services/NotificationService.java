package com.vishnu.ai_job_portal_backend.services;

import com.vishnu.ai_job_portal_backend.dto.NotificationDTO;
import com.vishnu.ai_job_portal_backend.entity.Application;
import com.vishnu.ai_job_portal_backend.entity.ApplicationStatus;
import com.vishnu.ai_job_portal_backend.entity.Job;
import com.vishnu.ai_job_portal_backend.entity.Notification;
import com.vishnu.ai_job_portal_backend.entity.User;
import com.vishnu.ai_job_portal_backend.repository.JobRepository;
import com.vishnu.ai_job_portal_backend.repository.NotificationRepository;
import com.vishnu.ai_job_portal_backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository,
                               JobRepository jobRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
    }

    public Notification createNotification(User user, String title, String message, String type) {
        if (user == null) return null;
        Notification notification = new Notification(user, title, message, type);
        return notificationRepository.save(notification);
    }

    public void notifyApplicationSubmitted(Application application) {
        if (application == null || application.getJob() == null) return;

        Job job = application.getJob();
        if (job.getId() != null) {
            job = jobRepository.findById(job.getId()).orElse(job);
        }
        String jobTitle = job.getTitle() != null ? job.getTitle() : "Job";


        // 1. Notify Candidate
        User candidate = application.getCandidate();
        if (candidate == null && application.getEmail() != null) {
            candidate = userRepository.findByEmail(application.getEmail()).orElse(null);
        }
        if (candidate != null) {
            createNotification(
                    candidate,
                    "Application Submitted",
                    "Your application for " + jobTitle + " has been submitted successfully.",
                    "APPLICATION_SUBMITTED"
            );
        }

        // 2. Notify Recruiter
        User recruiter = job.getPostedBy();
        if (recruiter != null) {
            String candidateName = application.getApplicantName() != null ? application.getApplicantName() : "A candidate";
            createNotification(
                    recruiter,
                    "New Job Application",
                    candidateName + " has applied for your " + jobTitle + " position.",
                    "NEW_APPLICANT"
            );
        }
    }

    public void notifyCandidateStatusChange(Application application, ApplicationStatus oldStatus, ApplicationStatus newStatus) {
        if (application == null || oldStatus == newStatus) return;

        User candidate = application.getCandidate();
        if (candidate == null && application.getEmail() != null) {
            candidate = userRepository.findByEmail(application.getEmail()).orElse(null);
        }
        if (candidate == null) return;

        Job job = application.getJob();
        if (job != null && job.getId() != null) {
            job = jobRepository.findById(job.getId()).orElse(job);
        }
        String jobTitle = (job != null && job.getTitle() != null) ? job.getTitle() : "Job";


        String title;
        String message;
        String type;

        if (newStatus == ApplicationStatus.SHORTLISTED) {
            title = "Application Shortlisted";
            message = "Your application for " + jobTitle + " has been shortlisted.";
            type = "APPLICATION_SHORTLISTED";
        } else if (newStatus == ApplicationStatus.INTERVIEW_SCHEDULED) {
            title = "Interview Scheduled";
            message = "Your application for " + jobTitle + " has been scheduled for an interview.";
            type = "INTERVIEW_SCHEDULED";
        } else if (newStatus == ApplicationStatus.REJECTED) {
            title = "Application Update";
            message = "Your application for " + jobTitle + " was not selected to move forward.";
            type = "APPLICATION_REJECTED";
        } else {
            title = "Application Status Update";
            message = "Your application status for " + jobTitle + " was updated to " + newStatus + ".";
            type = "APPLICATION_STATUS";
        }

        createNotification(candidate, title, message, type);
    }

    public List<NotificationDTO> getMyNotifications(String email) {
        List<Notification> list = notificationRepository.findByUserEmailOrderByCreatedAtDesc(email);
        return list.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<NotificationDTO> getUnreadNotifications(String email) {
        List<Notification> list = notificationRepository.findByUserEmailAndReadFalseOrderByCreatedAtDesc(email);
        return list.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public long getUnreadCount(String email) {
        return notificationRepository.countByUserEmailAndReadFalse(email);
    }

    public NotificationDTO markAsRead(Long notificationId, String email) {
        Notification notification = notificationRepository.findByIdAndUserEmail(notificationId, email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found or access denied"));

        notification.setRead(true);
        Notification saved = notificationRepository.save(notification);
        return mapToDTO(saved);
    }

    public void markAllAsRead(String email) {
        List<Notification> unreadList = notificationRepository.findByUserEmailAndReadFalseOrderByCreatedAtDesc(email);
        for (Notification n : unreadList) {
            n.setRead(true);
        }
        notificationRepository.saveAll(unreadList);
    }

    private NotificationDTO mapToDTO(Notification n) {
        return new NotificationDTO(
                n.getId(),
                n.getTitle(),
                n.getMessage(),
                n.getType(),
                n.isRead(),
                n.getCreatedAt()
        );
    }
}
