"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthService from "../services/AuthService";
import ScholarshipService from "../services/ScholarshipService";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ScholarshipDetailPage() {
  const { scholarshipId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const scholarshipService = new ScholarshipService(currentUser?.token);

  const [reviewers, setReviewers] = useState([]);
  const [committeeMembers, setCommitteeMembers] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    id: 1,
    name: "Scholarship Name",
    description: "Scholarship Description",
    applicationDeadline: "1999-12-31",
    reviewer: "",
    scholarshipCommittees: [null, null, null],
    minCGPA: "",
    maxFamilyIncome: "",
    mustBumiputera: false,
    minGraduationYear: "",
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${currentUser?.token}`,
    };

    Promise.all([
      fetch(`${API_BASE}/api/reviewer/list`, { headers }).then((r) =>
        r.ok ? r.json() : [],
      ),
      fetch(`${API_BASE}/api/users?role=COMMITTEE`, { headers }).then((r) =>
        r.ok ? r.json() : [],
      ),
      scholarshipId ? scholarshipService.getScholarshipById(scholarshipId) : Promise.resolve(null),
    ])
      .then(([reviewersList, committeeList, data]) => {
        setReviewers(reviewersList);
        setCommitteeMembers(committeeList);
        if (data) {
          // Transform the loaded data to match form expectations
          const transformedData = {
            ...data,
            reviewer: data.reviewer?.reviewerId || "",
            scholarshipCommittees: data.scholarshipCommittees?.length 
              ? data.scholarshipCommittees.map(c => c.committeeId || c.id)
              : [null, null, null],
            minCGPA: data.minCGPA ?? data.mincgpa ?? "",
            maxFamilyIncome: data.maxFamilyIncome ?? data.max_family_income ?? "",
            minGraduationYear: data.minGraduationYear ?? data.min_graduation_year ?? "",
            mustBumiputera: data.mustBumiputera ?? data.must_bumiputera ?? false
          };
          console.log("Raw data from API:", data);
          console.log("Transformed data for form:", transformedData);
          setFormData(transformedData);
        }
      })
      .catch((e) => {
        console.error("Error fetching options:", e);
        setErrorMessage("Failed to load form options");
      })
      .finally(() => setLoadingOptions(false));
  }, [scholarshipId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCommitteeChange = (index, value) => {
    setFormData((prev) => {
      const updatedCommitteeIds = [...prev.scholarshipCommittees];
      updatedCommitteeIds[index] = value;
      return { ...prev, scholarshipCommittees: updatedCommitteeIds };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Scholarship name is required";
    }
    if (!formData.description || formData.description.trim() === "") {
      newErrors.description = "Description is required";
    }
    if (!formData.applicationDeadline) {
      newErrors.applicationDeadline = "Application deadline is required";
    }
    if (!formData.reviewer) {
      newErrors.reviewer = "Please assign a reviewer";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyChanges = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) {
      setErrorMessage("Please fix the errors below");
      return;
    }

    setSubmitting(true);
    try {
      // Format data to match backend DTO expectations
      const payloadData = {
        name: formData.name,
        description: formData.description,
        applicationDeadline: formData.applicationDeadline,
        reviewerId: formData.reviewer ? parseInt(formData.reviewer) : null,
        committeeIds: formData.scholarshipCommittees
          .filter((id) => id) // Remove null values
          .map((id) => parseInt(id)),
        minCGPA: formData.minCGPA,
        maxFamilyIncome: formData.maxFamilyIncome,
        mustBumiputera: formData.mustBumiputera,
        minGraduationYear: formData.minGraduationYear,
      };

      let savedScholarshipId = scholarshipId;
      if (scholarshipId) {
        await scholarshipService.updateScholarship(scholarshipId, payloadData);
      } else {
        const result = await scholarshipService.createScholarship(payloadData);
        savedScholarshipId = result.id;
      }
      
      setSuccessMessage("Scholarship saved successfully! Redirecting...");
      
      // Redirect to scholarship view page after 1.5 seconds
      setTimeout(() => {
        navigate(`/admin/scholarship/${savedScholarshipId}/view`);
      }, 1500);
    } catch (error) {
      console.error("Error saving scholarship:", error);
      setErrorMessage(error.message || "Failed to save scholarship. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this scholarship?")) {
      scholarshipService
        .deleteScholarship(scholarshipId)
        .then(() => {
          setSuccessMessage("Scholarship deleted successfully! Redirecting...");
          setTimeout(() => {
            navigate("/admin/scholarship");
          }, 1500);
        })
        .catch((error) => {
          setErrorMessage("Failed to delete scholarship");
          console.error(error);
        });
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-4xl">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleApplyChanges}>
          {/* Main Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row">
              {/* Form Fields Section */}
              <div className="flex flex-1 flex-col gap-4">
                {/* Name Field */}
                <div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Scholarship name"
                    className={`w-full rounded-lg border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } bg-transparent px-4 py-3 text-lg font-semibold text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Description Field */}
                <div>
                  <div
                    className={`flex-1 rounded-lg border ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    } px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500`}
                  >
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      placeholder="Scholarship description"
                      rows={2}
                      className="w-full resize-none bg-transparent text-sm text-gray-600 outline-none"
                    />
                  </div>
                  {errors.description && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Application Deadline Field */}
                <div>
                  <div
                    className={`flex items-center gap-2 rounded-lg border ${
                      errors.applicationDeadline
                        ? "border-red-500"
                        : "border-gray-300"
                    } px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500`}
                  >
                    <span className="text-sm text-gray-500">Deadline:</span>
                    <input
                      type="date"
                      value={formData.applicationDeadline}
                      onChange={(e) =>
                        handleChange("applicationDeadline", e.target.value)
                      }
                      className="flex-1 bg-transparent text-sm text-gray-500 outline-none"
                    />
                  </div>
                  {errors.applicationDeadline && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.applicationDeadline}
                    </p>
                  )}
                </div>

                {/* Reviewer Dropdown */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Reviewer {errors.reviewer && <span className="text-red-600">*</span>}
                  </label>
                  <select
                    value={formData.reviewer || ""}
                    onChange={(e) => handleChange("reviewer", e.target.value)}
                    className={`w-full rounded-lg border ${
                      errors.reviewer ? "border-red-500" : "border-gray-300"
                    } bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                    disabled={loadingOptions}
                  >
                    <option value="">Select reviewer</option>
                    {reviewers.map((r) => (
                      <option key={r.reviewerId} value={r.reviewerId}>
                        {r.name} {r.email ? `(${r.email})` : ""}
                      </option>
                    ))}
                  </select>
                  {errors.reviewer && (
                    <p className="text-red-600 text-sm mt-1">{errors.reviewer}</p>
                  )}
                </div>

                {/* Scholarship Committee Dropdowns */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Scholarship Committee
                  </label>
                  <div className="grid gap-3 sm:grid-cols-1">
                    {[0, 1, 2].map((i) => (
                      <select
                        value={formData.scholarshipCommittees[i] || ""}
                        key={i}
                        onChange={(e) => {
                          handleCommitteeChange(i, e.target.value);
                        }}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        disabled={loadingOptions}
                      >
                        <option value="">Committee member {i + 1}</option>
                        {committeeMembers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} {c.email ? `(${c.email})` : ""}
                          </option>
                        ))}
                      </select>
                    ))}
                  </div>
                </div>

                {/* Eligibility Criteria */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Eligibility Criteria
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* Min CGPA */}
                    <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                      <span className="text-sm text-gray-500">Min CGPA:</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="4"
                        value={formData.minCGPA ?? ""}
                        onChange={(e) =>
                          handleChange(
                            "minCGPA",
                            e.target.value ? parseFloat(e.target.value) : null,
                          )
                        }
                        placeholder="e.g. 3.0"
                        className="flex-1 bg-transparent text-sm text-gray-900 outline-none"
                      />
                    </div>

                    {/* Max Family Income */}
                    <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                      <span className="text-sm text-gray-500">
                        Max Income (RM):
                      </span>
                      <input
                        type="number"
                        step="100"
                        min="0"
                        value={formData.maxFamilyIncome ?? ""}
                        onChange={(e) =>
                          handleChange(
                            "maxFamilyIncome",
                            e.target.value ? parseFloat(e.target.value) : null,
                          )
                        }
                        placeholder="e.g. 5000"
                        className="flex-1 bg-transparent text-sm text-gray-900 outline-none"
                      />
                    </div>

                    {/* Min Graduation Year */}
                    <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                      <span className="text-sm text-gray-500">
                        Min Grad Year:
                      </span>
                      <input
                        type="number"
                        min="2024"
                        value={formData.minGraduationYear ?? ""}
                        onChange={(e) =>
                          handleChange(
                            "minGraduationYear",
                            e.target.value ? parseInt(e.target.value) : null,
                          )
                        }
                        placeholder="e.g. 2025"
                        className="flex-1 bg-transparent text-sm text-gray-900 outline-none"
                      />
                    </div>

                    {/* Must Bumiputera */}
                    <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-3">
                      <input
                        type="checkbox"
                        id="mustBumiputera"
                        checked={formData.mustBumiputera ?? false}
                        onChange={(e) =>
                          handleChange("mustBumiputera", e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="mustBumiputera"
                        className="text-sm text-gray-700"
                      >
                        Bumiputera Only
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-row justify-center items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-w-48 items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : "Apply Changes"}
            </button>
            {scholarshipId && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex min-w-48 items-center justify-center rounded-full bg-red-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
