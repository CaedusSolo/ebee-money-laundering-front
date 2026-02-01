import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import scholarship1 from '../assets/images/scholarship1.png';
import scholarship2 from '../assets/images/scholarship2.png';
import scholarship3 from '../assets/images/scholarship3.png';

export default function AvailableScholarships() {
    const [searchQuery, setSearchQuery] = useState('');

    //stubs rn 
    const scholarships = [
        {
            id: 1,
            name: "Merit's Scholarship",
            description: "Awarded to students with exceptional academic performance and standardized test scores.",
            requirements: ["Minimum 3.67 CGPA", "Requirement 2", "Requirement 3"],
            deadline: "15 March 2026",
            image: scholarship1
        },
        {
            id: 2,
            name: "President's Scholarship",
            description: "Our most prestigious award for students who demonstrate holistic excellence and vision.",
            requirements: ["Minimum 3.9 CGPA", "Req 2", "Req 3"],
            deadline: "15 March 2026",
            image: scholarship2
        },
        {
            id: 3,
            name: "High Achiever's Scholarship",
            description: "Supporting students who have achieved significant milestones in specialized fields.",
            requirements: ["Req 1", "Req 2", "Req 3"],
            deadline: "15 March 2026",
            image: scholarship3
        }
    ];

    const filteredScholarships = scholarships.filter(scholarship =>
        scholarship.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white min-h-screen">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Available Scholarships</h1>
                
                {/* Search Bar matching the image style */}
                <div className="mb-10">
                    <div className="relative border border-gray-200 rounded shadow-sm bg-gray-50/30">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 bg-transparent text-sm focus:outline-none"
                        />
                    </div>
                </div>

                {/* Horizontal Scholarship Cards */}
                <div className="space-y-8">
                    {filteredScholarships.map((scholarship) => (
                        <div key={scholarship.id} className="flex flex-col md:flex-row bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            
                            {/* Square Image Section */}
                            <div className="w-full md:w-64 h-64 md:h-auto overflow-hidden">
                                <img
                                    src={scholarship.image}
                                    alt={scholarship.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Text Content Section */}
                            <div className="p-8 flex-1 flex flex-col justify-center">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{scholarship.name}</h2>
                                <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                                    {scholarship.description}
                                </p>

                                <div className="space-y-1 mb-4">
                                    <h3 className="text-sm font-semibold text-gray-400">Requirements:</h3>
                                    <ul className="text-gray-500 text-sm">
                                        {scholarship.requirements.map((req, index) => (
                                            <li key={index} className="flex items-center">
                                                <span className="mr-2">→</span> {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <p className="text-gray-500 text-sm mb-6">
                                    Deadline : <span className="font-medium text-gray-700">{scholarship.deadline}</span>
                                </p>
                                
                                <div>
                                    {/* FIX: changed this to link and pass scholarship name */}
                                    <Link 
                                        to="/application-form" 
                                        state={{ scholarshipName: scholarship.name }} 
                                        className="text-gray-900 font-bold border-b-2 border-gray-900 hover:text-blue-700 hover:border-blue-700 transition-all pb-1 inline-block"
                                    >
                                        Apply Now →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}