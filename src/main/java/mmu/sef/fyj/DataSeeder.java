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

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final ScholarshipCommitteeRepository committeeRepository;
    private final ReviewerRepository reviewerRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
            StudentRepository studentRepository,
            ScholarshipRepository scholarshipRepository,
            ScholarshipCommitteeRepository committeeRepository,
            ReviewerRepository reviewerRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.scholarshipRepository = scholarshipRepository;
        this.committeeRepository = committeeRepository;
        this.reviewerRepository = reviewerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Skip seeding if users or scholarships already exist
        if (userRepository.count() > 0 || scholarshipRepository.count() > 0) {
            System.out.println("--- Data already exists, skipping seeding ---");
            return;
        }

        System.out.println("--- Starting Secure Data Seeding ---");

        seedUsers();
        seedScholarships();

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

    private void seedUser(String name, String email, String rawPassword, Role role, String studentId,
            List<Integer> assignedIds) {
        if (!userRepository.existsByEmail(email)) {
            String encodedPassword = passwordEncoder.encode(rawPassword);

            User user = new User(name, email, encodedPassword, role, studentId);
            userRepository.save(user);

            // Create Student record for STUDENT role to prevent N/A profiles
            if (role == Role.STUDENT && !studentRepository.existsByEmail(email)) {
                Student student = new Student(name, studentId, email, encodedPassword);
                studentRepository.save(student);
            }

            if (role == Role.COMMITTEE && !committeeRepository.existsByEmail(email)) {
                ScholarshipCommittee sc = new ScholarshipCommittee();
                sc.setName(name);
                sc.setEmail(email);
                sc.setPassword(encodedPassword);

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
        if (scholarshipRepository.count() > 0)
            return;

        Scholarship scholarship1 = new Scholarship("Merit's Scholarship",
                "Outstanding academic achievement. Candidates must maintain a strong CGPA and moderate family income.",
                LocalDate.now().plusMonths(3));
        scholarship1.setMinCGPA(3.5f);
        scholarship1.setMaxFamilyIncome(5000f);
        scholarship1.setMinGraduationYear(2026);
        scholarship1.setMustBumiputera(false);

        Scholarship scholarship2 = new Scholarship("President's Scholarship",
                "Highest honour for students. Bumiputera candidates only with excellent academic standing.",
                LocalDate.now().plusMonths(4));
        scholarship2.setMinCGPA(3.7f);
        scholarship2.setMaxFamilyIncome(4000f);
        scholarship2.setMinGraduationYear(2026);
        scholarship2.setMustBumiputera(true);

        Scholarship scholarship3 = new Scholarship("High Achiever's Scholarship",
                "For students with strong academic records. Minimum CGPA requirement applies.",
                LocalDate.now().plusMonths(2));
        scholarship3.setMinCGPA(3.5f);
        scholarship3.setMinGraduationYear(2027);

        Scholarship scholarship4 = new Scholarship("Excellence in STEM Scholarship",
                "For Science and Engineering students. Competitive CGPA and income requirements.",
                LocalDate.now().plusMonths(5));
        scholarship4.setMinCGPA(3.0f);
        scholarship4.setMaxFamilyIncome(6000f);

        List<Scholarship> scholarships = List.of(scholarship1, scholarship2, scholarship3, scholarship4);

        List<Reviewer> allReviewers = reviewerRepository.findAll();
        List<ScholarshipCommittee> allCommittees = committeeRepository.findAll();

        for (Scholarship s : scholarships) {
            if (allReviewers.size() >= 3) {
                s.getReviewers().add(allReviewers.get(0));
                s.getReviewers().add(allReviewers.get(1));
                s.getReviewers().add(allReviewers.get(2));
            }

            if (allCommittees.size() >= 3) {
                s.getScholarshipCommittees().add(allCommittees.get(0));
                s.getScholarshipCommittees().add(allCommittees.get(1));
                s.getScholarshipCommittees().add(allCommittees.get(2));
            }

            scholarshipRepository.save(s);
        }

        System.out.println("Seeded " + scholarships.size() + " scholarships.");
    }
}
