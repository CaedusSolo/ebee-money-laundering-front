package mmu.sef.fyj.service;

import mmu.sef.fyj.model.Role;
import mmu.sef.fyj.model.User;
import mmu.sef.fyj.model.Reviewer;
import mmu.sef.fyj.model.ScholarshipCommittee;
import mmu.sef.fyj.dto.NewUser;
import mmu.sef.fyj.repository.UserRepository;
import mmu.sef.fyj.repository.ReviewerRepository;
import mmu.sef.fyj.repository.ScholarshipCommitteeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewerRepository reviewerRepository;

    @Autowired
    private ScholarshipCommitteeRepository committeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User addUser(NewUser newUserData) throws Exception {
        if (userRepository.existsByEmail(newUserData.getEmail())) {
            throw new Exception("Email already in use");
        }

        // Use standard BCrypt encoding
        String encodedPassword = passwordEncoder.encode(newUserData.getPassword());

        User newUser = new User(newUserData.getName(), newUserData.getEmail(), encodedPassword, newUserData.getRole(), "");
        User savedUser = userRepository.save(newUser);

        // Create corresponding entries in reviewer or committee tables
        if (newUserData.getRole() == Role.REVIEWER) {
            Reviewer reviewer = new Reviewer();
            reviewer.setName(newUserData.getName());
            reviewer.setEmail(newUserData.getEmail());
            reviewer.setPassword(encodedPassword);
            reviewerRepository.save(reviewer);
        } else if (newUserData.getRole() == Role.COMMITTEE) {
            ScholarshipCommittee committee = new ScholarshipCommittee();
            committee.setName(newUserData.getName());
            committee.setEmail(newUserData.getEmail());
            committee.setPassword(encodedPassword);
            committeeRepository.save(committee);
        }

        return savedUser;
    }
}
