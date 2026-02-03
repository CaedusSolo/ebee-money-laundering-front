package mmu.sef.fyj;

import mmu.sef.fyj.model.*;
import mmu.sef.fyj.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final ApplicationRepository applicationRepository;
    private final ScholarshipCommitteeRepository committeeRepository; // Added Repository
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
            ScholarshipRepository scholarshipRepository,
            ApplicationRepository applicationRepository,
            ScholarshipCommitteeRepository committeeRepository, // Added to Constructor
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.scholarshipRepository = scholarshipRepository;
        this.applicationRepository = applicationRepository;
        this.committeeRepository = committeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- Starting Secure Data Seeding ---");

        seedUsers();
        seedScholarships();
        seedApplications();

        System.out.println("--- Data Seeding Completed ---");
    }

    private void seedUsers() {
        // 1. Admin Account
        seedUser("System Admin", "admin@gmail.com", "Admin123!", Role.ADMIN, null);

        // 2. Student Accounts
        for (int i = 1; i <= 5; i++) {
            seedUser(
                    "Student " + i,
                    "student" + i + "@gmail.com",
                    "Student123!",
                    Role.STUDENT,
                    "11000" + i);
        }

        // 3. Committee Accounts
        for (int i = 1; i <= 6; i++) {
            seedUser(
                    "Committee Member " + i,
                    "committee" + i + "@gmail.com",
                    "Committee123!",
                    Role.COMMITTEE,
                    null);
        }

        // 4. Reviewer Accounts
        for (int i = 1; i <= 3; i++) {
            seedUser(
                    "Reviewer " + i,
                    "reviewer" + i + "@gmail.com",
                    "Reviewer123!",
                    Role.REVIEWER,
                    null);
        }
    }

    private void seedUser(String name, String email, String rawPassword, Role role, String studentId) {
        if (!userRepository.existsByEmail(email)) {
            String encodedPassword = passwordEncoder.encode(rawPassword);

            // Save to Authentication Table
            User user = new User(name, email, encodedPassword, role, studentId);
            userRepository.save(user);

            // FIX: If user is a Committee member, also create their Profile record
            if (role == Role.COMMITTEE && !committeeRepository.existsByEmail(email)) {
                ScholarshipCommittee committee = new ScholarshipCommittee();
                committee.setName(name);
                committee.setEmail(email);
                committee.setPassword(encodedPassword);
                committee.setAssignedScholarshipId(1); // Default assignment for testing
                committeeRepository.save(committee);
                System.out.println("Created Committee Profile: " + email);
            }

            System.out.println("Created User: " + email + " [" + role + "]");
        }
    }

    private void seedScholarships() {
        if (scholarshipRepository.count() > 0)
            return;

        List<Scholarship> scholarships = List.of(
                new Scholarship("Merit's Scholarship", "Outstanding academic achievement.",
                        LocalDate.now().plusMonths(3)),
                new Scholarship("President's Scholarship", "Highest honour for students.",
                        LocalDate.now().plusMonths(4)),
                new Scholarship("High Achiever's Scholarship", "Strong academic records (3.7+).",
                        LocalDate.now().plusMonths(2)),
                new Scholarship("Excellence in STEM Scholarship", "Science and Engineering focus.",
                        LocalDate.now().plusMonths(5)));

        for (Scholarship s : scholarships) {
            scholarshipRepository.save(s);
            System.out.println("Created Scholarship: " + s.getName());
        }
    }

    private void seedApplications() {
        if (applicationRepository.count() > 0)
            return;

        List<User> students = userRepository.findByRole(Role.STUDENT);
        List<Scholarship> scholarships = scholarshipRepository.findAll();

        if (students.isEmpty() || scholarships.isEmpty())
            return;

        Random random = new Random(42);
        String[] firstNames = { "Ahmad", "Sarah", "Wei Kang", "Nurul", "Ravi", "Mei Ling" };
        String[] lastNames = { "Abdullah", "Lee", "Tan", "Ibrahim", "Kumar", "Wong" };
        ApplicationStatus[] statuses = { ApplicationStatus.SUBMITTED, ApplicationStatus.UNDER_REVIEW,
                ApplicationStatus.GRADED };

        for (Scholarship scholarship : scholarships) {
            int numApplications = 2 + random.nextInt(3);
            for (int i = 0; i < numApplications && i < students.size(); i++) {
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
}
