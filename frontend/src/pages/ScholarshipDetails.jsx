"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import PlaceholderImage from "../assets/images/scholarship3.png";

export default function ScholarshipDetailPage() {
  const [formData, setFormData] = useState({
    id: 1,
    title: "Merit's Scholarship",
    description:
      "Call out a feature, benefit, or value of your site or product that can stand on its own.",
    requirements: ["Req 1", "Req 2", "Req 3"],
    deadline: "Date",
    image: PlaceholderImage,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData((prev) => ({ ...prev, requirements: newRequirements }));
  };

  const handleApplyChanges = (e) => {
    e.preventDefault();
    // Handle saving changes
    console.log("Saving:", formData);
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
              {/* Image Section */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg md:w-72 md:flex-shrink-0">
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt={formData.title}
                  className="h-full w-full object-cover"
                />
                {/* Edit Image Overlay */}
                <button
                  type="button"
                  className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-gray-50"
                >
                  <Pencil className="h-5 w-5 text-gray-700" />
                </button>
              </div>

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
                  <p className="mt-2 text-sm text-gray-500">Requirements:</p>
                  <div className="mt-1 space-y-1">
                    {formData.requirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">→</span>
                        <input
                          type="text"
                          value={req}
                          onChange={(e) =>
                            handleRequirementChange(index, e.target.value)
                          }
                          className="flex-1 bg-transparent text-sm text-gray-600 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deadline Field */}
                <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <span className="text-sm text-gray-500">Deadline:</span>
                  <input
                    type="text"
                    value={formData.deadline}
                    onChange={(e) => handleChange("deadline", e.target.value)}
                    className="flex-1 bg-transparent text-sm text-gray-500 outline-none"
                  />
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
