package com.vishnu.ai_job_portal_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vishnu.ai_job_portal_backend.entity.Job;
import com.vishnu.ai_job_portal_backend.repository.JobRepository;
@CrossOrigin(origins = "http://localhost:5174")
@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobRepository jobRepository;

    public JobController(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @GetMapping
public List<Job> getAllJobs() {
    return jobRepository.findAll();
}
    

    @GetMapping("/test")
public String test() {
    return "Job Portal API Working!";
}

@PostMapping
public Job createJob(@RequestBody Job job) {
    return jobRepository.save(job);
}
@GetMapping("/{id}")
public Job getJobById(@PathVariable Long id) {
    return jobRepository.findById(id).orElse(null);
}
@DeleteMapping("/{id}")
public String deleteJob(@PathVariable Long id) {
    jobRepository.deleteById(id);
    return "Job deleted successfully";
}


@PutMapping("/{id}")
public Job updateJob(@PathVariable Long id,
                     @RequestBody Job updatedJob) {

    Job job = jobRepository.findById(id).orElse(null);

    if (job != null) {

        job.setTitle(updatedJob.getTitle());
        job.setCompany(updatedJob.getCompany());
        job.setLocation(updatedJob.getLocation());

        job.setSalary(updatedJob.getSalary());
        job.setExperience(updatedJob.getExperience());
        job.setJobType(updatedJob.getJobType());
        job.setDescription(updatedJob.getDescription());
        job.setSkills(updatedJob.getSkills());

        return jobRepository.save(job);
    }

    return null;
    }
}