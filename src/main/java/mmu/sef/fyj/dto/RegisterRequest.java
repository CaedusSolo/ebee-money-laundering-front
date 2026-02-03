package mmu.sef.fyj.dto;

import jakarta.validation.constraints.*;

public class RegisterRequest {
    @NotBlank(message = "Full Name is required")
    @Size(min = 4, message = "Full Name must be at least 4 characters")
    private String name;

    @NotBlank(message = "Student ID is required")
    private String studentId;

    @NotBlank(message = "Email is required")
    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@gmail\\.com$", message = "Must be a valid Gmail address (@gmail.com)")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#.]).+$",
        message = "Password must contain at least 1 Uppercase letter, 1 Number, and 1 Special Symbol (@$!%*?&#.)"
    )
    private String password;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
