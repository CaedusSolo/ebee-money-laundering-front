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
    private StudentRepository studentRepository;

    public Map<String, Object> getStudentDashboard(Integer studentId) {
        Map<String, Object> dashboard = new HashMap<>();

        // Fetch actual student from database
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        
        if (studentOpt.isEmpty()) {
            throw new RuntimeException("Student not found with ID: " + studentId);
        }
        
        Student student = studentOpt.get();
        
        // Build student data
        Map<String, Object> studentData = new HashMap<>();
        studentData.put("studentId", student.getStudentId());
        studentData.put("name", student.getName());
        studentData.put("studentUniId", student.getStudentUniId());
        studentData.put("email", student.getEmail());
        studentData.put("profileImage", student.getProfileImage() != null ? student.getProfileImage() : "user.jpg");

        // TODO: Fetch actual applications from database when Application entity is ready
        // For now, using dummy data
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
        app3.put("status", "PENDING_APPROVAL");
        app3.put("submittedDate", "20/01/2026");
        applications.add(app3);
        
        dashboard.put("student", studentData);
        dashboard.put("applications", applications);
        dashboard.put("totalApplications", applications.size());
        
        return dashboard;
    }

    public Map<String, Object> deleteStudentAccount(Integer studentId) {
        Map<String, Object> response = new HashMap<>();
        
        // Check if student exists
        if (!studentRepository.existsById(studentId)) {
            throw new RuntimeException("Student not found with ID: " + studentId);
        }
        
        // Delete the student
        studentRepository.deleteById(studentId);
        
        response.put("success", true);
        response.put("message", "Account deleted successfully");
        response.put("deletedAt", LocalDate.now().toString());
        
        return response;
    }

    public Map<String, Object> updateProfileImage(Integer studentId, String imageUrl) {
        Map<String, Object> response = new HashMap<>();
        
        // Fetch student from database
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        
        if (studentOpt.isEmpty()) {
            throw new RuntimeException("Student not found with ID: " + studentId);
        }
        
        Student student = studentOpt.get();
        student.setProfileImage(imageUrl);
        studentRepository.save(student);
        
        response.put("success", true);
        response.put("message", "Profile image updated successfully");
        response.put("imageUrl", imageUrl);
        
        return response;
    }

    // Additional helper method to get student by email
    public Optional<Student> findByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    // Additional helper method to check if email exists
    public boolean emailExists(String email) {
        return studentRepository.existsByEmail(email);
    }
}