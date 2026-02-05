package mmu.sef.fyj.controller;

import jakarta.validation.Valid;
import mmu.sef.fyj.dto.LoginRequest;
import mmu.sef.fyj.dto.RegisterRequest;
import mmu.sef.fyj.dto.ResetPasswordRequest;
import mmu.sef.fyj.model.Student;
import mmu.sef.fyj.model.User;
import mmu.sef.fyj.model.Reviewer;
import mmu.sef.fyj.repository.StudentRepository;
import mmu.sef.fyj.repository.UserRepository;
import mmu.sef.fyj.repository.ReviewerRepository;
import mmu.sef.fyj.service.AuthService;
import mmu.sef.fyj.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewerRepository reviewerRepository;
    
    @Autowired
    private StudentRepository studentRepository;

    @PostMapping("/register/student")
    public ResponseEntity<?> registerStudent(@Valid @RequestBody RegisterRequest request) { // Changed to DTO
        try {
            User user = authService.registerStudent(
                    request.getName(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getStudentId());
            return ResponseEntity.ok(Map.of("message", "Student registered successfully", "userId", user.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest request) { // Changed to DTO
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
            String token = jwtService.generateToken(user);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("role", user.getRole());
            response.put("userId", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());

            // If user is a student, include student ID
            if (user.getRole().toString().equals("STUDENT")) {
                Optional<Student> student = studentRepository.findByEmail(user.getEmail());
                if (student.isPresent()) {
                    response.put("id", student.get().getStudentId());
                    response.put("studentId", student.get().getStudentId());
                    response.put("studentUniId", student.get().getStudentUniId());
                }
            }
            
            // If user is a reviewer, include reviewer ID
            if (user.getRole().toString().equals("REVIEWER")) {
                Optional<Reviewer> reviewer = reviewerRepository.findByEmail(user.getEmail());
                if (reviewer.isPresent()) {
                    response.put("reviewerId", reviewer.get().getReviewerId());
                }
            }

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request.getEmail(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Password reset successfully. You can now login."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
