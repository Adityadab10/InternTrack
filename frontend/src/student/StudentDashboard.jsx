import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import ProfileContent from './ProfileContent';
import UserProfile from './UserProfile';
import { ProgressCircle } from './ProgressCircle';
import StudentMentor from "./StudentMentor";
import StudentReport from "./StudentReport";

const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [internships, setInternships] = useState([]);
  const [appliedInternships, setAppliedInternships] = useState([]);
  const [rejectedInternships, setRejectedInternships] = useState([]);
  const [approvedInternships, setApprovedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('explore');

  // Use user.email for studentId
  const studentId = user?.email;

  // Store studentId in localStorage for persistence
  useEffect(() => {
    if (location.state?.studentId) {
      localStorage.setItem("studentId", location.state.studentId);
    }
  }, [location.state?.studentId]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch all internships first
      const internshipsResponse = await fetch('http://localhost:5001/api/internships', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!internshipsResponse.ok) {
        throw new Error(`Failed to fetch internships: ${internshipsResponse.status}`);
      }

      const allInternships = await internshipsResponse.json();

      // Initialize arrays
      let availableInternships = [...allInternships];
      let appliedInternships = [];
      let rejectedInternships = [];
      let approvedInternships = [];

      if (studentId) {
        try {
          const [applicationsResponse, approvedApplicationsResponse, rejectedApplicationsResponse] = 
            await Promise.all([
              fetch(`http://localhost:5001/api/applications/student/${studentId}`, {
                credentials: 'include'
              }),
              fetch(`http://localhost:5001/api/applications/student/${studentId}/approved`, {
                credentials: 'include'
              }),
              fetch(`http://localhost:5001/api/applications/student/${studentId}/rejected`, {
                credentials: 'include'
              })
            ]);

          const myApplications = applicationsResponse.ok ? await applicationsResponse.json() : [];
          const approvedApplications = approvedApplicationsResponse.ok ? await approvedApplicationsResponse.json() : [];
          const rejectedApplications = rejectedApplicationsResponse.ok ? await rejectedApplicationsResponse.json() : [];

          // Filter approved internships
          approvedInternships = allInternships.filter(internship =>
            approvedApplications.some(app => app.internshipId === internship._id)
          );

          // Update other filters to exclude approved internships
          rejectedInternships = allInternships.filter(internship =>
            rejectedApplications.some(app => app.internshipId === internship._id)
          );

          appliedInternships = allInternships.filter(internship =>
            myApplications.some(app => 
              app.internshipId === internship._id && 
              app.status === 'Pending' &&
              !approvedApplications.some(approved => approved.internshipId === internship._id) &&
              !rejectedApplications.some(rejected => rejected.internshipId === internship._id)
            )
          );

          availableInternships = allInternships.filter(internship =>
            !myApplications.some(app => app.internshipId === internship._id) &&
            !approvedApplications.some(app => app.internshipId === internship._id) &&
            !rejectedApplications.some(app => app.internshipId === internship._id)
          );
        } catch (error) {
          console.error("Error fetching application status:", error);
        }
      }

      setInternships(availableInternships);
      setAppliedInternships(appliedInternships);
      setRejectedInternships(rejectedInternships);
      setApprovedInternships(approvedInternships);
      setError(null);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [studentId]);

  // Add a retry function for better user experience
  const handleRetry = () => {
    fetchAllData();
  };

  const handleApply = async (internshipId) => {
    try {
      const internship = internships.find(i => i._id === internshipId);
      
      const response = await fetch('http://localhost:5001/api/applications', {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        credentials: "include",
        body: JSON.stringify({ 
          studentId,
          internshipId,
          internshipTitle: internship.title,
          company: internship.company
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to apply for internship");
      }

      // Update local state
      const appliedInternship = internships.find((i) => i._id === internshipId);
      setAppliedInternships(prev => [...prev, appliedInternship]);
      setInternships(prev => prev.filter((i) => i._id !== internshipId));

      alert("Applied successfully!");
      
      // Refresh the data to ensure everything is in sync
      await fetchAllData();
      
    } catch (err) {
      console.error("Error applying for internship:", err);
      alert(err.message || "Failed to apply. Please try again.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'explore':
        return (
          <div className="bg-black/50 p-6 rounded-lg">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-purple-200 mb-4">Available Internships</h2>
              {internships.length === 0 ? (
                <div className="bg-black/70 p-6 rounded-lg border border-purple-500/30 text-center">
                  <p className="text-purple-200">No internships available at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {internships.map((internship) => (
                    <div 
                      key={internship._id} 
                      className="bg-black/80 rounded-lg border border-purple-800/50 hover:border-purple-600 shadow-lg hover:shadow-purple-900/20 transition-all duration-300 transform hover:-translate-y-2"
                    >
                      <div className="p-6">
                        <h3 className="font-bold text-xl text-purple-400 mb-2">{internship.title}</h3>
                        <p className="text-gray-300 mb-4">{internship.company}</p>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {internship.location || "Remote"}
                          </div>
                          <div className="flex items-center text-sm text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            {internship.duration}
                          </div>
                          <div className="flex items-center text-sm text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M8.433 7.418c.155-.63.244-1.28.244-1.96s-.09-1.33-.244-1.96L10.932 2.5C11.582 2 12 1.24 12 .5H4c-.751 0-1.45.515-1.787 1.355L0 6v8l2.151.864A2.5 2.5 0 004.5 17h11a2.5 2.5 0 002.45-2.014L20 8v-1.5a1.5 1.5 0 00-1.5-1.5H16V5a1 1 0 00-1-1h-4.014L10.433 2.58zM12 10h2v3h-2v-3zM4 10h2v3H4v-3z" />
                            </svg>
                            ₹{internship.stipend || "Unpaid"}
                          </div>
                        </div>
                        <button
                          onClick={() => handleApply(internship._id)}
                          className="w-full bg-purple-900 text-purple-100 py-2 rounded-md hover:bg-purple-800 transition-colors duration-300"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Applications Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-purple-200 mb-4">Pending Applications</h2>
              {appliedInternships.length === 0 ? (
                <div className="bg-black/70 p-6 rounded-lg border border-purple-500/30 text-center">
                  <p className="text-purple-200">No pending applications.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {appliedInternships.map((internship) => (
                    <div 
                      key={internship._id} 
                      className="bg-black/80 rounded-lg border border-purple-800/50 hover:border-purple-600 shadow-lg hover:shadow-purple-900/20 transition-all duration-300 transform hover:-translate-y-2"
                    >
                      <div className="p-6">
                        <h3 className="font-bold text-xl text-purple-400 mb-2">{internship.title}</h3>
                        <p className="text-gray-300 mb-4">{internship.company}</p>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {internship.location || "Remote"}
                          </div>
                          <div className="flex items-center text-sm text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            {internship.duration}
                          </div>
                          <div className="flex items-center text-sm text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M8.433 7.418c.155-.63.244-1.28.244-1.96s-.09-1.33-.244-1.96L10.932 2.5C11.582 2 12 1.24 12 .5H4c-.751 0-1.45.515-1.787 1.355L0 6v8l2.151.864A2.5 2.5 0 004.5 17h11a2.5 2.5 0 002.45-2.014L20 8v-1.5a1.5 1.5 0 00-1.5-1.5H16V5a1 1 0 00-1-1h-4.014L10.433 2.58zM12 10h2v3h-2v-3zM4 10h2v3H4v-3z" />
                            </svg>
                            ₹{internship.stipend || "Unpaid"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rejected Applications Section */}
            <div>
              <h2 className="text-2xl font-bold text-purple-200 mb-4">Rejected Applications</h2>
              {rejectedInternships.length === 0 ? (
                <div className="bg-black/70 p-6 rounded-lg border border-purple-500/30 text-center">
                  <p className="text-purple-200">No rejected applications.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rejectedInternships.map((internship) => (
                    <div 
                      key={internship._id} 
                      className="bg-black/80 rounded-lg border border-red-800/50 hover:border-red-600 shadow-lg hover:shadow-red-900/20 transition-all duration-300"
                    >
                      <div className="p-6">
                        <div className="mb-4">
                          <span className="bg-red-900/50 text-red-200 px-3 py-1 rounded-full text-sm">
                            Application Rejected
                          </span>
                        </div>
                        <h3 className="font-bold text-xl text-red-400 mb-2">{internship.title}</h3>
                        <p className="text-gray-300 mb-4">{internship.company}</p>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {internship.location || "Remote"}
                          </div>
                          <div className="flex items-center text-sm text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            {internship.duration}
                          </div>
                          <div className="flex items-center text-sm text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M8.433 7.418c.155-.63.244-1.28.244-1.96s-.09-1.33-.244-1.96L10.932 2.5C11.582 2 12 1.24 12 .5H4c-.751 0-1.45.515-1.787 1.355L0 6v8l2.151.864A2.5 2.5 0 004.5 17h11a2.5 2.5 0 002.45-2.014L20 8v-1.5a1.5 1.5 0 00-1.5-1.5H16V5a1 1 0 00-1-1h-4.014L10.433 2.58zM12 10h2v3h-2v-3zM4 10h2v3H4v-3z" />
                            </svg>
                            ₹{internship.stipend || "Unpaid"}
                          </div>
                        </div>
                        <div className="mt-4 p-4 bg-red-900/20 rounded-lg">
                          <p className="text-red-200 text-sm">
                            We're sorry, but your application was not selected for this position. 
                            Keep exploring other opportunities that match your skills and interests.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'your-internships':
        return (
          <div className="space-y-8">
            {/* Dynamic Shortlisted/Approved/Accepted Internships */}
            <div>
              <h2 className="text-2xl font-bold text-purple-200 mb-4">Shortlisted/Accepted Internships</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedInternships.length === 0 ? (
                  <div className="col-span-full bg-black/70 p-6 rounded-lg border border-purple-500/30 text-center">
                    <p className="text-purple-200">No shortlisted or accepted internships yet.</p>
                  </div>
                ) : (
                  approvedInternships.map(internship => (
                    <div 
                      key={internship._id} 
                      className="bg-black/80 rounded-lg border border-green-800/50 hover:border-green-600 
                        shadow-lg hover:shadow-green-900/20 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="p-6">
                        <div className="mb-4">
                          <span className={`px-3 py-1 rounded-full text-sm
                            ${internship.status === "Accepted" 
                              ? "bg-emerald-900/50 text-emerald-200 border border-emerald-500/30"
                              : "bg-green-900/50 text-green-200 border border-green-500/30"
                            }`}
                          >
                            {internship.status || "Shortlisted"}
                          </span>
                        </div>
                        <h3 className="font-bold text-xl text-green-400 mb-2">{internship.title}</h3>
                        <p className="text-gray-300 mb-4">{internship.company}</p>
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center text-sm text-gray-300">
                            <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {internship.location || "Remote"}
                          </div>
                          <div className="flex items-center text-sm text-gray-300">
                            <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {internship.duration}
                          </div>
                          <div className="flex items-center text-sm text-gray-300">
                            <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            ₹{internship.stipend || "Unpaid"}
                          </div>
                          <div className="flex items-center text-sm text-gray-300">
                            <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Start Date: {new Date(internship.startDate || Date.now()).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <button 
                            className="flex-1 bg-green-900 text-green-100 py-2 rounded-md hover:bg-green-800 
                              transition-colors duration-300 flex items-center justify-center space-x-2"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>View Details</span>
                          </button>
                          {internship.status === "Accepted" && (
                            <button 
                              className="flex-1 bg-emerald-900/70 text-emerald-100 py-2 rounded-md hover:bg-emerald-800 
                                transition-colors duration-300 flex items-center justify-center space-x-2"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                              </svg>
                              <span>Start Onboarding</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Static Ongoing Internship */}
            <div>
              <h2 className="text-2xl font-bold text-purple-200 mb-4">Ongoing Internship</h2>
              <div className="bg-black/80 rounded-lg border border-blue-800/50 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-blue-400">Full Stack Developer</h3>
                    <p className="text-gray-300">InnoTech Solutions</p>
                  </div>
                  <ProgressCircle percentage={65} color="blue" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-gray-300">3 months (2 months remaining)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Tasks Completed</span>
                    <span className="text-gray-300">13/20</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Next Review</span>
                    <span className="text-gray-300">March 15, 2024</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Static Completed Internship */}
            <div>
              <h2 className="text-2xl font-bold text-purple-200 mb-4">Completed Internship</h2>
              <div className="bg-black/80 rounded-lg border border-purple-800/50 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="mb-2">
                      <span className="bg-purple-900/50 text-purple-200 px-3 py-1 rounded-full text-sm">
                        Completed Successfully
                      </span>
                    </div>
                    <h3 className="font-bold text-xl text-purple-400">UI/UX Design Intern</h3>
                    <p className="text-gray-300">DesignHub Creative</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Jan 2024 - Feb 2024</p>
                    <p className="text-green-400 mt-2">Certificate Available</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-gray-300">
                    <span className="text-gray-400">Key Achievements:</span> Redesigned company website, Created mobile app prototype
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">Skills Gained:</span> Figma, User Research, Prototyping
                  </p>
                </div>
                <div className="mt-4 flex space-x-4">
                  <button className="flex-1 bg-purple-900 text-purple-100 py-2 rounded-md hover:bg-purple-800 transition-colors duration-300">
                    View Certificate
                  </button>
                  <button className="flex-1 bg-purple-900/50 text-purple-100 py-2 rounded-md hover:bg-purple-800 transition-colors duration-300">
                    View Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Mentor':
        return <StudentMentor/>;
      case 'Report':
        return <StudentReport/>;
      case 'profile':
        return <UserProfile />;
      default:
        return <div className="text-gray-300">Select an option</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950">
      {/* Enhanced Sidebar with better UI */}
      <div className="w-72 bg-gradient-to-b from-black via-purple-950/50 to-black text-white h-full border-r border-purple-500/30 shadow-xl relative z-10 backdrop-blur-xl">
        {/* Profile Section */}
        <div className="p-6 border-b border-purple-500/30 bg-black/40">
          <div className="relative group">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-2xl font-bold ring-2 ring-purple-500/30 ring-offset-2 ring-offset-black/50 transform transition-all duration-300 group-hover:scale-105">
                  {user?.name?.[0] || 'S'}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                </div>
                <div className="absolute inset-0 rounded-full bg-purple-500 blur-xl opacity-30 group-hover:opacity-40 transition-opacity"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                  Student Portal
                </h2>
                <p className="text-sm text-purple-300/80">{user?.name || 'Student'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          <div className="space-y-1">
            {[
              { name: 'explore', icon: '🔍', label: 'Explore', desc: 'Find internships' },
              { name: 'your-internships', icon: '💼', label: 'Your Internships', desc: 'Track progress' },
              { name: 'Mentor', icon: '👥', label: 'Mentor', desc: 'Get guidance' },
              { name: 'Report', icon: '📊', label: 'Report', desc: 'View analytics' },
              { name: 'profile', icon: '👤', label: 'Profile', desc: 'Manage account' }
            ].map(item => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-300 relative group
                  ${activeTab === item.name 
                    ? 'bg-gradient-to-r from-purple-600/50 to-indigo-600/50 text-white shadow-lg shadow-purple-500/20' 
                    : 'hover:bg-purple-900/30 text-purple-200 hover:text-white'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                    activeTab === item.name 
                      ? 'bg-white/10' 
                      : 'bg-black/20 group-hover:bg-white/5'
                    } backdrop-blur-sm transition-colors`}>
                    <span className="text-xl transform transition-transform group-hover:scale-110">
                      {item.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-xs text-purple-300/70 group-hover:text-purple-200/90 transition-colors">
                      {item.desc}
                    </div>
                  </div>
                  {activeTab === item.name && (
                    <div className="w-1.5 h-8 bg-white rounded-full absolute right-2 top-1/2 transform -translate-y-1/2"></div>
                  )}
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </button>
            ))}
          </div>
        </nav>

        {/* Enhanced Logout Button - moved up to fill space */}
        <div className="fixed bottom-0 w-72 p-4 border-t border-purple-500/30 bg-black/20 backdrop-blur-sm">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-gradient-to-r from-red-900/50 to-purple-900/50 text-white rounded-xl 
              hover:from-red-800 hover:to-purple-800 transition-all duration-300 
              flex items-center justify-center space-x-2 shadow-lg hover:shadow-purple-500/20
              transform hover:-translate-y-0.5"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
            
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-purple-600/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </div>

      {/* Main Content Area - Update text colors */}
      <div className="flex-1 overflow-auto p-8 bg-gradient-to-br from-purple-950/90 via-black/95 to-indigo-950/90">
        {loading && (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-200 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
            <button 
              onClick={handleRetry}
              className="ml-4 bg-red-900 text-red-100 px-3 py-1 rounded hover:bg-red-800"
            >
              Retry
            </button>
          </div>
        )}
        {!loading && !error && (
          <div className="text-purple-100">
            {renderContent()}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;