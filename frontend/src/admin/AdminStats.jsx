import React, { useState, useEffect } from "react";

const AdminStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [expandedExplanations, setExpandedExplanations] = useState(new Set());

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
      
      // Enrich the applications data with student profiles and resume analysis
      const enrichedData = await Promise.all(data.map(async (application) => {
        try {
          const profileResponse = await fetch(
            `http://localhost:5000/api/student-profile/by-email/${application.studentId}`,
            { credentials: 'include' }
          );
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            let resumeRating = null;

            // If there's a resume, analyze it
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

    // Ensure all required fields are present
    const applicationData = {
      _id: application._id,
      internshipId: application.internshipId,
      internshipTitle: application.internshipTitle,
      company: application.company,
      studentId: application.studentId,
      studentName: application.studentName || `Student ${application.studentId}`,
      status: application.status || 'Pending'
    };

    // Validate required fields
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
      fetchStats(); // Refresh stats
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
      
      // Return a properly structured object
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
      // Return a default object instead of null
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Student Profile</h2>
            <button 
              onClick={() => setShowProfileModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-medium">{profile.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-medium">{profile.phone}</p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Education</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Degree</p>
                  <p className="font-medium">{profile.degree}</p>
                </div>
                <div>
                  <p className="text-gray-600">Field of Study</p>
                  <p className="font-medium">{profile.fieldOfStudy}</p>
                </div>
                <div>
                  <p className="text-gray-600">Year of Graduation</p>
                  <p className="font-medium">{profile.yearOfGraduation}</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Links */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Links</h3>
              <div className="space-y-3">
                {profile.linkedIn && (
                  <a
                    href={profile.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
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
                    className="flex items-center text-gray-700 hover:text-gray-900"
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
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Resume</h3>
                <a
                  href={`http://localhost:5000/uploads/resumes/${profile.resumeFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
    // Add validation check
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
        className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md"
      >
        <h3 className="font-bold text-lg text-blue-600">
          {stat.internshipTitle}
        </h3>
        <p className="text-gray-700">Company: {stat.company}</p>
        
        {/* Student Profile Information */}
        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-3">Student Information</h4>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">Name:</span> {stat.studentName || `Student ${stat.studentId}`}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {stat.studentId}
            </p>
            {stat.studentProfile && (
              <>
                <p className="text-gray-700">
                  <span className="font-medium">Phone:</span> {stat.studentProfile.phone}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Degree:</span> {stat.studentProfile.degree}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Field of Study:</span> {stat.studentProfile.fieldOfStudy}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Year of Graduation:</span> {stat.studentProfile.yearOfGraduation}
                </p>
                <div className="mt-2">
                  <span className="font-medium text-gray-700">Skills:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {stat.studentProfile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
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
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
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
                      className="inline-flex items-center text-gray-700 hover:text-gray-900"
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
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Resume
            </a>
          </div>
        )}

        {/* Resume Rating */}
        {stat.resumeRating && (
          <div className="mt-3 bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Resume Analysis for {stat.internshipTitle}</h4>
            <div className="flex items-center">
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-blue-600 rounded-full" 
                    style={{ width: `${(stat.resumeRating.rating || 0) * 10}%` }}
                  ></div>
                </div>
              </div>
              <span className="ml-3 font-medium text-blue-600">
                {stat.resumeRating.rating 
                  ? `${Number(stat.resumeRating.rating).toFixed(2)}/10` 
                  : 'Analyzing...'}
              </span>
            </div>
            
            {/* Collapsible Analysis Section */}
            <div className="mt-3">
              <button
                onClick={() => toggleExplanation(stat._id)}
                className="flex items-center justify-between w-full text-left text-sm font-medium text-blue-600 hover:text-blue-800"
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Expandable Content */}
              {expandedExplanations.has(stat._id) && (
                <div className="mt-3 space-y-3">
                  {/* Role Match Analysis */}
                  {stat.resumeRating.roleMatch && (
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-2">Strengths:</p>
                      <ul className="list-disc list-inside mb-2">
                        {stat.resumeRating.roleMatch.strengthAreas.map((strength, idx) => (
                          <li key={idx}>{strength}</li>
                        ))}
                      </ul>
                      
                      <p className="font-medium mb-2">Areas for Improvement:</p>
                      <ul className="list-disc list-inside">
                        {stat.resumeRating.roleMatch.improvementAreas.map((area, idx) => (
                          <li key={idx}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Explanation */}
                  {stat.resumeRating.explanation && (
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">Analysis:</p>
                      <p className="whitespace-pre-wrap">{stat.resumeRating.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status and Actions */}
        <div className="mt-4 flex justify-between items-center">
          <span className={`px-3 py-1 rounded-full text-sm ${
            isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {stat.status}
          </span>
          
          {!isApproved && (
            <div className="space-x-2">
              <button
                onClick={() => handleApprove(stat)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(stat._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          )}
        </div>

        {/* View Profile Button */}
        <button
          onClick={() => handleViewProfile(stat)}
          className="mt-4 w-full bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
        >
          View Full Profile
        </button>
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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Application Statistics</h2>
      <button
        onClick={fetchStats}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Refresh Applications
      </button>

      {loading && <p className="text-gray-600">Loading stats...</p>}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">{error}</div>
      )}

      {!loading && !error && (
        <div>
          {stats.length === 0 ? (
            <p className="text-gray-600">No applications found.</p>
          ) : (
            <>
              <p className="mb-4 text-gray-600">
                Total Applications: {stats.filter(s => s.status !== "Rejected").length}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map(renderApplicationCard)}
              </div>
            </>
          )}
        </div>
      )}

      {/* Add Profile Modal */}
      {showProfileModal && renderProfileModal()}
      
      {/* Task Assignment Form - updated without mentor selection */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Assign Tasks
            </h2>
            <form onSubmit={handleTaskAssignment}>
              <div className="mb-4">
                <label className="block font-medium mb-1">Tasks</label>
                <textarea
                  name="tasks"
                  rows="4"
                  className="w-full p-2 border rounded"
                  placeholder="Enter tasks, one per line"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedApplication(null)}
                  className="mr-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStats;
