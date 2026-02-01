package mmu.sef.fyj.service;

import mmu.sef.fyj.model.Student;
import mmu.sef.fyj.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class StudentService {
    
    @Autowired
    private StudentRepository StudentRepository;

    public Map<String, Object> getStudentDashboard(Integer studentId) {
        Map<String, Object> dashboard = new HashMap<>();

        // dummy student data for now  
        Map<String, Object> studentData = new HashMap<>();
        studentData.put("studentId", studentId);
        studentData.put("name", "Izzminhal");
        studentData.put("email", "izzminhal@student.mmu.edu.my");
        studentData.put("profileImage", "user.jpg"); // default icon image

        List<Map<String, Object>> applications = new ArrayList<>();
        
        Map<String, Object> app1 = new HashMap<>();
        app1.put("applicationId", 1);
        app1.put("scholarshipName", "Merit's Scholarship");
        app1.put("status", "UNDER REVIEW");
        app1.put("submittedDate", "15/01/2026");
        applications.add(app1);
        
        Map<String, Object> app2 = new HashMap<>();
        app2.put("applicationId", 2);
        app2.put("scholarshipName", "President's Scholarship");
        app2.put("status", "ACCEPTED");
        app2.put("submittedDate", "10/01/2026");
        applications.add(app2);
        
        Map<String, Object> app3 = new HashMap<>();
        app3.put("applicationId", 3);
        app3.put("scholarshipName", "High Achiever's Scholarship");
        app3.put("status", "SUBMITTED");
        app3.put("submittedDate", "20/01/2026");
        applications.add(app3);
        
        dashboard.put("student", studentData);
        dashboard.put("applications", applications);
        dashboard.put("totalApplications", applications.size());
        
        return dashboard;
    }

    public Map<String, Object> deleteStudentAccount(Integer studentId) {
        Map<String, Object> response = new HashMap<>();
        
        // stub for now
        System.out.println("Deleting student account: " + studentId);
        
        response.put("success", true);
        response.put("message", "Account deleted successfully");
        response.put("deletedAt", LocalDate.now().toString());
        
        return response;
    }

    public Map<String, Object> updateProfileImage(Integer studentId, String imageUrl) {
        Map<String, Object> response = new HashMap<>();
        
        // stub for now 
        System.out.println("Updating profile image for student: " + studentId);
        System.out.println("New image URL: " + imageUrl);
        
        response.put("success", true);
        response.put("message", "Profile image updated successfully");
        response.put("imageUrl", imageUrl);
        
        return response;
    }
}
