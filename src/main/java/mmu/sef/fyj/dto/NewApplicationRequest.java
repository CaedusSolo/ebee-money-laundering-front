package mmu.sef.fyj.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import java.util.List;

public class NewApplicationRequest {

    // Scholarship ID
    private Integer scholarshipID;

    // Personal Info
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotBlank(message = "Date of birth is required")
    private String dateOfBirth;

    @NotBlank(message = "IC number is required")
    private String icNumber;

    @NotBlank(message = "Nationality is required")
    private String nationality;

    @NotBlank(message = "Bumiputera status is required")
    private String bumiputera;

    @NotBlank(message = "Gender is required")
    private String gender;

    private String homeAddress;

    @NotBlank(message = "Monthly household income is required")
    private String monthlyHouseholdIncome;

    // Academic Info
    @NotBlank(message = "University is required")
    private String university;

    @NotBlank(message = "Major is required")
    private String major;

    @NotBlank(message = "Year is required")
    private String year;

    @NotNull(message = "CGPA is required")
    @DecimalMin(value = "0.0", message = "CGPA must be at least 0.0")
    @DecimalMax(value = "4.0", message = "CGPA must be at most 4.0")
    private String cgpa;

    @NotBlank(message = "Expected graduation is required")
    private String expectedGraduation;

    @NotBlank(message = "Highest qualification is required")
    private String highestQualification;

    // Family Members
    private List<FamilyMember> familyMembers;

    // Activities
    private List<Activity> activities;

    // Documents
    private DocumentDTO ic;
    private DocumentDTO payslip;
    private DocumentDTO transcript;

    // Nested class for FamilyMember
    public static class FamilyMember {
        private String name;
        private String relationship;
        private String age;
        private String occupation;
        private String income;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getRelationship() {
            return relationship;
        }

        public void setRelationship(String relationship) {
            this.relationship = relationship;
        }

        public String getAge() {
            return age;
        }

        public void setAge(String age) {
            this.age = age;
        }

        public String getOccupation() {
            return occupation;
        }

        public void setOccupation(String occupation) {
            this.occupation = occupation;
        }

        public String getIncome() {
            return income;
        }

        public void setIncome(String income) {
            this.income = income;
        }
    }

    // Nested class for Activity
    public static class Activity {
        private String activity;
        private String role;

        public String getActivity() {
            return activity;
        }

        public void setActivity(String activity) {
            this.activity = activity;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }

    // Getters and Setters
    public Integer getScholarshipID() {
        return scholarshipID;
    }

    public void setScholarshipID(Integer scholarshipID) {
        this.scholarshipID = scholarshipID;
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

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getIcNumber() {
        return icNumber;
    }

    public void setIcNumber(String icNumber) {
        this.icNumber = icNumber;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getBumiputera() {
        return bumiputera;
    }

    public void setBumiputera(String bumiputera) {
        this.bumiputera = bumiputera;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getHomeAddress() {
        return homeAddress;
    }

    public void setHomeAddress(String homeAddress) {
        this.homeAddress = homeAddress;
    }

    public String getMonthlyHouseholdIncome() {
        return monthlyHouseholdIncome;
    }

    public void setMonthlyHouseholdIncome(String monthlyHouseholdIncome) {
        this.monthlyHouseholdIncome = monthlyHouseholdIncome;
    }

    public String getUniversity() {
        return university;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getCgpa() {
        return cgpa;
    }

    public void setCgpa(String cgpa) {
        this.cgpa = cgpa;
    }

    public String getExpectedGraduation() {
        return expectedGraduation;
    }

    public void setExpectedGraduation(String expectedGraduation) {
        this.expectedGraduation = expectedGraduation;
    }

    public String getHighestQualification() {
        return highestQualification;
    }

    public void setHighestQualification(String highestQualification) {
        this.highestQualification = highestQualification;
    }

    public List<FamilyMember> getFamilyMembers() {
        return familyMembers;
    }

    public void setFamilyMembers(List<FamilyMember> familyMembers) {
        this.familyMembers = familyMembers;
    }

    public List<Activity> getActivities() {
        return activities;
    }

    public void setActivities(List<Activity> activities) {
        this.activities = activities;
    }

    public DocumentDTO getIc() {
        return ic;
    }

    public void setIc(DocumentDTO ic) {
        this.ic = ic;
    }

    public DocumentDTO getPayslip() {
        return payslip;
    }

    public void setPayslip(DocumentDTO payslip) {
        this.payslip = payslip;
    }

    public DocumentDTO getTranscript() {
        return transcript;
    }

    public void setTranscript(DocumentDTO transcript) {
        this.transcript = transcript;
    }
}
