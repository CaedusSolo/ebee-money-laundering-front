package mmu.sef.fyj.service;

import mmu.sef.fyj.model.*;
import mmu.sef.fyj.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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

        // 1. Get the authenticated user to find their unique email
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User account not found"));

        // 2. Fetch Committee Profile using the shared email
        ScholarshipCommittee committee = scholarshipCommitteeRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("Committee profile not found for: " + user.getEmail()));

        // 3. Fetch Assigned Scholarship
        if (committee.getAssignedScholarshipId() == null) {
            throw new RuntimeException("No scholarship has been assigned to this committee member yet.");
        }

        Scholarship scholarship = scholarshipRepository.findById(committee.getAssignedScholarshipId())
                .orElseThrow(() -> new RuntimeException("Assigned scholarship record not found"));

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", committee.getCommitteeId());
        profile.put("assignedScholarship", scholarship.getName());
        profile.put("assignedScholarshipId", scholarship.getId());

        // 4. Fetch Applications specifically for this scholarship
        List<Application> allApps = applicationRepository.findByScholarshipID(scholarship.getId());

        List<Map<String, Object>> pending = allApps.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.SUBMITTED)
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

    private Map<String, Object> mapToSummary(Application app) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", app.getApplicationID());
        map.put("studentName", app.getFirstName() + " " + app.getLastName());
        map.put("status", app.getStatus().name());
        map.put("submittedAt", app.getSubmittedAt() != null ? app.getSubmittedAt().toLocalDate().toString() : "N/A");

        // Map scores list to a property for the frontend
        map.put("scores", app.getGrades());
        return map;
    }
}
