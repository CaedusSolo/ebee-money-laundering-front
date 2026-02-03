package mmu.sef.fyj.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import mmu.sef.fyj.dto.ScholarshipDTO;
import mmu.sef.fyj.model.Scholarship;
import mmu.sef.fyj.service.ScholarshipService;

import java.util.List;


@RestController
@RequestMapping("/api/scholarships")
public class ScholarshipController {

    private final ScholarshipService scholarshipService;

    public ScholarshipController(ScholarshipService scholarshipService) {
        this.scholarshipService = scholarshipService;
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
}
