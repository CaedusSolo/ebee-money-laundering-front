"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthService from "../services/AuthService";
import ScholarshipService from "../services/ScholarshipService";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ScholarshipDetailPage() {
  const { scholarshipId } = useParams();
  const { currentUser } = useAuth();
  const scholarshipService = new ScholarshipService(currentUser?.token);

  const [reviewers, setReviewers] = useState([]);
  const [committeeMembers, setCommitteeMembers] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [formData, setFormData] = useState({
    id: 1,
    title: "Merit's Scholarship",
    description:
      "Call out a feature, benefit, or value of your site or product that can stand on its own.",
    deadline: "2024-12-31",
    reviewer: "",
    scholarshipCommittees: [],
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${currentUser?.token}`,
    };

    Promise.all([
      fetch(`${API_BASE}/api/users?role=REVIEWER`, { headers }).then((r) =>
        r.ok ? r.json() : [],
      ),
      fetch(`${API_BASE}/api/users?role=COMMITTEE`, { headers }).then((r) =>
        r.ok ? r.json() : [],
      ),
      scholarshipService.getScholarshipById(scholarshipId),
    ])
      .then(([reviewersList, committeeList, data]) => {
        setReviewers(reviewersList);
        setCommitteeMembers(committeeList);
        setFormData(data);
        console.log(data);
      })
      .catch((e) => {
        console.error("Error fetching options:", e);
      })
      .finally(() => setLoadingOptions(false));
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCommitteeChange = (index, value) => {
    setFormData((prev) => {
      const updatedCommitteeIds = [...prev.scholarshipCommittees];
      updatedCommitteeIds[index] = value;
      return { ...prev, scholarshipCommittees: updatedCommitteeIds };
    });
  };

  const handleApplyChanges = (e) => {
    e.preventDefault();
    console.log("Saving:", formData);
    if (scholarshipId) {
      scholarshipService
        .updateScholarship(scholarshipId, formData)
        .then((response) => {
          console.log("Scholarship updated successfully:", response);
        })
        .catch((error) => {
          console.error("Error updating scholarship:", error);
        });
    } else {
      scholarshipService
        .createScholarship(formData)
        .then((response) => {
          console.log("Scholarship created successfully:", response);
        })
        .catch((error) => {
          console.error("Error creating scholarship:", error);
        });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this scholarship?")) {
      // Delete logic here
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-4xl">
        <form onSubmit={handleApplyChanges}>
          {/* Main Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row">
              {/* Form Fields Section */}
              <div className="flex flex-1 flex-col gap-4">
                {/* Title Field */}
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-lg font-semibold text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

                {/* Description & Requirements Field */}
                <div className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    rows={2}
                    className="w-full resize-none bg-transparent text-sm text-gray-600 outline-none"
                  />
                </div>

                {/* Deadline Field */}
                <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <span className="text-sm text-gray-500">Deadline:</span>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleChange("deadline", e.target.value)}
                    className="flex-1 bg-transparent text-sm text-gray-500 outline-none"
                  />
                </div>

                {/* Reviewer Dropdown */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Reviewer
                  </label>
                  <select
                    value={formData.reviewer}
                    onChange={(e) => handleChange("reviewer", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    disabled={loadingOptions}
                  >
                    <option value="">Select reviewer</option>
                    {reviewers.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} {r.email ? `(${r.email})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Scholarship Committee Dropdowns */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Scholarship Committee
                  </label>
                  <div className="grid gap-3 sm:grid-cols-1">
                    {[1, 2, 3].map((i) => (
                      <select
                        value={formData.scholarshipCommittees[i]}
                        key={i}
                        onChange={(e) => {
                          handleCommitteeChange(i - 1, e.target.value);
                        }}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        disabled={loadingOptions}
                      >
                        <option value="">Committee member {i}</option>
                        {committeeMembers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} {c.email ? `(${c.email})` : ""}
                          </option>
                        ))}
                      </select>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-row justify-center items-center gap-3">
            <button
              onClick={handleApplyChanges}
              className="inline-flex min-w-48 items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Apply Changes
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex min-w-48 items-center justify-center rounded-full bg-red-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
