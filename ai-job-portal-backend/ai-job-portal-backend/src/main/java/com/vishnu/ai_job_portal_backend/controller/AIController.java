package com.vishnu.ai_job_portal_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai")
public class AIController {

    @GetMapping
    public String ai() {
        return "AI endpoint ready";
    }
}
