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
}
