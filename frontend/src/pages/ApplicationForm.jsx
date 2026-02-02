import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Step1PersonalInfo from "../components/PersonalInfoForm";
import Step2AcademicInfo from "../components/AcademicInfoForm";

const ScholarshipApplication = () => {
    const location = useLocation();
    const selectedScholarship = location.state?.scholarshipName || "Scholarship";

    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});

    // Form state for all fields
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        icNumber: "",
        nationality: "",
        bumiputera: "",
        gender: "",
        monthlyHouseholdIncome: "",
        university: "",
        major: "",
        year: "",
        cgpa: "",
        expectedGraduation: "",
        highestQualification: "",
    });

    // File uploads state
    const [files, setFiles] = useState({
        transcript: null,
        payslip: null,
        ic: null,
    });

    // Table data state
    const [familyMembers, setFamilyMembers] = useState(
        Array(5).fill({
            name: "",
            relationship: "",
            age: "",
            occupation: "",
            income: "",
        }),
    );
    
    const [activities, setActivities] = useState(
        Array(6).fill({ activity: "", role: "" }),
    );

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    // Handle validation errors from components
    const handleValidationError = (field, error) => {
        setErrors(prev => ({
            ...prev,
            [field]: error
        }));
    };

    // Handle file uploads
    const handleFileChange = (field, file) => {
        setFiles(prev => ({
            ...prev,
            [field]: file
        }));
        // Clear error when file is selected
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    // Handlers for dynamic inputs
    const handleFamilyChange = (index, field, value) => {
        const updated = [...familyMembers];
        updated[index] = { ...updated[index], [field]: value };
        setFamilyMembers(updated);
    };

    const handleActivityChange = (index, field, value) => {
        const updated = [...activities];
        updated[index] = { ...updated[index], [field]: value };
        setActivities(updated);
    };

    // Simple validation - just check if required fields are filled
    const validateStep1 = () => {
        const newErrors = {};
        
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
        if (!formData.dateOfBirth.trim()) newErrors.dateOfBirth = "Date of birth is required";
        if (!formData.icNumber.trim()) newErrors.icNumber = "IC number is required";
        if (!formData.nationality.trim()) newErrors.nationality = "Nationality is required";
        if (!formData.bumiputera.trim()) newErrors.bumiputera = "This field is required";
        if (!formData.gender || formData.gender === "Select Gender") newErrors.gender = "Please select a gender";
        if (!formData.monthlyHouseholdIncome.trim()) newErrors.monthlyHouseholdIncome = "Monthly household income is required";

        return newErrors;
    };

    const validateStep2 = () => {
        const newErrors = {};
        
        if (!formData.university.trim()) newErrors.university = "University/College is required";
        if (!formData.major.trim()) newErrors.major = "Major is required";
        if (!formData.year || formData.year === "Select Year") newErrors.year = "Please select a year";
        if (!formData.cgpa.trim()) newErrors.cgpa = "CGPA is required";
        if (!formData.expectedGraduation.trim()) newErrors.expectedGraduation = "Expected graduation year is required";
        if (!formData.highestQualification.trim()) newErrors.highestQualification = "Highest qualification is required";
        if (!files.transcript) newErrors.transcript = "Transcript is required";
        if (!files.payslip) newErrors.payslip = "Payslip is required";
        if (!files.ic) newErrors.ic = "Copy of IC is required";

        return newErrors;
    };

    // Navigation handlers
    const handleNext = () => {
        const newErrors = validateStep1();
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            setStep(2);
        } else {
            alert("Please fix the errors before proceeding to the next step.");
        }
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleSave = () => {
        console.log("Saving progress:", { formData, familyMembers });
        alert("Progress saved!");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateStep2();
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            console.log("Final Submission:", { formData, familyMembers, activities, files });
            alert("Application submitted successfully!");
        } else {
            alert("Please fix the errors before submitting.");
        }
    };

    return (
        <div className="bg-blue-50/30 min-h-screen">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 py-10 pt-24">
                <div className="bg-white rounded-2xl shadow-sm p-10 border border-gray-100">
                    <header className="mb-10">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Scholarship Application
                        </h1>
                        <p className="text-blue-600 font-semibold mt-1">
                            Applying for: {selectedScholarship}
                        </p>
                    </header>

                    <form onSubmit={handleSubmit}>
                        {step === 1 ? (
                            <Step1PersonalInfo
                                formData={formData}
                                errors={errors}
                                familyMembers={familyMembers}
                                handleInputChange={handleInputChange}
                                handleValidationError={handleValidationError}
                                handleFamilyChange={handleFamilyChange}
                                handleNext={handleNext}
                                handleSave={handleSave}
                            />
                        ) : (
                            <Step2AcademicInfo
                                formData={formData}
                                errors={errors}
                                files={files}
                                activities={activities}
                                handleInputChange={handleInputChange}
                                handleValidationError={handleValidationError}
                                handleFileChange={handleFileChange}
                                handleActivityChange={handleActivityChange}
                                handleBack={handleBack}
                            />
                        )}
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ScholarshipApplication;
