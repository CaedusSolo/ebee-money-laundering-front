package mmu.sef.fyj.service;

import mmu.sef.fyj.model.Application;
import mmu.sef.fyj.model.Reviewer;
import mmu.sef.fyj.model.ApplicationStatus;
import mmu.sef.fyj.model.Grade;
import mmu.sef.fyj.model.Scholarship;
import mmu.sef.fyj.model.Student;
import mmu.sef.fyj.repository.ApplicationRepository;
import mmu.sef.fyj.repository.ReviewerRepository;
import mmu.sef.fyj.repository.ScholarshipRepository;
import mmu.sef.fyj.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.time.LocalDateTime;

@Service
public class ReviewerService {

    @Autowired
    private ReviewerRepository reviewerRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ScholarshipRepository scholarshipRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EmailService emailService;

    public List<Reviewer> findAll() {
        return reviewerRepository.findAll();
    }

    public List<Map<String, Object>> getAllAssignedApplications(Integer reviewerId) {
        List<Map<String, Object>> applications = new ArrayList<>();
        
        // Get all scholarships where this reviewer is assigned
        List<Scholarship> assignedScholarships = scholarshipRepository.findByReviewers_ReviewerId(reviewerId);
        
        // Collect all applications from these scholarships
        for (Scholarship scholarship : assignedScholarships) {
            List<Application> apps = applicationRepository.findByScholarshipID(scholarship.getId());
            
            // Convert to map format for API response
            for (Application app : apps) {
                Map<String, Object> appMap = new HashMap<>();
                appMap.put("applicationID", app.getApplicationID());
                appMap.put("studentName", app.getFirstName() + " " + app.getLastName());
                appMap.put("major", app.getMajor());
                appMap.put("status", app.getStatus().toString());
                appMap.put("submittedAt", app.getSubmittedAt());
                appMap.put("createdAt", app.getCreatedAt());
                appMap.put("scholarshipId", scholarship.getId());
                appMap.put("scholarshipName", scholarship.getName());
                applications.add(appMap);
            }
        }

        return applications;
    }

    public List<Map<String, Object>> getApplicationsByScholarship(Integer scholarshipId) {
        List<Map<String, Object>> applications = new ArrayList<>();
        
        // Get all applications for the scholarship
        List<Application> apps = applicationRepository.findByScholarshipID(scholarshipId);
        
        // Convert to map format
        for (Application app : apps) {
            Map<String, Object> appMap = new HashMap<>();
            appMap.put("applicationID", app.getApplicationID());
            appMap.put("studentName", app.getFirstName() + " " + app.getLastName());
            appMap.put("status", app.getStatus().toString());
            appMap.put("submittedAt", app.getSubmittedAt());
            appMap.put("major", app.getMajor());
            applications.add(appMap);
        }

        return applications;
    }

