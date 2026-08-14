package com.vishnu.ai_job_portal_backend.services;

import com.vishnu.ai_job_portal_backend.dto.*;
import com.vishnu.ai_job_portal_backend.entity.*;
import com.vishnu.ai_job_portal_backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProfileService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserEducationRepository educationRepository;
    private final UserExperienceRepository experienceRepository;
    private final UserProjectRepository projectRepository;
    private final UserCertificationRepository certificationRepository;

    public ProfileService(UserRepository userRepository,
                          UserProfileRepository userProfileRepository,
                          UserEducationRepository educationRepository,
                          UserExperienceRepository experienceRepository,
                          UserProjectRepository projectRepository,
                          UserCertificationRepository certificationRepository) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.educationRepository = educationRepository;
        this.experienceRepository = experienceRepository;
        this.projectRepository = projectRepository;
        this.certificationRepository = certificationRepository;
    }

    public UserProfileDTO getProfileByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        Optional<UserProfile> profileOpt = userProfileRepository.findByUserEmail(email);

        if (profileOpt.isEmpty()) {
            UserProfileDTO defaultDto = new UserProfileDTO();
            defaultDto.setFullName(user.getFullName());
            defaultDto.setEmail(user.getEmail());
            defaultDto.setRole(user.getRole() != null ? user.getRole().name() : "ROLE_USER");
            defaultDto.setCompletionPercentage(calculateCompletionPercentage(null, user));
            return defaultDto;
        }

        return mapToDTO(profileOpt.get());
    }

    public UserProfileDTO updateProfile(String email, UserProfileDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        UserProfile profile = userProfileRepository.findByUserEmail(email)
                .orElseGet(() -> {
                    UserProfile p = new UserProfile();
                    p.setUser(user);
                    return p;
                });

        profile.setHeadline(dto.getHeadline());
        profile.setPhone(dto.getPhone());
        profile.setLocation(dto.getLocation());
        profile.setBio(dto.getBio());
        profile.setSkills(dto.getSkills());
        profile.setLinkedinUrl(dto.getLinkedinUrl());
        profile.setGithubUrl(dto.getGithubUrl());
        profile.setPortfolioUrl(dto.getPortfolioUrl());

        if (dto.getResumeUrl() != null) {
            profile.setResumeUrl(dto.getResumeUrl());
        }
        if (dto.getResumeFileName() != null) {
            profile.setResumeFileName(dto.getResumeFileName());
        }

        UserProfile saved = userProfileRepository.save(profile);
        return mapToDTO(saved);
    }

    public UserProfileDTO addEducation(String email, EducationDTO dto) {
        UserProfile profile = getOrCreateProfileEntity(email);

        UserEducation education = new UserEducation();
        education.setProfile(profile);
        education.setInstitution(dto.getInstitution());
        education.setDegree(dto.getDegree());
        education.setFieldOfStudy(dto.getFieldOfStudy());
        education.setStartDate(dto.getStartDate());
        education.setEndDate(dto.getEndDate());
        education.setGrade(dto.getGrade());

        educationRepository.save(education);
        return getProfileByUserEmail(email);
    }

    public UserProfileDTO deleteEducation(String email, Long id) {
        UserEducation education = educationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Education record not found"));

        if (!education.getProfile().getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized to modify this profile resource");
        }

        educationRepository.delete(education);
        return getProfileByUserEmail(email);
    }

    public UserProfileDTO addExperience(String email, ExperienceDTO dto) {
        UserProfile profile = getOrCreateProfileEntity(email);

        UserExperience experience = new UserExperience();
        experience.setProfile(profile);
        experience.setCompany(dto.getCompany());
        experience.setPosition(dto.getPosition());
        experience.setLocation(dto.getLocation());
        experience.setStartDate(dto.getStartDate());
        experience.setEndDate(dto.getEndDate());
        experience.setCurrent(dto.isCurrent());
        experience.setDescription(dto.getDescription());

        experienceRepository.save(experience);
        return getProfileByUserEmail(email);
    }

    public UserProfileDTO deleteExperience(String email, Long id) {
        UserExperience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Experience record not found"));

        if (!experience.getProfile().getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized to modify this profile resource");
        }

        experienceRepository.delete(experience);
        return getProfileByUserEmail(email);
    }

    public UserProfileDTO addProject(String email, ProjectDTO dto) {
        UserProfile profile = getOrCreateProfileEntity(email);

        UserProject project = new UserProject();
        project.setProfile(profile);
        project.setTitle(dto.getTitle());
        project.setDescription(dto.getDescription());
        project.setTechStack(dto.getTechStack());
        project.setProjectUrl(dto.getProjectUrl());

        projectRepository.save(project);
        return getProfileByUserEmail(email);
    }

    public UserProfileDTO deleteProject(String email, Long id) {
        UserProject project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project record not found"));

        if (!project.getProfile().getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized to modify this profile resource");
        }

        projectRepository.delete(project);
        return getProfileByUserEmail(email);
    }

    public UserProfileDTO addCertification(String email, CertificationDTO dto) {
        UserProfile profile = getOrCreateProfileEntity(email);

        UserCertification cert = new UserCertification();
        cert.setProfile(profile);
        cert.setName(dto.getName());
        cert.setIssuingOrganization(dto.getIssuingOrganization());
        cert.setIssueDate(dto.getIssueDate());
        cert.setCredentialUrl(dto.getCredentialUrl());

        certificationRepository.save(cert);
        return getProfileByUserEmail(email);
    }

    public UserProfileDTO deleteCertification(String email, Long id) {
        UserCertification cert = certificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certification record not found"));

        if (!cert.getProfile().getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized to modify this profile resource");
        }

        certificationRepository.delete(cert);
        return getProfileByUserEmail(email);
    }

    private UserProfile getOrCreateProfileEntity(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        return userProfileRepository.findByUserEmail(email)
                .orElseGet(() -> {
                    UserProfile p = new UserProfile();
                    p.setUser(user);
                    return userProfileRepository.save(p);
                });
    }

    private UserProfileDTO mapToDTO(UserProfile profile) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(profile.getId());
        dto.setFullName(profile.getUser().getFullName());
        dto.setEmail(profile.getUser().getEmail());
        dto.setRole(profile.getUser().getRole() != null ? profile.getUser().getRole().name() : "ROLE_USER");
        dto.setHeadline(profile.getHeadline());
        dto.setPhone(profile.getPhone());
        dto.setLocation(profile.getLocation());
        dto.setBio(profile.getBio());
        dto.setSkills(profile.getSkills());
        dto.setLinkedinUrl(profile.getLinkedinUrl());
        dto.setGithubUrl(profile.getGithubUrl());
        dto.setPortfolioUrl(profile.getPortfolioUrl());
        dto.setResumeUrl(profile.getResumeUrl());
        dto.setResumeFileName(profile.getResumeFileName());

        List<EducationDTO> eduList = profile.getEducationList().stream().map(e -> {
            EducationDTO d = new EducationDTO();
            d.setId(e.getId());
            d.setInstitution(e.getInstitution());
            d.setDegree(e.getDegree());
            d.setFieldOfStudy(e.getFieldOfStudy());
            d.setStartDate(e.getStartDate());
            d.setEndDate(e.getEndDate());
            d.setGrade(e.getGrade());
            return d;
        }).collect(Collectors.toList());
        dto.setEducationList(eduList);

        List<ExperienceDTO> expList = profile.getExperienceList().stream().map(e -> {
            ExperienceDTO d = new ExperienceDTO();
            d.setId(e.getId());
            d.setCompany(e.getCompany());
            d.setPosition(e.getPosition());
            d.setLocation(e.getLocation());
            d.setStartDate(e.getStartDate());
            d.setEndDate(e.getEndDate());
            d.setCurrent(e.isCurrent());
            d.setDescription(e.getDescription());
            return d;
        }).collect(Collectors.toList());
        dto.setExperienceList(expList);

        List<ProjectDTO> projList = profile.getProjectList().stream().map(p -> {
            ProjectDTO d = new ProjectDTO();
            d.setId(p.getId());
            d.setTitle(p.getTitle());
            d.setDescription(p.getDescription());
            d.setTechStack(p.getTechStack());
            d.setProjectUrl(p.getProjectUrl());
            return d;
        }).collect(Collectors.toList());
        dto.setProjectList(projList);

        List<CertificationDTO> certList = profile.getCertificationList().stream().map(c -> {
            CertificationDTO d = new CertificationDTO();
            d.setId(c.getId());
            d.setName(c.getName());
            d.setIssuingOrganization(c.getIssuingOrganization());
            d.setIssueDate(c.getIssueDate());
            d.setCredentialUrl(c.getCredentialUrl());
            return d;
        }).collect(Collectors.toList());
        dto.setCertificationList(certList);

        dto.setCompletionPercentage(calculateCompletionPercentage(profile, profile.getUser()));
        return dto;
    }

    private int calculateCompletionPercentage(UserProfile profile, User user) {
        int score = 15; // Base score for account registration
        if (profile == null) return score;

        if (profile.getHeadline() != null && !profile.getHeadline().trim().isEmpty()) score += 10;
        if (profile.getPhone() != null && !profile.getPhone().trim().isEmpty()) score += 10;
        if (profile.getLocation() != null && !profile.getLocation().trim().isEmpty()) score += 10;
        if (profile.getBio() != null && !profile.getBio().trim().isEmpty()) score += 15;
        if (profile.getSkills() != null && !profile.getSkills().trim().isEmpty()) score += 15;
        if (profile.getEducationList() != null && !profile.getEducationList().isEmpty()) score += 15;
        if ((profile.getExperienceList() != null && !profile.getExperienceList().isEmpty()) ||
            (profile.getProjectList() != null && !profile.getProjectList().isEmpty())) score += 10;

        return Math.min(score, 100);
    }
}
