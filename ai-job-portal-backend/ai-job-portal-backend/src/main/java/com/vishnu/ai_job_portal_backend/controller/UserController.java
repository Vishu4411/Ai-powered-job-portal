package com.vishnu.ai_job_portal_backend.controller;

import com.vishnu.ai_job_portal_backend.dto.*;
import com.vishnu.ai_job_portal_backend.services.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class UserController {

    private final ProfileService profileService;

    public UserController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public String users() {
        return "Users endpoint ready";
    }

    // -------------------- PROFILE ENDPOINTS --------------------

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getProfile(Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO profile = profileService.getProfileByUserEmail(email);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(@RequestBody UserProfileDTO dto,
                                                        Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO updated = profileService.updateProfile(email, dto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/profile/education")
    public ResponseEntity<UserProfileDTO> addEducation(@RequestBody EducationDTO dto,
                                                       Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO updated = profileService.addEducation(email, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/profile/education/{id}")
    public ResponseEntity<UserProfileDTO> deleteEducation(@PathVariable Long id,
                                                          Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO updated = profileService.deleteEducation(email, id);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/profile/experience")
    public ResponseEntity<UserProfileDTO> addExperience(@RequestBody ExperienceDTO dto,
                                                        Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO updated = profileService.addExperience(email, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/profile/experience/{id}")
    public ResponseEntity<UserProfileDTO> deleteExperience(@PathVariable Long id,
                                                           Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO updated = profileService.deleteExperience(email, id);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/profile/projects")
    public ResponseEntity<UserProfileDTO> addProject(@RequestBody ProjectDTO dto,
                                                     Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO updated = profileService.addProject(email, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/profile/projects/{id}")
    public ResponseEntity<UserProfileDTO> deleteProject(@PathVariable Long id,
                                                        Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO updated = profileService.deleteProject(email, id);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/profile/certifications")
    public ResponseEntity<UserProfileDTO> addCertification(@RequestBody CertificationDTO dto,
                                                            Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO updated = profileService.addCertification(email, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/profile/certifications/{id}")
    public ResponseEntity<UserProfileDTO> deleteCertification(@PathVariable Long id,
                                                               Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO updated = profileService.deleteCertification(email, id);
        return ResponseEntity.ok(updated);
    }
}