    public Map<String, Object> getApplicationDetails(Integer applicationId) {
        Map<String, Object> application = new HashMap<>();
        
        // Fetch the application from database
        Optional<Application> optionalApp = applicationRepository.findById(applicationId);
        
        if (optionalApp.isEmpty()) {
            application.put("error", "Application not found");
            return application;
        }
        
        Application app = optionalApp.get();
        
        // Build the response object with all application details
        application.put("applicationID", app.getApplicationID());
        application.put("firstName", app.getFirstName());
        application.put("lastName", app.getLastName());
        application.put("phoneNumber", app.getPhoneNumber());
        application.put("nricNumber", app.getNricNumber());
        application.put("gender", app.getGender() != null ? app.getGender().toString() : "N/A");
        application.put("nationality", app.getNationality());
        application.put("dateOfBirth", app.getDateOfBirth());
        application.put("monthlyFamilyIncome", app.getMonthlyFamilyIncome());
        application.put("isBumiputera", app.getBumiputera());
        application.put("status", app.getStatus().toString());
        application.put("submittedAt", app.getSubmittedAt());
        application.put("createdAt", app.getCreatedAt());
        
        // Reviewer approvals
        application.put("reviewerApprovals", app.getReviewerApprovals());
        
        // Get scholarship to determine required approvals
        Optional<Scholarship> scholarshipOpt = scholarshipRepository.findById(app.getScholarshipID());
        if (scholarshipOpt.isPresent()) {
            int assignedReviewers = scholarshipOpt.get().getReviewers() != null ? 
                scholarshipOpt.get().getReviewers().size() : 0;
            application.put("requiredApprovals", assignedReviewers > 0 ? assignedReviewers : 3);
        } else {
            application.put("requiredApprovals", 3);
        }
        
        // Address information
        Map<String, Object> address = new HashMap<>();
        address.put("homeAddress", app.getHomeAddress());
        address.put("city", app.getCity());
        address.put("zipCode", app.getZipCode());
        address.put("state", app.getState());
        application.put("address", address);
        
        // Education information
        Map<String, Object> education = new HashMap<>();
        education.put("college", app.getCollege());
        education.put("currentYearOfStudy", app.getCurrentYearOfStudy());
        education.put("expectedGraduationYear", app.getExpectedGraduationYear());
        education.put("major", app.getMajor());
        education.put("studyLevel", app.getStudyLevel() != null ? app.getStudyLevel().toString() : "N/A");
        education.put("cgpa", app.getCgpa());
        application.put("education", education);
        
        // Family members information
        if (app.getFamilyMembers() != null && !app.getFamilyMembers().isEmpty()) {
            List<Map<String, Object>> familyMembers = new ArrayList<>();
            for (var member : app.getFamilyMembers()) {
                Map<String, Object> memberMap = new HashMap<>();
                memberMap.put("name", member.getName());
                memberMap.put("relationship", member.getRelationship());
                memberMap.put("occupation", member.getOccupation());
                memberMap.put("monthlyIncome", member.getMonthlyIncome());
                familyMembers.add(memberMap);
            }
            application.put("familyMembers", familyMembers);
        }
        
        // Extracurricular activities
        if (app.getExtracurriculars() != null && !app.getExtracurriculars().isEmpty()) {
            List<Map<String, Object>> extracurriculars = new ArrayList<>();
            for (var activity : app.getExtracurriculars()) {
                Map<String, Object> activityMap = new HashMap<>();
                activityMap.put("activityName", activity.getActivityName());
                activityMap.put("role", activity.getRole());
                activityMap.put("achievement", activity.getAchievement());
                extracurriculars.add(activityMap);
            }
            application.put("extracurriculars", extracurriculars);
        }

        return application;
    }

    @Transactional
    public Map<String, Object> approveApplication(Integer applicationId, String decision, Integer reviewerId) {
        Map<String, Object> response = new HashMap<>();
        
        org.slf4j.LoggerFactory.getLogger(ReviewerService.class)
            .info("=== APPROVE APPLICATION CALLED === applicationId: {}, decision: {}, reviewerId: {}", applicationId, decision, reviewerId);
        
        Optional<Application> optionalApp = applicationRepository.findById(applicationId);
        
        if (optionalApp.isEmpty()) {
            response.put("success", false);
            response.put("error", "Application not found");
            return response;
        }
        
        Application app = optionalApp.get();
        
        // Handle rejection - any reviewer can reject
        if ("REJECT".equalsIgnoreCase(decision)) {
            org.slf4j.LoggerFactory.getLogger(ReviewerService.class).info("REJECTING application: {}", applicationId);
            app.setStatus(ApplicationStatus.REJECTED);
            applicationRepository.save(app);
            
            // Send rejection email to student
            sendRejectionEmailToStudent(app);
            
            response.put("success", true);
            response.put("applicationID", applicationId);
            response.put("status", ApplicationStatus.REJECTED.toString());
            response.put("reviewedAt", LocalDateTime.now());
            response.put("message", "Application rejected successfully");
            return response;
        }
        
        // Handle approval
        if ("APPROVE".equalsIgnoreCase(decision)) {
            org.slf4j.LoggerFactory.getLogger(ReviewerService.class).info("APPROVING application: {}", applicationId);
            // Add this reviewer's approval
            app.addReviewerApproval(reviewerId);
            
            // Get the scholarship to check how many reviewers are assigned
            Optional<Scholarship> scholarshipOpt = scholarshipRepository.findById(app.getScholarshipID());
            
            int requiredApprovals = 3; // Default to 3
            if (scholarshipOpt.isPresent()) {
                Scholarship scholarship = scholarshipOpt.get();
                // Count the number of assigned reviewers
                int assignedReviewers = scholarship.getReviewers() != null ? scholarship.getReviewers().size() : 0;
                if (assignedReviewers > 0) {
                    requiredApprovals = assignedReviewers;
                }
            }
            
            int currentApprovals = app.getReviewerApprovals().size();
            org.slf4j.LoggerFactory.getLogger(ReviewerService.class)
                .info("Current approvals: {}/{}", currentApprovals, requiredApprovals);
            
            if (currentApprovals >= requiredApprovals) {
                org.slf4j.LoggerFactory.getLogger(ReviewerService.class)
                    .info("✓✓✓ APPLICATION FULLY APPROVED ✓✓✓ - Sending email...");
                app.setStatus(ApplicationStatus.APPROVED);
                response.put("message", "Application fully approved by all reviewers");
                
                // Send approval email to student
                sendApprovalEmailToStudent(app);
            } else {
                // Keep status as PENDING_APPROVAL so other reviewers can still see and approve it
                app.setStatus(ApplicationStatus.PENDING_APPROVAL);
                response.put("message", String.format("Application approved by reviewer. Waiting for %d more approval(s)", 
                    requiredApprovals - currentApprovals));
            }
            
            applicationRepository.save(app);
            
            response.put("success", true);
            response.put("applicationID", applicationId);
            response.put("status", app.getStatus().toString());
            response.put("reviewedAt", LocalDateTime.now());
            response.put("approvalsCount", currentApprovals);
            response.put("requiredApprovals", requiredApprovals);
            
            return response;
        }
        
        response.put("success", false);
        response.put("error", "Invalid decision. Must be APPROVE or REJECT");
        return response;
    }

