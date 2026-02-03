package mmu.sef.fyj.dto;

import mmu.sef.fyj.model.ApplicationStatus;

import java.time.LocalDateTime;

public class ApplicationSummaryDTO {
    private Integer applicationId;
    private String studentName;
    private LocalDateTime createdAt;
    private LocalDateTime submittedAt;
    private ApplicationStatus status;

    public ApplicationSummaryDTO() {}

    public ApplicationSummaryDTO(Integer applicationId, String studentName, LocalDateTime createdAt,
                                  LocalDateTime submittedAt, ApplicationStatus status) {
        this.applicationId = applicationId;
        this.studentName = studentName;
        this.createdAt = createdAt;
        this.submittedAt = submittedAt;
        this.status = status;
    }

    public Integer getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Integer applicationId) {
        this.applicationId = applicationId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
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
}
