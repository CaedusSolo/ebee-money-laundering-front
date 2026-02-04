package mmu.sef.fyj.model;

import jakarta.persistence.*;
import java.util.ArrayList; // ADDED
import java.util.List; // ADDED

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
    private String password;

    // Fixed to match method names (singular) for easier integration with existing
    // service
    // or pluralize the methods below. Let's use plural for the logic:
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "committee_assignments", joinColumns = @JoinColumn(name = "committee_id"))
    @Column(name = "scholarship_id")
    private List<Integer> assignedScholarshipIds = new ArrayList<>();

    public ScholarshipCommittee() {
    }

    public ScholarshipCommittee(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
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

    // Pluralized methods to support multiple assignments
    public List<Integer> getAssignedScholarshipIds() {
        return assignedScholarshipIds;
    }

    public void setAssignedScholarshipIds(List<Integer> assignedScholarshipIds) {
        this.assignedScholarshipIds = assignedScholarshipIds;
    }
}
