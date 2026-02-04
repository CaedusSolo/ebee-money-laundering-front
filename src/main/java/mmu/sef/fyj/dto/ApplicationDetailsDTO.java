package mmu.sef.fyj.dto;

import java.time.LocalDate;
import java.util.List;

public class ApplicationDetailsDTO {
    
    private Integer applicationId;
    
    // Personal Information
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String nricNumber;
    private String gender;
    private String nationality;
    private LocalDate dateOfBirth;
    
    // Reviewer
    private String reviewerName;
    
    // Education
    private EducationDTO education;
    
    // Financial Information
    private Float monthlyFamilyIncome;
    private Boolean isBumiputera;
    
    // Address
    private AddressDTO address;
    
    // Extracurriculars
    private List<ExtracurricularDTO> extracurriculars;
    
    // Documents
    private DocumentDTO nricDoc;
    private DocumentDTO transcriptDoc;
    private DocumentDTO familyIncomeConfirmationDoc;

    // Constructors
    public ApplicationDetailsDTO() {}

    // Getters and Setters
    public Integer getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Integer applicationId) {
        this.applicationId = applicationId;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
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

    public String getReviewerName() {
        return reviewerName;
    }

    public void setReviewerName(String reviewerName) {
        this.reviewerName = reviewerName;
    }

    public EducationDTO getEducation() {
        return education;
    }

    public void setEducation(EducationDTO education) {
        this.education = education;
    }

    public Float getMonthlyFamilyIncome() {
        return monthlyFamilyIncome;
    }

    public void setMonthlyFamilyIncome(Float monthlyFamilyIncome) {
        this.monthlyFamilyIncome = monthlyFamilyIncome;
    }

    public Boolean getIsBumiputera() {
        return isBumiputera;
    }

    public void setIsBumiputera(Boolean isBumiputera) {
        this.isBumiputera = isBumiputera;
    }

    public AddressDTO getAddress() {
        return address;
    }

    public void setAddress(AddressDTO address) {
        this.address = address;
    }

    public List<ExtracurricularDTO> getExtracurriculars() {
        return extracurriculars;
    }

    public void setExtracurriculars(List<ExtracurricularDTO> extracurriculars) {
        this.extracurriculars = extracurriculars;
    }

    public DocumentDTO getNricDoc() {
        return nricDoc;
    }

    public void setNricDoc(DocumentDTO nricDoc) {
        this.nricDoc = nricDoc;
    }

    public DocumentDTO getTranscriptDoc() {
        return transcriptDoc;
    }

    public void setTranscriptDoc(DocumentDTO transcriptDoc) {
        this.transcriptDoc = transcriptDoc;
    }

    public DocumentDTO getFamilyIncomeConfirmationDoc() {
        return familyIncomeConfirmationDoc;
    }

    public void setFamilyIncomeConfirmationDoc(DocumentDTO familyIncomeConfirmationDoc) {
        this.familyIncomeConfirmationDoc = familyIncomeConfirmationDoc;
    }
}
