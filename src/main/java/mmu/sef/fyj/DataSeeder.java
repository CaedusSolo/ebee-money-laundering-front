package mmu.sef.fyj;

import mmu.sef.fyj.model.Role;
import mmu.sef.fyj.model.User;
import mmu.sef.fyj.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- Starting Secure Data Seeding ---");

        seedUsers();

        System.out.println("--- Data Seeding Completed ---");
    }

    private void seedUsers() {
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
    }

    private void seedUser(String name, String email, String rawPassword, Role role, String studentId) {
        if (!userRepository.existsByEmail(email)) {
            // SECURE: Encode password using BCrypt
            String encodedPassword = passwordEncoder.encode(rawPassword);

            User user = new User(name, email, encodedPassword, role, studentId);
            userRepository.save(user);
            System.out.println("Created User: " + email + " [" + role + "]");
        }
    }

}
