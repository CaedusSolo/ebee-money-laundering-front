package mmu.sef.fyj.service;

import mmu.sef.fyj.model.*;
import mmu.sef.fyj.dto.NewUser;
import mmu.sef.fyj.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public User addUser(NewUser newUserData) throws Exception {
        if (userRepository.existsByEmail(newUserData.getEmail())) {
            throw new Exception("Email already in use");
        }

        String encodedPassword = passwordEncoder.encode(newUserData.getPassword());

        User newUser = new User(newUserData.getName(), newUserData.getEmail(), encodedPassword, newUserData.getRole(),
                "");
        User savedUser = userRepository.save(newUser);

        // Create corresponding entries in role-specific tables
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
        } else if (newUserData.getRole() == Role.STUDENT) {
            Student student = new Student(newUserData.getName(), "PENDING", newUserData.getEmail(), encodedPassword);
            studentRepository.save(student);
        }

        return savedUser;
    }

    @Transactional
    public User updateUser(Integer userId, NewUser updateData) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found with ID: " + userId));

        String oldEmail = user.getEmail();
        Role oldRole = user.getRole();

        if (!oldEmail.equals(updateData.getEmail()) && userRepository.existsByEmail(updateData.getEmail())) {
            throw new Exception("Email already in use");
        }

        user.setName(updateData.getName());
        user.setEmail(updateData.getEmail());
        user.setRole(updateData.getRole());

        String newEncodedPassword = null;
        if (updateData.getPassword() != null && !updateData.getPassword().trim().isEmpty()) {
            newEncodedPassword = passwordEncoder.encode(updateData.getPassword());
            user.setPassword(newEncodedPassword);
        }

        User updatedUser = userRepository.save(user);

        handleRoleAndPasswordUpdate(oldEmail, oldRole, updateData, newEncodedPassword);

        return updatedUser;
    }

    @Transactional
    public void deleteUser(Integer id) throws Exception {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new Exception("User not found with ID: " + id));

        if (user.getRole() == Role.ADMIN) {
            throw new Exception("Admin accounts cannot be deleted.");
        }

        // Cleanup role-specific data
        if (user.getRole() == Role.REVIEWER) {
            reviewerRepository.findByEmail(user.getEmail()).ifPresent(reviewerRepository::delete);
        } else if (user.getRole() == Role.COMMITTEE) {
            committeeRepository.findByEmail(user.getEmail()).ifPresent(committeeRepository::delete);
        } else if (user.getRole() == Role.STUDENT) {
            studentRepository.findByEmail(user.getEmail()).ifPresent(studentRepository::delete);
        }

        userRepository.delete(user);
    }

    private void handleRoleAndPasswordUpdate(String oldEmail, Role oldRole, NewUser updateData,
            String newEncodedPassword) {
        Role newRole = updateData.getRole();
        String newEmail = updateData.getEmail();

        if (oldRole != newRole) {
            // Remove from old role table
            if (oldRole == Role.REVIEWER) {
                reviewerRepository.findByEmail(oldEmail).ifPresent(reviewerRepository::delete);
            } else if (oldRole == Role.COMMITTEE) {
                committeeRepository.findByEmail(oldEmail).ifPresent(committeeRepository::delete);
            } else if (oldRole == Role.STUDENT) {
                studentRepository.findByEmail(oldEmail).ifPresent(studentRepository::delete);
            }

            // Add to new role table
            if (newRole == Role.REVIEWER) {
                Reviewer newReviewer = new Reviewer();
                newReviewer.setName(updateData.getName());
                newReviewer.setEmail(newEmail);
                newReviewer.setPassword(newEncodedPassword != null ? newEncodedPassword : "");
                reviewerRepository.save(newReviewer);
            } else if (newRole == Role.COMMITTEE) {
                ScholarshipCommittee newCommittee = new ScholarshipCommittee();
                newCommittee.setName(updateData.getName());
                newCommittee.setEmail(newEmail);
                newCommittee.setPassword(newEncodedPassword != null ? newEncodedPassword : "");
                committeeRepository.save(newCommittee);
            } else if (newRole == Role.STUDENT) {
                Student newStudent = new Student(updateData.getName(), "PENDING", newEmail,
                        newEncodedPassword != null ? newEncodedPassword : "");
                studentRepository.save(newStudent);
            }
        } else {
            // Update existing record
            if (newRole == Role.REVIEWER) {
                reviewerRepository.findByEmail(oldEmail).ifPresent(reviewer -> {
                    reviewer.setName(updateData.getName());
                    reviewer.setEmail(newEmail);
                    if (newEncodedPassword != null)
                        reviewer.setPassword(newEncodedPassword);
                    reviewerRepository.save(reviewer);
                });
            } else if (newRole == Role.COMMITTEE) {
                committeeRepository.findByEmail(oldEmail).ifPresent(committee -> {
                    committee.setName(updateData.getName());
                    committee.setEmail(newEmail);
                    if (newEncodedPassword != null)
                        committee.setPassword(newEncodedPassword);
                    committeeRepository.save(committee);
                });
            } else if (newRole == Role.STUDENT) {
                studentRepository.findByEmail(oldEmail).ifPresent(student -> {
                    student.setName(updateData.getName());
                    student.setEmail(newEmail);
                    if (newEncodedPassword != null)
                        student.setPassword(newEncodedPassword);
                    studentRepository.save(student);
                });
            }
        }
    }
}
