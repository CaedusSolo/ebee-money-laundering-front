package mmu.sef.fyj.service;

import mmu.sef.fyj.model.Application;
import mmu.sef.fyj.model.Scholarship;
import mmu.sef.fyj.model.Student;
import mmu.sef.fyj.repository.ApplicationRepository;
import mmu.sef.fyj.repository.ScholarshipRepository;
import mmu.sef.fyj.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private ScholarshipRepository scholarshipRepository;

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

        // Fetch actual applications from database
        List<Application> studentApplications = applicationRepository.findByStudentID(studentId);
        List<Map<String, Object>> applications = new ArrayList<>();
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        
        for (Application app : studentApplications) {
            Map<String, Object> appData = new HashMap<>();
            appData.put("applicationId", app.getApplicationID());
            
            // Fetch scholarship name
            Optional<Scholarship> scholarship = scholarshipRepository.findById(app.getScholarshipID());
            String scholarshipName = scholarship.isPresent() ? scholarship.get().getName() : "Unknown Scholarship";
            appData.put("scholarshipName", scholarshipName);
            
            // Format status
            String status = app.getStatus().name();
            appData.put("status", status);
            
            // Format submitted date
            String submittedDate = app.getSubmittedAt() != null 
                ? app.getSubmittedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                : "Not submitted";
            appData.put("submittedDate", submittedDate);
            
            applications.add(appData);
        }
        
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