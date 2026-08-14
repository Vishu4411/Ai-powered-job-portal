package com.vishnu.ai_job_portal_backend.controller;

import com.vishnu.ai_job_portal_backend.dto.UserProfileDTO;
import com.vishnu.ai_job_portal_backend.services.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users/resume")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ResumeController {

    private final ProfileService profileService;

    public ResumeController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<UserProfileDTO> getMyResume(Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO profile = profileService.getProfileByUserEmail(email);
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    public ResponseEntity<UserProfileDTO> updateMyResume(@RequestBody UserProfileDTO dto,
                                                          Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO updated = profileService.updateProfile(email, dto);
        return ResponseEntity.ok(updated);
    }
}

