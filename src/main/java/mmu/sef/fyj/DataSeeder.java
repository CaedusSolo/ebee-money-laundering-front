package mmu.sef.fyj;

import mmu.sef.fyj.model.Role;
import mmu.sef.fyj.model.User;
import mmu.sef.fyj.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    public DataSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- Starting Data Seeding ---");

        // 1. Admin Account (1 Account)
        seedUser("System Admin", "admin@mmu.edu.my", "admin123", Role.ADMIN, null);

        // 2. Student Accounts (5 Accounts)
        for (int i = 1; i <= 5; i++) {
            seedUser(
                    "Student " + i,
                    "student" + i + "@mmu.edu.my",
                    "student123",
                    Role.STUDENT,
                    "11000" + i);
        }

        // 3. Committee Accounts (6 Accounts)
        for (int i = 1; i <= 6; i++) {
            seedUser(
                    "Committee Member " + i,
                    "committee" + i + "@mmu.edu.my",
                    "committee123",
                    Role.COMMITTEE,
                    null);
        }

        // 4. Reviewer Accounts (3 Accounts)
        for (int i = 1; i <= 3; i++) {
            seedUser(
                    "Reviewer " + i,
                    "reviewer" + i + "@mmu.edu.my",
                    "reviewer123",
                    Role.REVIEWER,
                    null);
        }

        System.out.println("--- Data Seeding Completed ---");
    }

    private void seedUser(String name, String email, String rawPassword, Role role, String studentId) {
        // Only create if email doesn't exist
        if (!userRepository.existsByEmail(email)) {
            String hashedPassword = hashPassword(rawPassword);
            User user = new User(name, email, hashedPassword, role, studentId);
            userRepository.save(user);
            System.out.println("Created: " + email + " [" + role + "]");
        } else {
            System.out.println("Skipped: " + email + " (Already exists)");
        }
    }

    // Helper to replicate AuthService hashing
    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error hashing password during seed", e);
        }
    }
}
