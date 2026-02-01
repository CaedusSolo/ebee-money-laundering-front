package mmu.sef.fyj.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 4, message = "Full Name must be at least 4 characters long")
    private String name;

    @NotBlank(message = "Email is required")
    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@mmu\\.edu\\.my$", message = "Must be a valid MMU email (@mmu.edu.my)")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d).+$", message = "Password must contain at least 1 Uppercase letter and 1 Number")
    private String password;

    @NotBlank(message = "Student ID is required")
    // Explaining the Regex:
    // Option 1: ^12\d{8}$ -> Starts with 12, followed by 8 digits (Total 10 digits)
    // OR (|)
    // Option 2: ^2\d{2}[a-zA-Z]{2}\d{3}[a-zA-Z0-9]{2}$
    // - ^2\d{2} -> Starts with 2xx (e.g., 241, 252)
    // - [a-zA-Z]{2} -> 4th & 5th chars are Letters
    // - \d{3} -> 6th, 7th, 8th chars are Numbers
    // - [a-zA-Z0-9]{2}-> 9th & 10th chars are Alphanumeric
    @Pattern(regexp = "^(12\\d{8}|2\\d{2}[a-zA-Z]{2}\\d{3}[a-zA-Z0-9]{2})$", message = "Invalid Student ID format. Must be '12xxxxxxxx' or '2xxLLNNNXX'")
    private String studentId;

    // Getters and Setters
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

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }
}
