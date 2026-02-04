package mmu.sef.fyj;

import mmu.sef.fyj.model.*;
import mmu.sef.fyj.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
        String[] firstNames = { 
            "Ahmad", "Sarah", "Wei Kang", "Nurul", "Ravi", "Mei Ling",
            "Hassan", "Aisha", "Prabhu", "Zainab", "Vikram", "Noor",
            "Jamal", "Leila", "Arjun", "Fatimah", "Mohammed", "Siti"
        };
        String[] lastNames = { 
            "Abdullah", "Lee", "Tan", "Ibrahim", "Kumar", "Wong",
            "Ali", "Chen", "Lim", "Hassan", "Singh", "Ng",
            "Rahman", "Ooi", "Ong", "Mohamed", "Sharma", "Koh"
        };
        String[] comments = {
            "Excellent academic performance with strong leadership demonstrated in projects. Well-rounded candidate.",
            "Good overall performance. Shows potential for growth in leadership roles. Consistent contributor in activities.",
            "Outstanding student with exceptional leadership qualities. Highly active in extracurricular activities. Strongly recommended.",
            "Strong academic background with solid extracurricular involvement. Shows promising potential for the future.",
            "Demonstrates well-balanced skills across academics and leadership. Good fit for the scholarship.",
            "Exceptional commitment to community service and academic excellence. Highly motivated and driven student."
        };

        // Each student applies to each scholarship exactly once (respects the unique constraint)
        // Distribute applications across different statuses
        ApplicationStatus[] allStatuses = { ApplicationStatus.PENDING_APPROVAL, ApplicationStatus.UNDER_REVIEW,
                ApplicationStatus.GRADED, ApplicationStatus.APPROVED, ApplicationStatus.REJECTED };
        String[] colleges = { "Multimedia University", "Universiti Malaya", "Universiti Teknologi Malaysia", "Universiti Sains Malaysia" };
        String[] majors = { "Computer Science", "Software Engineering", "Information Technology", "Data Science", "Cybersecurity" };
        String[] cities = { "Cyberjaya", "Kuala Lumpur", "Petaling Jaya", "Shah Alam", "Subang Jaya" };
        String[] states = { "Selangor", "Wilayah Persekutuan", "Johor", "Penang", "Perak" };
        String[] activities = { "Debate Club", "Basketball Team", "Volunteer Corps", "Coding Club", "Music Society",
                "Student Council" };
        String[] roles = { "President", "Vice President", "Secretary", "Member", "Team Captain", "Coordinator" };

        int appIndex = 0;
        for (Scholarship scholarship : scholarships) {
            for (int i = 0; i < students.size(); i++) {
                User student = students.get(i);
                Application app = new Application();
                app.setStudentID(student.getId());
                app.setScholarshipID(scholarship.getId());
                app.setFirstName(firstNames[random.nextInt(firstNames.length)]);
                app.setLastName(lastNames[random.nextInt(lastNames.length)]);
                app.setGender(random.nextBoolean() ? Gender.MALE : Gender.FEMALE);
                app.setNationality("Malaysian");
                app.setDateOfBirth(
                        LocalDate.of(2000 + random.nextInt(4), 1 + random.nextInt(12), 1 + random.nextInt(28)));
                app.setPhoneNumber("01" + random.nextInt(10) + "-" + (1000000 + random.nextInt(9000000)));
                app.setNricNumber("00010" + random.nextInt(10) + "-14-" + (1000 + random.nextInt(9000)));
                app.setMonthlyFamilyIncome(2000f + random.nextInt(8000));
                app.setBumiputera(random.nextBoolean());
                
                // Assign status: distribute applications between PENDING_APPROVAL and UNDER_REVIEW
                ApplicationStatus status;
                int appPair = i; // Student index within each scholarship
                
                // For scholarship 1 (Merit's Scholarship), assign more applications for reviewer 1
                if (scholarship.getId() == 1) {
                    // Alternate between PENDING_APPROVAL and UNDER_REVIEW
                    status = (appPair % 2 == 0) ? ApplicationStatus.PENDING_APPROVAL : ApplicationStatus.UNDER_REVIEW;
                } else {
                    // For other scholarships, use the same distribution
                    status = (appPair % 2 == 0) ? ApplicationStatus.PENDING_APPROVAL : ApplicationStatus.UNDER_REVIEW;
                }

                app.setStatus(status);
                app.setSubmittedAt(LocalDateTime.now().minusDays(random.nextInt(30)));

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
                app.setNricDoc(new DocumentInfo("nric_" + student.getId() + ".pdf",
                        "https://example.com/docs/nric_" + student.getId() + ".pdf", "application/pdf"));
                app.setTranscriptDoc(new DocumentInfo("transcript_" + student.getId() + ".pdf",
                        "https://example.com/docs/transcript_" + student.getId() + ".pdf", "application/pdf"));
                app.setFamilyIncomeConfirmationDoc(new DocumentInfo("income_" + student.getId() + ".pdf",
                        "https://example.com/docs/income_" + student.getId() + ".pdf", "application/pdf"));

                // Extracurriculars
                int numExtracurriculars = 1 + random.nextInt(3);
                for (int j = 0; j < numExtracurriculars; j++) {
                    Extracurricular extra = new Extracurricular(
                            activities[random.nextInt(activities.length)],
                            roles[random.nextInt(roles.length)],
                            "Achievement in " + (2020 + random.nextInt(5)));
                    app.getExtracurriculars().add(extra);
                }

                Application savedApp = applicationRepository.save(app);
                
                // Add committee grades to PENDING_APPROVAL applications
                if (status == ApplicationStatus.PENDING_APPROVAL) {
                    List<Grade> grades = new ArrayList<>();
                    addRandomGradesToList(grades, random, comments);
                    for (Grade grade : grades) {
                        savedApp.getGrades().add(grade);
                    }
                    applicationRepository.save(savedApp);
                }
            }
        }
    }

    private void addRandomGradesToList(List<Grade> grades, Random random, String[] comments) {
        String[] committeeNames = { "Dr. Ahmed Khan", "Prof. Sarah Osman", "Assoc. Prof. Fatimah Hassan" };
        String[] committeeRoles = { "Academic Excellence Committee", "Leadership Committee", "Student Affairs Committee" };
        
        for (int j = 0; j < 3; j++) {
            // Generate varied scores (14-19 range per rubric)
            int academic = 14 + random.nextInt(6);
            int cocurricular = 14 + random.nextInt(6);
            int leadership = 14 + random.nextInt(6);
            int rawScore = academic + cocurricular + leadership;
            int normalizedScore = (rawScore * 100) / 60;
            
            // Create committee review as a formatted comment
            String reviewData = String.format(
                "{\"reviewID\":%d,\"committeeMemberName\":\"%s\",\"committeeMemberRole\":\"%s\",\"academicRubric\":%d,\"cocurricularRubric\":%d,\"leadershipRubric\":%d,\"rawScore\":%d,\"normalizedScore\":%d,\"comment\":\"%s\"}",
                j + 1,
                committeeNames[j],
                committeeRoles[j],
                academic,
                cocurricular,
                leadership,
                rawScore,
                normalizedScore,
                comments[random.nextInt(comments.length)]
            );
            
            Grade grade = new Grade(
                j + 1,
                "COMMITTEE_REVIEW_" + (j + 1),
                normalizedScore,
                reviewData
            );
            grades.add(grade);
        }
    }
}
