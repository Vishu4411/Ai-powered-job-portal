package com.vishnu.ai_job_portal_backend.controller;

import com.vishnu.ai_job_portal_backend.dto.CompanyDTO;
import com.vishnu.ai_job_portal_backend.services.CompanyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/companies")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping("/me")
    public ResponseEntity<CompanyDTO> getMyCompany(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(companyService.getCompanyForRecruiter(email));
    }

    @PutMapping("/me")
    public ResponseEntity<CompanyDTO> updateMyCompany(@RequestBody CompanyDTO dto,
                                                      Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(companyService.saveOrUpdateCompany(email, dto));
    }
}
