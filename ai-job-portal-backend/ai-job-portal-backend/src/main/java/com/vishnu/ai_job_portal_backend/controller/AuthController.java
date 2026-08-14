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

        String rawEmail = request.getEmail() != null ? request.getEmail().trim() : "";
        if (rawEmail.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is required");
        }

        if (userRepository.findByEmail(rawEmail).isPresent() || userRepository.findByEmail(rawEmail.toLowerCase()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName() != null ? request.getFullName().trim() : "");
        user.setEmail(rawEmail);
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

        String rawEmail = request.getEmail() != null ? request.getEmail().trim() : "";
        Optional<User> optionalUser = userRepository.findByEmail(rawEmail);
        if (optionalUser.isEmpty()) {
            optionalUser = userRepository.findByEmail(rawEmail.toLowerCase());
        }

        System.out.println("LOGIN EMAIL RECEIVED = [" + rawEmail + "]");
        System.out.println("USER FOUND = " + optionalUser.isPresent());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        User user = optionalUser.get();

        System.out.println("USER EMAIL IN DB = [" + user.getEmail() + "]");
        System.out.println("USER ROLE = " + user.getRole());
        System.out.println("PASSWORD HASH PRESENT = " +
                (user.getPassword() != null && !user.getPassword().isBlank()));
        System.out.println("PASSWORD HASH LENGTH = " +
                (user.getPassword() != null ? user.getPassword().length() : 0));

        boolean passwordMatches = false;
        if (user.getPassword() != null && (user.getPassword().startsWith("$2a$") || user.getPassword().startsWith("$2b$"))) {
            passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        } else if (user.getPassword() != null && user.getPassword().equals(request.getPassword())) {
            // Auto-upgrade legacy unhashed password to BCrypt hash in MySQL
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            userRepository.save(user);
            passwordMatches = true;
        }

        System.out.println("PASSWORD MATCHES = " + passwordMatches);

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
