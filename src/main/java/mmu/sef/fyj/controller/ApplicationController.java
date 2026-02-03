package mmu.sef.fyj.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import mmu.sef.fyj.dto.ApplicationSummaryDTO;
import mmu.sef.fyj.model.Application;
import mmu.sef.fyj.model.ApplicationStatus;
import mmu.sef.fyj.service.ApplicationService;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications() {
        return ResponseEntity.ok(applicationService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(@PathVariable Integer id) {
        return applicationService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Application>> getApplicationsByStudent(@PathVariable Integer studentId) {
        return ResponseEntity.ok(applicationService.findByStudent(studentId));
    }

    @GetMapping("/scholarship/{scholarshipId}")
    public ResponseEntity<List<Application>> getApplicationsByScholarship(@PathVariable Integer scholarshipId) {
        return ResponseEntity.ok(applicationService.findByScholarship(scholarshipId));
    }

    @GetMapping("/scholarship/{scholarshipId}/summaries")
    public ResponseEntity<List<ApplicationSummaryDTO>> getApplicationSummariesByScholarship(@PathVariable Integer scholarshipId) {
        return ResponseEntity.ok(applicationService.findSummariesByScholarship(scholarshipId));
    }

    @PostMapping
    public ResponseEntity<Application> createApplication(@RequestBody Application application) {
        Application created = applicationService.createDraft(application);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<Application> submitApplication(@PathVariable Integer id) {
        return applicationService.submit(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Application> updateApplicationStatus(
            @PathVariable Integer id,
            @RequestBody ApplicationStatus status) {
        return applicationService.updateStatus(id, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Integer id) {
        applicationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
