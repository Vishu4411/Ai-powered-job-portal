package com.vishnu.ai_job_portal_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.http.HttpStatus;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .exceptionHandling(ex -> ex.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**", "/error").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/jobs/**").permitAll()
                        .requestMatchers("/recruiter/**").hasAnyAuthority("ROLE_RECRUITER", "ROLE_ADMIN")
                        .requestMatchers("/ai/recruiter/**").hasAnyAuthority("ROLE_RECRUITER", "ROLE_ADMIN")
                        .requestMatchers("/companies/**").hasAnyAuthority("ROLE_RECRUITER", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/jobs/*/apply").authenticated()
                        .requestMatchers("/notifications/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/jobs/**").hasAnyAuthority("ROLE_RECRUITER", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/jobs/**").hasAnyAuthority("ROLE_RECRUITER", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/jobs/**").hasAnyAuthority("ROLE_RECRUITER", "ROLE_ADMIN")
                        .anyRequest().authenticated())




                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}



