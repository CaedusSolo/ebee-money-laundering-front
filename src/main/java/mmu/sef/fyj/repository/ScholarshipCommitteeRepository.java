package mmu.sef.fyj.repository;

import mmu.sef.fyj.model.ScholarshipCommittee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ScholarshipCommitteeRepository extends JpaRepository<ScholarshipCommittee, Integer> {
    Optional<ScholarshipCommittee> findByEmail(String email);

    boolean existsByEmail(String email);
}
