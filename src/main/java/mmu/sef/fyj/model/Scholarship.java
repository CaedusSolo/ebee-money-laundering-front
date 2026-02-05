package mmu.sef.fyj.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
import java.time.LocalDate;

@Entity
@Table(name = "scholarships")
public class Scholarship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDate applicationDeadline;

    @ManyToMany
    @JoinTable(
        name = "scholarship_reviewer_assignments",
        joinColumns = @JoinColumn(name = "scholarship_id"),
        inverseJoinColumns = @JoinColumn(name = "reviewer_id")
    )
    private Set<Reviewer> reviewers = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "scholarship_committee_assignments",
        joinColumns = @JoinColumn(name = "scholarship_id"),
        inverseJoinColumns = @JoinColumn(name = "committee_id")
    )
    private Set<ScholarshipCommittee> scholarshipCommittees = new HashSet<>();

    private Float minCGPA;

    private Float maxFamilyIncome;

    private Boolean mustBumiputera;

    private Integer minGraduationYear;

    // Constructors
    public Scholarship() {}

    public Scholarship(String name, String description, LocalDate applicationDeadline) {
        this.name = name;
        this.description = description;
        this.applicationDeadline = applicationDeadline;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getApplicationDeadline() {
        return applicationDeadline;
    }

    public void setApplicationDeadline(LocalDate applicationDeadline) {
        this.applicationDeadline = applicationDeadline;
    }

    public Set<Reviewer> getReviewers() {
        return reviewers;
    }

    public void setReviewers(Set<Reviewer> reviewers) {
        this.reviewers = reviewers;
    }

    public Set<ScholarshipCommittee> getScholarshipCommittees() {
        return scholarshipCommittees;
    }

    public void setScholarshipCommittees(Set<ScholarshipCommittee> scholarshipCommittees) {
        this.scholarshipCommittees = scholarshipCommittees;
    }

    public Float getMinCGPA() {
        return minCGPA;
    }

    public void setMinCGPA(Float minCGPA) {
        this.minCGPA = minCGPA;
    }

    public Float getMaxFamilyIncome() {
        return maxFamilyIncome;
    }

    public void setMaxFamilyIncome(Float maxFamilyIncome) {
        this.maxFamilyIncome = maxFamilyIncome;
    }

    public Boolean getMustBumiputera() {
        return mustBumiputera;
    }

    public void setMustBumiputera(Boolean mustBumiputera) {
        this.mustBumiputera = mustBumiputera;
    }

    public Integer getMinGraduationYear() {
        return minGraduationYear;
    }

    public void setMinGraduationYear(Integer minGraduationYear) {
        this.minGraduationYear = minGraduationYear;
    }
}
