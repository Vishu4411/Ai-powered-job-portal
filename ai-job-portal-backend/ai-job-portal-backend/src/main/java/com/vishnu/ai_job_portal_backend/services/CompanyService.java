package com.vishnu.ai_job_portal_backend.services;

import com.vishnu.ai_job_portal_backend.dto.CompanyDTO;
import com.vishnu.ai_job_portal_backend.entity.Company;
import com.vishnu.ai_job_portal_backend.entity.RecruiterProfile;
import com.vishnu.ai_job_portal_backend.entity.User;
import com.vishnu.ai_job_portal_backend.repository.CompanyRepository;
import com.vishnu.ai_job_portal_backend.repository.RecruiterProfileRepository;
import com.vishnu.ai_job_portal_backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class CompanyService {

    private final UserRepository userRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final CompanyRepository companyRepository;

    public CompanyService(UserRepository userRepository,
                          RecruiterProfileRepository recruiterProfileRepository,
                          CompanyRepository companyRepository) {
        this.userRepository = userRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.companyRepository = companyRepository;
    }

    public CompanyDTO getCompanyForRecruiter(String email) {
        Optional<RecruiterProfile> profileOpt = recruiterProfileRepository.findByUserEmail(email);

        if (profileOpt.isEmpty() || profileOpt.get().getCompany() == null) {
            return new CompanyDTO();
        }

        return mapToDTO(profileOpt.get().getCompany());
    }

    public CompanyDTO saveOrUpdateCompany(String email, CompanyDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Recruiter user not found: " + email));

        RecruiterProfile profile = recruiterProfileRepository.findByUserEmail(email)
                .orElseGet(() -> {
                    RecruiterProfile rp = new RecruiterProfile();
                    rp.setUser(user);
                    return rp;
                });

        Company company = profile.getCompany();
        if (company == null) {
            company = new Company();
        }

        company.setCompanyName(dto.getCompanyName() != null ? dto.getCompanyName() : "My Company");
        company.setIndustry(dto.getIndustry());
        company.setDescription(dto.getDescription());
        company.setLocation(dto.getLocation());
        company.setWebsite(dto.getWebsite());
        company.setLogoUrl(dto.getLogoUrl());

        Company savedCompany = companyRepository.save(company);
        profile.setCompany(savedCompany);
        recruiterProfileRepository.save(profile);

        return mapToDTO(savedCompany);
    }

    private CompanyDTO mapToDTO(Company company) {
        CompanyDTO dto = new CompanyDTO();
        dto.setId(company.getId());
        dto.setCompanyName(company.getCompanyName());
        dto.setIndustry(company.getIndustry());
        dto.setDescription(company.getDescription());
        dto.setLocation(company.getLocation());
        dto.setWebsite(company.getWebsite());
        dto.setLogoUrl(company.getLogoUrl());
        dto.setVerified(company.isVerified());
        return dto;
    }
}
