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
        String[] colleges = { "Multimedia University", "Universiti Malaya", "Universiti Teknologi Malaysia", "Universiti Sains Malaysia" };
        String[] majors = { "Computer Science", "Software Engineering", "Information Technology", "Data Science", "Cybersecurity" };
        String[] cities = { "Cyberjaya", "Kuala Lumpur", "Petaling Jaya", "Shah Alam", "Subang Jaya" };
        String[] states = { "Selangor", "Wilayah Persekutuan", "Johor", "Penang", "Perak" };
        String[] activities = { "Debate Club", "Basketball Team", "Volunteer Corps", "Coding Club", "Music Society", "Student Council" };
        String[] roles = { "President", "Vice President", "Secretary", "Member", "Team Captain", "Coordinator" };

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
                app.setDateOfBirth(LocalDate.of(2000 + random.nextInt(4), 1 + random.nextInt(12), 1 + random.nextInt(28)));
                app.setPhoneNumber("01" + random.nextInt(10) + "-" + (1000000 + random.nextInt(9000000)));
                app.setNricNumber("00010" + random.nextInt(10) + "-14-" + (1000 + random.nextInt(9000)));
                app.setMonthlyFamilyIncome(2000f + random.nextInt(8000));
                app.setBumiputera(random.nextBoolean());
                app.setStatus(statuses[random.nextInt(statuses.length)]);

                // Address
                app.setHomeAddress("No. " + (1 + random.nextInt(100)) + ", Jalan " + (1 + random.nextInt(20)));
                app.setCity(cities[random.nextInt(cities.length)]);
                app.setZipCode(String.valueOf(40000 + random.nextInt(10000)));
                app.setState(states[random.nextInt(states.length)]);

                // Education
                app.setCollege(colleges[random.nextInt(colleges.length)]);
                app.setMajor(majors[random.nextInt(majors.length)]);
                app.setCurrentYearOfStudy(1 + random.nextInt(4));
                app.setExpectedGraduationYear(2025 + random.nextInt(3));
                StudyLevel[] studyLevels = StudyLevel.values();
                app.setStudyLevel(studyLevels[random.nextInt(studyLevels.length)]);

                // Documents
                app.setNricDoc(new DocumentInfo("nric_" + student.getId() + ".pdf", "https://example.com/docs/nric_" + student.getId() + ".pdf", "application/pdf"));
                app.setTranscriptDoc(new DocumentInfo("transcript_" + student.getId() + ".pdf", "https://example.com/docs/transcript_" + student.getId() + ".pdf", "application/pdf"));
                app.setFamilyIncomeConfirmationDoc(new DocumentInfo("income_" + student.getId() + ".pdf", "https://example.com/docs/income_" + student.getId() + ".pdf", "application/pdf"));

                // Extracurriculars
                int numExtracurriculars = 1 + random.nextInt(3);
                for (int j = 0; j < numExtracurriculars; j++) {
                    Extracurricular extra = new Extracurricular(
                            activities[random.nextInt(activities.length)],
                            roles[random.nextInt(roles.length)],
                            "Achievement in " + (2020 + random.nextInt(5))
                    );
                    app.getExtracurriculars().add(extra);
                }

                applicationRepository.save(app);
            }
        }
    }
}
