package mmu.sef.fyj.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import mmu.sef.fyj.model.*;
import mmu.sef.fyj.repository.UserRepository;
import mmu.sef.fyj.dto.NewUser;
import mmu.sef.fyj.service.StudentService;
import mmu.sef.fyj.service.UserService;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private StudentService studentService;

    @GetMapping
    public List<User> getAllUsers(@RequestParam(required = false) Role role) {
        if (role != null) {
            return userRepository.findByRole(role);
        }
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/student-id")
    public ResponseEntity<Integer> getStudentIdByUserId(@PathVariable Integer id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = userOpt.get();

        Optional<Student> studentOpt = studentService.findByEmail(user.getEmail());
        if (studentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Student student = studentOpt.get();

        return ResponseEntity.ok(student.getStudentId());
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody NewUser newUser) {
        try {
            User user = userService.addUser(newUser);
            return ResponseEntity.ok(Map.of("message", "User created successfully", "userId", user.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @RequestBody NewUser updateData) {
        try {
            User updatedUser = userService.updateUser(id, updateData);
            return ResponseEntity.ok(Map.of("message", "User updated successfully", "user", updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "You cannot delete an admin account."));
        }
    }
}
