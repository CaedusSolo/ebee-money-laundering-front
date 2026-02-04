package mmu.sef.fyj.service;

import mmu.sef.fyj.model.Application;
import mmu.sef.fyj.model.Reviewer;
import mmu.sef.fyj.model.ApplicationStatus;
import mmu.sef.fyj.model.Grade;
import mmu.sef.fyj.repository.ApplicationRepository;
import mmu.sef.fyj.repository.ReviewerRepository;
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

    public List<Reviewer> findAll() {
        return reviewerRepository.findAll();
    }

    public List<Map<String, Object>> getAllAssignedApplications(Integer reviewerId) {
        List<Map<String, Object>> applications = new ArrayList<>();
        
        // Get the reviewer's assigned scholarship
        Optional<Reviewer> reviewer = reviewerRepository.findById(reviewerId);
        if (reviewer.isEmpty()) {
            return applications;
        }
        
        Integer assignedScholarshipId = reviewer.get().getAssignedScholarshipId();
        
        // Get all applications for the reviewer's assigned scholarship
        List<Application> assignedApplications = applicationRepository.findByScholarshipID(assignedScholarshipId);
        
        // Convert to map format for API response
        for (Application app : assignedApplications) {
            Map<String, Object> appMap = new HashMap<>();
            appMap.put("applicationID", app.getApplicationID());
            appMap.put("studentName", app.getFirstName() + " " + app.getLastName());
            appMap.put("major", app.getMajor());
            appMap.put("status", app.getStatus().toString());
            appMap.put("submittedAt", app.getSubmittedAt());
            appMap.put("createdAt", app.getCreatedAt());
            applications.add(appMap);
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
    public Map<String, Object> approveApplication(Integer applicationId, String decision) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<Application> optionalApp = applicationRepository.findById(applicationId);
        
        if (optionalApp.isEmpty()) {
            response.put("success", false);
            response.put("error", "Application not found");
            return response;
        }
        
        Application app = optionalApp.get();
        
        // Update application status based on decision
        ApplicationStatus newStatus;
        if ("APPROVE".equalsIgnoreCase(decision)) {
            newStatus = ApplicationStatus.APPROVED;
        } else if ("REJECT".equalsIgnoreCase(decision)) {
            newStatus = ApplicationStatus.REJECTED;
        } else {
            response.put("success", false);
            response.put("error", "Invalid decision. Must be APPROVE or REJECT");
            return response;
        }
        
        // Update the application
        app.setStatus(newStatus);
        applicationRepository.save(app);
        
        response.put("success", true);
        response.put("applicationID", applicationId);
        response.put("status", newStatus.toString());
        response.put("reviewedAt", LocalDateTime.now());
        response.put("message", "Application " + decision.toLowerCase() + "d successfully");
        
        return response;
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
        long submitted = allApplications.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.SUBMITTED)
                .count();
        
        long total = allApplications.size();
        double approvalRate = total > 0 ? (approved * 100.0) / total : 0;
        
        stats.put("totalApplications", total);
        stats.put("approvedApplications", approved);
        stats.put("rejectedApplications", rejected);
        stats.put("gradedApplications", graded);
        stats.put("underReviewApplications", underReview);
        stats.put("submittedApplications", submitted);
        stats.put("approvalRate", approvalRate);
        
        Map<String, Long> byStatus = new HashMap<>();
        byStatus.put("APPROVED", approved);
        byStatus.put("REJECTED", rejected);
        byStatus.put("GRADED", graded);
        byStatus.put("UNDER_REVIEW", underReview);
        byStatus.put("SUBMITTED", submitted);
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
        
        // Parse stored committee reviews from grades
        if (grades != null) {
            for (Grade grade : grades) {
                if (grade.getCategory() != null && grade.getCategory().startsWith("COMMITTEE_REVIEW_")) {
                    try {
                        // Parse the JSON-like string stored in remarks
                        String remarkStr = grade.getRemarks();
                        Map<String, Object> review = new HashMap<>();
                        
                        // Simple JSON parsing - extract values
                        review.put("reviewID", extractJsonValue(remarkStr, "reviewID", Integer.class));
                        review.put("committeeMemberName", extractJsonValue(remarkStr, "committeeMemberName", String.class));
                        review.put("committeeMemberRole", extractJsonValue(remarkStr, "committeeMemberRole", String.class));
                        review.put("academicRubric", extractJsonValue(remarkStr, "academicRubric", Integer.class));
                        review.put("cocurricularRubric", extractJsonValue(remarkStr, "cocurricularRubric", Integer.class));
                        review.put("leadershipRubric", extractJsonValue(remarkStr, "leadershipRubric", Integer.class));
                        review.put("rawScore", extractJsonValue(remarkStr, "rawScore", Integer.class));
                        review.put("normalizedScore", grade.getScore()); // Already in database
                        review.put("comment", extractJsonValue(remarkStr, "comment", String.class));
                        review.put("submittedAt", LocalDateTime.now().toString());
                        
                        reviews.add(review);
                        totalNormalizedScore += grade.getScore();
                    } catch (Exception e) {
                        // Log error but continue processing other reviews
                        System.err.println("Error parsing committee review: " + e.getMessage());
                        e.printStackTrace();
                    }
                }
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
