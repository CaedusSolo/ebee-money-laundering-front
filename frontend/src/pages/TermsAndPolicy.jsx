import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header with Back Button */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center">
          <Link
            to="/signup"
            className="flex items-center text-gray-600 hover:text-[#1e3a8a] transition duration-200 group"
          >
            <svg
              className="w-6 h-6 mr-2 transform group-hover:-translate-x-1 transition"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-bold text-lg">Back to Sign Up</span>
          </Link>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 max-w-4xl mx-auto px-6 py-10 w-full">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 md:p-12">

          {/* Title Section */}
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-2">Terms & Policy</h1>
            <p className="text-gray-500">Last updated: February 2026</p>
          </div>

          {/* Terms Content */}
          <div className="space-y-8 text-gray-700 leading-relaxed">

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Eligibility</h2>
              <p>
                By applying for this scholarship, you certify that all information provided in your application is true and accurate.
                Applicants must be currently enrolled in an accredited institution and meet the GPA requirements specified in the specific scholarship details.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Data Privacy</h2>
              <p>
                We value your privacy. Your personal information, including academic records and financial data, will be used solely for the purpose of evaluating your scholarship application.
                We do not sell or share your data with third parties without your explicit consent, except as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Code of Conduct</h2>
              <p>
                Applicants are expected to uphold the highest standards of academic integrity. Plagiarism, falsification of documents, or any form of fraud will result in immediate disqualification
                and potential banning from future scholarship opportunities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Award Disbursal</h2>
              <p>
                Scholarship funds are disbursed directly to the educational institution to cover tuition and fees. In specific cases where funds are disbursed to the student,
                receipts proving educational expenses must be provided within 30 days.
              </p>
            </section>

            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-[#1e3a8a] mt-8">
              <p className="text-sm text-blue-900 font-medium">
                By creating an account, you acknowledge that you have read and understood these terms.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPolicy;
