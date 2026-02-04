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
        Scholarship scholarship = new Scholarship(
            dto.getName(),
            dto.getDescription(),
            dto.getApplicationDeadline()
        );

        if (dto.getReviewerId() != null) {
            Reviewer reviewer = reviewerRepository.findById(dto.getReviewerId())
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer not found"));
            scholarship.setReviewer(reviewer);
        }

        if (dto.getCommitteeIds() != null && !dto.getCommitteeIds().isEmpty()) {
            Set<ScholarshipCommittee> committees = new HashSet<>(
                committeeRepository.findAllById(dto.getCommitteeIds())
            );
            scholarship.setScholarshipCommittees(committees);
        }

        return scholarshipRepository.save(scholarship);
    }

    @Transactional
    public Optional<Scholarship> update(Integer id, ScholarshipDTO dto) {
        return scholarshipRepository.findById(id)
            .map(scholarship -> {
                scholarship.setName(dto.getName());
                scholarship.setDescription(dto.getDescription());
                scholarship.setApplicationDeadline(dto.getApplicationDeadline());

                if (dto.getReviewerId() != null) {
                    Reviewer reviewer = reviewerRepository.findById(dto.getReviewerId())
                        .orElseThrow(() -> new ResourceNotFoundException("Reviewer not found"));
                    scholarship.setReviewer(reviewer);
                }

                if (dto.getCommitteeIds() != null) {
                    Set<ScholarshipCommittee> committees = new HashSet<>(
                        committeeRepository.findAllById(dto.getCommitteeIds())
                    );
                    scholarship.setScholarshipCommittees(committees);
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
