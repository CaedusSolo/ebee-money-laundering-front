package mmu.sef.fyj.model;

import jakarta.persistence.*;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id")
    private Reviewer reviewer;

    @ManyToMany
    @JoinTable(
        name = "scholarship_committees",
        joinColumns = @JoinColumn(name = "scholarship_id"),
        inverseJoinColumns = @JoinColumn(name = "committee_id")
    )
    private Set<Committee> scholarshipCommittees = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "scholarship_applications",
        joinColumns = @JoinColumn(name = "scholarship_id"),
        inverseJoinColumns = @JoinColumn(name = "application_id")
    )
    private Set<Application> applications = new HashSet<>();

    // Constructors
    public Scholarship() {}

    public Scholarship(String name, String description, LocalDate applicationDeadline) {
        this.name = name;
        this.description = description;
        this.applicationDeadline = applicationDeadline;
    }

    // Business method
    public void applyScholarship(Application application) {
        this.applications.add(application);
    }

    // Getters and Setters
    // ... (generate as needed)
}
