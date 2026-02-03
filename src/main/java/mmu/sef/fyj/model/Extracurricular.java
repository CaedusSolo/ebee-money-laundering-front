package mmu.sef.fyj.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class Extracurricular {

    @Column(name = "activity_name")
    private String activityName;

    @Column(name = "role")
    private String role;

    @Column(name = "achievement", columnDefinition = "TEXT")
    private String achievement;

    public Extracurricular() {}

    public Extracurricular(String activityName, String role, String achievement) {
        this.activityName = activityName;
        this.role = role;
        this.achievement = achievement;
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

    public String getAchievement() {
        return achievement;
    }

    public void setAchievement(String achievement) {
        this.achievement = achievement;
    }
}

