package mmu.sef.fyj.service;

import mmu.sef.fyj.dto.*;
import mmu.sef.fyj.model.Application;
import mmu.sef.fyj.model.ApplicationStatus;
import mmu.sef.fyj.model.Grade;
import mmu.sef.fyj.model.Gender;
import mmu.sef.fyj.model.StudyLevel;
import mmu.sef.fyj.model.Extracurricular;
import mmu.sef.fyj.model.FamilyMember;
import mmu.sef.fyj.model.DocumentInfo;
import mmu.sef.fyj.dto.ApplicationDetailsDTO.FamilyMemberDTO;
import mmu.sef.fyj.repository.ApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private static final Logger logger = LoggerFactory.getLogger(ApplicationService.class);
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
                        app.getStatus()))
                .collect(Collectors.toList());
    }

    public Optional<ApplicationDetailsDTO> findDetailsById(Integer id) {
        return applicationRepository.findById(id).map(this::mapToDetailsDTO);
    }

    ApplicationDetailsDTO mapToDetailsDTO(Application app) {
        ApplicationDetailsDTO dto = new ApplicationDetailsDTO();

        dto.setApplicationId(app.getApplicationID());
        dto.setFirstName(app.getFirstName());
        dto.setLastName(app.getLastName());
        dto.setPhoneNumber(app.getPhoneNumber());
        dto.setNricNumber(app.getNricNumber());
        dto.setGender(app.getGender() != null ? app.getGender().name() : null);
        dto.setNationality(app.getNationality());
        dto.setCgpa(app.getCgpa());
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

        // Family Members (Added Mapping)
        if (app.getFamilyMembers() != null) {
            dto.setFamilyMembers(app.getFamilyMembers().stream()
                    .map(fm -> new FamilyMemberDTO(
                        fm.getName(),
                        fm.getRelationship(),
                        fm.getOccupation(),
                        fm.getMonthlyIncome()))
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

    @Transactional
    public Application createFromFormData(Map<String, String> formData) {
        Application app = new Application();

        // Set scholarship ID from form data or default to 1
        try {
            app.setScholarshipID(Integer.parseInt(formData.getOrDefault("scholarshipId", "1")));
        } catch (Exception e) {
            app.setScholarshipID(1);
        }

        // Set student ID from form data or default to 1
        // TODO: Get this from authenticated user in the future
        try {
            app.setStudentID(Integer.parseInt(formData.getOrDefault("studentId", "1")));
        } catch (Exception e) {
            app.setStudentID(1);
        }

        // Personal info
        app.setFirstName(formData.getOrDefault("firstName", ""));
        app.setLastName(formData.getOrDefault("lastName", ""));
        app.setPhoneNumber(formData.getOrDefault("phoneNumber", ""));
        app.setNricNumber(formData.getOrDefault("icNumber", ""));
        app.setNationality(formData.getOrDefault("nationality", "Malaysian"));

        // Parse date
        try {
            if (formData.containsKey("dateOfBirth")) {
                app.setDateOfBirth(LocalDate.parse(formData.get("dateOfBirth")));
            }
        } catch (Exception e) {
            // Handle date parse error
        }

        // Parse gender
        try {
            String genderStr = formData.getOrDefault("gender", "MALE");
            app.setGender(Gender.valueOf(genderStr.toUpperCase()));
        } catch (Exception e) {
            app.setGender(Gender.MALE);
        }

        // Parse bumiputera
        app.setBumiputera("yes".equalsIgnoreCase(formData.getOrDefault("bumiputera", "no")));

        // Parse income
        try {
            app.setMonthlyFamilyIncome(Float.parseFloat(formData.getOrDefault("monthlyHouseholdIncome", "0")));
        } catch (Exception e) {
            app.setMonthlyFamilyIncome(0f);
        }

        // Academic info
        app.setCollege(formData.getOrDefault("university", ""));
        app.setMajor(formData.getOrDefault("major", ""));

        try {
            app.setCurrentYearOfStudy(Integer.parseInt(formData.getOrDefault("year", "1")));
        } catch (Exception e) {
            app.setCurrentYearOfStudy(1);
        }

        try {
            app.setExpectedGraduationYear(Integer.parseInt(formData.getOrDefault("expectedGraduation", "2025")));
        } catch (Exception e) {
            app.setExpectedGraduationYear(2025);
        }

        try {
            String cgpaStr = formData.get("cgpa");
            if (cgpaStr != null && !cgpaStr.isBlank()) {
                app.setCgpa(Float.parseFloat(cgpaStr));
            }
        } catch (Exception e) {
            app.setCgpa(null);
        }

        // Study level
        try {
            String qualStr = formData.getOrDefault("highestQualification", "BACHELOR");
            app.setStudyLevel(StudyLevel.valueOf(qualStr.toUpperCase()));
        } catch (Exception e) {
            app.setStudyLevel(StudyLevel.BACHELOR);
        }

        // Submit the application immediately
        app.submitApplication();

        return applicationRepository.save(app);
    }

    @Transactional
    public Application createFromApplicationRequest(NewApplicationRequest request, Integer studentId) {
        logger.info("Creating application from request. CGPA value received: '{}'", request.getCgpa());

        Application app = new Application();

        // Set IDs - use the scholarshipID from request, default to 1 if not provided
        app.setScholarshipID(request.getScholarshipID() != null ? request.getScholarshipID() : 1);
        app.setStudentID(studentId);

        // Personal info - split fullName into firstName and lastName
        String fullName = request.getFullName();
        if (fullName != null && !fullName.isEmpty()) {
            String[] nameParts = fullName.trim().split("\\s+", 2);
            app.setFirstName(nameParts[0]);
            app.setLastName(nameParts.length > 1 ? nameParts[1] : "");
        }
        app.setPhoneNumber(request.getPhoneNumber());
        app.setNricNumber(request.getIcNumber());
        app.setNationality(request.getNationality());

        // Parse date of birth
        try {
            if (request.getDateOfBirth() != null && !request.getDateOfBirth().isEmpty()) {
                app.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
            }
        } catch (Exception e) {
            logger.error("Failed to parse date of birth: {}", request.getDateOfBirth(), e);
        }

        // Parse gender
        try {
            String genderStr = request.getGender();
            if (genderStr != null && !genderStr.isEmpty()) {
                app.setGender(Gender.valueOf(genderStr.toUpperCase()));
            }
        } catch (Exception e) {
            logger.error("Failed to parse gender: {}", request.getGender(), e);
            app.setGender(Gender.MALE);
        }

        // Parse bumiputera
        app.setBumiputera("yes".equalsIgnoreCase(request.getBumiputera()));

        // Home address
        app.setHomeAddress(request.getHomeAddress());

        // Parse income
        try {
            if (request.getMonthlyHouseholdIncome() != null) {
                app.setMonthlyFamilyIncome(Float.parseFloat(request.getMonthlyHouseholdIncome()));
            }
        } catch (Exception e) {
            logger.error("Failed to parse monthly household income: {}", request.getMonthlyHouseholdIncome(), e);
            app.setMonthlyFamilyIncome(0f);
        }

        // Academic info
        app.setCollege(request.getUniversity());
        app.setMajor(request.getMajor());

        try {
            if (request.getYear() != null) {
                app.setCurrentYearOfStudy(Integer.parseInt(request.getYear()));
            }
        } catch (Exception e) {
            logger.error("Failed to parse year: {}", request.getYear(), e);
            app.setCurrentYearOfStudy(1);
        }

        try {
            if (request.getExpectedGraduation() != null) {
                app.setExpectedGraduationYear(Integer.parseInt(request.getExpectedGraduation()));
            }
        } catch (Exception e) {
            logger.error("Failed to parse expected graduation: {}", request.getExpectedGraduation(), e);
            app.setExpectedGraduationYear(2025);
        }

        // Study level
        try {
            String qualStr = request.getHighestQualification();
            if (qualStr != null && !qualStr.isEmpty()) {
                app.setStudyLevel(StudyLevel.valueOf(qualStr.toUpperCase()));
            }
        } catch (Exception e) {
            logger.error("Failed to parse study level: {}", request.getHighestQualification(), e);
            app.setStudyLevel(StudyLevel.BACHELOR);
        }

        // CGPA
        try {
            String cgpaStr = request.getCgpa();
            logger.debug("Parsing CGPA. Raw value: '{}', isNull: {}, isEmpty: {}",
                    cgpaStr,
                    cgpaStr == null,
                    cgpaStr != null && cgpaStr.isEmpty());

            if (cgpaStr != null && !cgpaStr.trim().isEmpty()) {
                Float cgpaValue = Float.parseFloat(cgpaStr.trim());
                app.setCgpa(cgpaValue);
                logger.info("Successfully parsed CGPA: {}", cgpaValue);
            } else {
                logger.warn("CGPA is null or empty. Setting to null.");
                app.setCgpa(null);
            }
        } catch (NumberFormatException e) {
            logger.error("Failed to parse CGPA value: '{}'. Error: {}", request.getCgpa(), e.getMessage());
            app.setCgpa(null);
        }

        // Family members
        if (request.getFamilyMembers() != null) {
            List<FamilyMember> familyMembers = new ArrayList<>();
            for (NewApplicationRequest.FamilyMember fm : request.getFamilyMembers()) {
                if (fm.getName() != null && !fm.getName().isEmpty()) {
                    Float income = null;
                    try {
                        if (fm.getIncome() != null && !fm.getIncome().isEmpty()) {
                            income = Float.parseFloat(fm.getIncome());
                        }
                    } catch (Exception e) {
                        income = 0f;
                    }
                    familyMembers.add(new FamilyMember(fm.getName(), fm.getRelationship(), fm.getOccupation(), income));
                }
            }
            app.setFamilyMembers(familyMembers);
        }

        // Activities/Extracurriculars
        if (request.getActivities() != null) {
            List<Extracurricular> extracurriculars = new ArrayList<>();
            for (NewApplicationRequest.Activity activity : request.getActivities()) {
                if (activity.getActivity() != null && !activity.getActivity().isEmpty()) {
                    extracurriculars.add(new Extracurricular(activity.getActivity(), activity.getRole(), null));
                }
            }
            app.setExtracurriculars(extracurriculars);
        }

        // Documents
        if (request.getIc() != null) {
            app.setNricDoc(new DocumentInfo(request.getIc().getFileName(), request.getIc().getFileUrl(), null));
        }
        if (request.getTranscript() != null) {
            app.setTranscriptDoc(new DocumentInfo(request.getTranscript().getFileName(),
                    request.getTranscript().getFileUrl(), null));
        }
        if (request.getPayslip() != null) {
            app.setFamilyIncomeConfirmationDoc(
                    new DocumentInfo(request.getPayslip().getFileName(), request.getPayslip().getFileUrl(), null));
        }

        // Submit the application
        app.submitApplication();

        logger.info("Application created successfully. CGPA set to: {}", app.getCgpa());
        return applicationRepository.save(app);
    }
}
