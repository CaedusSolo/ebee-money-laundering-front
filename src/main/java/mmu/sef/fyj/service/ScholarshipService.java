package mmu.sef.fyj.service;

import mmu.sef.fyj.dto.ScholarshipDTO;
import mmu.sef.fyj.model.Reviewer;
import mmu.sef.fyj.model.Scholarship;
import mmu.sef.fyj.model.ScholarshipCommittee;
import mmu.sef.fyj.repository.ReviewerRepository;
import mmu.sef.fyj.repository.ScholarshipCommitteeRepository;
import mmu.sef.fyj.repository.ScholarshipRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ScholarshipService {

    private final ScholarshipRepository scholarshipRepository;
    private final ReviewerRepository reviewerRepository;
    private final ScholarshipCommitteeRepository committeeRepository;

    @Autowired
    public ScholarshipService(
            ScholarshipRepository scholarshipRepository,
            ReviewerRepository reviewerRepository,
            ScholarshipCommitteeRepository committeeRepository) {
        this.scholarshipRepository = scholarshipRepository;
        this.reviewerRepository = reviewerRepository;
        this.committeeRepository = committeeRepository;
    }

    public List<Scholarship> findAll() {
        return scholarshipRepository.findAll();
    }

    public Optional<Scholarship> findById(Integer id) {
        return scholarshipRepository.findById(id);
    }

    @Transactional
    public Scholarship create(ScholarshipDTO dto) {
        // Validate exactly 3 reviewers are assigned
        if (dto.getReviewerIds() == null || dto.getReviewerIds().size() != 3) {
            throw new IllegalArgumentException("Exactly 3 reviewers must be assigned to a scholarship");
        }

        // Validate exactly 3 committee members are assigned
        if (dto.getCommitteeIds() == null || dto.getCommitteeIds().size() != 3) {
            throw new IllegalArgumentException("Exactly 3 committee members must be assigned to a scholarship");
        }

        Scholarship scholarship = new Scholarship(
            dto.getName(),
            dto.getDescription(),
            dto.getApplicationDeadline()
        );

        Set<Reviewer> reviewers = new HashSet<>(
            reviewerRepository.findAllById(dto.getReviewerIds())
        );
        if (reviewers.size() != 3) {
            throw new IllegalArgumentException("One or more reviewer IDs are invalid");
        }
        scholarship.setReviewers(reviewers);

        Set<ScholarshipCommittee> committees = new HashSet<>(
            committeeRepository.findAllById(dto.getCommitteeIds())
        );
        if (committees.size() != 3) {
            throw new IllegalArgumentException("One or more committee member IDs are invalid");
        }
        scholarship.setScholarshipCommittees(committees);

        // Set eligibility criteria
        scholarship.setMinCGPA(dto.getMinCGPA());
        scholarship.setMaxFamilyIncome(dto.getMaxFamilyIncome());
        scholarship.setMustBumiputera(dto.getMustBumiputera());
        scholarship.setMinGraduationYear(dto.getMinGraduationYear());

        Scholarship savedScholarship = scholarshipRepository.save(scholarship);

        // Update committee assignments
        if (dto.getCommitteeIds() != null && !dto.getCommitteeIds().isEmpty()) {
            for (Integer committeeId : dto.getCommitteeIds()) {
                committeeRepository.findById(committeeId).ifPresent(committee -> {
                    if (!committee.getAssignedScholarshipIds().contains(savedScholarship.getId())) {
                        committee.getAssignedScholarshipIds().add(savedScholarship.getId());
                        committeeRepository.save(committee);
                    }
                });
            }
        }

        return savedScholarship;
    }

    @Transactional
    public Optional<Scholarship> update(Integer id, ScholarshipDTO dto) {
        // Validate exactly 3 reviewers are assigned
        if (dto.getReviewerIds() == null || dto.getReviewerIds().size() != 3) {
            throw new IllegalArgumentException("Exactly 3 reviewers must be assigned to a scholarship");
        }

        // Validate exactly 3 committee members are assigned
        if (dto.getCommitteeIds() == null || dto.getCommitteeIds().size() != 3) {
            throw new IllegalArgumentException("Exactly 3 committee members must be assigned to a scholarship");
        }

        return scholarshipRepository.findById(id)
            .map(scholarship -> {
                scholarship.setName(dto.getName());
                scholarship.setDescription(dto.getDescription());
                scholarship.setApplicationDeadline(dto.getApplicationDeadline());

                Set<Reviewer> reviewers = new HashSet<>(
                    reviewerRepository.findAllById(dto.getReviewerIds())
                );
                if (reviewers.size() != 3) {
                    throw new IllegalArgumentException("One or more reviewer IDs are invalid");
                }
                scholarship.setReviewers(reviewers);

                // Update committee assignments - remove from old committees
                Set<Integer> oldCommitteeIds = scholarship.getScholarshipCommittees().stream()
                    .map(ScholarshipCommittee::getCommitteeId)
                    .collect(java.util.stream.Collectors.toSet());

                for (Integer oldCommitteeId : oldCommitteeIds) {
                    if (!dto.getCommitteeIds().contains(oldCommitteeId)) {
                        committeeRepository.findById(oldCommitteeId).ifPresent(committee -> {
                            committee.getAssignedScholarshipIds().remove(Integer.valueOf(id));
                            committeeRepository.save(committee);
                        });
                    }
                }

                Set<ScholarshipCommittee> committees = new HashSet<>(
                    committeeRepository.findAllById(dto.getCommitteeIds())
                );
                if (committees.size() != 3) {
                    throw new IllegalArgumentException("One or more committee member IDs are invalid");
                }
                scholarship.setScholarshipCommittees(committees);

                // Add to new committees
                for (Integer committeeId : dto.getCommitteeIds()) {
                    committeeRepository.findById(committeeId).ifPresent(committee -> {
                        if (!committee.getAssignedScholarshipIds().contains(id)) {
                            committee.getAssignedScholarshipIds().add(id);
                            committeeRepository.save(committee);
                        }
                    });
                }

                // Update eligibility criteria
                scholarship.setMinCGPA(dto.getMinCGPA());
                scholarship.setMaxFamilyIncome(dto.getMaxFamilyIncome());
                scholarship.setMustBumiputera(dto.getMustBumiputera());
                scholarship.setMinGraduationYear(dto.getMinGraduationYear());

                return scholarshipRepository.save(scholarship);
            });
    }

    @Transactional
    public void delete(Integer id) {
        scholarshipRepository.deleteById(id);
    }

    // @Transactional
    // public Optional<Scholarship> applyScholarship(Integer scholarshipId, Integer applicationId) {
    //     return scholarshipRepository.findById(scholarshipId)
    //         .map(scholarship -> {
    //             Application application = applicationRepository.findById(applicationId)
    //                 .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
    //             scholarship.applyScholarship(application);
    //             return scholarshipRepository.save(scholarship);
    //         });
    // }
    //
    // public Optional<Set<Application>> getApplications(Integer id) {
    //     return scholarshipRepository.findById(id)
    //         .map(Scholarship::getApplications);
    // }
}


class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
