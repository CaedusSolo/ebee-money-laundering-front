import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Pencil, ArrowRight } from "lucide-react";
import ScholarshipPlaceholder from "../assets/images/scholarship3.png";

const scholarships = [
  {
    id: 1,
    title: "Merit's Scholarship",
    description:
      "Call out a feature, benefit, or value of your site or product that can stand on its own.",
    requirements: ["Req 1", "Req 2", "Req 3"],
    deadline: "Date",
  },
  {
    id: 2,
    title: "President's Scholarship",
    description:
      "Call out a feature, benefit, or value of your site or product that can stand on its own.",
    requirements: ["Req 1", "Req 2", "Req 3"],
    deadline: "Date",
  },
  {
    id: 3,
    title: "High Achiever's Scholarship",
    description:
      "Call out a feature, benefit, or value of your site or product that can stand on its own.",
    requirements: ["Req 1", "Req 2", "Req 3"],
    deadline: "Date",
  },
];

function ScholarshipCard({ scholarship }) {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex-shrink-0">
        <img
          src={scholarship.image || ScholarshipPlaceholder}
          alt={scholarship.title}
          className="w-32 h-24 object-cover rounded-lg"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900">
          {scholarship.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{scholarship.description}</p>

        <div className="mt-2">
          <p className="text-sm text-gray-600">Requirements:</p>
          <ul className="mt-1 space-y-0.5">
            {scholarship.requirements.map((req, index) => (
              <li
                key={index}
                className="text-sm text-gray-500 flex items-center gap-1"
              >
                <ArrowRight className="w-3 h-3" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          Deadline : {scholarship.deadline}
        </p>

        <Link
          to={`/scholarship/${scholarship.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 mt-2"
        >
          More information
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex-shrink-0">
        <Link
          className="block p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Edit scholarship"
          to={`details/${scholarship.id}`}
        >
          <Pencil className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

export default function ManageScholarship() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredScholarships = scholarships.filter((scholarship) =>
    scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search scholarships..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Add Scholarship Button */}
      <div className="flex justify-center mb-8">
        <Link
          to="details/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors"
        >
          Add Scholarship
          <Plus className="w-5 h-5" />
        </Link>
      </div>

      {/* Scholarship List */}
      <div className="space-y-4">
        {filteredScholarships.map((scholarship) => (
          <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
        ))}
      </div>

      {filteredScholarships.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No scholarships found matching your search.
        </p>
      )}
    </div>
  );
}
