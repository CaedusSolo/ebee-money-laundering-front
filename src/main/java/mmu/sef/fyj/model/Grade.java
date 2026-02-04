package mmu.sef.fyj.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class Grade {

    @Column(name = "committee_id")
    private Integer committeeId;

    @Column(name = "category")
    private String category;

    @Column(name = "score")
    private Integer score;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    public Grade() {
    }

    public Grade(Integer committeeId, String category, Integer score, String remarks) {
        this.category = category;
        this.score = score;
        this.remarks = remarks;
        this.committeeId = committeeId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getScore() {
        return score;
    }

    public Integer getCommitteeId() {
        return committeeId;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

}
