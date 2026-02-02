package mmu.sef.fyj.repository;

import mmu.sef.fyj.model.Student;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findByEmail(String email);
    
    boolean existsByEmail(String email);
}

