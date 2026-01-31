package mmu.sef.fyj.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userID;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // Hashed

    @Enumerated(EnumType.STRING)
    private Role role;

    // Specific to Student Sign Up
    private String studentId;

    // Constructors, Getters, Setters
    public User() {
    }

    public User(String name, String email, String password, Role role, String studentId) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.studentId = studentId;
    }

    // Standard Getters and Setters for all fields...
    public Integer getUserID() {
        return userID;
    }

    public void setUserID(Integer userID) {
        this.userID = userID;
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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }
}
