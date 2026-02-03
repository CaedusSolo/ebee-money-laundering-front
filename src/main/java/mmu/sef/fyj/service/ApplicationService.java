package mmu.sef.fyj.service;

import mmu.sef.fyj.dto.ApplicationSummaryDTO;
import mmu.sef.fyj.model.Application;
import mmu.sef.fyj.model.ApplicationStatus;
import mmu.sef.fyj.model.Grade;
import mmu.sef.fyj.repository.ApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public List<Application> findAll() {
        return applicationRepository.findAll();
    }

    public Optional<Application> findById(Integer id) {
        return applicationRepository.findById(id);
    }

    public List<Application> findByStudent(Integer studentId) {
        return applicationRepository.findByStudentID(studentId);
    }

    public List<Application> findByScholarship(Integer scholarshipId) {
        return applicationRepository.findByScholarshipID(scholarshipId);
    }

    @Transactional
    public Application createDraft(Application application) {
        // Ensure draft status/createdAt are set by the entity constructor
        if (application.getStatus() == null) {
            application.setStatus(ApplicationStatus.DRAFT);
        }
        return applicationRepository.save(application);
    }

    @Transactional
    public Optional<Application> submit(Integer id) {
        return applicationRepository.findById(id).map(app -> {
            app.submitApplication();
            return applicationRepository.save(app);
        });
    }

    @Transactional
    public Optional<Application> updateStatus(Integer id, ApplicationStatus status) {
        return applicationRepository.findById(id).map(app -> {
            app.updateStatus(status);
            return applicationRepository.save(app);
        });
    }

    @Transactional
    public Optional<Application> addGrade(Integer id, Grade grade) {
        return applicationRepository.findById(id).map(app -> {
            app.addGrade(grade);
            return applicationRepository.save(app);
        });
    }

    @Transactional
    public void delete(Integer id) {
        applicationRepository.deleteById(id);
    }

    public List<ApplicationSummaryDTO> findSummariesByScholarship(Integer scholarshipId) {
        return applicationRepository.findByScholarshipID(scholarshipId).stream()
                .map(app -> new ApplicationSummaryDTO(
                        app.getApplicationID(),
                        app.getFirstName() + " " + app.getLastName(),
                        app.getCreatedAt(),
                        app.getSubmittedAt(),
                        app.getStatus()
                ))
                .collect(Collectors.toList());
    }
}

