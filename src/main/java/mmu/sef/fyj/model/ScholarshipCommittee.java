package mmu.sef.fyj.model;

import jakarta.persistence.*;

@Entity
@Table(name = "scholarship_committees")
public class ScholarshipCommittee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer committeeId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // Hashed

    @Column(nullable = false)
    private Integer assignedScholarshipId;

    public ScholarshipCommittee() {
    }

    public ScholarshipCommittee(String name, String email, String password, Integer assignedScholarshipId) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.assignedScholarshipId = assignedScholarshipId;
    }

    // Getters and Setters
    public Integer getCommitteeId() {
        return committeeId;
    }

    public void setCommitteeId(Integer committeeId) {
        this.committeeId = committeeId;
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
