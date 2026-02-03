package mmu.sef.fyj.controller;

import mmu.sef.fyj.model.Reviewer;
import mmu.sef.fyj.service.ReviewerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviewer")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class ReviewerController {

    @Autowired
    private ReviewerService reviewerService;

    @GetMapping("/list")
    public ResponseEntity<List<Reviewer>> getAllReviewers() {
        return ResponseEntity.ok(reviewerService.findAll());
    }

    @GetMapping("/dashboard/{reviewerId}")
    public ResponseEntity<?> getDashboard(@PathVariable Integer reviewerId) {
        try {
            List<Map<String, Object>> applications = reviewerService.getAllAssignedApplications(reviewerId);

            Map<String, Object> dashboard = Map.of(
                "reviewerId", reviewerId,
                "totalAssignedApplications", applications.size(),
                "applications", applications
            );

            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/scholarships/{scholarshipId}/applications")
    public ResponseEntity<?> getApplicationsByScholarship(@PathVariable Integer scholarshipId) {
        try {
            List<Map<String, Object>> applications = reviewerService.getApplicationsByScholarship(scholarshipId);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/applications/{applicationId}")
    public ResponseEntity<?> getApplicationDetails(@PathVariable Integer applicationId) {
        try {
            Map<String, Object> application = reviewerService.getApplicationDetails(applicationId);
            return ResponseEntity.ok(application);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/applications/{applicationId}/decision")
    public ResponseEntity<?> makeDecision(@PathVariable Integer applicationId, @RequestBody Map<String, String> payload) {
        try {
            String decision = payload.get("decision"); // APPROVE or REJECT
            Map<String, Object> result = reviewerService.approveApplication(applicationId, decision);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<?> getStatistics() {
        try {
            Map<String, Object> stats = reviewerService.getStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/applications/{applicationId}/grades")
    public ResponseEntity<?> getApplicationGrades(@PathVariable Integer applicationId) {
        try {
            Map<String, Object> reviews = reviewerService.getCommitteeReviews(applicationId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/send-email")
    public ResponseEntity<?> sendEmailNotification(@RequestBody Map<String, Object> payload) {
        try {
            Integer applicationId = (Integer) payload.get("applicationId");
            String subject = (String) payload.get("subject");
            String message = (String) payload.get("message");

            Map<String, Object> result = reviewerService.sendEmailNotification(applicationId, subject, message);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
