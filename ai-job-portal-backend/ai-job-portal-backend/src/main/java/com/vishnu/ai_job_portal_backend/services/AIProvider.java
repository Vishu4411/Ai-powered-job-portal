package com.vishnu.ai_job_portal_backend.services;

import com.vishnu.ai_job_portal_backend.dto.JobMatchResultDTO;
import com.vishnu.ai_job_portal_backend.dto.UserProfileDTO;
import com.vishnu.ai_job_portal_backend.entity.Job;

import java.util.List;

public interface AIProvider {

    String generateMatchExplanation(UserProfileDTO candidate, Job job, JobMatchResultDTO matchResult);

    String generateSkillGapAnalysis(UserProfileDTO candidate, Job job, JobMatchResultDTO matchResult);

    String generateCoverLetter(UserProfileDTO candidate, Job job);

    List<String> generateInterviewQuestions(UserProfileDTO candidate, Job job);

    String generateCareerAdvice(UserProfileDTO candidate);
}
