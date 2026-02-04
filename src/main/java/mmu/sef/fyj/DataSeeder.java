package mmu.sef.fyj;

import mmu.sef.fyj.model.*;
import mmu.sef.fyj.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final ApplicationRepository applicationRepository;
    private final ScholarshipCommitteeRepository committeeRepository;
    private final ReviewerRepository reviewerRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
            ScholarshipRepository scholarshipRepository,
            ApplicationRepository applicationRepository,
            ScholarshipCommitteeRepository committeeRepository,
            ReviewerRepository reviewerRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.scholarshipRepository = scholarshipRepository;
        this.applicationRepository = applicationRepository;
        this.committeeRepository = committeeRepository;
        this.reviewerRepository = reviewerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- Starting Secure Data Seeding ---");

        seedUsers();
        seedScholarships();
        seedApplications();
        seedGradedApplications();

        System.out.println("--- Data Seeding Completed ---");
    }

    private void seedUsers() {
        // 1. Admin Account
        seedUser("System Admin", "admin@gmail.com", "Admin123!", Role.ADMIN, null, null);

        // 2. Student Accounts
        for (int i = 1; i <= 5; i++) {
            seedUser(
                    "Student " + i,
                    "student" + i + "@gmail.com",
                    "Student123!",
                    Role.STUDENT,
                    "11000" + i,
                    null);
        }

        // 3. Committee Accounts
        for (int i = 1; i <= 6; i++) {
            List<Integer> assignments = new ArrayList<>();
            // Test Case: Committee 1 gets three different scholarships
            if (i == 1) {
                assignments.addAll(Arrays.asList(1, 2, 3));
            } else {
                assignments.add(1);
            }

            seedUser(
                    "Committee Member " + i,
                    "committee" + i + "@gmail.com",
                    "Committee123!",
                    Role.COMMITTEE,
                    null,
                    assignments);
        }

        // 4. Reviewer Accounts
        for (int i = 1; i <= 3; i++) {
            seedUser(
                    "Reviewer " + i,
                    "reviewer" + i + "@gmail.com",
                    "Reviewer123!",
                    Role.REVIEWER,
                    null,
                    null);
        }
    }

    private void seedUser(String name, String email, String rawPassword, Role role, String studentId, List<Integer> assignedIds) {
        if (!userRepository.existsByEmail(email)) {
            String encodedPassword = passwordEncoder.encode(rawPassword);

            User user = new User(name, email, encodedPassword, role, studentId);
            userRepository.save(user);

            if (role == Role.COMMITTEE && !committeeRepository.existsByEmail(email)) {
                ScholarshipCommittee sc = new ScholarshipCommittee();
                sc.setName(name);
                sc.setEmail(email);
                sc.setPassword(encodedPassword);

                // Use the passed assignments instead of hardcoded 1
                if (assignedIds != null) {
                    sc.getAssignedScholarshipIds().addAll(assignedIds);
                }

                committeeRepository.save(sc);
            }

            if (role == Role.REVIEWER && !reviewerRepository.existsByEmail(email)) {
                Reviewer reviewer = new Reviewer();
                reviewer.setName(name);
                reviewer.setEmail(email);
                reviewer.setPassword(encodedPassword);
                reviewer.setAssignedScholarshipId(1);
                reviewerRepository.save(reviewer);
            }
        }
    }

    private void seedScholarships() {
        if (scholarshipRepository.count() > 0) return;

        List<Scholarship> scholarships = List.of(
                new Scholarship("Merit's Scholarship", "Outstanding academic achievement.", LocalDate.now().plusMonths(3)),
                new Scholarship("President's Scholarship", "Highest honour for students.", LocalDate.now().plusMonths(4)),
                new Scholarship("High Achiever's Scholarship", "Strong academic records (3.7+).", LocalDate.now().plusMonths(2)),
                new Scholarship("Excellence in STEM Scholarship", "Science and Engineering focus.", LocalDate.now().plusMonths(5)));

        for (Scholarship s : scholarships) {
            scholarshipRepository.save(s);
        }
    }

    private void seedApplications() {
        if (applicationRepository.count() > 0) return;

        List<User> students = userRepository.findByRole(Role.STUDENT);
        List<Scholarship> scholarships = scholarshipRepository.findAll();

        if (students.isEmpty() || scholarships.isEmpty()) return;

        Random random = new Random(42);
        String[] firstNames = { "Ahmad", "Sarah", "Wei Kang", "Nurul", "Ravi", "Mei Ling" };
        String[] lastNames = { "Abdullah", "Lee", "Tan", "Ibrahim", "Kumar", "Wong" };
        ApplicationStatus[] statuses = { ApplicationStatus.SUBMITTED, ApplicationStatus.UNDER_REVIEW };

        for (Scholarship scholarship : scholarships) {
            for (int i = 0; i < 4 && i < students.size(); i++) {
                User student = students.get(i);
                Application app = new Application();
                app.setStudentID(student.getId());
                app.setScholarshipID(scholarship.getId());
                app.setFirstName(firstNames[random.nextInt(firstNames.length)]);
                app.setLastName(lastNames[random.nextInt(lastNames.length)]);
                app.setGender(random.nextBoolean() ? Gender.MALE : Gender.FEMALE);
                app.setNationality("Malaysian");
                app.setDateOfBirth(LocalDate.of(2000, 1, 1));
                app.setPhoneNumber("012-3456789");
                app.setNricNumber("000101-14-1234");
                app.setMonthlyFamilyIncome(5000f);
                app.setBumiputera(true);
                app.setStatus(statuses[random.nextInt(statuses.length)]);
                applicationRepository.save(app);
            }
        }
    }

    private void seedGradedApplications() {
        List<User> students = userRepository.findByRole(Role.STUDENT);
        List<Scholarship> scholarships = scholarshipRepository.findAll();

        if (students.isEmpty() || scholarships.isEmpty()) return;

        Random random = new Random(99);
        String[] firstNames = { "Ahmad", "Sarah", "Wei Kang", "Nurul", "Ravi", "Mei Ling" };
        String[] lastNames = { "Abdullah", "Lee", "Tan", "Ibrahim", "Kumar", "Wong" };

        for (Scholarship scholarship : scholarships) {
            for (int i = 0; i < 2 && i < students.size(); i++) {
                User student = students.get(i);
                Application app = new Application();
                app.setStudentID(student.getId());
                app.setScholarshipID(scholarship.getId());
                app.setFirstName(firstNames[random.nextInt(firstNames.length)]);
                app.setLastName(lastNames[random.nextInt(lastNames.length)]);
                app.setGender(random.nextBoolean() ? Gender.MALE : Gender.FEMALE);
                app.setNationality("Malaysian");
                app.setDateOfBirth(LocalDate.of(2000 + random.nextInt(4), 1, 1 + random.nextInt(28)));
                app.setPhoneNumber("012-" + (1000000 + random.nextInt(9000000)));
                app.setNricNumber("000101-14-" + (1000 + random.nextInt(9000)));
                app.setMonthlyFamilyIncome(3000f + random.nextFloat() * 7000);
                app.setBumiputera(random.nextBoolean());
                app.setStatus(ApplicationStatus.GRADED);
                applicationRepository.save(app);
            }
        }
    }
}
