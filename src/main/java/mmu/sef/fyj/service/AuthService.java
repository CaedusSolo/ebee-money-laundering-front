package mmu.sef.fyj.service;

import mmu.sef.fyj.model.Role;
import mmu.sef.fyj.model.User;
import mmu.sef.fyj.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerStudent(String name, String email, String password, String studentId) throws Exception {
        if (userRepository.existsByEmail(email)) {
            throw new Exception("Email already in use");
        }

        // Use standard BCrypt encoding
        String encodedPassword = passwordEncoder.encode(password);

        User newUser = new User(name, email, encodedPassword, Role.STUDENT, studentId);
        return userRepository.save(newUser);
    }

    public void resetPassword(String email, String newPassword) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("No account found with this email address."));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

}
