package mmu.sef.fyj.controller;

import jakarta.validation.Valid;
import mmu.sef.fyj.dto.LoginRequest;
import mmu.sef.fyj.dto.RegisterRequest;
import mmu.sef.fyj.model.User;
import mmu.sef.fyj.repository.UserRepository;
import mmu.sef.fyj.service.AuthService;
import mmu.sef.fyj.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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

    @PostMapping("/register/student")
    public ResponseEntity<?> registerStudent(@Valid @RequestBody RegisterRequest request) { // Changed to DTO
        try {
            User user = authService.registerStudent(
                    request.getName(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getStudentId()
            );
            return ResponseEntity.ok(Map.of("message", "Student registered successfully", "userId", user.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest request) { // Changed to DTO
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
            String token = jwtService.generateToken(user);

            return ResponseEntity.ok(Map.of(
                "token", token,
                "role", user.getRole(),
                "user", user
            ));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        }
    }
}
