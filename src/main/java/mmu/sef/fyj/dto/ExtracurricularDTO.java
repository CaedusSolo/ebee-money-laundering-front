package mmu.sef.fyj.dto;

public class ExtracurricularDTO {
    private String activityName;
    private String role;

    public ExtracurricularDTO() {}

    public ExtracurricularDTO(String activityName, String role) {
        this.activityName = activityName;
        this.role = role;
    }

    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
