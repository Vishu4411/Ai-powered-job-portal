package com.vishnu.ai_job_portal_backend.services;

import com.vishnu.ai_job_portal_backend.dto.ATSResumeAnalysisDTO;
import com.vishnu.ai_job_portal_backend.dto.CareerActionPlanDTO;
import com.vishnu.ai_job_portal_backend.dto.CareerReadinessDTO;
import com.vishnu.ai_job_portal_backend.dto.UserProfileDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class CareerActionPlanEngine {

    private final CareerReadinessEngine readinessEngine;
    private final ATSScoringEngine atsScoringEngine;

    public CareerActionPlanEngine(CareerReadinessEngine readinessEngine, ATSScoringEngine atsScoringEngine) {
        this.readinessEngine = readinessEngine;
        this.atsScoringEngine = atsScoringEngine;
    }

    public CareerActionPlanDTO generateActionPlan(UserProfileDTO candidate) {
        CareerActionPlanDTO plan = new CareerActionPlanDTO();

        // 1. Calculate Authoritative Readiness & ATS Scores
        CareerReadinessDTO readiness = readinessEngine.calculateReadiness(candidate);
        ATSResumeAnalysisDTO atsAnalysis = atsScoringEngine.calculateATSScore(candidate);


        int overallReadiness = readiness.getOverallScore();
        plan.setOverallReadinessScore(overallReadiness);

        // 2. Deterministic Priority Level
        if (overallReadiness >= 80) {
            plan.setPriorityLevel("ON_TRACK");
        } else if (overallReadiness >= 65) {
            plan.setPriorityLevel("MODERATE");
        } else if (overallReadiness >= 45) {
            plan.setPriorityLevel("HIGH");
        } else {
            plan.setPriorityLevel("CRITICAL");
        }

        // 3. Deterministic Estimated Timeline
        if (overallReadiness >= 80) {
            plan.setEstimatedTimeline("Interview Ready");
        } else if (overallReadiness >= 65) {
            plan.setEstimatedTimeline("1–2 Weeks to Job Ready");
        } else if (overallReadiness >= 50) {
            plan.setEstimatedTimeline("2–3 Weeks to Job Ready");
        } else if (overallReadiness >= 35) {
            plan.setEstimatedTimeline("3–4 Weeks to Job Ready");
        } else {
            plan.setEstimatedTimeline("4+ Weeks to Job Ready");
        }

        // 4. Generate Concrete Action Tasks by Category
        List<CareerActionPlanDTO.ActionTask> skillTasks = generateSkillTasks(readiness, candidate);
        List<CareerActionPlanDTO.ActionTask> resumeTasks = generateResumeTasks(readiness, atsAnalysis, candidate);
        List<CareerActionPlanDTO.ActionTask> projectTasks = generateProjectTasks(readiness, candidate);
        List<CareerActionPlanDTO.ActionTask> interviewTasks = generateInterviewTasks(readiness, candidate);

        plan.setSkillTasks(skillTasks);
        plan.setResumeTasks(resumeTasks);
        plan.setProjectTasks(projectTasks);
        plan.setInterviewTasks(interviewTasks);

        // 5. Determine Primary Next Best Action & Top Priority Focus
        determineNextBestActionAndFocus(readiness, atsAnalysis, plan);

        // 6. Generate 4-Week Structured Roadmap
        plan.setWeeklyRoadmap(generateWeeklyRoadmap(readiness, atsAnalysis, plan));

        // 7. Executive Summary Fallback
        plan.setExecutiveSummary(String.format(
                "Your overall readiness is %d%% (%s priority). Focus primarily on %s to accelerate your job readiness within %s.",
                overallReadiness,
                plan.getPriorityLevel().replace("_", " "),
                plan.getTopPriorityFocus().toLowerCase(),
                plan.getEstimatedTimeline()
        ));

        return plan;
    }

    private void determineNextBestActionAndFocus(CareerReadinessDTO readiness, ATSResumeAnalysisDTO atsAnalysis, CareerActionPlanDTO plan) {
        // Find lowest scoring readiness component
        int lowestScore = readiness.getProfileScore();
        String lowestArea = "Profile";

        if (readiness.getResumeATSScore() < lowestScore) {
            lowestScore = readiness.getResumeATSScore();
            lowestArea = "Resume & ATS";
        }
        if (readiness.getProjectsScore() < lowestScore) {
            lowestScore = readiness.getProjectsScore();
            lowestArea = "Portfolio Projects";
        }
        if (readiness.getExperienceScore() < lowestScore) {
            lowestScore = readiness.getExperienceScore();
            lowestArea = "Work Experience";
        }
        if (readiness.getSkillsScore() < lowestScore) {
            lowestScore = readiness.getSkillsScore();
            lowestArea = "Technical Skills";
        }

        if (lowestArea.equals("Portfolio Projects")) {
            plan.setTopPriorityFocus("Portfolio & Production Project Evidence");
            plan.setNextBestAction("Build a full-stack Spring Boot REST API project with MySQL, JWT authentication, and deploy on GitHub with live demonstration links.");
        } else if (lowestArea.equals("Resume & ATS") || lowestArea.equals("Profile")) {
            plan.setTopPriorityFocus("ATS Resume Optimization & Profile Completeness");
            plan.setNextBestAction("Upload your resume and complete missing profile details (LinkedIn, GitHub, Phone) to boost your ATS indexability score.");
        } else if (lowestArea.equals("Work Experience")) {
            plan.setTopPriorityFocus("Experience Impact & Quantifiable Accomplishments");
            plan.setNextBestAction("Add detailed work experience bullet points with quantifiable achievements (e.g., 'Improved API latency by 35%').");
        } else if (lowestArea.equals("Technical Skills")) {
            plan.setTopPriorityFocus("Core Technical Skills & Stack Coverage");
            plan.setNextBestAction("Add top relevant technical skills (Java, Spring Boot, React, MySQL, Microservices) to your profile.");
        } else {
            plan.setTopPriorityFocus("Interview Performance & Practice");
            plan.setNextBestAction("Complete 2 AI Mock Interview sessions using the STAR methodology for behavioral and technical questions.");
        }
    }

    private List<CareerActionPlanDTO.ActionTask> generateSkillTasks(CareerReadinessDTO readiness, UserProfileDTO candidate) {
        List<CareerActionPlanDTO.ActionTask> tasks = new ArrayList<>();
        String currentSkills = candidate != null && candidate.getSkills() != null ? candidate.getSkills() : "";

        if (readiness.getSkillsScore() < 100) {
            tasks.add(new CareerActionPlanDTO.ActionTask(
                    "SKILL-01",
                    "Skills",
                    "Add Top Technical Skills",
                    "Add core framework skills such as Microservices, Docker, Redis, and Cloud Architecture to your candidate profile.",
                    "HIGH",
                    "LOW_EFFORT"
            ));
        }

        if (!currentSkills.toLowerCase().contains("spring") && !currentSkills.toLowerCase().contains("react")) {
            tasks.add(new CareerActionPlanDTO.ActionTask(
                    "SKILL-02",
                    "Skills",
                    "Master Core Enterprise Frameworks",
                    "Practice Spring Boot backend development, REST API design, and React frontend integration.",
                    "HIGH",
                    "MODERATE"
            ));
        } else {
            tasks.add(new CareerActionPlanDTO.ActionTask(
                    "SKILL-03",
                    "Skills",
                    "Acquire Distributed System & Caching Knowledge",
                    "Learn Redis caching, Kafka messaging queues, and database indexing optimization.",
                    "MEDIUM",
                    "MODERATE"
            ));
        }

        return tasks;
    }

    private List<CareerActionPlanDTO.ActionTask> generateResumeTasks(CareerReadinessDTO readiness, ATSResumeAnalysisDTO atsAnalysis, UserProfileDTO candidate) {
        List<CareerActionPlanDTO.ActionTask> tasks = new ArrayList<>();

        if (readiness.getResumeATSScore() < 70) {
            tasks.add(new CareerActionPlanDTO.ActionTask(
                    "RES-01",
                    "Resume / ATS",
                    "Optimize ATS Resume Keywords",
                    "Align technical keywords in your resume with targeted job descriptions to boost your parser score above 75%.",
                    "HIGH",
                    "LOW_EFFORT"
            ));
        }

        if (candidate == null || candidate.getBio() == null || candidate.getBio().trim().isEmpty()) {
            tasks.add(new CareerActionPlanDTO.ActionTask(
                    "RES-02",
                    "Resume / ATS",
                    "Complete Professional Bio & Social Links",
                    "Add a 2-3 sentence professional elevator pitch, LinkedIn profile URL, and GitHub repository link.",
                    "HIGH",
                    "LOW_EFFORT"
            ));
        }

        tasks.add(new CareerActionPlanDTO.ActionTask(
                "RES-03",
                "Resume / ATS",
                "Format Quantifiable Work Experience Bullets",
                "Rewrite work experience bullets using the Action Verb + Context + Quantifiable Metric structure.",
                "MEDIUM",
                "MODERATE"
        ));

        return tasks;
    }

    private List<CareerActionPlanDTO.ActionTask> generateProjectTasks(CareerReadinessDTO readiness, UserProfileDTO candidate) {
        List<CareerActionPlanDTO.ActionTask> tasks = new ArrayList<>();

        if (readiness.getProjectsScore() < 80) {
            tasks.add(new CareerActionPlanDTO.ActionTask(
                    "PROJ-01",
                    "Projects",
                    "Build Production-Grade Full-Stack Project",
                    "Create a Spring Boot REST API backend + React frontend application with JWT authentication and database persistence.",
                    "HIGH",
                    "HIGH_EFFORT"
            ));
            tasks.add(new CareerActionPlanDTO.ActionTask(
                    "PROJ-02",
                    "Projects",
                    "Deploy Live Demo & Share GitHub Repository",
                    "Host your portfolio project live (e.g. Render/Vercel) and provide public GitHub repository links on your profile.",
                    "HIGH",
                    "MODERATE"
            ));
        } else {
            tasks.add(new CareerActionPlanDTO.ActionTask(
                    "PROJ-03",
                    "Projects",
                    "Enhance Microservice Architecture & Performance",
                    "Add Redis caching, Docker containerization, and unit tests to your existing portfolio projects.",
                    "MEDIUM",
                    "MODERATE"
            ));
        }

        return tasks;
    }

    private List<CareerActionPlanDTO.ActionTask> generateInterviewTasks(CareerReadinessDTO readiness, UserProfileDTO candidate) {
        List<CareerActionPlanDTO.ActionTask> tasks = new ArrayList<>();

        tasks.add(new CareerActionPlanDTO.ActionTask(
                "INT-01",
                "Interview",
                "Complete AI Mock Interview Session",
                "Practice 5 technical and behavioral interview questions using the AI Mock Interview Simulator.",
                "HIGH",
                "LOW_EFFORT"
        ));

        tasks.add(new CareerActionPlanDTO.ActionTask(
                "INT-02",
                "Interview",
                "Refine Behavioral Responses Using STAR Method",
                "Format past project challenge stories using Situation, Task, Action, and Result with concrete metrics.",
                "MEDIUM",
                "MODERATE"
        ));

        return tasks;
    }

    private List<CareerActionPlanDTO.WeeklyMilestone> generateWeeklyRoadmap(CareerReadinessDTO readiness, ATSResumeAnalysisDTO atsAnalysis, CareerActionPlanDTO plan) {
        List<CareerActionPlanDTO.WeeklyMilestone> roadmap = new ArrayList<>();

        // Week 1: Immediate Profile & Resume Optimization
        roadmap.add(new CareerActionPlanDTO.WeeklyMilestone(
                1,
                "Immediate Profile & Resume Alignment",
                "Resume & ATS Optimization",
                Arrays.asList(
                        "Upload latest PDF resume for ATS parsing.",
                        "Add LinkedIn, GitHub, and professional bio to profile.",
                        "Align top technical skills with target job postings."
                )
        ));

        // Week 2: Core Technical Skill & Framework Mastery
        roadmap.add(new CareerActionPlanDTO.WeeklyMilestone(
                2,
                "Technical Skill & Core Framework Focus",
                "Skill Gap Closure",
                Arrays.asList(
                        "Practice core Spring Boot, REST API, and React state management.",
                        "Study database indexing, SQL query optimization, and caching strategies."
                )
        ));

        // Week 3: Portfolio Project & Experience Evidence
        roadmap.add(new CareerActionPlanDTO.WeeklyMilestone(
                3,
                "Full-Stack Portfolio Project Build",
                "Project & Experience Evidence",
                Arrays.asList(
                        "Build or enhance a full-stack Spring Boot + React application.",
                        "Publish repository to GitHub with documentation and live demo link."
                )
        ));

        // Week 4: AI Mock Interview Practice & Applications
        roadmap.add(new CareerActionPlanDTO.WeeklyMilestone(
                4,
                "Mock Interview Simulation & Job Applications",
                "Interview Practice & Applications",
                Arrays.asList(
                        "Complete 2 AI Mock Interview practice sessions.",
                        "Submit targeted applications to recommended high-match jobs."
                )
        ));

        return roadmap;
    }
}
