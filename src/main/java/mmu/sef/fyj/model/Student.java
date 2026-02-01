package mmu.sef.fyj.model;

import java.time.LocalDate;
import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {
    
    @Id
    @GeneratedValue(strategy = GeneratedValue.IDENTITY)
    private Integer studentId; // in DB

    @Column(nullable = false) 
    private String name;

    @Column(nullable = false)
    private String studentUniId; // eg 243UC247CJ

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // hashed

    public Student(String name, String studentUniId, String email, String password) {
        this.name = name;
        this.studentUniId = studentUniId;
        this.email = email;
        this.password = password;
    }

    // getters and setters
    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public Integer getStudentUniId() {
        return studentId;
    }

    public void setStudentUniId(String studentUniId) {
        this.studentUniId = studentUniId;
    }

    public String getname() {
        return name;
    }

    public void setFirstName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public String setEmail(String email) {
        this.email = email;
    }
}
