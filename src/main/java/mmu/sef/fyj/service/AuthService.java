package mmu.sef.fyj.service;

import mmu.sef.fyj.model.Role;
import mmu.sef.fyj.model.User;
import mmu.sef.fyj.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User login(String email, String password) throws Exception {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new Exception("User not found");
        }

        User user = userOpt.get();
        if (!verifyPassword(password, user.getPassword())) {
            throw new Exception("Invalid credentials");
        }

        return user;
    }

    public User registerStudent(String name, String email, String password, String studentId) throws Exception {
        if (userRepository.existsByEmail(email)) {
            throw new Exception("Email already in use");
        }

        String hashedPassword = hashPassword(password);
        User newUser = new User(name, email, hashedPassword, Role.STUDENT, studentId);

        return userRepository.save(newUser);
    }

    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Hashing error", e);
        }
    }

    private boolean verifyPassword(String rawPassword, String storedHash) {
        return hashPassword(rawPassword).equals(storedHash);
    }
}
