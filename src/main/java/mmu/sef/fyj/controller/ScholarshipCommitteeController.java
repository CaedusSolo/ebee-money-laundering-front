package mmu.sef.fyj.controller;

import mmu.sef.fyj.model.ScholarshipCommittee;
import mmu.sef.fyj.service.ScholarshipCommitteeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/committee")
@CrossOrigin(origins = "*")
public class ScholarshipCommitteeController {

    @Autowired
    private ScholarshipCommitteeService committeeService;

    @GetMapping("/list")
    public ResponseEntity<List<ScholarshipCommittee>> getAllCommitteeMembers() {
        return ResponseEntity.ok(committeeService.findAll());
    }

    @GetMapping("/dashboard/{committeeId}")
    public ResponseEntity<?> getDashboard(@PathVariable Integer committeeId) {
        try {
            Map<String, Object> data = committeeService.getCommitteeDashboard(committeeId);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
