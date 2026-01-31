package mmu.sef.fyj.controller;

import mmu.sef.fyj.model.User;
import mmu.sef.fyj.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class UserController {

    @Autowired
    private AuthService authService;

    // Simple in-memory session store
    private static final Map<String, User> sessions = new HashMap<>();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String password = payload.get("password");

            User user = authService.login(email, password);

            String token = UUID.randomUUID().toString();
            sessions.put(token, user);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("role", user.getRole());
            response.put("name", user.getName());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        try {
            User user = authService.registerStudent(
                    payload.get("name"),
                    payload.get("email"),
                    payload.get("password"),
                    payload.get("studentId"));
            return ResponseEntity.ok(Map.of("message", "Registration successful", "userID", user.getUserID()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {
        sessions.remove(token);
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }
}
