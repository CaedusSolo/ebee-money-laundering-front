package mmu.sef.fyj.service;

import mmu.sef.fyj.dto.ApplicationDetailsDTO;
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
    @Autowired
    private ApplicationService applicationService;

    public List<ScholarshipCommittee> findAll() {
        return scholarshipCommitteeRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getCommitteeDashboard(Integer userId) {
        Map<String, Object> dashboard = new HashMap<>();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User account not found"));

        // FIX: Graceful handling if the user exists but isn't in the committee table
        Optional<ScholarshipCommittee> committeeOpt = scholarshipCommitteeRepository.findByEmail(user.getEmail());

        if (committeeOpt.isEmpty()) {
            // Return empty data instead of crashing
            dashboard.put("scholarships", new HashMap<>());
            dashboard.put("warning", "Account verified, but no Committee Profile linked to " + user.getEmail());
            return dashboard;
        }

        ScholarshipCommittee committee = committeeOpt.get();
        Integer currentCommitteeId = committee.getCommitteeId();
        List<Integer> scholarshipIds = committee.getAssignedScholarshipIds();

        if (scholarshipIds == null || scholarshipIds.isEmpty()) {
            dashboard.put("scholarships", new HashMap<>());
            return dashboard;
        }

        List<Application> allAssignedApps = applicationRepository.findByScholarshipIDIn(scholarshipIds).stream()
                .filter(app -> app.getStatus() != ApplicationStatus.DRAFT)
                .collect(Collectors.toList());

        Map<Integer, String> scholarshipNames = scholarshipRepository.findAllById(scholarshipIds)
                .stream().collect(Collectors.toMap(Scholarship::getId, Scholarship::getName));

        Map<String, Map<String, List<Map<String, Object>>>> groupedScholarships = new HashMap<>();

        for (Integer sId : scholarshipIds) {
            String name = scholarshipNames.getOrDefault(sId, "Scholarship " + sId);
            List<Application> appsForThisType = allAssignedApps.stream()
                    .filter(app -> app.getScholarshipID().equals(sId))
                    .toList();

            Map<String, List<Map<String, Object>>> groups = new HashMap<>();

            // Pending
            groups.put("pending", appsForThisType.stream()
                    .filter(app -> app.getGrades().stream()
                            .noneMatch(g -> g.getCommitteeId() != null && g.getCommitteeId().equals(currentCommitteeId)))
                    .map(app -> mapToSummary(app, currentCommitteeId))
                    .toList());

            // Evaluated
            groups.put("evaluated", appsForThisType.stream()
                    .filter(app -> app.getGrades().stream()
                            .anyMatch(g -> g.getCommitteeId() != null && g.getCommitteeId().equals(currentCommitteeId)))
                    .map(app -> mapToSummary(app, currentCommitteeId))
                    .toList());

            groupedScholarships.put(name, groups);
        }

        dashboard.put("scholarships", groupedScholarships);
        return dashboard;
    }

    @Transactional
    public void evaluateApplication(Integer applicationId, Map<String, Object> evaluationData, Integer userId) {
        Application app = applicationRepository.findById(applicationId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();

        // Same safety check for evaluation
        ScholarshipCommittee committee = scholarshipCommitteeRepository.findByEmail(user.getEmail())
             .orElseThrow(() -> new RuntimeException("Committee profile not found. You cannot grade applications."));

        Integer committeeId = committee.getCommitteeId();
        String remarks = (String) evaluationData.get("comments");

        app.getGrades().removeIf(g -> g.getCommitteeId() != null && g.getCommitteeId().equals(committeeId));

        app.getGrades().add(new Grade(committeeId, "ACADEMIC", parseInteger(evaluationData.get("academic")), remarks));
        app.getGrades().add(new Grade(committeeId, "CURRICULUM", parseInteger(evaluationData.get("curriculum")), remarks));
        app.getGrades().add(new Grade(committeeId, "LEADERSHIP", parseInteger(evaluationData.get("leadership")), remarks));

        Scholarship scholarship = scholarshipRepository.findById(app.getScholarshipID()).orElseThrow();
        int requiredGraders = scholarship.getScholarshipCommittees().size();

        long currentGradersCount = app.getGrades().stream()
                .map(Grade::getCommitteeId)
                .filter(Objects::nonNull)
                .distinct()
                .count();

        if (currentGradersCount >= requiredGraders && requiredGraders > 0) {
            app.setStatus(ApplicationStatus.GRADED);
        } else {
            app.setStatus(ApplicationStatus.UNDER_REVIEW);
        }

        applicationRepository.save(app);
    }

    private Integer parseInteger(Object obj) {
        if (obj == null) return 0;
        if (obj instanceof Integer) return (Integer) obj;
        try { return Integer.parseInt(obj.toString()); } catch (Exception e) { return 0; }
    }

    public ApplicationDetailsDTO getFullApplicationDetails(Integer applicationId) {
        return applicationService.findDetailsById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application details not found"));
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
                .toList();

        for (Grade g : myGrades) {
            scores.put(g.getCategory().toLowerCase(), g.getScore());
            rawTotal += (g.getScore() != null ? g.getScore() : 0);
            scores.put("remarks", g.getRemarks());
        }

        map.put("scores", scores);
        map.put("totalScore", rawTotal);
        map.put("status", myGrades.isEmpty() ? "PENDING" : "GRADED");

        return map;
    }
}
