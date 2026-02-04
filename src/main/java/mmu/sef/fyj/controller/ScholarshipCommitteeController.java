package mmu.sef.fyj.controller;

import mmu.sef.fyj.model.User;
import mmu.sef.fyj.service.ScholarshipCommitteeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/committee")
@CrossOrigin(origins = "*")
public class ScholarshipCommitteeController {

    @Autowired
    private ScholarshipCommitteeService committeeService;

    @GetMapping("/dashboard/{committeeId}")
    public ResponseEntity<?> getDashboard(@PathVariable Integer committeeId) {
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

    @PostMapping("/evaluate/{applicationId}")
    public ResponseEntity<?> evaluate(@PathVariable Integer applicationId,
            @RequestBody Map<String, Object> evaluationData) {
        try {
            // FIX: Retrieve current user ID from the Security Context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) authentication.getPrincipal();
            Integer userId = currentUser.getId();

            // Pass the required 3 arguments: appId, data, and userId
            committeeService.evaluateApplication(applicationId, evaluationData, userId);

            return ResponseEntity.ok(Map.of("message", "Evaluation submitted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
