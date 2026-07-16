package com.vishnu.ai_job_portal_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/resume")
public class ResumeController {

    @GetMapping
    public String resume() {
        return "Resume endpoint ready";
    }
}
