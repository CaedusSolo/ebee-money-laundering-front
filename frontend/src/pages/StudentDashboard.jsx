import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from "../components/Navbar";
import personPlaceholder from "../assets/personPlaceholder.svg";
import AuthService from "../services/AuthService.jsx";

export default function StudentDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [emailInput, setEmailInput] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                console.log("Current user:", currentUser); // Debug log
                // Check for both id and userId (for backwards compatibility)
                const studentId = currentUser?.id || currentUser?.studentId || currentUser?.userId;
                if (!studentId) {
                    console.error("No current user ID found. Current user:", currentUser);
                    setDashboardData({ student: {}, applications: [] });
                    setLoading(false);
                    return;
                }
                
                console.log(`Fetching dashboard for student ID: ${studentId}`); // Debug log
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/students/dashboard/${studentId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${currentUser.token}`
                        }
                    }
                );
                
                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }
                
                const data = await response.json();
                console.log("Dashboard data received:", data); // Debug log
                setDashboardData(data);
            } catch (error) {
                console.error("Error fetching dashboard:", error);
                // Set empty applications on error
                setDashboardData({ student: {}, applications: [] });
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
    }, [location, currentUser]);

    useEffect(() => {
        if (dashboardData?.student) {
            setEmailInput(dashboardData.student.email || "");
            // Use placeholder if no profile image or if it's the backend default path
            const profileImg = dashboardData.student.profileImage;
            console.log('Profile image from backend:', profileImg); // Debug log
            if (!profileImg || profileImg === '/assets/images/personPlaceholder.svg') {
                setPreview(personPlaceholder);
            } else {
                setPreview(profileImg);
            }
        }
    }, [dashboardData]);

    const closeModal = () => {
        setEditOpen(false);
        setSelectedFile(null);
        setFormError(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError(null);

        try {
            const studentId = currentUser?.id || currentUser?.studentId || currentUser?.userId;
            if (!studentId) throw new Error('No student id');

            // Update profile image if selected
            if (preview) {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/students/profile-image/${studentId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${currentUser.token}`
                    },
                    body: JSON.stringify({ imageUrl: preview })
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || 'Failed to upload image');
                }
            }

            // Update email if changed
            if (emailInput && emailInput !== dashboardData?.student?.email) {
                const res2 = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/students/email/${studentId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${currentUser.token}`
                    },
                    body: JSON.stringify({ email: emailInput })
                });
                if (!res2.ok) {
                    const err = await res2.json();
                    throw new Error(err.error || 'Failed to update email');
                }

                // Update local storage and reload so AuthContext picks up new email
                const stored = AuthService.getCurrentUser();
                if (stored) {
                    const updated = { ...stored, email: emailInput };
                    localStorage.setItem('user', JSON.stringify(updated));
                }
            }

            // Refresh dashboard data
            const refreshRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/students/dashboard/${studentId}`, {
                headers: { 'Authorization': `Bearer ${currentUser.token}` }
            });
            if (refreshRes.ok) {
                const refreshed = await refreshRes.json();
                setDashboardData(refreshed);
            }

            closeModal();
        } catch (err) {
            setFormError(err.message || 'Failed to update profile');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const applications = dashboardData?.applications || []; // Use real data from API

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
                                <img 
                                    src={
                                        !dashboardData?.student?.profileImage || 
                                        dashboardData?.student?.profileImage === '/assets/images/personPlaceholder.svg' ||
                                        dashboardData?.student?.profileImage === '/assets/personPlaceholder.svg'
                                            ? personPlaceholder 
                                            : dashboardData?.student?.profileImage
                                    } 
                                    alt="Profile" 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => {
                                        console.log('Image failed to load, using placeholder');
                                        e.target.src = personPlaceholder;
                                    }}
                                />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 uppercase">
                                    {dashboardData?.student?.name || "FIRSTNAME LASTNAME"}
                                </h2>
                                <p className="text-gray-600">Student</p>
                                <p className="text-gray-500 text-sm">
                                    {dashboardData?.student?.email || "student@gmail.com"}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setEditOpen(true)} className="bg-blue-800 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition">
                            Edit
                        </button>
                    </div>

                    {editOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                            <div className="bg-white rounded-xl w-full max-w-lg p-8 shadow-2xl">
                                <h3 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h3>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Profile Picture</label>
                                        <div className="flex items-center gap-6">
                                            <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200 shadow-sm">
                                                <img src={preview || dashboardData?.student?.profileImage || personPlaceholder} alt="preview" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Upload Image
                                                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                                </label>
                                                <p className="text-xs text-gray-500 mt-2">JPG, PNG (max. 5MB)</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                        <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="your.email@example.com" />
                                    </div>

                                    {formError && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                            <p className="text-sm font-medium">{formError}</p>
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-3 pt-4 border-t">
                                        <button type="button" onClick={closeModal} className="px-5 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                                        <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

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
                                        const statusUpper = status?.toUpperCase();
                                        switch(statusUpper) {
                                            case 'APPROVED':
                                                return {
                                                    bg: 'bg-green-100',
                                                    text: 'text-green-700',
                                                    border: 'border-l-green-500'
                                                };
                                            case 'UNDER_REVIEW':
                                            case 'GRADED':
                                                return {
                                                    bg: 'bg-yellow-100',
                                                    text: 'text-yellow-700',
                                                    border: 'border-l-yellow-500'
                                                };
                                            case 'PENDING_APPROVAL':
                                            case 'DRAFT':
                                                return {
                                                    bg: 'bg-blue-100',
                                                    text: 'text-blue-700',
                                                    border: 'border-l-blue-500'
                                                };
                                            case 'REJECTED':
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
                                    
                                    // Format status for display
                                    const formatStatus = (status) => {
                                        return status?.replace(/_/g, ' ') || 'UNKNOWN';
                                    };

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
                                                                {formatStatus(app.status)}
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
