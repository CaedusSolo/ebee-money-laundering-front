import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ScholarshipService from "../services/ScholarshipService";
import ScholarshipPlaceholder from "../assets/images/scholarship3.png";

export default function ScholarshipView() {
  const { scholarshipId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const scholarshipService = new ScholarshipService(currentUser?.token);

  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        setLoading(true);
        const data = await scholarshipService.getScholarshipById(scholarshipId);
        setScholarship(data);
      } catch (err) {
        setError("Failed to load scholarship details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarship();
  }, [scholarshipId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading scholarship details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="flex gap-6 mb-8">
            <div className="flex-shrink-0">
              <img
                src={scholarship?.image || ScholarshipPlaceholder}
                alt={scholarship?.name}
                className="w-48 h-40 object-cover rounded-lg shadow-md"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {scholarship?.name}
              </h1>
              <p className="text-gray-600 text-lg mb-4">
                {scholarship?.description}
              </p>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium">Deadline:</span>
                <span>{scholarship?.applicationDeadline}</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Eligibility Criteria */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Eligibility Criteria
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Minimum CGPA</p>
                  <p className="font-medium text-gray-900">
                    {scholarship?.minCGPA || "No minimum"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Maximum Family Income</p>
                  <p className="font-medium text-gray-900">
                    RM {scholarship?.maxFamilyIncome?.toLocaleString() || "No limit"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Minimum Graduation Year</p>
                  <p className="font-medium text-gray-900">
                    {scholarship?.minGraduationYear || "Any year"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bumiputera Status</p>
                  <p className="font-medium text-gray-900">
                    {scholarship?.mustBumiputera ? "Required" : "Not required"}
                  </p>
                </div>
              </div>
            </div>

            {/* Assignment Information */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Assignment
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Assigned Reviewer</p>
                  <p className="font-medium text-gray-900">
                    {scholarship?.reviewer ? `${scholarship.reviewer.name} (${scholarship.reviewer.email})` : "Not assigned"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Scholarship Committee Members
                  </p>
                  <div className="space-y-2">
                    {scholarship?.scholarshipCommittees &&
                    scholarship.scholarshipCommittees.length > 0 ? (
                      scholarship.scholarshipCommittees.map((member, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-medium text-gray-900">
                            {index + 1}. {member.name || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {member.email}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No committee members assigned</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate(`/admin/scholarship/details/${scholarshipId}`)}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Scholarship
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