    /**
     * Helper method to send approval email to student
     */
    private void sendApprovalEmailToStudent(Application app) {
        try {
            Optional<Student> studentOpt = studentRepository.findById(app.getStudentID());
            Optional<Scholarship> scholarshipOpt = scholarshipRepository.findById(app.getScholarshipID());
            
            if (studentOpt.isPresent() && scholarshipOpt.isPresent()) {
                Student student = studentOpt.get();
                Scholarship scholarship = scholarshipOpt.get();
                
                String studentEmail = student.getEmail();
                String studentName = student.getName();
                String scholarshipName = scholarship.getName();
                
                org.slf4j.LoggerFactory.getLogger(ReviewerService.class)
                    .info("Sending approval email to: {} for scholarship: {}", studentEmail, scholarshipName);
                emailService.sendApprovalEmail(studentEmail, studentName, scholarshipName);
            } else {
                org.slf4j.LoggerFactory.getLogger(ReviewerService.class)
                    .warn("Could not find student or scholarship for application: {}", app.getApplicationID());
            }
        } catch (Exception e) {
            org.slf4j.LoggerFactory.getLogger(ReviewerService.class)
                .error("Failed to send approval email for application: " + app.getApplicationID(), e);
        }
    }

    /**
     * Helper method to send rejection email to student
     */
    private void sendRejectionEmailToStudent(Application app) {
        try {
            Optional<Student> studentOpt = studentRepository.findById(app.getStudentID());
            Optional<Scholarship> scholarshipOpt = scholarshipRepository.findById(app.getScholarshipID());
            
            if (studentOpt.isPresent() && scholarshipOpt.isPresent()) {
                Student student = studentOpt.get();
                Scholarship scholarship = scholarshipOpt.get();
                
                String studentEmail = student.getEmail();
                String studentName = student.getName();
                String scholarshipName = scholarship.getName();
                
                org.slf4j.LoggerFactory.getLogger(ReviewerService.class)
                    .info("Sending rejection email to: {} for scholarship: {}", studentEmail, scholarshipName);
                emailService.sendRejectionEmail(studentEmail, studentName, scholarshipName);
            } else {
                org.slf4j.LoggerFactory.getLogger(ReviewerService.class)
                    .warn("Could not find student or scholarship for application: {}", app.getApplicationID());
            }
        } catch (Exception e) {
            org.slf4j.LoggerFactory.getLogger(ReviewerService.class)
                .error("Failed to send rejection email for application: " + app.getApplicationID(), e);
        }
    }

    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get all applications from database
        List<Application> allApplications = applicationRepository.findAll();
        
