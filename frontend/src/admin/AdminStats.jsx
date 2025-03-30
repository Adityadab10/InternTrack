import React, { useState, useEffect } from "react";

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

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/application-status/applications', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
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
            let resumeRating = null;

            if (profileData.resumeFile) {
              console.log(`Analyzing resume for ${profileData.name}...`);
              resumeRating = await analyzeResume(
                `/uploads/resumes/${profileData.resumeFile}`,
                profileData.skills || [],
                application.internshipTitle,
                application.company
              );
              console.log(`Resume analysis for ${profileData.name}:`, resumeRating);
            }

            return {
              ...application,
              studentProfile: profileData,
              studentName: profileData.name,
              resumeRating
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
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (application) => {
    console.log("Approving application:", application);
    if (!application || !application._id) {
      console.error("Invalid application data:", application);
      alert("Invalid application selected");
      return;
    }

    const applicationData = {
      _id: application._id,
      internshipId: application.internshipId,
      internshipTitle: application.internshipTitle,
      company: application.company,
      studentId: application.studentId,
      studentName: application.studentName || `Student ${application.studentId}`,
      status: application.status || 'Pending'
    };

    const requiredFields = ['_id', 'internshipTitle', 'company', 'studentId'];
    const missingFields = requiredFields.filter(field => !applicationData[field]);

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      alert(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    setSelectedApplication(applicationData);
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

      alert("Application rejected successfully.");
      fetchStats();
    } catch (err) {
      console.error("Error rejecting application:", err);
      alert(err.message || "Failed to reject application. Please try again.");
    }
  };

  const handleTaskAssignment = async (e) => {
    e.preventDefault();
    
    if (!selectedApplication?._id) {
      console.error("No application ID found:", selectedApplication);
      alert("Invalid application selected");
      return;
    }
  
    const formData = new FormData(e.target);
    const tasks = formData.get("tasks")
      .split("\n")
      .filter(task => task.trim())
      .map(task => task.trim());
  
    if (tasks.length === 0) {
      alert("Please enter at least one task");
      return;
    }
  
    try {
      const taskDetails = {
        applicationId: selectedApplication._id,
        tasks,
        internshipId: selectedApplication.internshipId,
        internshipTitle: selectedApplication.internshipTitle,
        company: selectedApplication.company,
        candidateId: selectedApplication.studentId,
        candidateName: selectedApplication.studentName || `Student ${selectedApplication.studentId}`
      };
  
      console.log('Sending approval request:', taskDetails);
  
      const response = await fetch(
        `http://localhost:5000/api/application-status/applications/${selectedApplication._id}/approve`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json"
          },
          credentials: 'include',
          body: JSON.stringify(taskDetails),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to approve application");
      }
  
      const data = await response.json();
      console.log('Approval response:', data);
      
      alert("Application approved and tasks assigned successfully.");
      setSelectedApplication(null);
      fetchStats();
    } catch (err) {
      console.error("Error approving application:", err);
      alert(err.message || "Failed to approve application. Please try again.");
    }
  };

  const handleViewProfile = (application) => {
    setSelectedProfile(application);
    setShowProfileModal(true);
  };

  const analyzeResume = async (resumeUrl, skills, jobRole = 'Not Specified', company = 'Not Specified') => {
    try {
      console.log('Starting resume analysis for:', {
        resumeUrl,
        skills,
        jobRole,
        company
      });
      
      if (!resumeUrl || !skills || !Array.isArray(skills)) {
        console.error('Invalid inputs for resume analysis:', { resumeUrl, skills });
        return null;
      }

      const fullResumeUrl = resumeUrl.startsWith('http') 
        ? resumeUrl 
        : `http://localhost:5000${resumeUrl}`;

      const response = await fetch('http://localhost:5000/api/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          resumeUrl: fullResumeUrl,
          skills,
          jobRole,
          company
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server responded with error:', errorData);
        throw new Error(errorData.error || 'Failed to analyze resume');
      }

      const data = await response.json();
      console.log('Resume analysis successful:', data);
      
      return {
        rating: Number(data.rating || 0),
        explanation: data.explanation || 'Analysis completed',
        roleMatch: data.roleMatch || {
          strengthAreas: [],
          improvementAreas: []
        }
      };
    } catch (error) {
      console.error('Resume analysis failed:', error);
      return {
        rating: 0,
        explanation: 'Analysis failed',
        roleMatch: {
          strengthAreas: [],
          improvementAreas: []
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
    if (!stat || !stat._id || !stat.internshipTitle || !stat.company) {
      console.error("Invalid application data in renderApplicationCard:", stat);
      return null;
    }

    const isApproved = stat.status === "Accepted";
    const isRejected = stat.status === "Rejected";

    if (isRejected) {
      return null;
    }

    return (
      <div
        key={stat._id}
        className="p-6 border border-purple-800 rounded-lg shadow-lg bg-gray-900 hover:shadow-purple-900/30 transition-all duration-300"
      >
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
              `/uploads/resumes/${application.studentProfile.resumeFile}`,
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
    <div className="min-h-screen bg-gray-950 text-purple-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-purple-300 mb-2">Application Dashboard</h2>
            <p className="text-purple-400">Manage and review internship applications</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <button
              onClick={fetchStats}
              className="bg-purple-800 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            {!hasStartedAnalysis && (
              <button
                onClick={startAnalysis}
                className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Analyze Resumes
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-900/50 text-red-300 rounded-lg mb-6 border border-red-800">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {!loading && !error && (
          <div>
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
                
                {/* Group and render applications */}
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
          </div>
        )}

        {/* Profile Modal */}
        {showProfileModal && renderProfileModal()}
        
        {/* Task Assignment Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full shadow-xl border border-purple-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-purple-300">
                  Assign Tasks
                </h2>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-purple-400 hover:text-purple-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleTaskAssignment}>
                <div className="mb-4">
                  <label className="block font-medium mb-2 text-purple-400">Tasks</label>
                  <textarea
                    name="tasks"
                    rows="5"
                    className="w-full p-3 bg-gray-800 border border-purple-900 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Enter tasks, one per line"
                    required
                  ></textarea>
                  <p className="mt-1 text-xs text-purple-400">Separate tasks with line breaks</p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedApplication(null)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
                  >
                    Assign Tasks
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStats;