package com.vishnu.ai_job_portal_backend.config;

public class JwtUtil {

    public String generateToken(String username) {
        return "jwt-token-for-" + username;
    }

    public boolean validateToken(String token) {
        return token != null && token.startsWith("jwt-token");
    }
}
