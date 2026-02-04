package mmu.sef.fyj.service;

import mmu.sef.fyj.model.*;
import mmu.sef.fyj.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ScholarshipCommitteeService {

    @Autowired
    private ScholarshipCommitteeRepository scholarshipCommitteeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ScholarshipRepository scholarshipRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    /**
     * Fetches the dashboard data for a specific committee member.
     * Logic:
     * 1. Links User (auth) to Committee Profile via email.
     * 2. Filters applications by the scholarship type assigned to that member.
     * 3. Sorts applications into "Pending" or "Graded" based on whether THIS
     * member's ID
     * appears in the application's grade list.
     */
    public Map<String, Object> getCommitteeDashboard(Integer userId) {
        Map<String, Object> dashboard = new HashMap<>();

        // 1. Resolve Identity
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User account not found"));

        ScholarshipCommittee committee = scholarshipCommitteeRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("Committee profile not found for: " + user.getEmail()));

        Integer currentCommitteeId = committee.getCommitteeId();

        // 2. Resolve Assigned Scholarship
        if (committee.getAssignedScholarshipId() == null) {
            throw new RuntimeException("No scholarship assigned to this committee member.");
        }

        Scholarship scholarship = scholarshipRepository.findById(committee.getAssignedScholarshipId())
                .orElseThrow(() -> new RuntimeException("Assigned scholarship record not found"));

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", currentCommitteeId);
        profile.put("assignedScholarship", scholarship.getName());
        profile.put("assignedScholarshipId", scholarship.getId());

        // 3. Fetch Applications for this scholarship type
        List<Application> appsForScholarship = applicationRepository.findByScholarshipID(scholarship.getId());

        // 4. Group by current member's grading status
        // Pending: This committee member has NOT graded this app yet
        List<Map<String, Object>> pending = appsForScholarship.stream()
                .filter(app -> app.getGrades().stream()
                        .noneMatch(g -> g.getCommitteeId() != null && g.getCommitteeId().equals(currentCommitteeId)))
                .map(app -> mapToSummary(app, currentCommitteeId))
                .collect(Collectors.toList());

        // Graded: This committee member HAS graded this app
        List<Map<String, Object>> graded = appsForScholarship.stream()
                .filter(app -> app.getGrades().stream()
                        .anyMatch(g -> g.getCommitteeId() != null && g.getCommitteeId().equals(currentCommitteeId)))
                .map(app -> mapToSummary(app, currentCommitteeId))
                .collect(Collectors.toList());

        dashboard.put("profile", profile);
        dashboard.put("pendingApplications", pending);
        dashboard.put("gradedApplications", graded);

        return dashboard;
    }

    /**
     * Saves rubric scores for a specific application.
     * Grades are stored individually per committee member.
     */
    @Transactional
    public void evaluateApplication(Integer applicationId, Map<String, Object> evaluationData, Integer userId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Resolve current committee ID from the auth user
        User user = userRepository.findById(userId).orElseThrow();
        ScholarshipCommittee committee = scholarshipCommitteeRepository.findByEmail(user.getEmail()).orElseThrow();
        Integer committeeId = committee.getCommitteeId();

        String remarks = (String) evaluationData.get("comments");

        // Remove existing grades for this specific member if they are re-submitting
        app.getGrades().removeIf(g -> g.getCommitteeId() != null && g.getCommitteeId().equals(committeeId));

        // Add new raw grades (max 20 per category)
        app.getGrades().add(new Grade(committeeId, "ACADEMIC", (Integer) evaluationData.get("academic"), remarks));
        app.getGrades().add(new Grade(committeeId, "CURRICULUM", (Integer) evaluationData.get("curriculum"), remarks));
        app.getGrades().add(new Grade(committeeId, "LEADERSHIP", (Integer) evaluationData.get("leadership"), remarks));

        // Note: We update the global status to UNDER_REVIEW or GRADED
        app.setStatus(ApplicationStatus.GRADED);

        applicationRepository.save(app);
    }

    public Application getFullApplicationDetails(Integer applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    /**
     * Formats data for the Dashboard view.
     * Only calculates and shows scores provided by the SPECIFIC logged-in member.
     */
    private Map<String, Object> mapToSummary(Application app, Integer currentCommitteeId) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", app.getApplicationID());
        map.put("studentName", app.getFirstName() + " " + app.getLastName());
        map.put("submittedAt", app.getSubmittedAt() != null ? app.getSubmittedAt().toLocalDate().toString() : "N/A");

        // Extract scores given by THIS committee member
        Map<String, Object> scores = new HashMap<>();
        int rawTotal = 0;

        List<Grade> myGrades = app.getGrades().stream()
                .filter(g -> g.getCommitteeId() != null && g.getCommitteeId().equals(currentCommitteeId))
                .collect(Collectors.toList());

        for (Grade g : myGrades) {
            String categoryKey = g.getCategory().toLowerCase();
            scores.put(categoryKey, g.getScore());
            rawTotal += (g.getScore() != null ? g.getScore() : 0);
        }

        // Initialize null values for frontend consistency
        if (!scores.containsKey("academic"))
            scores.put("academic", null);
        if (!scores.containsKey("curriculum"))
            scores.put("curriculum", null);
        if (!scores.containsKey("leadership"))
            scores.put("leadership", null);

        map.put("scores", scores);
        map.put("status", myGrades.isEmpty() ? "PENDING" : "GRADED");
        map.put("totalScore", rawTotal); // Raw sum (Max 60)
        return map;
    }
}
