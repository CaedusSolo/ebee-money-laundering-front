package mmu.sef.fyj.repository;

import mmu.sef.fyj.model.Application;
import mmu.sef.fyj.model.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Integer> {

    List<Application> findByStudentID(Integer studentID);

    // RESTORED: Single ID search used by ApplicationService
    List<Application> findByScholarshipID(Integer scholarshipID);

    // ADDED: List-based search for multiple assignments (used in
    // ScholarshipCommitteeService)
    List<Application> findByScholarshipIDIn(Collection<Integer> scholarshipIDs);

    List<Application> findByStatus(ApplicationStatus status);
}
