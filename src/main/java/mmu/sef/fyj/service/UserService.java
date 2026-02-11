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

import java.util.Optional;

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

    public User updateUser(Integer userId, NewUser updateData) throws Exception {
        // Find the user by ID
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new Exception("User not found with ID: " + userId));

        // Store old email and role for later comparison
        String oldEmail = user.getEmail();
        Role oldRole = user.getRole();

        // Check if email is being changed and if it's already in use by another user
        if (!oldEmail.equals(updateData.getEmail()) && userRepository.existsByEmail(updateData.getEmail())) {
            throw new Exception("Email already in use");
        }

        // Update basic user information
        user.setName(updateData.getName());
        user.setEmail(updateData.getEmail());
        user.setRole(updateData.getRole());

        // Only update password if provided (not null or empty)
        String newEncodedPassword = null;
        if (updateData.getPassword() != null && !updateData.getPassword().trim().isEmpty()) {
            newEncodedPassword = passwordEncoder.encode(updateData.getPassword());
            user.setPassword(newEncodedPassword);
        }

        // Save the updated user
        User updatedUser = userRepository.save(user);

        // Handle role changes and updates in reviewer/committee tables
        handleRoleAndPasswordUpdate(oldEmail, oldRole, updateData, newEncodedPassword);

        return updatedUser;
    }

    private void handleRoleAndPasswordUpdate(String oldEmail, Role oldRole, NewUser updateData, String newEncodedPassword) {
        Role newRole = updateData.getRole();
        String newEmail = updateData.getEmail();

        // If role changed, remove from old role table and add to new role table
        if (oldRole != newRole) {
            // Remove from old role table
            if (oldRole == Role.REVIEWER) {
                reviewerRepository.findByEmail(oldEmail).ifPresent(reviewerRepository::delete);
            } else if (oldRole == Role.COMMITTEE) {
                committeeRepository.findByEmail(oldEmail).ifPresent(committeeRepository::delete);
            }

            // Add to new role table if applicable
            if (newRole == Role.REVIEWER) {
                Reviewer newReviewer = new Reviewer();
                newReviewer.setName(updateData.getName());
                newReviewer.setEmail(newEmail);
                // If password was updated, use new one; otherwise keep empty (user's existing password in User table)
                newReviewer.setPassword(newEncodedPassword != null ? newEncodedPassword : "");
                reviewerRepository.save(newReviewer);
            } else if (newRole == Role.COMMITTEE) {
                ScholarshipCommittee newCommittee = new ScholarshipCommittee();
                newCommittee.setName(updateData.getName());
                newCommittee.setEmail(newEmail);
                // If password was updated, use new one; otherwise keep empty (user's existing password in User table)
                newCommittee.setPassword(newEncodedPassword != null ? newEncodedPassword : "");
                committeeRepository.save(newCommittee);
            }
        } else {
            // Role didn't change, just update existing reviewer/committee record
            if (newRole == Role.REVIEWER) {
                Optional<Reviewer> reviewerOpt = reviewerRepository.findByEmail(oldEmail);
                if (reviewerOpt.isPresent()) {
                    Reviewer reviewer = reviewerOpt.get();
                    reviewer.setName(updateData.getName());
                    reviewer.setEmail(newEmail);
                    if (newEncodedPassword != null) {
                        reviewer.setPassword(newEncodedPassword);
                    }
                    reviewerRepository.save(reviewer);
                }
            } else if (newRole == Role.COMMITTEE) {
                Optional<ScholarshipCommittee> committeeOpt = committeeRepository.findByEmail(oldEmail);
                if (committeeOpt.isPresent()) {
                    ScholarshipCommittee committee = committeeOpt.get();
                    committee.setName(updateData.getName());
                    committee.setEmail(newEmail);
                    if (newEncodedPassword != null) {
                        committee.setPassword(newEncodedPassword);
                    }
                    committeeRepository.save(committee);
                }
            }
        }
    }
}
