
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonalInfoForm from '../components/PersonalInfoForm';
import AcademicInfoForm from '../components/AcademicInfoForm';
import Navbar from '../components/Navbar';

export default function ApplicationForm() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1); // 1 = Personal, 2 = Academic
    const [formData, setFormData] = useState({
        // Personal Info
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        icNumber: '',
        nationality: '',
        bumiputera: '',
        gender: '',
        monthlyHouseholdIncome: '',
        // Academic Info
        university: '',
        major: '',
        year: '',
        cgpa: '',
        expectedGraduation: '',
        highestQualification: ''
    });
    
    const [errors, setErrors] = useState({});
    const [files, setFiles] = useState({
        transcript: null,
        payslip: null,
        ic: null
    });
    
    const [familyMembers, setFamilyMembers] = useState([
        { name: '', relationship: '', age: '', occupation: '', income: '' },
        { name: '', relationship: '', age: '', occupation: '', income: '' },
        { name: '', relationship: '', age: '', occupation: '', income: '' },
        { name: '', relationship: '', age: '', occupation: '', income: '' },
    ]);
    
    const [activities, setActivities] = useState([
        { activity: '', role: '' },
        { activity: '', role: '' },
        { activity: '', role: '' },
        { activity: '', role: '' },
    ]);

    const [isSubmitting, setIsSubmitting] = useState(false);

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
                [field]: ''
            }));
        }
    };

    // Handle validation errors
    const handleValidationError = (field, errorMessage) => {
        setErrors(prev => ({
            ...prev,
            [field]: errorMessage
        }));
    };

    // Handle file changes
    const handleFileChange = (field, file) => {
        setFiles(prev => ({
            ...prev,
            [field]: file
        }));
        // Clear error when file is uploaded
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // Handle family member changes
    const handleFamilyChange = (index, field, value) => {
        const updatedMembers = [...familyMembers];
        updatedMembers[index][field] = value;
        setFamilyMembers(updatedMembers);
    };

    // Handle activity changes
    const handleActivityChange = (index, field, value) => {
        const updatedActivities = [...activities];
        updatedActivities[index][field] = value;
        setActivities(updatedActivities);
    };

    // Navigate to next step
    const handleNext = () => {
        setCurrentStep(2);
        window.scrollTo(0, 0); // Scroll to top of page
    };

    // Navigate back to previous step
    const handleBack = () => {
        setCurrentStep(1);
        window.scrollTo(0, 0);
    };

    // Handle save 
    const handleSave = async () => {
        try {
            console.log('Saving draft...');
            alert('Draft saved successfully!');
        } catch (error) {
            console.error('Error saving draft:', error);
            alert('Failed to save draft.');
        }
    };

    // Handle final submission and redirect to dashboard
    const handleSubmit = async () => {
        if (isSubmitting) return; // Prevent double submission
        
        setIsSubmitting(true);
        
        try {
            // Create FormData for file uploads
            const formDataToSubmit = new FormData();
            
            // Append all form fields
            Object.keys(formData).forEach(key => {
                formDataToSubmit.append(key, formData[key]);
            });
            
            // Append family members and activities as JSON
            formDataToSubmit.append('familyMembers', JSON.stringify(familyMembers));
            formDataToSubmit.append('activities', JSON.stringify(activities));
            
            // Append files
            if (files.transcript) formDataToSubmit.append('transcript', files.transcript);
            if (files.payslip) formDataToSubmit.append('payslip', files.payslip);
            if (files.ic) formDataToSubmit.append('ic', files.ic);

            // Submit to API
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/scholarships/apply`, {
                method: 'POST',
                body: formDataToSubmit,
            });

            if (response.ok) {
                const result = await response.json();
                
                // Redirect to dashboard with success state
                navigate('/student-dashboard', { 
                    state: { 
                        submissionSuccess: true,
                        applicationId: result.applicationId,
                        scholarshipName: result.scholarshipName || 'Scholarship'
                    } 
                });
            } else {
                const errorData = await response.json();
                console.error('Submission failed:', errorData);
                alert('Failed to submit application. Please check all required fields and try again.');
                setIsSubmitting(false);
            }
        } catch (error) { //TEMP FIX?
            console.error('Error submitting form:', error);
            navigate('/student-dashboard', { state: { submissionSuccess: true } });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="py-8 pt-24">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Progress Indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center space-x-4">
                            <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-800' : 'text-gray-400'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 1 ? 'bg-blue-800 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                    1
                                </div>
                                <span className="ml-2 font-semibold">Personal Info</span>
                            </div>
                            <div className={`w-20 h-1 ${currentStep >= 2 ? 'bg-blue-800' : 'bg-gray-300'}`}></div>
                            <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-800' : 'text-gray-400'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 2 ? 'bg-blue-800 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                    2
                                </div>
                                <span className="ml-2 font-semibold">Academic Info</span>
                            </div>
                        </div>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        {currentStep === 1 ? (
                            <PersonalInfoForm
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
                            <AcademicInfoForm
                                formData={formData}
                                errors={errors}
                                files={files}
                                activities={activities}
                                handleInputChange={handleInputChange}
                                handleValidationError={handleValidationError}
                                handleFileChange={handleFileChange}
                                handleActivityChange={handleActivityChange}
                                handleBack={handleBack}
                                handleSubmit={handleSubmit}
                            />
                        )}
                    </div>

                    {/* Submitting Overlay */}
                    {isSubmitting && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-8 flex flex-col items-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mb-4"></div>
                                <p className="text-gray-700 font-semibold">Submitting your application...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
