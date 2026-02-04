package mmu.sef.fyj.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

public class ScholarshipDTO {

    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Application deadline is required")
    @Future(message = "Deadline must be in the future")
    private LocalDate applicationDeadline;

    private Integer reviewerId;

    private Set<Integer> committeeIds = new HashSet<>();

    private Float minCGPA;

    private Float maxFamilyIncome;

    private Boolean mustBumiputera;

    private Integer minGraduationYear;

    // Getters and Setters
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

    public Integer getReviewerId() {
        return reviewerId;
    }

    public void setReviewerId(Integer reviewerId) {
        this.reviewerId = reviewerId;
    }

    public Set<Integer> getCommitteeIds() {
        return committeeIds;
    }

    public void setCommitteeIds(Set<Integer> committeeIds) {
        this.committeeIds = committeeIds != null ? committeeIds : new HashSet<>();
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
