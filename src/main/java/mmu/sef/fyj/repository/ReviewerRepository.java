package mmu.sef.fyj.repository;

import mmu.sef.fyj.model.Reviewer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ReviewerRepository extends JpaRepository<Reviewer, Integer> {
    Optional<Reviewer> findByEmail(String email);

    boolean existsByEmail(String email);
}
