package mmu.sef.fyj.service;

import mmu.sef.fyj.model.ScholarshipCommittee;
import mmu.sef.fyj.repository.ScholarshipCommitteeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ScholarshipCommitteeService {

    @Autowired
    private ScholarshipCommitteeRepository scholarshipCommitteeRepository;

    public List<ScholarshipCommittee> findAll() {
        return scholarshipCommitteeRepository.findAll();
    }

    public Map<String, Object> getCommitteeDashboard(Integer committeeId) {
        Map<String, Object> dashboard = new HashMap<>();

        // Profile data (In a real app, you would fetch this from
        // ScholarshipCommitteeRepository)
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", committeeId);
        profile.put("assignedScholarship", "Merit's Scholarship");
        profile.put("assignedScholarshipId", 1);

        // Dummy applications assigned to this committee's scholarship
        List<Map<String, Object>> applications = new ArrayList<>();

        Map<String, Object> app1 = new HashMap<>();
        app1.put("id", "APP-2026-001");
        app1.put("status", "Pending");
        app1.put("submittedDate", "15/01/2026");
        app1.put("scores", new HashMap<String, Object>() {
            {
                put("academic", null);
                put("curriculum", null);
                put("leadership", null);
            }
        });
        applications.add(app1);

        Map<String, Object> app2 = new HashMap<>();
        app2.put("id", "APP-2026-002");
        app2.put("status", "Graded");
        app2.put("submittedDate", "16/01/2026");
        app2.put("scores", new HashMap<String, Object>() {
            {
                put("academic", 18);
                put("curriculum", 15);
                put("leadership", 17);
            }
        });
        app2.put("totalScore", 83);
        applications.add(app2);

        dashboard.put("profile", profile);
        dashboard.put("applications", applications);

        return dashboard;
    }
}
