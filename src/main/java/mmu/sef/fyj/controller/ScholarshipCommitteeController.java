package mmu.sef.fyj.controller;

import mmu.sef.fyj.service.ScholarshipCommitteeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/committee")
@CrossOrigin(origins = "*")
public class ScholarshipCommitteeController {

    @Autowired
    private ScholarshipCommitteeService committeeService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(@RequestParam Integer committeeId) {
        return ResponseEntity.ok(committeeService.getCommitteeDashboard(committeeId));
    }

    @GetMapping("/application/{id}")
    public ResponseEntity<?> getApplication(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(committeeService.getFullApplicationDetails(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
