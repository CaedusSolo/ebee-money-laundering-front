package mmu.sef.fyj.model;

import jakarta.persistence.*;

@Entity
@Table(name = "reviewers")
public class Reviewer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reviewerId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // Hashed

    @Column(nullable = false)
    private Integer assignedScholarshipId;

    public Reviewer() {
    }

    public Reviewer(String name, String email, String password, Integer assignedScholarshipId) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.assignedScholarshipId = assignedScholarshipId;
    }

    public Integer getReviewerId() {
        return reviewerId;
    }

    public void setReviewerId(Integer reviewerId) {
        this.reviewerId = reviewerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getAssignedScholarshipId() {
        return assignedScholarshipId;
    }

    public void setAssignedScholarshipId(Integer assignedScholarshipId) {
        this.assignedScholarshipId = assignedScholarshipId;
    }
}
