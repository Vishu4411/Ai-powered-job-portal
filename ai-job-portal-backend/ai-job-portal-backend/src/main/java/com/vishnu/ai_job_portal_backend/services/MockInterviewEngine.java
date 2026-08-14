package com.vishnu.ai_job_portal_backend.services;

import com.vishnu.ai_job_portal_backend.dto.MockInterviewFeedbackDTO;
import com.vishnu.ai_job_portal_backend.dto.MockInterviewSessionDTO;
import com.vishnu.ai_job_portal_backend.dto.MockInterviewSubmissionDTO;
import com.vishnu.ai_job_portal_backend.dto.UserProfileDTO;
import com.vishnu.ai_job_portal_backend.entity.Job;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class MockInterviewEngine {

    public MockInterviewSessionDTO generateSession(UserProfileDTO candidate, Job job) {
        MockInterviewSessionDTO session = new MockInterviewSessionDTO();

        if (job != null) {
            session.setJobId(job.getId());
            session.setJobTitle(job.getTitle());
            session.setCompany(job.getCompanyEntity() != null ? job.getCompanyEntity().getCompanyName() : job.getCompany());
        } else {
            session.setJobTitle("General Software Engineer");
            session.setCompany("Career Compass Target Role");
        }

        if (candidate != null) {
            session.setCandidateName(candidate.getHeadline() != null ? candidate.getHeadline() : "Candidate");
            session.setCandidateSkills(candidate.getSkills() != null ? candidate.getSkills() : "Java, Spring Boot, React, MySQL");
        } else {
            session.setCandidateSkills("Java, Spring Boot, React, SQL");
        }

        String primarySkill = getPrimarySkill(candidate, job);
        String jobTitle = session.getJobTitle();

        List<MockInterviewSessionDTO.QuestionDTO> questions = new ArrayList<>();

        // Question 1: System Architecture & Design
        questions.add(new MockInterviewSessionDTO.QuestionDTO(
                1,
                String.format("Walk us through how you would architect a high-scale microservices system for a %s role using %s.", jobTitle, primarySkill),
                "System Architecture",
                "Mention key architectural principles, API gateways, database partitioning, and scalability strategies."
        ));

        // Question 2: Technical Deep-Dive
        questions.add(new MockInterviewSessionDTO.QuestionDTO(
                2,
                String.format("How do you handle concurrency, caching, and performance optimization when developing services with %s?", primarySkill),
                "Technical Execution",
                "Discuss thread safety, Redis/in-memory caching, indexing, and bottleneck resolution."
        ));

        // Question 3: Behavioral / Problem Solving (STAR Method)
        questions.add(new MockInterviewSessionDTO.QuestionDTO(
                3,
                "Describe a complex production issue or bug you encountered in a recent project. How did you diagnose and resolve it?",
                "Behavioral & Problem Solving",
                "Use the STAR method: Situation, Task, Action, and Result with quantifiable impact."
        ));

        // Question 4: Technical Quality & Security
        questions.add(new MockInterviewSessionDTO.QuestionDTO(
                4,
                "What strategies and tools do you use to ensure code quality, automated testing, and secure API design?",
                "Code Quality & Security",
                "Highlight unit/integration testing, CI/CD pipelines, JWT authentication, and OWASP security practices."
        ));

        // Question 5: Stakeholder & Team Collaboration
        questions.add(new MockInterviewSessionDTO.QuestionDTO(
                5,
                "How do you prioritize technical debt versus delivering new business features when collaborating with product managers?",
                "Collaboration & Leadership",
                "Explain communication techniques, trade-off analysis, and metrics used to justify technical refactoring."
        ));

        session.setQuestions(questions);
        return session;
    }

    public MockInterviewFeedbackDTO evaluateSubmission(UserProfileDTO candidate, Job job, MockInterviewSubmissionDTO submission) {
        MockInterviewFeedbackDTO feedback = new MockInterviewFeedbackDTO();

        if (submission == null || submission.getAnswers() == null || submission.getAnswers().isEmpty()) {
            feedback.setOverallScore(0);
            feedback.setTechnicalAccuracyScore(0);
            feedback.setCompletenessScore(0);
            feedback.setCommunicationScore(0);
            feedback.setKeyTakeaway("No answers submitted. Complete all interview questions to receive feedback.");
            return feedback;
        }

        int totalTechScore = 0;
        int totalCompScore = 0;
        int totalCommScore = 0;

        List<MockInterviewFeedbackDTO.QuestionFeedbackItem> itemFeedbackList = new ArrayList<>();

        for (MockInterviewSubmissionDTO.AnswerItem item : submission.getAnswers()) {
            MockInterviewFeedbackDTO.QuestionFeedbackItem qf = new MockInterviewFeedbackDTO.QuestionFeedbackItem();
            qf.setQuestionId(item.getQuestionId());
            qf.setQuestionText(item.getQuestionText() != null ? item.getQuestionText() : "Interview Question " + item.getQuestionId());
            qf.setCategory(item.getCategory() != null ? item.getCategory() : "Technical");
            qf.setCandidateAnswer(item.getCandidateAnswer() != null ? item.getCandidateAnswer() : "");

            String ans = (item.getCandidateAnswer() != null) ? item.getCandidateAnswer().trim() : "";
            int wordCount = ans.isEmpty() ? 0 : ans.split("\\s+").length;

            // 1. Technical Accuracy Evaluation (0 - 100)
            int techScore = evaluateTechnicalAccuracy(ans, candidate, job);
            totalTechScore += techScore;

            // 2. Completeness Evaluation (0 - 100)
            int compScore;
            if (wordCount >= 45) compScore = 95;
            else if (wordCount >= 25) compScore = 80;
            else if (wordCount >= 10) compScore = 55;
            else if (wordCount > 0) compScore = 30;
            else compScore = 0;

            totalCompScore += compScore;

            // 3. Communication Clarity Evaluation (0 - 100)
            int commScore = evaluateCommunicationClarity(ans);
            totalCommScore += commScore;

            // Combined Question Score
            int itemScore = (int) Math.round((techScore * 0.45) + (compScore * 0.35) + (commScore * 0.20));
            qf.setScore(itemScore);

            // Rule-based Strengths & Missing Concepts
            List<String> strengths = new ArrayList<>();
            List<String> missingConcepts = new ArrayList<>();

            if (techScore >= 70) strengths.add("Good inclusion of relevant technical terminology.");
            if (compScore >= 75) strengths.add("Comprehensive response providing adequate detail.");
            if (commScore >= 70) strengths.add("Structured explanation demonstrating clear reasoning.");

            if (strengths.isEmpty() && wordCount > 0) {
                strengths.add("Attempted answer provided.");
            }

            if (wordCount < 20) missingConcepts.add("Response is too brief. Expand with concrete technical examples.");
            if (techScore < 60) missingConcepts.add("Incorporate core technical architecture and framework details.");
            if (commScore < 60) missingConcepts.add("Structure response using Situation, Task, Action, and Result (STAR).");

            qf.setStrengths(strengths);
            qf.setMissingConcepts(missingConcepts);

            // Default Rule-Based Model Answer Advice
            qf.setModelAnswerAdvice(getModelAnswerAdvice(qf.getCategory(), getPrimarySkill(candidate, job)));

            itemFeedbackList.add(qf);
        }

        int n = submission.getAnswers().size();
        int avgTech = Math.min(100, Math.max(0, totalTechScore / n));
        int avgComp = Math.min(100, Math.max(0, totalCompScore / n));
        int avgComm = Math.min(100, Math.max(0, totalCommScore / n));

        feedback.setTechnicalAccuracyScore(avgTech);
        feedback.setCompletenessScore(avgComp);
        feedback.setCommunicationScore(avgComm);

        int overall = (int) Math.round((avgTech * 0.45) + (avgComp * 0.35) + (avgComm * 0.20));
        feedback.setOverallScore(overall);

        feedback.setQuestionFeedback(itemFeedbackList);

        if (overall >= 80) {
            feedback.setKeyTakeaway("Excellent performance! Your answers demonstrate strong technical mastery and clear communication.");
        } else if (overall >= 60) {
            feedback.setKeyTakeaway("Solid foundational performance. Focus on expanding technical details and utilizing the STAR framework.");
        } else {
            feedback.setKeyTakeaway("Practice needed. Provide detailed technical explanations and structure answers with clear action steps.");
        }

        return feedback;
    }

    private String getPrimarySkill(UserProfileDTO candidate, Job job) {
        if (job != null && job.getSkills() != null && !job.getSkills().trim().isEmpty()) {
            return job.getSkills().split(",")[0].trim();
        }
        if (candidate != null && candidate.getSkills() != null && !candidate.getSkills().trim().isEmpty()) {
            return candidate.getSkills().split(",")[0].trim();
        }
        return "Java & Microservices";
    }

    private int evaluateTechnicalAccuracy(String answer, UserProfileDTO candidate, Job job) {
        if (answer == null || answer.trim().isEmpty()) return 0;

        String lowerAns = answer.toLowerCase();
        List<String> techTerms = Arrays.asList(
                "java", "spring", "spring boot", "react", "mysql", "sql", "api", "rest", "microservices",
                "database", "architecture", "redis", "cache", "docker", "kubernetes", "aws", "cloud",
                "ci/cd", "testing", "junit", "security", "jwt", "kafka", "git", "algorithm", "design pattern",
                "performance", "optimization", "scalability", "refactoring"
        );

        int matches = 0;
        for (String term : techTerms) {
            if (lowerAns.contains(term)) {
                matches++;
            }
        }

        if (matches >= 4) return 95;
        if (matches >= 3) return 80;
        if (matches >= 2) return 65;
        if (matches >= 1) return 45;
        return 25;
    }

    private int evaluateCommunicationClarity(String answer) {
        if (answer == null || answer.trim().isEmpty()) return 0;

        String lowerAns = answer.toLowerCase();
        int score = 40;

        // Check for STAR method keywords
        List<String> starKeywords = Arrays.asList("situation", "task", "action", "result", "built", "implemented", "resolved", "designed", "engineered", "optimized", "team", "metric");
        int count = 0;
        for (String kw : starKeywords) {
            if (lowerAns.contains(kw)) count++;
        }

        if (count >= 3) score += 35;
        else if (count >= 1) score += 20;

        // Sentence structure / capitalization
        if (Character.isUpperCase(answer.charAt(0)) && (answer.endsWith(".") || answer.endsWith("!"))) {
            score += 25;
        }

        return Math.min(100, score);
    }

    private String getModelAnswerAdvice(String category, String primarySkill) {
        if (category == null) category = "Technical";

        if (category.toLowerCase().contains("architecture")) {
            return "Structure architecture answers around high availability, decoupling, database choices, caching layers, and fault tolerance.";
        } else if (category.toLowerCase().contains("behavioral") || category.toLowerCase().contains("problem")) {
            return "Format behavioral answers using STAR: Briefly state the Situation, describe your Task, detail your specific Action, and quantify the positive Result.";
        } else if (category.toLowerCase().contains("quality") || category.toLowerCase().contains("security")) {
            return "Highlight unit testing, integration tests, static code analysis, automated CI/CD pipelines, and secure authentication (OAuth2/JWT).";
        } else {
            return String.format("Focus on core %s mechanics, trade-off analysis, performance profiling, and production best practices.", primarySkill);
        }
    }
}
