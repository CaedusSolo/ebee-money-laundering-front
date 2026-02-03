package mmu.sef.fyj.service;

import mmu.sef.fyj.model.Application;
import mmu.sef.fyj.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ScholarshipCommitteeService {

    @Autowired
    private ApplicationRepository applicationRepository;

    public Map<String, Object> getCommitteeDashboard(Integer committeeId) {
        List<Application> allApps = applicationRepository.findAll();

        List<Map<String, Object>> pending = allApps.stream()
                .filter(app -> "SUBMITTED".equals(app.getStatus().name()))
                .map(this::mapToSummary)
                .collect(Collectors.toList());

        List<Map<String, Object>> graded = allApps.stream()
                .filter(app -> "GRADED".equals(app.getStatus().name()))
                .map(this::mapToSummary)
                .collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAssigned", allApps.size());
        stats.put("pendingEvaluation", pending.size());
        stats.put("completed", graded.size());

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("stats", stats);
        dashboard.put("pendingApplications", pending);
        dashboard.put("gradedApplications", graded);

        return dashboard;
    }

    public Application getFullApplicationDetails(Integer applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with ID: " + applicationId));
    }

    private Map<String, Object> mapToSummary(Application app) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", app.getApplicationid());
        map.put("studentName", app.getFirstName() + " " + app.getLastName());
        map.put("status", app.getStatus().name());
        map.put("submittedAt", app.getSubmittedAt());
        // Map existing grades if available
        map.put("scores", app.getGrades());
        return map;
    }
}
