package mmu.sef.fyj.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import mmu.sef.fyj.model.Role;
import mmu.sef.fyj.model.User;
import mmu.sef.fyj.repository.UserRepository;
import mmu.sef.fyj.repository.ReviewerRepository;
import mmu.sef.fyj.repository.ScholarshipCommitteeRepository;
import mmu.sef.fyj.dto.NewUser;
import mmu.sef.fyj.service.UserService;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewerRepository reviewerRepository;

    @Autowired
    private ScholarshipCommitteeRepository committeeRepository;

    @Autowired
    private UserService userService;

    // GET all users (optional query param: role=ADMIN|STUDENT|COMMITTEE|REVIEWER)
    @GetMapping
    public List<User> getAllUsers(@RequestParam(required = false) Role role) {
        if (role != null) {
            return userRepository.findByRole(role);
        }
        return userRepository.findAll();
    }

    // GET user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create user
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody NewUser newUser) {
        try {
            User user = userService.addUser(newUser);
            return ResponseEntity.ok(Map.of("message", "Student registered successfully", "userId", user.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT update user
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody User userDetails) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setName(userDetails.getName());
                    user.setEmail(userDetails.getEmail());
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        return userRepository.findById(id)
                .map(user -> {
                    // Delete from reviewer or committee tables if applicable
                    if (user.getRole() == Role.REVIEWER) {
                        reviewerRepository.findByEmail(user.getEmail())
                            .ifPresent(reviewer -> reviewerRepository.delete(reviewer));
                    } else if (user.getRole() == Role.COMMITTEE) {
                        committeeRepository.findByEmail(user.getEmail())
                            .ifPresent(committee -> committeeRepository.delete(committee));
                    }
                    
                    // Delete from users table
                    userRepository.delete(user);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
