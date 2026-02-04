package mmu.sef.fyj.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import mmu.sef.fyj.dto.ScholarshipDTO;
import mmu.sef.fyj.dto.NewApplicationRequest;
import mmu.sef.fyj.model.Scholarship;
import mmu.sef.fyj.model.Application;
import mmu.sef.fyj.model.User;
import mmu.sef.fyj.service.ScholarshipService;
import mmu.sef.fyj.service.ApplicationService;

import java.util.List;
import java.util.Map;
import java.util.HashMap;


@RestController
@RequestMapping("/api/scholarships")
public class ScholarshipController {

    private final ScholarshipService scholarshipService;
    private final ApplicationService applicationService;

    public ScholarshipController(ScholarshipService scholarshipService, ApplicationService applicationService) {
        this.scholarshipService = scholarshipService;
        this.applicationService = applicationService;
    }

    @GetMapping
    public ResponseEntity<List<Scholarship>> getAllScholarships() {
        return ResponseEntity.ok(scholarshipService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Scholarship> getScholarshipById(@PathVariable int id) {
        return scholarshipService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Scholarship> createScholarship(@Valid @RequestBody ScholarshipDTO dto) {
        Scholarship scholarship = scholarshipService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(scholarship);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Scholarship> updateScholarship(
            @PathVariable int id,
            @Valid @RequestBody ScholarshipDTO dto) {
        return scholarshipService.update(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScholarship(@PathVariable int id) {
        scholarshipService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyForScholarship(@Valid @RequestBody NewApplicationRequest request) {
        try {
            // Get authenticated user from security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) authentication.getPrincipal();

            Application application = applicationService.createFromApplicationRequest(request, currentUser.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("applicationId", application.getApplicationID());
            response.put("scholarshipName", "Scholarship Application");
            response.put("status", "success");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}
