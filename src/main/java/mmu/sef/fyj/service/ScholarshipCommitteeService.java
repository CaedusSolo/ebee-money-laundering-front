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

    public List<ScholarshipCommittee> findAll() {
        return scholarshipCommitteeRepository.findAll();
    }

    public Map<String, Object> getCommitteeDashboard(Integer userId) {
        Map<String, Object> dashboard = new HashMap<>();

        // 1. Resolve Identity
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User account not found"));

        ScholarshipCommittee committee = scholarshipCommitteeRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("Committee profile not found for: " + user.getEmail()));

        Integer currentCommitteeId = committee.getCommitteeId();
        List<Integer> scholarshipIds = committee.getAssignedScholarshipIds();

        if (scholarshipIds == null || scholarshipIds.isEmpty()) {
            throw new RuntimeException("No scholarships assigned to this committee member.");
        }

        // 2. Fetch All Assigned Applications
        List<Application> allAssignedApps = applicationRepository.findByScholarshipIDIn(scholarshipIds);

        // 3. Resolve Scholarship Names for grouping headings
        Map<Integer, String> scholarshipNames = scholarshipRepository.findAllById(scholarshipIds)
                .stream().collect(Collectors.toMap(Scholarship::getId, Scholarship::getName));

        // 4. Group by Scholarship Name and then Status
        // This creates the "scholarships" key the frontend is looking for
        Map<String, Map<String, List<Map<String, Object>>>> groupedScholarships = new HashMap<>();

        for (Integer sId : scholarshipIds) {
            String name = scholarshipNames.getOrDefault(sId, "Scholarship " + sId);

            List<Application> appsForThisType = allAssignedApps.stream()
                    .filter(app -> app.getScholarshipID().equals(sId))
                    .collect(Collectors.toList());

            Map<String, List<Map<String, Object>>> groups = new HashMap<>();

            // Pending: Applications this specific member hasn't graded
            groups.put("pending", appsForThisType.stream()
                    .filter(app -> app.getGrades().stream()
                            .noneMatch(
                                    g -> g.getCommitteeId() != null && g.getCommitteeId().equals(currentCommitteeId)))
                    .map(app -> mapToSummary(app, currentCommitteeId))
                    .collect(Collectors.toList()));

            // Graded: Applications this specific member has graded
            groups.put("graded", appsForThisType.stream()
                    .filter(app -> app.getGrades().stream()
                            .anyMatch(g -> g.getCommitteeId() != null && g.getCommitteeId().equals(currentCommitteeId)))
                    .map(app -> mapToSummary(app, currentCommitteeId))
                    .collect(Collectors.toList()));

            groupedScholarships.put(name, groups);
        }

        // 5. Final Output
        Map<String, Object> profileInfo = new HashMap<>();
        profileInfo.put("name", committee.getName());
        profileInfo.put("assignedCount", scholarshipIds.size());

        dashboard.put("profile", profileInfo);
        dashboard.put("scholarships", groupedScholarships); // The frontend needs this key

        return dashboard;
    }

    @Transactional
    public void evaluateApplication(Integer applicationId, Map<String, Object> evaluationData, Integer userId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        User user = userRepository.findById(userId).orElseThrow();
        ScholarshipCommittee committee = scholarshipCommitteeRepository.findByEmail(user.getEmail()).orElseThrow();
        Integer committeeId = committee.getCommitteeId();

        String remarks = (String) evaluationData.get("comments");

        app.getGrades().removeIf(g -> g.getCommitteeId() != null && g.getCommitteeId().equals(committeeId));

        app.getGrades().add(new Grade(committeeId, "ACADEMIC", (Integer) evaluationData.get("academic"), remarks));
        app.getGrades().add(new Grade(committeeId, "CURRICULUM", (Integer) evaluationData.get("curriculum"), remarks));
        app.getGrades().add(new Grade(committeeId, "LEADERSHIP", (Integer) evaluationData.get("leadership"), remarks));

        app.setStatus(ApplicationStatus.GRADED);
        applicationRepository.save(app);
    }

    public Application getFullApplicationDetails(Integer applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    private Map<String, Object> mapToSummary(Application app, Integer currentCommitteeId) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", app.getApplicationID());
        map.put("studentName", app.getFirstName() + " " + app.getLastName());
        map.put("submittedAt", app.getSubmittedAt() != null ? app.getSubmittedAt().toLocalDate().toString() : "N/A");

        Map<String, Object> scores = new HashMap<>();
        int rawTotal = 0;

        List<Grade> myGrades = app.getGrades().stream()
                .filter(g -> g.getCommitteeId() != null && g.getCommitteeId().equals(currentCommitteeId))
                .collect(Collectors.toList());

        for (Grade g : myGrades) {
            String key = g.getCategory().toLowerCase();
            scores.put(key, g.getScore());
            rawTotal += (g.getScore() != null ? g.getScore() : 0);
            scores.put("remarks", g.getRemarks());
        }

        if (!scores.containsKey("academic"))
            scores.put("academic", null);
        if (!scores.containsKey("curriculum"))
            scores.put("curriculum", null);
        if (!scores.containsKey("leadership"))
            scores.put("leadership", null);

        map.put("scores", scores);
        map.put("status", myGrades.isEmpty() ? "PENDING" : "GRADED");
        map.put("totalScore", rawTotal);
        return map;
    }
}
