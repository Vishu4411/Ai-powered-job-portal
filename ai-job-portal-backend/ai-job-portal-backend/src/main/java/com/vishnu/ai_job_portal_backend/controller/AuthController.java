package com.vishnu.ai_job_portal_backend.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vishnu.ai_job_portal_backend.config.JwtUtil;
import com.vishnu.ai_job_portal_backend.dto.LoginRequest;
import com.vishnu.ai_job_portal_backend.dto.LoginResponse;
import com.vishnu.ai_job_portal_backend.dto.SignupRequest;
import com.vishnu.ai_job_portal_backend.entity.Role;
import com.vishnu.ai_job_portal_backend.entity.User;
import com.vishnu.ai_job_portal_backend.repository.UserRepository;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // -------------------- SIGNUP --------------------

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Allow ROLE_USER or ROLE_RECRUITER registration while strictly blocking ROLE_ADMIN escalation
        if (request.getRole() != null && (request.getRole().equalsIgnoreCase("ROLE_RECRUITER") || request.getRole().equalsIgnoreCase("RECRUITER"))) {
            user.setRole(Role.ROLE_RECRUITER);
        } else {
            user.setRole(Role.ROLE_USER);
        }

        userRepository.save(user);

        return ResponseEntity.ok("Signup Successful");
    }

    // -------------------- LOGIN --------------------

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        User user = optionalUser.get();

        // Enforce strict BCrypt password matching
        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!passwordMatches) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        String roleName = user.getRole() != null ? user.getRole().name() : "ROLE_USER";
        String token = jwtUtil.generateToken(user.getEmail(), roleName);

        LoginResponse response = new LoginResponse(
                token,
                user.getFullName(),
                user.getEmail(),
                roleName
        );

        return ResponseEntity.ok(response);
    }
}
