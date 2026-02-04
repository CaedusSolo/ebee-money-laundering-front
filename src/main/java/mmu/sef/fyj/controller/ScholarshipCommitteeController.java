package mmu.sef.fyj.controller;

import mmu.sef.fyj.dto.ApplicationDetailsDTO;
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
@CrossOrigin(origins = "*") // Allow frontend access
public class ScholarshipCommitteeController {

    @Autowired
    private ScholarshipCommitteeService committeeService;

    @GetMapping("/dashboard/{userId}")
    public ResponseEntity<?> getDashboard(@PathVariable Integer userId) {
        return ResponseEntity.ok(committeeService.getCommitteeDashboard(userId));
    }

    @GetMapping("/application/{id}")
    public ResponseEntity<ApplicationDetailsDTO> getApplication(@PathVariable Integer id) {
        return ResponseEntity.ok(committeeService.getFullApplicationDetails(id));
    }

    @PostMapping("/evaluate/{applicationId}")
    public ResponseEntity<?> evaluate(@PathVariable Integer applicationId,
            @RequestBody Map<String, Object> evaluationData) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) auth.getPrincipal();
            committeeService.evaluateApplication(applicationId, evaluationData, currentUser.getId());
            return ResponseEntity.ok(Map.of("message", "Evaluation submitted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
