import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import personPlaceholder from "../assets/personPlaceholder.svg";
import ApplicationItem from "../components/ApplicationItem";

export default function StudentDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    const mockApplications = [
        { applicationId: 1, scholarshipName: "Merit's Scholarship", status: "Under Review", submittedDate: "DD/MM/YYYY" },
        { applicationId: 2, scholarshipName: "President's Scholarship", status: "Accepted", submittedDate: "DD/MM/YYYY" },
        { applicationId: 3, scholarshipName: "High Achiever's Scholarship", status: "Submitted", submittedDate: "DD/MM/YYYY" },
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const studentId = 1;
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/students/dashboard/${studentId}`);
                const data = await response.json();
                setDashboardData(data);
            } catch (error) {
                console.error("Error fetching dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const applications = dashboardData?.applications?.length > 0 ? dashboardData.applications : mockApplications;

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
                <div className="space-y-8">

                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden border border-gray-100">
                                <img src={personPlaceholder} alt="Profile" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 uppercase">
                                    {dashboardData?.student?.name || "IZZMINHAL"}
                                </h2>
                                <p className="text-gray-600">Student</p>
                                <p className="text-gray-500 text-sm">
                                    {dashboardData?.student?.email || "jimin@student.fyj.edu.my"}
                                </p>
                            </div>
                        </div>
                        <button className="bg-blue-800 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition">
                            Edit
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center mb-6 pb-2 border-b border-gray-100">
                            <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-xl font-bold text-gray-800">Application Status</h3>
                        </div>

                        <div className="space-y-4">
                            {applications.map((app) => (
                                <ApplicationItem
                                    key={app.applicationId}
                                    title={app.scholarshipName}
                                    status={app.status}
                                    date={app.submittedDate}
                                />
                            ))}
                        </div>
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
