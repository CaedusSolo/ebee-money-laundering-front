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

    public Map<String, Object> getCommitteeDashboard(Integer userId) {
        Map<String, Object> dashboard = new HashMap<>();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User account not found"));

        ScholarshipCommittee committee = scholarshipCommitteeRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("Committee profile not found for: " + user.getEmail()));

        if (committee.getAssignedScholarshipId() == null) {
            throw new RuntimeException("No scholarship has been assigned to this committee member yet.");
        }

        Scholarship scholarship = scholarshipRepository.findById(committee.getAssignedScholarshipId())
                .orElseThrow(() -> new RuntimeException("Assigned scholarship record not found"));

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", committee.getCommitteeId());
        profile.put("assignedScholarship", scholarship.getName());
        profile.put("assignedScholarshipId", scholarship.getId());

        List<Application> allApps = applicationRepository.findByScholarshipID(scholarship.getId());

        List<Map<String, Object>> pending = allApps.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.SUBMITTED
                        || app.getStatus() == ApplicationStatus.UNDER_REVIEW)
                .map(this::mapToSummary)
                .collect(Collectors.toList());

        List<Map<String, Object>> graded = allApps.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.GRADED)
                .map(this::mapToSummary)
                .collect(Collectors.toList());

        dashboard.put("profile", profile);
        dashboard.put("pendingApplications", pending);
        dashboard.put("gradedApplications", graded);

        return dashboard;
    }

    public Application getFullApplicationDetails(Integer applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    @Transactional
    public void evaluateApplication(Integer applicationId, Map<String, Object> evaluationData) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        String remarks = (String) evaluationData.get("comments");

        // Build new grades list (Replacing old ones if they exist)
        List<Grade> grades = new ArrayList<>();
        grades.add(new Grade("ACADEMIC", (Integer) evaluationData.get("academic"), remarks));
        grades.add(new Grade("CURRICULUM", (Integer) evaluationData.get("curriculum"), remarks));
        grades.add(new Grade("LEADERSHIP", (Integer) evaluationData.get("leadership"), remarks));

        app.setGrades(grades);
        app.setStatus(ApplicationStatus.GRADED);

        applicationRepository.save(app);
    }

    private Map<String, Object> mapToSummary(Application app) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", app.getApplicationID());
        map.put("studentName", app.getFirstName() + " " + app.getLastName());
        map.put("status", app.getStatus().name());
        map.put("submittedAt", app.getSubmittedAt() != null ? app.getSubmittedAt().toLocalDate().toString() : "N/A");

        Map<String, Object> scores = new HashMap<>();
        int total = 0;
        for (Grade g : app.getGrades()) {
            scores.put(g.getCategory().toLowerCase(), g.getScore());
            total += (g.getScore() != null ? g.getScore() : 0);
        }

        map.put("scores", scores);
        // Normalize score to 100 based on max 60 (3 categories * 20)
        map.put("totalScore", Math.round((total / 60.0) * 100));
        return map;
    }
}
