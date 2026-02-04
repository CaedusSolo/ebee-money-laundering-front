import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import scholarship1 from '../assets/images/scholarship1.png';
import scholarship2 from '../assets/images/scholarship2.png';
import scholarship3 from '../assets/images/scholarship3.png';

export default function AvailableScholarships() {
    const [searchQuery, setSearchQuery] = useState('');
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Default images mapping (cycles through images)
    const defaultImages = [scholarship1, scholarship2, scholarship3];

    // Fetch scholarships from backend
    useEffect(() => {
        fetchScholarships();
    }, []);

    const fetchScholarships = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('http://localhost:8080/api/scholarships');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Fetched scholarships:', data); // For debugging
            
            // Map backend data to frontend format
            const formattedScholarships = data.map((scholarship, index) => ({
                id: scholarship.id,
                name: scholarship.name,
                description: scholarship.description,
                // Format requirements from backend fields
                requirements: buildRequirements(scholarship),
                // Format deadline (LocalDate comes as "YYYY-MM-DD")
                deadline: formatDeadline(scholarship.applicationDeadline),
                // Cycle through default images
                image: defaultImages[index % defaultImages.length],
                // Keep original data for potential use
                rawData: scholarship
            }));
            
            setScholarships(formattedScholarships);
        } catch (err) {
            console.error('Error fetching scholarships:', err);
            setError('Failed to load scholarships. Please ensure the backend is running on http://localhost:8080');
        } finally {
            setLoading(false);
        }
    };

    // Build requirements array from scholarship data
    const buildRequirements = (scholarship) => {
        const requirements = [];
        
        if (scholarship.minCGPA) {
            requirements.push(`CGPA ${scholarship.minCGPA} and above`);
        }
        
        if (scholarship.mustBumiputera) {
            requirements.push('Must be Bumiputera');
        }
        
        if (scholarship.maxFamilyIncome) {
            requirements.push(`Family income below RM ${scholarship.maxFamilyIncome.toLocaleString()}`);
        }
        
        if (scholarship.minGraduationYear) {
            requirements.push(`Graduating ${scholarship.minGraduationYear} or later`);
        }
        
        // If no specific requirements, show generic message
        if (requirements.length === 0) {
            requirements.push('Check scholarship details for specific requirements');
        }
        
        return requirements;
    };

    // Format the deadline from "YYYY-MM-DD" to "DD Month YYYY"
    const formatDeadline = (dateString) => {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            return date.toLocaleDateString('en-GB', options);
        } catch (e) {
            return dateString; // Return original if parsing fails
        }
    };

    const filteredScholarships = scholarships.filter(scholarship =>
        scholarship.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white min-h-screen">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 py-12 pt-24">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Available Scholarships</h1>

                {/* Search Bar */}
                <div className="mb-10">
                    <div className="relative border border-gray-200 rounded shadow-sm bg-gray-50/30">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search scholarships..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 bg-transparent text-sm focus:outline-none"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                        <p className="mt-4 text-gray-600">Loading scholarships...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                        <div className="flex items-start">
                            <svg className="h-5 w-5 text-red-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                                <h3 className="text-red-800 font-medium">Error loading scholarships</h3>
                                <p className="text-red-700 text-sm mt-1">{error}</p>
                                <button 
                                    onClick={fetchScholarships}
                                    className="mt-3 text-red-600 hover:text-red-800 font-medium text-sm underline"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && scholarships.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="mt-4 text-gray-600 font-medium">No scholarships available</p>
                        <p className="text-gray-500 text-sm mt-1">Check back later for new opportunities</p>
                    </div>
                )}

                {/* No Search Results */}
                {!loading && !error && scholarships.length > 0 && filteredScholarships.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="mt-4 text-gray-600 font-medium">No scholarships found</p>
                        <p className="text-gray-500 text-sm mt-1">Try searching with different keywords</p>
                    </div>
                )}

                {/* Scholarship Cards */}
                {!loading && !error && filteredScholarships.length > 0 && (
                    <div className="space-y-8">
                        {filteredScholarships.map((scholarship) => (
                            <div key={scholarship.id} className="flex flex-col md:flex-row bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">

                                {/* Square Image Section */}
                                <div className="w-full md:w-64 h-64 md:h-auto overflow-hidden flex-shrink-0">
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

                                    {/* Requirements */}
                                    <div className="space-y-1 mb-4">
                                        <h3 className="text-sm font-semibold text-gray-400">Requirements:</h3>
                                        <ul className="text-gray-500 text-sm space-y-1">
                                            {scholarship.requirements.map((req, index) => (
                                                <li key={index} className="flex items-start">
                                                    <span className="mr-2 mt-0.5">→</span>
                                                    <span>{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Deadline */}
                                    <p className="text-gray-500 text-sm mb-6">
                                        Deadline: <span className="font-medium text-gray-700">{scholarship.deadline}</span>
                                    </p>

                                    {/* Apply Button */}
                                    <div>
                                        <Link
                                            to="/application-form"
                                            state={{ 
                                                scholarshipName: scholarship.name,
                                                scholarshipId: scholarship.id,
                                                scholarship: scholarship.rawData
                                            }}
                                            className="text-gray-900 font-bold border-b-2 border-gray-900 hover:text-blue-700 hover:border-blue-700 transition-all pb-1 inline-block"
                                        >
                                            Apply Now →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
