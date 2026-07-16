package com.vishnu.ai_job_portal_backend.controller;

import java.util.Optional;

import org.springframework.web.bind.annotation.*;

import com.vishnu.ai_job_portal_backend.dto.LoginRequest;
import com.vishnu.ai_job_portal_backend.dto.SignupRequest;
import com.vishnu.ai_job_portal_backend.entity.Role;
import com.vishnu.ai_job_portal_backend.entity.User;
import com.vishnu.ai_job_portal_backend.repository.UserRepository;
import com.vishnu.ai_job_portal_backend.dto.LoginResponse;
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // -------------------- SIGNUP --------------------

    @PostMapping("/signup")
    public String signup(@RequestBody SignupRequest request) {

        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already registered";
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(Role.USER);

        userRepository.save(user);

        return "Signup Successful";
    }

    // -------------------- LOGIN --------------------

   @PostMapping("/login")
public LoginResponse login(@RequestBody LoginRequest request) {

    Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

    if (optionalUser.isEmpty()) {
        throw new RuntimeException("User Not Found");
    }

    User user = optionalUser.get();

    if (!user.getPassword().equals(request.getPassword())) {
        throw new RuntimeException("Invalid Password");
    }

    return new LoginResponse(
            user.getFullName(),
            user.getEmail(),
            user.getRole().name()
    );
}
}