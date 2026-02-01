import React, { useState, useEffect } from 'react';

export default function StudentDashboard() {
    const [studentData, setStudentData] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const studentId = 1; // This should come from auth context

    useEffect(() => {
        fetchStudentDashboard();
    }, []);

    const fetchStudentDashboard = async () => {
        setLoading(true);
        try {
        // Stub API call - replace with actual endpoint
        // const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/student/dashboard/${studentId}`);
        // const data = await response.json();
        
        // Using stub data for now
        const stubData = {
            studentId: 1,
            username: "IZZMINHAL",
            fullName: "Izz Minhal",
            email: "jinda@student.ubd.edu.my",
            profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
            applications: [
            {
                applicationId: 1,
                scholarshipName: "Merit's Scholarship",
                status: "UNDER REVIEW",
                submittedDate: "DD/MM/YYYY"
            },
            {
                applicationId: 2,
                scholarshipName: "President's Scholarship",
                status: "ACCEPTED",
                submittedDate: "DD/MM/YYYY"
            },
            {
                applicationId: 3,
                scholarshipName: "High Achiever's Scholarship",
                status: "SUBMITTED",
                submittedDate: "DD/MM/YYYY"
            }
            ]
        };
        
        setStudentData(stubData);
        setApplications(stubData.applications);
        } catch (err) {
        setError('Failed to load dashboard');
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    const handleEditProfile = () => {
        console.log("Edit profile clicked");
        // Navigate to edit profile page
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        console.log("Delete account confirmed");
        // Call delete account API
        }
    };

    const getStatusColor = (status) => {
        switch (status.toUpperCase()) {
        case 'ACCEPTED':
            return 'success';
        case 'UNDER REVIEW':
            return 'warning';
        case 'SUBMITTED':
            return 'info';
        case 'REJECTED':
            return 'danger';
        default:
            return 'secondary';
        }
    };

    const getStatusText = (status) => {
        return status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ');
    };

    if (loading) {
        return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
            </div>
        </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        {/* Header */}
        <nav className="navbar" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '1rem 2rem'
        }}>
            <div className="container-fluid">
            <a className="navbar-brand text-white d-flex align-items-center" href="#">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="me-2">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2"/>
                </svg>
                <span className="fw-bold">Further Your Journey</span>
            </a>
            <div className="d-flex align-items-center gap-3">
                <button className="btn btn-dark">Find Scholarship</button>
                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" 
                    style={{ width: '40px', height: '40px', cursor: 'pointer' }}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                </svg>
                </div>
            </div>
            </div>
        </nav>

        {/* Main Content */}
        <div className="container py-5">
            {error && (
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
            )}

            <div className="row">
            <div className="col-12">
                {/* Profile Card */}
                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        {/* Profile Image */}
                        <div className="position-relative me-3">
                        <img
                            src={studentData?.profileImage || "https://via.placeholder.com/100"}
                            alt="Profile"
                            className="rounded-circle"
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                        {/* Online status indicator */}
                        <div 
                            className="position-absolute bg-success rounded-circle border border-3 border-white"
                            style={{ width: '20px', height: '20px', bottom: '5px', right: '5px' }}
                        ></div>
                        </div>
                        
                        {/* Profile Info */}
                        <div>
                        <h4 className="mb-1 fw-bold">{studentData?.username || 'Student'}</h4>
                        <p className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>Student</p>
                        <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                            {studentData?.email || 'student@example.com'}
                        </p>
                        </div>
                    </div>
                    
                    {/* Edit Button */}
                    <button 
                        className="btn btn-primary"
                        onClick={handleEditProfile}
                        style={{ borderRadius: '8px' }}
                    >
                        Edit
                    </button>
                    </div>
                </div>
                </div>

                {/* Application Status Section */}
                <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-4">
                    <svg width="24" height="24" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                        <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                    </svg>
                    <h5 className="mb-0 fw-bold">Application Status</h5>
                    </div>

                    {/* Applications List */}
                    <div className="d-flex flex-column gap-3">
                    {applications.map((app, index) => (
                        <div 
                        key={app.applicationId}
                        className="border-start border-4 ps-3"
                        style={{ 
                            borderColor: `var(--bs-${getStatusColor(app.status)})!important`,
                            paddingTop: '0.5rem',
                            paddingBottom: '0.5rem'
                        }}
                        >
                        <h6 className="fw-bold mb-2">{app.scholarshipName}</h6>
                        <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>
                            Status: <span className={`text-${getStatusColor(app.status)}`}>
                            {getStatusText(app.status)}
                            </span>
                        </p>
                        <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                            Submitted: {app.submittedDate}
                        </p>
                        </div>
                    ))}
                    </div>
                </div>
                </div>

                {/* Delete Account Button */}
                <div className="mt-4 text-end">
                <button 
                    className="btn btn-danger"
                    onClick={handleDeleteAccount}
                    style={{ borderRadius: '8px' }}
                >
                    Delete Account
                </button>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}

