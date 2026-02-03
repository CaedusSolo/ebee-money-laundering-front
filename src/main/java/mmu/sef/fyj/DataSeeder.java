package mmu.sef.fyj;

import mmu.sef.fyj.model.*;
import mmu.sef.fyj.repository.ApplicationRepository;
import mmu.sef.fyj.repository.ScholarshipRepository;
import mmu.sef.fyj.repository.UserRepository;
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
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
            ScholarshipRepository scholarshipRepository,
            ApplicationRepository applicationRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.scholarshipRepository = scholarshipRepository;
        this.applicationRepository = applicationRepository;
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

    private void seedApplications() {
        if (applicationRepository.count() > 0) {
            return;
        }

        List<User> students = userRepository.findByRole(Role.STUDENT);
        List<Scholarship> scholarships = scholarshipRepository.findAll();

        if (students.isEmpty() || scholarships.isEmpty()) {
            System.out.println("Skipping application seeding: No students or scholarships found.");
            return;
        }

        Random random = new Random(42);
        String[] firstNames = {"Ahmad", "Sarah", "Wei Kang", "Nurul", "Ravi", "Mei Ling", "Muhammad", "Priya"};
        String[] lastNames = {"Abdullah", "Lee", "Tan", "Ibrahim", "Kumar", "Wong", "Hassan", "Raj"};
        String[] majors = {"Computer Science", "Data Science", "Software Engineering", "Cybersecurity", "Information Technology"};
        String[] colleges = {"Faculty of Computing", "Faculty of Engineering", "Faculty of Information Science"};
        ApplicationStatus[] statuses = {ApplicationStatus.SUBMITTED, ApplicationStatus.UNDER_REVIEW, ApplicationStatus.GRADED, ApplicationStatus.APPROVED, ApplicationStatus.REJECTED};

        int applicationCount = 0;
        for (Scholarship scholarship : scholarships) {
            // Create 2-4 applications per scholarship
            int numApplications = 2 + random.nextInt(3);

            for (int i = 0; i < numApplications && i < students.size(); i++) {
                User student = students.get(i % students.size());

                Application app = new Application();
                app.setStudentID(student.getId());
                app.setScholarshipID(scholarship.getId());
                app.setFirstName(firstNames[random.nextInt(firstNames.length)]);
                app.setLastName(lastNames[random.nextInt(lastNames.length)]);
                app.setGender(random.nextBoolean() ? Gender.MALE : Gender.FEMALE);
                app.setNationality("Malaysian");
                app.setDateOfBirth(LocalDate.of(2000 + random.nextInt(5), 1 + random.nextInt(12), 1 + random.nextInt(28)));
                app.setPhoneNumber("01" + (random.nextInt(9) + 1) + "-" + (1000000 + random.nextInt(9000000)));
                app.setNricNumber("00010" + (1000 + random.nextInt(9000)) + "-" + (10 + random.nextInt(90)) + "-" + (1000 + random.nextInt(9000)));
                app.setMonthlyFamilyIncome(2000f + random.nextFloat() * 8000f);
                app.setBumiputera(random.nextBoolean());

                app.setHomeAddress((10 + random.nextInt(90)) + " Jalan " + (random.nextInt(20) + 1));
                app.setCity("Cyberjaya");
                app.setZipCode("6310" + random.nextInt(10));
                app.setState("Selangor");

                app.setCollege(colleges[random.nextInt(colleges.length)]);
                app.setCurrentYearOfStudy(1 + random.nextInt(4));
                app.setExpectedGraduationYear(2025 + random.nextInt(3));
                app.setMajor(majors[random.nextInt(majors.length)]);
                app.setStudyLevel(StudyLevel.BACHELOR);

                app.setStatus(statuses[random.nextInt(statuses.length)]);
                if (app.getStatus() != ApplicationStatus.DRAFT) {
                    app.setSubmittedAt(app.getCreatedAt().plusDays(random.nextInt(7)));
                }

                applicationRepository.save(app);
                applicationCount++;
            }
        }

        System.out.println("Created " + applicationCount + " Applications across " + scholarships.size() + " scholarships");
    }

}
