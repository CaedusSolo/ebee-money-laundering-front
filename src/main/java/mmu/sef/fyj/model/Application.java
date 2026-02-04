package mmu.sef.fyj.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer applicationID;

    @Column(nullable = false)
    private Integer studentID;

    @Column(nullable = false)
    private Integer scholarshipID;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime submittedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    // Personal details
    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private String nationality;

    private LocalDate dateOfBirth;

    private String phoneNumber;

    private String nricNumber;

    private Float monthlyFamilyIncome;

    private Boolean isBumiputera;

    // Family members
    @ElementCollection
    @CollectionTable(name = "application_family_members", joinColumns = @JoinColumn(name = "application_id"))
    private List<FamilyMember> familyMembers = new ArrayList<>();

    // Address
    private String homeAddress;
    private String city;
    private String zipCode;
    private String state;

    // Education
    private String college;
    private Integer currentYearOfStudy;
    private Integer expectedGraduationYear;
    private String major;

    @Enumerated(EnumType.STRING)
    private StudyLevel studyLevel;

    private Float cgpa;

    // Extracurriculars
    @ElementCollection
    @CollectionTable(name = "application_extracurriculars", joinColumns = @JoinColumn(name = "application_id"))
    private List<Extracurricular> extracurriculars = new ArrayList<>();

    // Documents
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "fileName", column = @Column(name = "nric_file_name")),
            @AttributeOverride(name = "fileUrl", column = @Column(name = "nric_file_url", columnDefinition = "TEXT")),
            @AttributeOverride(name = "contentType", column = @Column(name = "nric_content_type"))
    })
    private DocumentInfo nricDoc;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "fileName", column = @Column(name = "transcript_file_name")),
            @AttributeOverride(name = "fileUrl", column = @Column(name = "transcript_file_url", columnDefinition = "TEXT")),
            @AttributeOverride(name = "contentType", column = @Column(name = "transcript_content_type"))
    })
    private DocumentInfo transcriptDoc;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "fileName", column = @Column(name = "income_file_name")),
            @AttributeOverride(name = "fileUrl", column = @Column(name = "income_file_url", columnDefinition = "TEXT")),
            @AttributeOverride(name = "contentType", column = @Column(name = "income_content_type"))
    })
    private DocumentInfo familyIncomeConfirmationDoc;

    // Grades
    @ElementCollection
    @CollectionTable(name = "application_grades", joinColumns = @JoinColumn(name = "application_id"))
    private List<Grade> grades = new ArrayList<>();

    public Application() {
        this.createdAt = LocalDateTime.now();
        this.status = ApplicationStatus.DRAFT;
    }

    public Application(Integer studentID, Integer scholarshipID) {
        this();
        this.studentID = studentID;
        this.scholarshipID = scholarshipID;
    }

    // Business methods
    public void submitApplication() {
        validate();
        this.status = ApplicationStatus.SUBMITTED;
        this.submittedAt = LocalDateTime.now();
    }

    public void updateStatus(ApplicationStatus newStatus) {
        this.status = newStatus;
    }

    public void addGrade(Grade grade) {
        if (grade != null) {
            this.grades.add(grade);
            this.status = ApplicationStatus.GRADED;
        }
    }

    public void validate() {
        if (studentID == null) {
            throw new IllegalStateException("studentID is required");
        }
        if (scholarshipID == null) {
            throw new IllegalStateException("scholarshipID is required");
        }
        if (firstName == null || firstName.isBlank()) {
            throw new IllegalStateException("firstName is required");
        }
        if (lastName == null || lastName.isBlank()) {
            throw new IllegalStateException("lastName is required");
        }
    }

    // Getters and setters

    public Integer getApplicationID() {
        return applicationID;
    }

    public void setApplicationID(Integer applicationID) {
        this.applicationID = applicationID;
    }

    public Integer getStudentID() {
        return studentID;
    }

    public void setStudentID(Integer studentID) {
        this.studentID = studentID;
    }

    public Integer getScholarshipID() {
        return scholarshipID;
    }

    public void setScholarshipID(Integer scholarshipID) {
        this.scholarshipID = scholarshipID;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getNricNumber() {
        return nricNumber;
    }

    public void setNricNumber(String nricNumber) {
        this.nricNumber = nricNumber;
    }

    public Float getMonthlyFamilyIncome() {
        return monthlyFamilyIncome;
    }

    public void setMonthlyFamilyIncome(Float monthlyFamilyIncome) {
        this.monthlyFamilyIncome = monthlyFamilyIncome;
    }

    public Boolean getBumiputera() {
        return isBumiputera;
    }

    public void setBumiputera(Boolean bumiputera) {
        isBumiputera = bumiputera;
    }

    public List<FamilyMember> getFamilyMembers() {
        return familyMembers;
    }

    public void setFamilyMembers(List<FamilyMember> familyMembers) {
        this.familyMembers = familyMembers;
    }

    public String getHomeAddress() {
        return homeAddress;
    }

    public void setHomeAddress(String homeAddress) {
        this.homeAddress = homeAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public Integer getCurrentYearOfStudy() {
        return currentYearOfStudy;
    }

    public void setCurrentYearOfStudy(Integer currentYearOfStudy) {
        this.currentYearOfStudy = currentYearOfStudy;
    }

    public Integer getExpectedGraduationYear() {
        return expectedGraduationYear;
    }

    public void setExpectedGraduationYear(Integer expectedGraduationYear) {
        this.expectedGraduationYear = expectedGraduationYear;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public StudyLevel getStudyLevel() {
        return studyLevel;
    }

    public void setStudyLevel(StudyLevel studyLevel) {
        this.studyLevel = studyLevel;
    }

    public Float getCgpa() {
        return cgpa;
    }

    public void setCgpa(Float cgpa) {
        this.cgpa = cgpa;
    }

    public List<Extracurricular> getExtracurriculars() {
        return extracurriculars;
    }

    public void setExtracurriculars(List<Extracurricular> extracurriculars) {
        this.extracurriculars = extracurriculars;
    }

    public DocumentInfo getNricDoc() {
        return nricDoc;
    }

    public void setNricDoc(DocumentInfo nricDoc) {
        this.nricDoc = nricDoc;
    }

    public DocumentInfo getTranscriptDoc() {
        return transcriptDoc;
    }

    public void setTranscriptDoc(DocumentInfo transcriptDoc) {
        this.transcriptDoc = transcriptDoc;
    }

    public DocumentInfo getFamilyIncomeConfirmationDoc() {
        return familyIncomeConfirmationDoc;
    }

    public void setFamilyIncomeConfirmationDoc(DocumentInfo familyIncomeConfirmationDoc) {
        this.familyIncomeConfirmationDoc = familyIncomeConfirmationDoc;
    }

    public List<Grade> getGrades() {
        return grades;
    }

    public void setGrades(List<Grade> grades) {
        this.grades = grades;
    }
}

