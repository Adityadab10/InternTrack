import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AdminStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [expandedExplanations, setExpandedExplanations] = useState(new Set());
  const [analyzingApplications, setAnalyzingApplications] = useState(new Set());
  const [hasStartedAnalysis, setHasStartedAnalysis] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(null);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/pending-applications', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch applications: ${response.status}`);
      }

      const data = await response.json();
      
      const enrichedData = await Promise.all(data.map(async (application) => {
        try {
          const profileResponse = await fetch(
            `http://localhost:5000/api/student-profile/by-email/${application.studentId}`,
            { credentials: 'include' }
          );
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            return {
              ...application,
              studentProfile: profileData,
              studentName: profileData.name
            };
          }
          return application;
        } catch (error) {
          console.error(`Error processing application for ${application.studentId}:`, error);
          return application;
        }
      }));

      setStats(enrichedData);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (application) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/${application._id}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status: 'Accepted' })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to approve application');
      }

      setStats(prevStats => prevStats.filter(stat => stat._id !== application._id));
      alert('Application approved successfully');
    } catch (err) {
      console.error('Error approving application:', err);
      alert(err.message || 'Failed to approve application');
    }
  };

  const handleReject = async (applicationId) => {
    try {
      const response = await fetch(
        `/api/application-status/applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Rejected" }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update status");
      }

      setStats(prevStats => prevStats.filter(stat => stat._id !== applicationId));

      alert("Application rejected successfully.");
    } catch (err) {
      console.error("Error rejecting application:", err);
      alert(err.message || "Failed to reject application. Please try again.");
    }
  };

  const handleViewProfile = (application) => {
    setSelectedProfile(application);
    setShowProfileModal(true);
  };

  const analyzeResume = async (resumeUrl, skills, jobRole = 'Not Specified', company = 'Not Specified') => {
    try {
      console.log('Starting resume analysis:', { resumeUrl, skills, jobRole, company });
      
      const cleanResumeUrl = resumeUrl.replace('/uploads/resumes/', '/uploads/');
      
      const response = await fetch('http://localhost:5000/api/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          resumeUrl: cleanResumeUrl,
          skills: Array.isArray(skills) ? skills : [],
          jobRole,
          company
        })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Resume analysis result:', data);
      return data;
    } catch (error) {
      console.error('Resume analysis error:', error);
      return {
        rating: 0,
        explanation: 'Failed to analyze resume',
        roleMatch: {
          strengthAreas: ['Analysis failed'],
          improvementAreas: ['Please try again']
        }
      };
    }
  };

  const renderProfileModal = () => {
    if (!selectedProfile || !selectedProfile.studentProfile) return null;

    const profile = selectedProfile.studentProfile;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-900 text-purple-100 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-purple-300">Student Profile</h2>
            <button 
              onClick={() => setShowProfileModal(false)}
              className="text-purple-400 hover:text-purple-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-800 p-4 rounded-lg border border-purple-900">
              <h3 className="text-lg font-semibold text-purple-300 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-purple-400">Name</p>
                  <p className="font-medium text-white">{profile.name}</p>
                </div>
                <div>
                  <p className="text-purple-400">Email</p>
                  <p className="font-medium text-white">{profile.email}</p>
                </div>
                <div>
                  <p className="text-purple-400">Phone</p>
                  <p className="font-medium text-white">{profile.phone}</p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-gray-800 p-4 rounded-lg border border-purple-900">
              <h3 className="text-lg font-semibold text-purple-300 mb-4">Education</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-purple-400">Degree</p>
                  <p className="font-medium text-white">{profile.degree}</p>
                </div>
                <div>
                  <p className="text-purple-400">Field of Study</p>
                  <p className="font-medium text-white">{profile.fieldOfStudy}</p>
                </div>
                <div>
                  <p className="text-purple-400">Year of Graduation</p>
                  <p className="font-medium text-white">{profile.yearOfGraduation}</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="bg-gray-800 p-4 rounded-lg border border-purple-900">
                <h3 className="text-lg font-semibold text-purple-300 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-900 text-purple-200 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Links */}
            <div className="bg-gray-800 p-4 rounded-lg border border-purple-900">
              <h3 className="text-lg font-semibold text-purple-300 mb-4">Professional Links</h3>
              <div className="space-y-3">
                {profile.linkedIn && (
                  <a
                    href={profile.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-purple-300 hover:text-purple-100 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn Profile
                  </a>
                )}
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-purple-300 hover:text-purple-100 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub Profile
                  </a>
                )}
              </div>
            </div>

            {/* Resume */}
            {profile.resumeFile && (
              <div className="bg-gray-800 p-4 rounded-lg border border-purple-900">
                <h3 className="text-lg font-semibold text-purple-300 mb-4">Resume</h3>
                <a
                  href={`http://localhost:5000/uploads/resumes/${profile.resumeFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Resume
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderApplicationCard = (stat) => {
    const isApproved = stat.status === 'Accepted';
    
    return (
      <div key={stat._id} className="bg-gray-900/50 rounded-lg border border-purple-500/30 overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-xl text-purple-300">
              {stat.internshipTitle}
            </h3>
            <p className="text-purple-400">Company: {stat.company}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            isApproved ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
          }`}>
            {stat.status}
          </span>
        </div>
        
        {/* Student Profile Information */}
        <div className="mt-4 bg-gray-800 p-4 rounded-lg border border-purple-900">
          <h4 className="font-medium text-purple-300 mb-3">Student Information</h4>
          <div className="space-y-2">
            <p className="text-purple-200">
              <span className="font-medium text-purple-400">Name:</span> {stat.studentName || `Student ${stat.studentId}`}
            </p>
            <p className="text-purple-200">
              <span className="font-medium text-purple-400">Email:</span> {stat.studentId}
            </p>
            {stat.studentProfile && (
              <>
                <p className="text-purple-200">
                  <span className="font-medium text-purple-400">Phone:</span> {stat.studentProfile.phone}
                </p>
                <p className="text-purple-200">
                  <span className="font-medium text-purple-400">Degree:</span> {stat.studentProfile.degree}
                </p>
                <p className="text-purple-200">
                  <span className="font-medium text-purple-400">Field of Study:</span> {stat.studentProfile.fieldOfStudy}
                </p>
                <p className="text-purple-200">
                  <span className="font-medium text-purple-400">Year of Graduation:</span> {stat.studentProfile.yearOfGraduation}
                </p>
                <div className="mt-2">
                  <span className="font-medium text-purple-400">Skills:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {stat.studentProfile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-900 text-purple-200 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {stat.studentProfile.linkedIn && (
                    <a
                      href={stat.studentProfile.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-purple-300 hover:text-purple-100 text-sm"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      LinkedIn Profile
                    </a>
                  )}
                  {stat.studentProfile.github && (
                    <a
                      href={stat.studentProfile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-purple-300 hover:text-purple-100 text-sm"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub Profile
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Resume Section */}
        {stat.resumeUrl && (
          <div className="mt-3">
            <a 
              href={`http://localhost:5000${stat.resumeUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-purple-800 text-purple-100 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Resume
            </a>
          </div>
        )}

        {/* Resume Analysis Section */}
        {hasStartedAnalysis && (
          <div className="mt-4 bg-gray-800 p-4 rounded-lg border border-purple-900">
            <h4 className="font-medium text-purple-300 mb-2">Resume Analysis for {stat.internshipTitle}</h4>
            
            {analyzingApplications.has(stat._id) ? (
              <div className="flex items-center justify-center space-x-2 py-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
                <span className="text-sm text-purple-400">Analyzing resume...</span>
              </div>
            ) : stat.resumeRating ? (
              <>
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="h-2 bg-gray-700 rounded-full">
                      <div 
                        className="h-2 bg-purple-500 rounded-full" 
                        style={{ width: `${(stat.resumeRating.rating || 0) * 10}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="ml-3 font-medium text-purple-300">
                    {`${Number(stat.resumeRating.rating).toFixed(2)}/10`}
                  </span>
                </div>

                {/* Collapsible Analysis Section */}
                <div className="mt-3">
                  <button
                    onClick={() => toggleExplanation(stat._id)}
                    className="flex items-center justify-between w-full text-left text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <span>View Detailed Analysis</span>
                    <svg
                      className={`w-5 h-5 transform transition-transform ${
                        expandedExplanations.has(stat._id) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {expandedExplanations.has(stat._id) && (
                    <div className="mt-3 space-y-3 text-sm text-purple-200">
                      {/* Role Match Analysis */}
                      {stat.resumeRating.roleMatch && (
                        <div>
                          <p className="font-medium mb-2 text-purple-300">Strengths:</p>
                          <ul className="list-disc list-inside mb-2 space-y-1">
                            {stat.resumeRating.roleMatch.strengthAreas.map((strength, idx) => (
                              <li key={idx}>{strength}</li>
                            ))}
                          </ul>
                          
                          <p className="font-medium mb-2 text-purple-300">Areas for Improvement:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {stat.resumeRating.roleMatch.improvementAreas.map((area, idx) => (
                              <li key={idx}>{area}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Explanation */}
                      {stat.resumeRating.explanation && (
                        <div>
                          <p className="font-medium text-purple-300">Analysis:</p>
                          <p className="whitespace-pre-wrap">{stat.resumeRating.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-purple-400 mt-2">No resume analysis available</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex flex-col space-y-3">
          {!isApproved && (
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => handleApprove(stat)}
                className="px-4 py-2 bg-purple-600/20 text-purple-300 rounded-lg hover:bg-purple-600/30 transition-colors text-base font-medium flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Shortlist
              </button>
              <button
                onClick={() => handleReject(stat._id)}
                className="px-4 py-2 bg-red-900/20 text-red-300 rounded-lg hover:bg-red-900/30 transition-colors text-base font-medium flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reject
              </button>
            </div>
          )}
          
          <button
            onClick={() => handleViewProfile(stat)}
            className="w-full bg-gray-800 text-purple-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors border border-purple-900"
          >
            View Full Profile
          </button>
        </div>
      </div>
    );
  };

  const toggleExplanation = (applicationId) => {
    setExpandedExplanations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(applicationId)) {
        newSet.delete(applicationId);
      } else {
        newSet.add(applicationId);
      }
      return newSet;
    });
  };

  const groupAndSortApplications = (applications) => {
    const grouped = applications.reduce((acc, app) => {
      const key = `${app.internshipTitle}-${app.company}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(app);
      return acc;
    }, {});

    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => {
        const ratingA = a.resumeRating?.rating || 0;
        const ratingB = b.resumeRating?.rating || 0;
        return ratingB - ratingA;
      });
    });

    return grouped;
  };

  const startAnalysis = async () => {
    setHasStartedAnalysis(true);
    try {
      const enrichedData = await Promise.all(stats.map(async (application) => {
        setAnalyzingApplications(prev => new Set([...prev, application._id]));
        
        try {
          if (application.studentProfile?.resumeFile) {
            const resumeRating = await analyzeResume(
              `/uploads/${application.studentProfile.resumeFile}`,
              application.studentProfile.skills || [],
              application.internshipTitle,
              application.company
            );
            setAnalyzingApplications(prev => {
              const newSet = new Set(prev);
              newSet.delete(application._id);
              return newSet;
            });
            return { ...application, resumeRating };
          }
          return application;
        } catch (error) {
          console.error(`Error analyzing resume for ${application.studentId}:`, error);
          return application;
        }
      }));

      setStats(enrichedData);
    } catch (error) {
      console.error('Error during analysis:', error);
    } finally {
      setAnalyzingApplications(new Set());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 text-purple-100 p-6">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent mb-2">
              Application Dashboard
            </h2>
            <p className="text-purple-400/80">Track and manage internship applications efficiently</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchStats}
              className="bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 
                text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/20 
                flex items-center justify-center group"
            >
              <svg 
                className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </motion.button>
            
            {!hasStartedAnalysis && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startAnalysis}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 
                  text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-500/20 
                  flex items-center justify-center group"
              >
                <svg 
                  className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Start Analysis
              </motion.button>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          {[
            {
              label: 'Total Applications',
              value: stats.filter(s => s.status !== "Rejected").length,
              color: 'purple',
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )
            },
            {
              label: 'Pending Review',
              value: stats.filter(s => s.status === "Pending").length,
              color: 'yellow',
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )
            },
            {
              label: 'Approved',
              value: stats.filter(s => s.status === "Accepted").length,
              color: 'green',
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )
            },
            {
              label: 'Rejected',
              value: stats.filter(s => s.status === "Rejected").length,
              color: 'red',
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-${stat.color}-500/20
                hover:border-${stat.color}-500/40 transition-all duration-300 group`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 bg-${stat.color}-900/30 rounded-lg group-hover:bg-${stat.color}-900/50 
                  transition-colors duration-300`}>
                  <div className={`text-${stat.color}-400`}>{stat.icon}</div>
                </div>
                <div>
                  <p className={`text-${stat.color}-400 text-sm`}>{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {loading && (
          <motion.div 
            className="flex justify-center items-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-red-900/20 backdrop-blur-sm text-red-300 rounded-xl mb-6 border border-red-800"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && !error && (
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="space-y-8"
          >
            {stats.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-purple-300">No applications found</h3>
                <p className="mt-1 text-purple-400">There are currently no applications to display.</p>
                <div className="mt-6">
                  <button
                    onClick={fetchStats}
                    className="inline-flex items-center px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-gray-900/50 border border-purple-900/50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg border border-purple-900/50">
                      <p className="text-sm text-purple-400">Total Applications</p>
                      <p className="text-2xl font-bold text-purple-300">
                        {stats.filter(s => s.status !== "Rejected").length}
                      </p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-purple-900/50">
                      <p className="text-sm text-purple-400">Pending</p>
                      <p className="text-2xl font-bold text-yellow-400">
                        {stats.filter(s => s.status === "Pending").length}
                      </p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-purple-900/50">
                      <p className="text-sm text-purple-400">Approved</p>
                      <p className="text-2xl font-bold text-green-400">
                        {stats.filter(s => s.status === "Accepted").length}
                      </p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-purple-900/50">
                      <p className="text-sm text-purple-400">Rejected</p>
                      <p className="text-2xl font-bold text-red-400">
                        {stats.filter(s => s.status === "Rejected").length}
                      </p>
                    </div>
                  </div>
                </div>
                
                {Object.entries(groupAndSortApplications(stats)).map(([key, applications]) => (
                  <div key={key} className="mb-10">
                    <div className="flex items-center mb-4 p-3 bg-gray-900 rounded-lg border border-purple-900/50">
                      <h3 className="text-xl font-semibold text-purple-300">
                        {key.split('-')[0]}
                      </h3>
                      <span className="ml-2 px-2 py-1 bg-purple-900/50 text-purple-300 text-xs rounded-full">
                        {key.split('-')[1]}
                      </span>
                      <span className="ml-auto text-sm text-purple-400">
                        {applications.length} {applications.length === 1 ? 'application' : 'applications'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {applications.map(app => renderApplicationCard(app))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </motion.div>
        )}

        {showProfileModal && renderProfileModal()}
      </motion.div>
    </div>
  );
};

export default AdminStats;