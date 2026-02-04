package mmu.sef.fyj.service;

import mmu.sef.fyj.model.Application;
import mmu.sef.fyj.model.Reviewer;
import mmu.sef.fyj.model.ApplicationStatus;
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
        
        long total = allApplications.size();
        double approvalRate = total > 0 ? (approved * 100.0) / total : 0;
        
        stats.put("totalApplications", total);
        stats.put("approvedApplications", approved);
        stats.put("rejectedApplications", rejected);
        stats.put("gradedApplications", graded);
        stats.put("approvalRate", approvalRate);
        
        Map<String, Long> byStatus = new HashMap<>();
        byStatus.put("APPROVED", approved);
        byStatus.put("REJECTED", rejected);
        byStatus.put("GRADED", graded);
        stats.put("applicationsByStatus", byStatus);

        return stats;
    }

    public Map<String, Object> getCommitteeReviews(Integer applicationId) {
        Map<String, Object> reviewsData = new HashMap<>();
        
        List<Map<String, Object>> reviews = new ArrayList<>();
        
        // Committee member 1 review
        Map<String, Object> review1 = new HashMap<>();
        review1.put("reviewID", 1);
        review1.put("committeeMemberName", "Dr. Ahmed Khan");
        review1.put("committeeMemberRole", "Academic Excellence Committee");
        review1.put("academicRubric", 18);
        review1.put("cocurricularRubric", 16);
        review1.put("leadershipRubric", 17);
        review1.put("rawScore", 51); // 18+16+17
        review1.put("normalizedScore", 85); // (51/60)*100
        review1.put("comment", "Excellent academic performance with strong leadership demonstrated in projects. Well-rounded candidate.");
        review1.put("submittedAt", "2026-01-28");
        reviews.add(review1);
        
        // Committee member 2 review
        Map<String, Object> review2 = new HashMap<>();
        review2.put("reviewID", 2);
        review2.put("committeeMemberName", "Prof. Sarah Osman");
        review2.put("committeeMemberRole", "Leadership Committee");
        review2.put("academicRubric", 16);
        review2.put("cocurricularRubric", 15);
        review2.put("leadershipRubric", 16);
        review2.put("rawScore", 47); // 16+15+16
        review2.put("normalizedScore", 79); // (47/60)*100
        review2.put("comment", "Good overall performance. Shows potential for growth in leadership roles. Consistent contributor in activities.");
        review2.put("submittedAt", "2026-01-28");
        reviews.add(review2);
        
        // Committee member 3 review
        Map<String, Object> review3 = new HashMap<>();
        review3.put("reviewID", 3);
        review3.put("committeeMemberName", "Assoc. Prof. Fatimah Hassan");
        review3.put("committeeMemberRole", "Student Affairs Committee");
        review3.put("academicRubric", 17);
        review3.put("cocurricularRubric", 16);
        review3.put("leadershipRubric", 18);
        review3.put("rawScore", 51); // 17+16+18
        review3.put("normalizedScore", 85); // (51/60)*100
        review3.put("comment", "Outstanding student with exceptional leadership qualities. Highly active in extracurricular activities. Strongly recommended.");
        review3.put("submittedAt", "2026-01-29");
        reviews.add(review3);
        
        reviewsData.put("applicationID", applicationId);
        reviewsData.put("committeeReviews", reviews);
        reviewsData.put("totalReviews", reviews.size());
        reviewsData.put("combinedScore", 249); // 85+79+85
        
        return reviewsData;
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
