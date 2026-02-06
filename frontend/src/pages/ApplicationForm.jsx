import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PersonalInfoForm from "../components/PersonalInfoForm";
import AcademicInfoForm from "../components/AcademicInfoForm";
import Navbar from "../components/Navbar";

export default function ApplicationForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const scholarshipId = location.state?.scholarshipId;
  const scholarshipName = location.state?.scholarshipName;
  const [currentStep, setCurrentStep] = useState(1); // 1 = Personal, 2 = Academic

  const [formData, setFormData] = useState({
    // Personal Info
    name: "",
    phoneNumber: "",
    dateOfBirth: "",
    icNumber: "",
    nationality: "",
    bumiputera: "",
    gender: "",
    homeAddress: "",
    monthlyHouseholdIncome: "",
    // Academic Info
    university: "",
    major: "",
    year: "",
    cgpa: "",
    expectedGraduation: "",
    highestQualification: "",
  });

  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState({
    transcript: null,
    payslip: null,
    ic: null,
  });

  const [familyMembers, setFamilyMembers] = useState([
    { name: "", relationship: "", age: "", occupation: "", income: "" },
    { name: "", relationship: "", age: "", occupation: "", income: "" },
    { name: "", relationship: "", age: "", occupation: "", income: "" },
    { name: "", relationship: "", age: "", occupation: "", income: "" },
  ]);

  const [activities, setActivities] = useState([
    { activity: "", role: "" },
    { activity: "", role: "" },
    { activity: "", role: "" },
    { activity: "", role: "" },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill student's full name from authenticated user when available
  useEffect(() => {
    if (!currentUser) return;

    const name =
      currentUser.name ||
      currentUser.fullName ||
      currentUser.studentName ||
      currentUser.username ||
      currentUser.userName ||
      (currentUser.student && currentUser.student.name) ||
      "";

    if (name) {
      setFormData((prev) => ({ ...prev, name }));
    }
  }, [currentUser]);

  // Handle input changes - memoized to prevent re-renders
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  // Handle validation errors - memoized
  const handleValidationError = useCallback((field, errorMessage) => {
    setErrors((prev) => {
      // If error message is empty, remove the key entirely
      if (!errorMessage || errorMessage.trim() === "") {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      // Otherwise, set the error
      return {
        ...prev,
        [field]: errorMessage,
      };
    });
  }, []);

  // Handle file changes - memoized
  const handleFileChange = useCallback((field, file) => {
    setFiles((prev) => ({
      ...prev,
      [field]: file,
    }));
    // Clear error when file is uploaded
    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  // Handle family member changes - memoized
  const handleFamilyChange = useCallback((index, field, value) => {
    setFamilyMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  // Handle activity changes - memoized
  const handleActivityChange = useCallback((index, field, value) => {
    setActivities((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  // Navigate to next step - memoized
  const handleNext = useCallback(() => {
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Navigate back to previous step - memoized
  const handleBack = useCallback(() => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Handle save - memoized
  const handleSave = useCallback(async () => {
    try {
      console.log("Saving draft...");
      alert("Draft saved successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft.");
    }
  }, []);

  // Helper function to upload a file

  // Handle final submission and redirect to dashboard - memoized
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);

    const uploadFile = async (file) => {
      const fileFormData = new FormData();
      fileFormData.append("file", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/files/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
          body: fileFormData,
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to upload file: ${file.name}`);
      }

      return await response.json();
    };

    try {
      // Upload files and get their info
      const uploadedFiles = {};

      if (files.transcript) {
        const result = await uploadFile(files.transcript);
        uploadedFiles.transcript = {
          fileName: result.filename,
          fileUrl: `/api/files/download/${result.filename}`,
        };
      }

      if (files.payslip) {
        const result = await uploadFile(files.payslip);
        uploadedFiles.payslip = {
          fileName: result.filename,
          fileUrl: `/api/files/download/${result.filename}`,
        };
      }

      if (files.ic) {
        const result = await uploadFile(files.ic);
        uploadedFiles.ic = {
          fileName: result.filename,
          fileUrl: `/api/files/download/${result.filename}`,
        };
      }

      // Build the application request body
      const applicationData = {
        ...formData,
        // backend expects `fullName` (validated). Ensure we send it.
        fullName: formData.name || formData.fullName || "",
        scholarshipID: scholarshipId,
        familyMembers: familyMembers,
        activities: activities,
        transcript: uploadedFiles.transcript || null,
        payslip: uploadedFiles.payslip || null,
        ic: uploadedFiles.ic || null,
      };

      // Submit to API
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/scholarships/apply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(applicationData),
        },
      );

      if (response.ok) {
        const result = await response.json();

        // Redirect to dashboard with success state
        navigate("/student-dashboard", {
          state: {
            submissionSuccess: true,
            applicationId: result.applicationId,
            scholarshipName:
              result.scholarshipName || scholarshipName || "Scholarship",
          },
        });
      } else {
        const errorData = await response.json();
        console.error("Submission failed:", errorData);
        alert(
          "Failed to submit application. Please check all required fields and try again.",
        );
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit application: " + error.message);
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    formData,
    familyMembers,
    activities,
    files,
    navigate,
    currentUser,
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="py-8 pt-24">
        <div className="max-w-4xl mx-auto px-4">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div
                className={`flex items-center ${currentStep >= 1 ? "text-blue-800" : "text-gray-400"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 1 ? "bg-blue-800 text-white" : "bg-gray-300 text-gray-600"}`}
                >
                  1
                </div>
                <span className="ml-2 font-semibold">Personal Info</span>
              </div>
              <div
                className={`w-20 h-1 ${currentStep >= 2 ? "bg-blue-800" : "bg-gray-300"}`}
              ></div>
              <div
                className={`flex items-center ${currentStep >= 2 ? "text-blue-800" : "text-gray-400"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 2 ? "bg-blue-800 text-white" : "bg-gray-300 text-gray-600"}`}
                >
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
                <p className="text-gray-700 font-semibold">
                  Submitting your application...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
