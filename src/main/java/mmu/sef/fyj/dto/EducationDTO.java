package mmu.sef.fyj.dto;

public class EducationDTO {
    private String college;
    private String major;
    private Integer currentYearOfStudy;
    private Integer expectedGraduationYear;
    private String studyLevel;

    public EducationDTO() {}

    public EducationDTO(String college, String major, Integer currentYearOfStudy,
                        Integer expectedGraduationYear, String studyLevel) {
        this.college = college;
        this.major = major;
        this.currentYearOfStudy = currentYearOfStudy;
        this.expectedGraduationYear = expectedGraduationYear;
        this.studyLevel = studyLevel;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
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

    public String getStudyLevel() {
        return studyLevel;
    }

    public void setStudyLevel(String studyLevel) {
        this.studyLevel = studyLevel;
    }
}
