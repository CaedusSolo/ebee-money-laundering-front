import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from "../components/Navbar";
import personPlaceholder from "../assets/personPlaceholder.svg";

const mockApplications = [
    {
        applicationId: 1,
        scholarshipName: "Merit's Scholarship",
        status: "Under Review",
        submittedDate: "DD/MM/YYYY"
    },
    {
        applicationId: 2,
        scholarshipName: "President's Scholarship",
        status: "Accepted",
        submittedDate: "DD/MM/YYYY"
    },
    {
        applicationId: 3,
        scholarshipName: "High Achiever's Scholarship",
        status: "Pending Approval",
        submittedDate: "DD/MM/YYYY"
    },
];

export default function StudentDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const studentId = 1;
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/students/dashboard/${studentId}`);
                const data = await response.json();
                setDashboardData(data);
            } catch (error) {
                console.error("Error fetching dashboard:", error);
                // Set empty applications on error
                setDashboardData({ applications: [] });
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();

        // Check if redirected after successful submission
        if (location.state?.submissionSuccess) {
            setShowSuccessMessage(true);
            // Clear the state to prevent showing message on refresh
            window.history.replaceState({}, document.title);
            // Hide message after 5 seconds
            setTimeout(() => setShowSuccessMessage(false), 5000);
        }
    }, [location]);

    const applications = mockApplications; // Using mock data

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <Navbar showBrowse={true} /> {/* Pass the prop here */}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                <div className="space-y-8">
                    
                    {/* Success Message */}
                    {showSuccessMessage && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between animate-fade-in">
                            <div className="flex items-center space-x-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="font-semibold text-green-800">Application Submitted Successfully!</p>
                                    <p className="text-sm text-green-700">Your scholarship application has been received and is now under review.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowSuccessMessage(false)}
                                className="text-green-600 hover:text-green-800"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden border border-gray-100">
                                <img src={personPlaceholder} alt="Profile" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 uppercase">
                                    {dashboardData?.student?.name || "FIRSTNAME LASTNAME"}
                                </h2>
                                <p className="text-gray-600">Student</p>
                                <p className="text-gray-500 text-sm">
                                    {dashboardData?.student?.email || "student1234@student.fyj.edu.my"}
                                </p>
                            </div>
                        </div>
                        <button className="bg-blue-800 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition">
                            Edit
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-50">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                <svg className="w-6 h-6 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Application Status
                            </h3>
                        </div>

                        {applications.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-500 mb-4">No applications yet</p>
                                <button 
                                    onClick={() => navigate('/scholarships-list')}
                                    className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                                >
                                    Browse Scholarships
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {applications.map((app) => {
                                    const getStatusStyles = (status) => {
                                        switch(status?.toLowerCase()) {
                                            case 'accepted':
                                                return {
                                                    bg: 'bg-green-100',
                                                    text: 'text-green-700',
                                                    border: 'border-l-blue-500'
                                                };
                                            case 'under review':
                                                return {
                                                    bg: 'bg-yellow-100',
                                                    text: 'text-yellow-700',
                                                    border: 'border-l-blue-500'
                                                };
                                            case 'pending approval':
                                                return {
                                                    bg: 'bg-blue-100',
                                                    text: 'text-blue-700',
                                                    border: 'border-l-blue-500'
                                                };
                                            case 'rejected':
                                                return {
                                                    bg: 'bg-red-100',
                                                    text: 'text-red-700',
                                                    border: 'border-l-red-500'
                                                };
                                            default:
                                                return {
                                                    bg: 'bg-gray-100',
                                                    text: 'text-gray-700',
                                                    border: 'border-l-gray-400'
                                                };
                                        }
                                    };

                                    const statusStyles = getStatusStyles(app.status);

                                    return (
                                        <div 
                                            key={app.applicationId} 
                                            className={`bg-white border-l-8 ${statusStyles.border} p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-bold text-gray-800 mb-3">{app.scholarshipName}</h4>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-600 font-medium">Status:</span>
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusStyles.bg} ${statusStyles.text}`}>
                                                                {app.status.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500">
                                                            <span className="font-medium">Submitted:</span> {app.submittedDate}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button className="bg-red-600 text-white px-6 py-2 rounded-md font-bold hover:bg-red-700 transition shadow-sm">
                            Delete Account
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
