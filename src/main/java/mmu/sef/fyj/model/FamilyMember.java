package mmu.sef.fyj.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class FamilyMember {

    @Column(name = "member_name")
    private String name;

    @Column(name = "relationship")
    private String relationship;

    @Column(name = "occupation")
    private String occupation;

    @Column(name = "monthly_income")
    private Float monthlyIncome;

    public FamilyMember() {}

    public FamilyMember(String name, String relationship, String occupation, Float monthlyIncome) {
        this.name = name;
        this.relationship = relationship;
        this.occupation = occupation;
        this.monthlyIncome = monthlyIncome;
    }

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

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public Float getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(Float monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }
}

