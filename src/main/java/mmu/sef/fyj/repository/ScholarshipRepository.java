package mmu.sef.fyj.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import mmu.sef.fyj.model.Scholarship;


@Repository
public interface ScholarshipRepository extends JpaRepository<Scholarship, Integer> {

    @Query("SELECT s FROM Scholarship s JOIN s.reviewers r WHERE r.reviewerId = :reviewerId")
    List<Scholarship> findByReviewers_ReviewerId(@Param("reviewerId") Integer reviewerId);

    List<Scholarship> findByApplicationDeadlineAfter(LocalDate date);

    List<Scholarship> findByScholarshipCommittees_CommitteeId(Integer committeeId);

    @Query("SELECT s FROM Scholarship s WHERE s.applicationDeadline >= :today")
    List<Scholarship> findActiveScholarships(@Param("today") LocalDate today);

    @Query("SELECT s FROM Scholarship s JOIN s.scholarshipCommittees c WHERE c.committeeId IN :committeeIds")
    List<Scholarship> findByCommitteeIds(@Param("committeeIds") Set<Integer> committeeIds);
}
