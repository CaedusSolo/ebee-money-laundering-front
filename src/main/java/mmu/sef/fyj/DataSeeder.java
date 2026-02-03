package mmu.sef.fyj;

import mmu.sef.fyj.model.Role;
import mmu.sef.fyj.model.Scholarship;
import mmu.sef.fyj.model.User;
import mmu.sef.fyj.repository.ScholarshipRepository;
import mmu.sef.fyj.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
            ScholarshipRepository scholarshipRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.scholarshipRepository = scholarshipRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- Starting Secure Data Seeding ---");

        seedUsers();
        seedScholarships();

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

    private void seedScholarships() {
        if (scholarshipRepository.count() > 0) {
            return;
        }

        List<Scholarship> scholarships = List.of(
                new Scholarship(
                        "Merit's Scholarship",
                        "Awarded to students who demonstrate outstanding academic achievement and leadership. Applicants must have a minimum GPA of 3.5 and be enrolled full-time in an accredited programme.",
                        LocalDate.now().plusMonths(3)),
                new Scholarship(
                        "President's Scholarship",
                        "The highest honour for incoming students, covering full tuition and a living stipend. Open to top performers in academics, extracurricular activities, and community service.",
                        LocalDate.now().plusMonths(4)),
                new Scholarship(
                        "High Achiever's Scholarship",
                        "Designed for students with strong academic records (GPA 3.7+) and evidence of research or innovation. Recipients receive partial tuition support and mentorship opportunities.",
                        LocalDate.now().plusMonths(2)),
                new Scholarship(
                        "Excellence in STEM Scholarship",
                        "Supports students pursuing degrees in Science, Technology, Engineering, or Mathematics. Criteria include academic merit, project portfolio, and recommendation letters.",
                        LocalDate.now().plusMonths(5))
        );

        for (Scholarship s : scholarships) {
            scholarshipRepository.save(s);
            System.out.println("Created Scholarship: " + s.getName());
        }
    }

}
