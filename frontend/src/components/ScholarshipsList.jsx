import React, { useState } from 'react';
import scholarship1 from '../assets/images/scholarship1.png';
import scholarship2 from '../assets/images/scholarship2.png';
import scholarship3 from '../assets/images/scholarship3.png';
// import 'bootstrap/dist/css/bootstrap.min.css';

export default function AvailableScholarships() {
    const [searchQuery, setSearchQuery] = useState('');

  // data for scholarships, stubs for now cus can add on scholarships later 
    const scholarships = [
    {
        id: 1,
        name: "Merit's Scholarship",
        description: "Call out a feature, benefit, or value of your site or product that can stand on its own.",
        requirements: ["Req 1", "Req 2", "Req 3"],
        deadline: "Date",
        image: scholarship1
    },
    {
        id: 2,
        name: "President's Scholarship",
        description: "Call out a feature, benefit, or value of your site or product that can stand on its own.",
        requirements: ["Req 1", "Req 2", "Req 3"],
        deadline: "Date",
        image: scholarship2
    },
    {
        id: 3,
        name: "High Achiever's Scholarship",
        description: "Call out a feature, benefit, or value of your site or product that can stand on its own.",
        requirements: ["Req 1", "Req 2", "Req 3"],
        deadline: "Date",
        image: scholarship3
    }
];

  // filter scholarships based on search query
    const filteredScholarships = scholarships.filter(scholarship =>
        scholarship.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleApply = (scholarshipId) => {
        // stub function for applying to a scholarship
        console.log(`Applying to scholarship with ID: ${scholarshipId}`);
        alert(`Application submitted for scholarship ID: ${scholarshipId}`);
    };

    return (
        <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
        {/* Header */}
        <nav className="navbar navbar-expand-lg" style={{ 
            background: 'linear-gradient(135deg, #2D25CC 0%, #6FE6D5 100%)',
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
                <div className="ms-auto">
                    <button className="btn btn-light me-2" style={{ fontWeight: '500' }}>Sign Up</button>
                    <button className="btn btn-outline-light" style={{ fontWeight: '500' }}>Login</button>
                </div>
            </div>
        </nav>

      {/* Main Content */}
        <div className="container py-5">
            <h1 className="fw-bold mb-4" style={{ fontSize: '2rem' }}>Available Scholarships</h1>

            {/* Search Bar */}
            <div className="mb-5">
                <div className="input-group" style={{ maxWidth: '600px' }}>
                    <span className="input-group-text bg-white border-end-0">
                    <svg width="16" height="16" fill="currentColor" className="text-muted" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                    </span>
                    <input
                    type="text"
                    className="form-control border-start-0 ps-0"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ boxShadow: 'none' }}
                    />
                </div>
            </div>

        {/* Scholarships Grid */}
        <div className="row g-4">
                {filteredScholarships.map((scholarship) => (
                <div key={scholarship.id} className="col-12 col-md-6 col-lg-4">
                    <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                        {/* Image */}
                        <div style={{ height: '200px', overflow: 'hidden' }}>
                            <img
                            src={scholarship.image}
                            alt={scholarship.name}
                            className="w-100 h-100"
                            style={{ objectFit: 'cover' }}
                            />
                        </div>

                        {/* Card Body */}
                        <div className="card-body p-4">
                            <h5 className="card-title fw-bold mb-3">{scholarship.name}</h5>
                            <p className="card-text text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                                {scholarship.description}
                            </p>

                            {/* Requirements */}
                            <div className="mb-3">
                                <p className="mb-2 fw-semibold" style={{ fontSize: '0.9rem' }}>Requirements:</p>
                                <ul className="list-unstyled mb-0">
                                {scholarship.requirements.map((req, index) => (
                                    <li key={index} className="text-muted d-flex align-items-center mb-1" style={{ fontSize: '0.85rem' }}>
                                    <span className="me-2" style={{ color: '#667eea' }}>→</span>
                                    {req}
                                    </li>
                                ))}
                                </ul>
                            </div>

                            {/* Deadline */}
                            <p className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
                                <span className="fw-semibold">Deadline:</span> {scholarship.deadline}
                            </p>

                            {/* Apply Button */}
                            <button
                                onClick={() => handleApply(scholarship.id)}
                                className="btn w-100 fw-semibold d-flex align-items-center justify-content-center"
                                style={{
                                backgroundColor: 'transparent',
                                color: '#000',
                                border: 'none',
                                padding: '0',
                                fontSize: '0.9rem'
                                }}
                            >
                                Apply Now
                                <span className="ms-2">→</span>
                            </button>
                        </div>
                    </div>
                </div>
                ))}
            </div>

            {/* No Results Message */}
            {filteredScholarships.length === 0 && (
                <div className="alert alert-info" role="alert">
                    No scholarships found matching your search.
                </div>
            )}
        </div>
    </div>
    );
}
