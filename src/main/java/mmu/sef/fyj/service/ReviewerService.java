package mmu.sef.fyj.service;

import mmu.sef.fyj.model.Reviewer;
import mmu.sef.fyj.repository.ReviewerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ReviewerService {

    @Autowired
    private ReviewerRepository reviewerRepository;

    public List<Reviewer> findAll() {
        return reviewerRepository.findAll();
    }

    // Dummy data for applications
    public List<Map<String, Object>> getAllAssignedApplications(Integer reviewerId) {
        List<Map<String, Object>> applications = new ArrayList<>();
        
        // Dummy application 1
        Map<String, Object> app1 = new HashMap<>();
        app1.put("applicationID", 1);
        app1.put("studentName", "John Doe");
        app1.put("scholarshipName", "Merit Excellence Scholarship");
        app1.put("status", "PENDING APPROVAL");
        app1.put("submittedAt", "2026-01-25");
        app1.put("major", "Computer Science");
        app1.put("totalScore", 249);
        app1.put("judgingCompleted", true);
        applications.add(app1);

        // Dummy application 2
        Map<String, Object> app2 = new HashMap<>();
        app2.put("applicationID", 2);
        app2.put("studentName", "Jane Smith");
        app2.put("scholarshipName", "Merit Excellence Scholarship");
        app2.put("status", "PENDING APPROVAL");
        app2.put("submittedAt", "2026-01-26");
        app2.put("major", "Business Administration");
        app2.put("totalScore", 269);
        app2.put("judgingCompleted", true);
        applications.add(app2);

        // Dummy application 3
        Map<String, Object> app3 = new HashMap<>();
        app3.put("applicationID", 3);
        app3.put("studentName", "Ahmed Hassan");
        app3.put("scholarshipName", "Merit Excellence Scholarship");
        app3.put("status", "UNDER REVIEW");
        app3.put("submittedAt", "2026-01-27");
        app3.put("major", "Engineering");
        app3.put("totalScore", 0);
        app3.put("judgingCompleted", false);
        applications.add(app3);

        return applications;
    }

    public List<Map<String, Object>> getApplicationsByScholarship(Integer scholarshipId) {
        List<Map<String, Object>> applications = new ArrayList<>();
        
        Map<String, Object> app1 = new HashMap<>();
        app1.put("applicationID", 1);
        app1.put("studentName", "John Doe");
        app1.put("status", "PENDING REVIEW");
        app1.put("submittedAt", "2026-01-25");
        app1.put("gpa", 3.8);
        applications.add(app1);

        Map<String, Object> app2 = new HashMap<>();
        app2.put("applicationID", 2);
        app2.put("studentName", "Jane Smith");
        app2.put("status", "IN REVIEW");
        app2.put("submittedAt", "2026-01-26");
        app2.put("gpa", 3.9);
        applications.add(app2);

        return applications;
    }

    public Map<String, Object> getApplicationDetails(Integer applicationId) {
        Map<String, Object> application = new HashMap<>();
        application.put("applicationID", applicationId);
        application.put("firstName", "John");
        application.put("lastName", "Doe");
        application.put("email", "john.doe@example.com");
        application.put("phoneNumber", "+60123456789");
        application.put("nricNumber", "950101-12-1234");
        application.put("gender", "MALE");
        application.put("nationality", "Malaysian");
        application.put("dateOfBirth", "1995-01-01");
        application.put("monthlyFamilyIncome", 5000.00);
        application.put("isBumiputera", true);
        
        Map<String, Object> address = new HashMap<>();
        address.put("homeAddress", "123 Jalan Merdeka");
        address.put("city", "Kuala Lumpur");
        address.put("zipCode", "50000");
        address.put("state", "Wilayah Persekutuan");
        application.put("address", address);

        Map<String, Object> education = new HashMap<>();
        education.put("college", "University of Malaya");
        education.put("currentYearOfStudy", 2);
        education.put("expectedGraduationYear", 2027);
        education.put("major", "Computer Science");
        education.put("studyLevel", "UNDERGRADUATE");
        application.put("education", education);

        application.put("status", "PENDING REVIEW");
        application.put("submittedAt", "2026-01-25");

        return application;
    }

    public Map<String, Object> approveApplication(Integer applicationId, String decision) {
        Map<String, Object> response = new HashMap<>();
        response.put("applicationID", applicationId);
        response.put("status", decision.equals("APPROVE") ? "APPROVED" : "REJECTED");
        response.put("reviewedAt", new Date());
        response.put("message", "Application " + decision.toLowerCase() + "d successfully");
        return response;
    }

    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalApplications", 45);
        stats.put("approvedApplications", 28);
        stats.put("rejectedApplications", 12);
        stats.put("pendingApplications", 5);
        stats.put("approvalRate", 62.2);
        
        Map<String, Integer> byStatus = new HashMap<>();
        byStatus.put("APPROVED", 28);
        byStatus.put("REJECTED", 12);
        byStatus.put("PENDING REVIEW", 5);
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
