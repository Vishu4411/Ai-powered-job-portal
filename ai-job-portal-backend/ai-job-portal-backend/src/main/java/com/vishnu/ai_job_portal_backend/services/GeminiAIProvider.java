package com.vishnu.ai_job_portal_backend.services;

import com.vishnu.ai_job_portal_backend.dto.ATSResumeAnalysisDTO;
import com.vishnu.ai_job_portal_backend.dto.CandidateInsightsDTO;
import com.vishnu.ai_job_portal_backend.dto.JobMatchResultDTO;
import com.vishnu.ai_job_portal_backend.dto.MockInterviewFeedbackDTO;
import com.vishnu.ai_job_portal_backend.dto.MockInterviewSubmissionDTO;
import com.vishnu.ai_job_portal_backend.dto.SkillGapRoadmapDTO;
import com.vishnu.ai_job_portal_backend.dto.UserProfileDTO;
import com.vishnu.ai_job_portal_backend.entity.Job;



import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiAIProvider implements AIProvider {



    private static final Logger log = LoggerFactory.getLogger(GeminiAIProvider.class);

    @Value("${ai.api.key:${AI_API_KEY:}}")
    private String apiKey;

    @Value("${ai.provider:gemini}")
    private String providerName;

    private final RestTemplate restTemplate;

    public GeminiAIProvider() {
        this.restTemplate = new RestTemplate();
    }

    @Override
    public String generateMatchExplanation(UserProfileDTO candidate, Job job, JobMatchResultDTO matchResult) {
        if (!isApiKeyConfigured()) {
            return buildFallbackExplanation(candidate, job, matchResult);
        }

        String prompt = String.format(
                "You are an expert AI Career Advisor. Explain why candidate %s matches job '%s' at %s with an overall match score of %d%%.\n" +
                "Candidate skills: %s. Candidate headline: %s.\n" +
                "Job required skills: %s. Job description: %s.\n" +
                "Matching skills: %s. Missing skills: %s.\n" +
                "Provide a concise, encouraging 2-3 paragraph professional match summary highlighting candidate strengths and growth recommendations.",
                candidate.getFullName(), job.getTitle(), job.getCompany() != null ? job.getCompany() : "Company",
                matchResult.getOverallMatchScore(),
                candidate.getSkills(), candidate.getHeadline(),
                job.getSkills(), job.getDescription(),
                matchResult.getMatchingSkills(), matchResult.getMissingSkills()
        );

        String aiResponse = callGeminiApi(prompt);
        return (aiResponse != null && !aiResponse.trim().isEmpty())
                ? aiResponse
                : buildFallbackExplanation(candidate, job, matchResult);
    }

    @Override
    public String generateSkillGapAnalysis(UserProfileDTO candidate, Job job, JobMatchResultDTO matchResult) {
        if (!isApiKeyConfigured()) {
            return String.format(
                    "Skill Gap Analysis for %s:\n\nMatching Core Skills: %s\nMissing Skills to Acquire: %s\n\nRecommendation: Focus on building hands-on project experience in %s to boost your match score to 100%%.",
                    job.getTitle(),
                    matchResult.getMatchingSkills().isEmpty() ? "None" : String.join(", ", matchResult.getMatchingSkills()),
                    matchResult.getMissingSkills().isEmpty() ? "None! You meet all required skills." : String.join(", ", matchResult.getMissingSkills()),
                    matchResult.getMissingSkills().isEmpty() ? "advanced architecture patterns" : String.join(", ", matchResult.getMissingSkills())
            );
        }

        String prompt = String.format(
                "Analyze skill gaps for candidate %s targeting position '%s'.\nMatching skills: %s. Missing required skills: %s.\nProvide a structured 3-step learning plan to acquire missing skills.",
                candidate.getFullName(), job.getTitle(), matchResult.getMatchingSkills(), matchResult.getMissingSkills()
        );

        String aiResponse = callGeminiApi(prompt);
        return (aiResponse != null && !aiResponse.trim().isEmpty())
                ? aiResponse
                : String.format("Focus on mastering missing skills: %s", matchResult.getMissingSkills());
    }

    @Override
    public String generateCoverLetter(UserProfileDTO candidate, Job job) {
        if (!isApiKeyConfigured()) {
            return String.format(
                    "Dear Hiring Manager at %s,\n\nI am writing to express my strong interest in the %s position. With my background in %s and hands-on experience, I am confident in my ability to contribute effectively to your team.\n\nThank you for your time and consideration.\n\nSincerely,\n%s",
                    job.getCompany() != null ? job.getCompany() : "your company",
                    job.getTitle(),
                    candidate.getSkills() != null ? candidate.getSkills() : "software engineering",
                    candidate.getFullName()
            );
        }

        String prompt = String.format(
                "Write a professional, compelling cover letter for candidate %s applying for '%s' at %s.\nCandidate bio: %s. Candidate skills: %s. Job description: %s.",
                candidate.getFullName(), job.getTitle(), job.getCompany(), candidate.getBio(), candidate.getSkills(), job.getDescription()
        );

        String aiResponse = callGeminiApi(prompt);
        return (aiResponse != null && !aiResponse.trim().isEmpty())
                ? aiResponse
                : String.format("Dear Hiring Manager,\n\nI am applying for %s...", job.getTitle());
    }

    @Override
    public List<String> generateInterviewQuestions(UserProfileDTO candidate, Job job) {
        if (!isApiKeyConfigured()) {
            return Arrays.asList(
                    "Explain your experience with " + (job.getSkills() != null ? job.getSkills() : "core technical stack") + ".",
                    "Describe a challenging project you built using your primary technical skills.",
                    "How do you approach debugging complex production issues?",
                    "What strategies do you use to quickly learn new frameworks or APIs?",
                    "Why are you interested in joining " + (job.getCompany() != null ? job.getCompany() : "our engineering team") + "?"
            );
        }

        String prompt = String.format(
                "Generate 5 targeted technical & behavioral interview questions for candidate %s interviewing for position '%s'. Required skills: %s.",
                candidate.getFullName(), job.getTitle(), job.getSkills()
        );

        String aiResponse = callGeminiApi(prompt);
        if (aiResponse != null && !aiResponse.trim().isEmpty()) {
            return Arrays.asList(aiResponse.split("\n"));
        }

        return Arrays.asList("Explain your core technical background.", "Walk me through your most complex project.");
    }

    @Override
    public String generateCareerAdvice(UserProfileDTO candidate) {
        if (!isApiKeyConfigured()) {
            return String.format(
                    "Career Guidance for %s:\n\n1. Keep your profile updated with recent project tech stacks.\n2. Practice mock interview questions regularly.\n3. Apply for roles matching your core skills: %s.",
                    candidate.getFullName(),
                    candidate.getSkills() != null ? candidate.getSkills() : "Java, React, SQL"
            );
        }

        String prompt = String.format(
                "Provide personalized career advice and growth suggestions for software professional %s. Skills: %s. Bio: %s.",
                candidate.getFullName(), candidate.getSkills(), candidate.getBio()
        );

        String aiResponse = callGeminiApi(prompt);
        return (aiResponse != null && !aiResponse.trim().isEmpty())
                ? aiResponse
                : "Keep expanding your technical stack and project portfolio.";
    }

    @Override
    public ATSResumeAnalysisDTO analyzeResumeATS(UserProfileDTO candidate, ATSResumeAnalysisDTO baseAnalysis) {
        if (!isApiKeyConfigured() || candidate == null) {
            return baseAnalysis;
        }

        try {
            String prompt = String.format(
                    "You are an ATS (Applicant Tracking System) & Resume Specialist.\n" +
                    "Analyze the following candidate professional profile (Deterministic ATS Score: %d%%):\n" +
                    "Headline: %s\n" +
                    "Professional Bio: %s\n" +
                    "Technical Skills: %s\n" +
                    "Education Count: %d\n" +
                    "Experience Count: %d\n" +
                    "Project Count: %d\n\n" +
                    "Provide a 2-3 paragraph professional ATS feedback summary highlighting structural strengths, missing industry keywords, and formatting recommendations.",
                    baseAnalysis.getOverallScore(),
                    candidate.getHeadline() != null ? candidate.getHeadline() : "Software Professional",
                    candidate.getBio() != null ? candidate.getBio() : "N/A",
                    candidate.getSkills() != null ? candidate.getSkills() : "N/A",
                    candidate.getEducationList() != null ? candidate.getEducationList().size() : 0,
                    candidate.getExperienceList() != null ? candidate.getExperienceList().size() : 0,
                    candidate.getProjectList() != null ? candidate.getProjectList().size() : 0
            );

            String aiResponse = callGeminiApi(prompt);
            if (aiResponse != null && !aiResponse.trim().isEmpty()) {
                baseAnalysis.setAiExplanation(aiResponse);
            }
        } catch (Exception e) {
            log.warn("Gemini ATS analysis call failed: {}", e.getMessage());
        }

        return baseAnalysis;
    }

    @Override
    public SkillGapRoadmapDTO generateSkillRoadmap(UserProfileDTO candidate, Job job, JobMatchResultDTO matchResult, SkillGapRoadmapDTO baseRoadmap) {
        if (!isApiKeyConfigured() || candidate == null || job == null) {
            return baseRoadmap;
        }

        try {
            String prompt = String.format(
                    "You are an AI Technical Career & Learning Specialist.\n" +
                    "Generate a personalized weekly learning roadmap for a software professional targeting position '%s' at %s (Match Score: %d%%).\n" +
                    "Matching skills possessed: %s.\n" +
                    "Missing required skills to acquire: %s.\n\n" +
                    "Provide:\n" +
                    "1. A 2-paragraph executive roadmap summary.\n" +
                    "2. A step-by-step 4-week learning progression plan.\n" +
                    "3. A recommended portfolio project title & description to demonstrate mastery.",
                    job.getTitle(),
                    job.getCompany() != null ? job.getCompany() : "Target Company",
                    matchResult.getOverallMatchScore(),
                    matchResult.getMatchingSkills().isEmpty() ? "None" : String.join(", ", matchResult.getMatchingSkills()),
                    matchResult.getMissingSkills().isEmpty() ? "None" : String.join(", ", matchResult.getMissingSkills())
            );

            String aiResponse = callGeminiApi(prompt);
            if (aiResponse != null && !aiResponse.trim().isEmpty()) {
                baseRoadmap.setRoadmapSummary(aiResponse);
            }
        } catch (Exception e) {
            log.warn("Gemini Skill Roadmap generation failed: {}", e.getMessage());
        }

        return baseRoadmap;
    }

    @Override
    public CandidateInsightsDTO generateCandidateInsights(UserProfileDTO candidate, Job job, JobMatchResultDTO matchResult, CandidateInsightsDTO baseInsights) {
        if (!isApiKeyConfigured() || candidate == null || job == null) {
            return baseInsights;
        }

        try {
            String prompt = String.format(
                    "You are an Executive Technical Recruiter & Hiring Specialist.\n" +
                    "Analyze candidate %s for position '%s' at %s (Deterministic Match Score: %d%%).\n" +
                    "Headline: %s\n" +
                    "Bio: %s\n" +
                    "Candidate Skills: %s\n" +
                    "Job Required Skills: %s\n" +
                    "Matching Skills: %s\n" +
                    "Missing Skills: %s\n\n" +
                    "Provide a structured assessment:\n" +
                    "1. Executive Summary: 2-3 sentence overview for hiring manager.\n" +
                    "2. Role Fit Analysis: 2 sentence summary on technical and experience alignment.\n" +
                    "3. Exactly 5 targeted technical & behavioral interview questions tailored to candidate background and job requirements.",
                    candidate.getFullName() != null ? candidate.getFullName() : "Candidate",
                    job.getTitle(),
                    job.getCompany() != null ? job.getCompany() : "Target Company",
                    matchResult.getOverallMatchScore(),
                    candidate.getHeadline() != null ? candidate.getHeadline() : "N/A",
                    candidate.getBio() != null ? candidate.getBio() : "N/A",
                    candidate.getSkills() != null ? candidate.getSkills() : "N/A",
                    job.getSkills() != null ? job.getSkills() : "N/A",
                    matchResult.getMatchingSkills().isEmpty() ? "None" : String.join(", ", matchResult.getMatchingSkills()),
                    matchResult.getMissingSkills().isEmpty() ? "None" : String.join(", ", matchResult.getMissingSkills())
            );

            String aiResponse = callGeminiApi(prompt);
            if (aiResponse != null && !aiResponse.trim().isEmpty()) {
                baseInsights.setExecutiveSummary(aiResponse);
            }

        } catch (Exception e) {
            log.warn("Gemini Candidate Insights generation failed: {}", e.getMessage());
        }

        return baseInsights;
    }

    @Override
    public MockInterviewFeedbackDTO evaluateMockInterviewAnswers(UserProfileDTO candidate, Job job, MockInterviewSubmissionDTO submission, MockInterviewFeedbackDTO baseFeedback) {
        if (!isApiKeyConfigured() || submission == null || submission.getAnswers() == null || submission.getAnswers().isEmpty()) {
            return baseFeedback;
        }

        try {
            StringBuilder promptBuilder = new StringBuilder();
            promptBuilder.append(String.format(
                    "You are a Senior Engineering Hiring Manager conducting a technical interview for role '%s'.\n" +
                    "Evaluated Candidate Skills: %s\n\n" +
                    "Review the candidate's answers below and provide brief model answer advice and strategic takeaways:\n\n",
                    job != null ? job.getTitle() : "Software Engineer",
                    candidate != null && candidate.getSkills() != null ? candidate.getSkills() : "Java, React, SQL"
            ));

            for (MockInterviewSubmissionDTO.AnswerItem item : submission.getAnswers()) {
                promptBuilder.append(String.format(
                        "Q%d [%s]: %s\nCandidate Answer: %s\n\n",
                        item.getQuestionId(),
                        item.getCategory() != null ? item.getCategory() : "Technical",
                        item.getQuestionText(),
                        item.getCandidateAnswer() != null && !item.getCandidateAnswer().trim().isEmpty() ? item.getCandidateAnswer() : "No answer provided"
                ));
            }

            promptBuilder.append("Provide concise, professional interview performance feedback with model answer guidance for key questions.");

            String aiAdvice = callGeminiApi(promptBuilder.toString());
            if (aiAdvice != null && !aiAdvice.trim().isEmpty()) {
                baseFeedback.setKeyTakeaway(aiAdvice.trim());
            }
        } catch (Exception e) {
            log.warn("Gemini Mock Interview Answer Evaluation failed: {}", e.getMessage());
        }

        return baseFeedback;
    }





    private boolean isApiKeyConfigured() {
        return apiKey != null && !apiKey.trim().isEmpty() && !apiKey.startsWith("YOUR_");
    }

    private String callGeminiApi(String promptText) {
        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey.trim();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", promptText);

            Map<String, Object> partsMap = new HashMap<>();
            partsMap.put("parts", Collections.singletonList(textPart));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", Collections.singletonList(partsMap));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            Map<?, ?> response = restTemplate.postForObject(url, entity, Map.class);

            if (response != null && response.containsKey("candidates")) {
                List<?> candidates = (List<?>) response.get("candidates");
                if (!candidates.isEmpty() && candidates.get(0) instanceof Map) {
                    Map<?, ?> candMap = (Map<?, ?>) candidates.get(0);
                    if (candMap.containsKey("content") && candMap.get("content") instanceof Map) {
                        Map<?, ?> contentMap = (Map<?, ?>) candMap.get("content");
                        if (contentMap.containsKey("parts") && contentMap.get("parts") instanceof List) {
                            List<?> parts = (List<?>) contentMap.get("parts");
                            if (!parts.isEmpty() && parts.get(0) instanceof Map) {
                                Map<?, ?> pMap = (Map<?, ?>) parts.get(0);
                                return (String) pMap.get("text");
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Gemini AI API call failed or timed out. Falling back to deterministic response. Error: {}", e.getMessage());
        }
        return null;
    }

    private String buildFallbackExplanation(UserProfileDTO candidate, Job job, JobMatchResultDTO matchResult) {
        return String.format(
                "You match %d%% of the requirements for %s at %s based on your current skills and experience. " +
                "You possess %d matching core skills (%s). " +
                "Consider developing experience in %s to reach 100%% match strength.",
                matchResult.getOverallMatchScore(),
                job.getTitle(),
                job.getCompany() != null ? job.getCompany() : "the target company",
                matchResult.getMatchingSkills().size(),
                matchResult.getMatchingSkills().isEmpty() ? "general experience" : String.join(", ", matchResult.getMatchingSkills()),
                matchResult.getMissingSkills().isEmpty() ? "advanced specialization" : String.join(", ", matchResult.getMissingSkills())
        );
    }
}
