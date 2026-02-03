package mmu.sef.fyj.model;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer studentId;

    @Column(nullable = false) 
    private String name;

    @Column(nullable = false)
    private String studentUniId; // eg 243UC247CJ

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // hashed

    @Column
    private String profileImage;

    // Default constructor 
    public Student() {
    }

    // Parameterized constructor
    public Student(String name, String studentUniId, String email, String password) {
        this.name = name;
        this.studentUniId = studentUniId;
        this.email = email;
        this.password = password;
    }

    // Getters and setters
    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public String getStudentUniId() {
        return studentUniId;
    }

    public void setStudentUniId(String studentUniId) {
        this.studentUniId = studentUniId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }
}