        // Count by status
        long approved = allApplications.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.APPROVED)
                .count();
        long rejected = allApplications.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.REJECTED)
                .count();
        long graded = allApplications.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.GRADED)
                .count();
        long underReview = allApplications.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.UNDER_REVIEW)
                .count();
        long pendingApproval = allApplications.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.PENDING_APPROVAL)
                .count();
        
        long total = allApplications.size();
        double approvalRate = total > 0 ? (approved * 100.0) / total : 0;
        
        stats.put("totalApplications", total);
        stats.put("approvedApplications", approved);
        stats.put("rejectedApplications", rejected);
        stats.put("gradedApplications", graded);
        stats.put("underReviewApplications", underReview);
        stats.put("pendingApprovalApplications", pendingApproval);
        stats.put("approvalRate", approvalRate);
        
        Map<String, Long> byStatus = new HashMap<>();
        byStatus.put("APPROVED", approved);
        byStatus.put("REJECTED", rejected);
        byStatus.put("GRADED", graded);
        byStatus.put("UNDER_REVIEW", underReview);
        byStatus.put("PENDING_APPROVAL", pendingApproval);
        stats.put("applicationsByStatus", byStatus);

        return stats;
    }

    public Map<String, Object> getCommitteeReviews(Integer applicationId) {
        Map<String, Object> reviewsData = new HashMap<>();
        
        Optional<Application> optionalApp = applicationRepository.findById(applicationId);
        if (optionalApp.isEmpty()) {
            reviewsData.put("error", "Application not found");
            return reviewsData;
        }
        
        Application app = optionalApp.get();
        List<Grade> grades = app.getGrades();
        
        List<Map<String, Object>> reviews = new ArrayList<>();
        int totalNormalizedScore = 0;
        
        // Group grades by committee member
        Map<Integer, Map<String, Object>> committeeReviewsMap = new HashMap<>();
        
        if (grades != null) {
            for (Grade grade : grades) {
                Integer committeeId = grade.getCommitteeId();
                if (committeeId != null) {
                    // Get or create review for this committee member
                    committeeReviewsMap.putIfAbsent(committeeId, new HashMap<>());
                    Map<String, Object> review = committeeReviewsMap.get(committeeId);
                    
                    // Store committee info on first grade
                    if (!review.containsKey("reviewID")) {
                        review.put("reviewID", committeeId);
                        review.put("committeeMemberName", "Committee Member " + committeeId);
                        review.put("committeeMemberRole", "Committee Member");
                        review.put("comment", grade.getRemarks() != null ? grade.getRemarks() : "No comments provided");
                    }
                    
                    // Store rubric scores based on category
                    String category = grade.getCategory();
                    if ("ACADEMIC".equals(category)) {
                        review.put("academicRubric", grade.getScore());
                    } else if ("CURRICULUM".equals(category) || "COCURRICULAR".equals(category)) {
                        review.put("cocurricularRubric", grade.getScore());
                    } else if ("LEADERSHIP".equals(category)) {
                        review.put("leadershipRubric", grade.getScore());
                    }
                }
            }
            
            // Calculate normalized scores and format reviews
            for (Map<String, Object> review : committeeReviewsMap.values()) {
                int academic = (Integer) review.getOrDefault("academicRubric", 0);
                int cocurricular = (Integer) review.getOrDefault("cocurricularRubric", 0);
                int leadership = (Integer) review.getOrDefault("leadershipRubric", 0);
                
                int rawScore = academic + cocurricular + leadership;
                int normalizedScore = (rawScore * 100) / 60; // Assuming max 20 per rubric
                
                review.put("rawScore", rawScore);
                review.put("normalizedScore", normalizedScore);
                review.put("submittedAt", LocalDateTime.now().toString());
                
                reviews.add(review);
                totalNormalizedScore += normalizedScore;
            }
        }
        
        reviewsData.put("applicationID", applicationId);
        reviewsData.put("committeeReviews", reviews);
        reviewsData.put("totalReviews", reviews.size());
        reviewsData.put("combinedScore", totalNormalizedScore);
        
        return reviewsData;
    }
    
    private Object extractJsonValue(String json, String key, Class<?> type) {
        // Simple regex-based JSON value extraction
        String pattern = "\"" + key + "\":\\s*([^,}]+)";
        java.util.regex.Pattern p = java.util.regex.Pattern.compile(pattern);
        java.util.regex.Matcher m = p.matcher(json);
        
        if (m.find()) {
            String value = m.group(1).trim();
            // Remove quotes if string
            if (value.startsWith("\"") && value.endsWith("\"")) {
                value = value.substring(1, value.length() - 1);
            }
            
            if (type == Integer.class) {
                return Integer.parseInt(value);
            } else if (type == String.class) {
                return value;
            }
        }
        
        return type == Integer.class ? 0 : "";
    }

    public Map<String, Object> sendEmailNotification(Integer applicationId, String subject, String message) {
        // Dummy function - just prints to terminal
        System.out.println("Sending email notification for application: " + applicationId);
        System.out.println("Subject: " + subject);
        System.out.println("Message: " + message);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Email notification sent");
        
        return response;
    }
}
