package mmu.sef.fyj.controller;

import mmu.sef.fyj.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/dashboard/{studentId}")
    public ResponseEntity<?> getDashboard(@PathVariable Integer studentId) {
        try {
            Map<String, Object> data = studentService.getStudentDashboard(studentId);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/account/{studentId}")
    public ResponseEntity<?> deleteAccount(@PathVariable Integer studentId) {
        try {
            Map<String, Object> result = studentService.deleteStudentAccount(studentId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/profile-image/{studentId}")
    public ResponseEntity<?> updateProfileImage(
            @PathVariable Integer studentId,
            @RequestBody Map<String, String> request) {
        try {
            String imageUrl = request.get("imageUrl");
            if (imageUrl == null || imageUrl.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Image URL is required"));
            }
            Map<String, Object> result = studentService.updateProfileImage(studentId, imageUrl);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}