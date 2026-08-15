package com.vishnu.ai_job_portal_backend.services;

import com.vishnu.ai_job_portal_backend.dto.ATSResumeAnalysisDTO;

import com.vishnu.ai_job_portal_backend.dto.CandidateInsightsDTO;
import com.vishnu.ai_job_portal_backend.dto.JobMatchResultDTO;
import com.vishnu.ai_job_portal_backend.dto.SkillGapRoadmapDTO;
import com.vishnu.ai_job_portal_backend.dto.UserProfileDTO;
import com.vishnu.ai_job_portal_backend.entity.Job;

import com.vishnu.ai_job_portal_backend.dto.CareerActionPlanDTO;
import com.vishnu.ai_job_portal_backend.dto.MockInterviewFeedbackDTO;
import com.vishnu.ai_job_portal_backend.dto.MockInterviewSubmissionDTO;

import java.util.List;

public interface AIProvider {

    String generateMatchExplanation(UserProfileDTO candidate, Job job, JobMatchResultDTO matchResult);

    String generateSkillGapAnalysis(UserProfileDTO candidate, Job job, JobMatchResultDTO matchResult);

    String generateCoverLetter(UserProfileDTO candidate, Job job);

    List<String> generateInterviewQuestions(UserProfileDTO candidate, Job job);

    String generateCareerAdvice(UserProfileDTO candidate);

    ATSResumeAnalysisDTO analyzeResumeATS(UserProfileDTO candidate, ATSResumeAnalysisDTO baseAnalysis);

    SkillGapRoadmapDTO generateSkillRoadmap(UserProfileDTO candidate, Job job, JobMatchResultDTO matchResult, SkillGapRoadmapDTO baseRoadmap);

    CandidateInsightsDTO generateCandidateInsights(UserProfileDTO candidate, Job job, JobMatchResultDTO matchResult, CandidateInsightsDTO baseInsights);

    MockInterviewFeedbackDTO evaluateMockInterviewAnswers(UserProfileDTO candidate, Job job, MockInterviewSubmissionDTO submission, MockInterviewFeedbackDTO baseFeedback);

    CareerActionPlanDTO generateCareerActionPlanCoaching(UserProfileDTO candidate, CareerActionPlanDTO basePlan);

    String generateApplicationCopilotStrategy(UserProfileDTO candidate, Job job, JobMatchResultDTO matchResult, ATSResumeAnalysisDTO atsAnalysis);
}






