package mmu.sef.fyj.service;

import mmu.sef.fyj.dto.*;
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

    public Optional<ApplicationDetailsDTO> findDetailsById(Integer id) {
        return applicationRepository.findById(id).map(this::mapToDetailsDTO);
    }

    private ApplicationDetailsDTO mapToDetailsDTO(Application app) {
        ApplicationDetailsDTO dto = new ApplicationDetailsDTO();
        
        dto.setApplicationId(app.getApplicationID());
        dto.setFirstName(app.getFirstName());
        dto.setLastName(app.getLastName());
        dto.setPhoneNumber(app.getPhoneNumber());
        dto.setNricNumber(app.getNricNumber());
        dto.setGender(app.getGender() != null ? app.getGender().name() : null);
        dto.setNationality(app.getNationality());
        dto.setDateOfBirth(app.getDateOfBirth());
        dto.setMonthlyFamilyIncome(app.getMonthlyFamilyIncome());
        dto.setIsBumiputera(app.getBumiputera());
        
        // Education
        dto.setEducation(new EducationDTO(
                app.getCollege(),
                app.getMajor(),
                app.getCurrentYearOfStudy(),
                app.getExpectedGraduationYear(),
                app.getStudyLevel() != null ? app.getStudyLevel().name() : null
        ));
        
        // Address
        dto.setAddress(new AddressDTO(
                app.getHomeAddress(),
                app.getCity(),
                app.getZipCode(),
                app.getState()
        ));
        
        // Extracurriculars
        if (app.getExtracurriculars() != null) {
            dto.setExtracurriculars(app.getExtracurriculars().stream()
                    .map(e -> new ExtracurricularDTO(e.getActivityName(), e.getRole()))
                    .collect(Collectors.toList()));
        }
        
        // Documents
        if (app.getNricDoc() != null) {
            dto.setNricDoc(new DocumentDTO(app.getNricDoc().getFileName(), app.getNricDoc().getFileUrl()));
        }
        if (app.getTranscriptDoc() != null) {
            dto.setTranscriptDoc(new DocumentDTO(app.getTranscriptDoc().getFileName(), app.getTranscriptDoc().getFileUrl()));
        }
        if (app.getFamilyIncomeConfirmationDoc() != null) {
            dto.setFamilyIncomeConfirmationDoc(new DocumentDTO(
                    app.getFamilyIncomeConfirmationDoc().getFileName(),
                    app.getFamilyIncomeConfirmationDoc().getFileUrl()
            ));
        }
        
        return dto;
    }
}

