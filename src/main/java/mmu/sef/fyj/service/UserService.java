package mmu.sef.fyj.service;

import mmu.sef.fyj.model.Role;
import mmu.sef.fyj.model.User;
import mmu.sef.fyj.dto.NewUser;
import mmu.sef.fyj.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User addUser(NewUser newUserData) throws Exception {
        if (userRepository.existsByEmail(newUserData.getEmail())) {
            throw new Exception("Email already in use");
        }

        // Use standard BCrypt encoding
        String encodedPassword = passwordEncoder.encode(newUserData.getPassword());

        User newUser = new User(newUserData.getName(), newUserData.getEmail(), encodedPassword, newUserData.getRole(), "");
        return userRepository.save(newUser);
    }
}
