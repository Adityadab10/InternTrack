import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiRefreshCw, FiCheck, FiX, FiAlertTriangle, 
  FiFileText, FiClock, FiUser, FiExternalLink,
  FiChevronDown, FiChevronUp, FiShield, FiDownload
} from "react-icons/fi";

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
      const response = await fetch('http://localhost:5001/api/pending-applications', {
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
            `http://localhost:5001/api/student-profile/by-email/${application.studentId}`,
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
        `http://localhost:5001/api/applications/${application._id}/status`,
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
      
      const response = await fetch('http://localhost:5001/api/analyze-resume', {
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
        <div className="bg-gray-900 text-purple-100 rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-800">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-300">Student Profile</h2>
            <button 
              onClick={() => setShowProfileModal(false)}
              className="text-purple-400 hover:text-purple-200 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-purple-900">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-purple-400 text-sm">Name</p>
                  <p className="font-medium text-white">{profile.name}</p>
                </div>
                <div>
                  <p className="text-purple-400 text-sm">Email</p>
                  <p className="font-medium text-white">{profile.email}</p>
                </div>
                <div>
                  <p className="text-purple-400 text-sm">Phone</p>
                  <p className="font-medium text-white">{profile.phone}</p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-purple-900">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">Education</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-purple-400 text-sm">Degree</p>
                  <p className="font-medium text-white">{profile.degree}</p>
                </div>
                <div>
                  <p className="text-purple-400 text-sm">Field of Study</p>
                  <p className="font-medium text-white">{profile.fieldOfStudy}</p>
                </div>
                <div>
                  <p className="text-purple-400 text-sm">Year of Graduation</p>
                  <p className="font-medium text-white">{profile.yearOfGraduation}</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-purple-900">
                <h3 className="text-lg font-semibold text-purple-300 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-900 text-purple-200 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Links */}
            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-purple-900">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">Professional Links</h3>
              <div className="space-y-2">
                {profile.linkedIn && (
                  <a
                    href={profile.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-purple-300 hover:text-purple-100 transition-colors text-sm"
                  >
                    <FiExternalLink className="w-4 h-4 mr-2" />
                    LinkedIn Profile
                  </a>
                )}
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-purple-300 hover:text-purple-100 transition-colors text-sm"
                  >
                    <FiExternalLink className="w-4 h-4 mr-2" />
                    GitHub Profile
                  </a>
                )}
              </div>
            </div>

            {/* Resume */}
            {profile.resumeFile && (
              <div className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-purple-900">
                <h3 className="text-lg font-semibold text-purple-300 mb-3">Resume</h3>
                <a
                  href={`http://localhost:5001/uploads/resumes/${profile.resumeFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                >
                  <FiDownload className="w-4 h-4 mr-2" />
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
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg sm:text-xl text-purple-300">
                {stat.internshipTitle}
              </h3>
              <p className="text-purple-400 text-sm">Company: {stat.company}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isApproved ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
            }`}>
              {stat.status}
            </span>
          </div>
          
          {/* Student Profile Information */}
          <div className="mt-3 bg-gray-800 p-3 rounded-lg border border-purple-900">
            <h4 className="font-medium text-purple-300 mb-2">Student Information</h4>
            <div className="space-y-2">
              <p className="text-purple-200 text-sm">
                <span className="font-medium text-purple-400">Name:</span> {stat.studentName || `Student ${stat.studentId}`}
              </p>
              <p className="text-purple-200 text-sm">
                <span className="font-medium text-purple-400">Email:</span> {stat.studentId}
              </p>
              {stat.studentProfile && (
                <>
                  <p className="text-purple-200 text-sm">
                    <span className="font-medium text-purple-400">Phone:</span> {stat.studentProfile.phone}
                  </p>
                  <p className="text-purple-200 text-sm">
                    <span className="font-medium text-purple-400">Degree:</span> {stat.studentProfile.degree}
                  </p>
                  <div className="mt-2">
                    <span className="font-medium text-purple-400 text-sm">Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {stat.studentProfile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-purple-900 text-purple-200 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Resume Section */}
          {stat.resumeUrl && (
            <div className="mt-3">
              <a 
                href={`http://localhost:5001${stat.resumeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 bg-purple-800 text-purple-100 rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                <FiFileText className="w-4 h-4 mr-2" />
                View Resume
              </a>
            </div>
          )}

          {/* Resume Analysis Section */}
          {hasStartedAnalysis && (
            <div className="mt-3 bg-gray-800 p-3 rounded-lg border border-purple-900">
              <h4 className="font-medium text-purple-300 mb-2 text-sm">Resume Analysis</h4>
              
              {analyzingApplications.has(stat._id) ? (
                <div className="flex items-center justify-center space-x-2 py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                  <span className="text-xs text-purple-400">Analyzing...</span>
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
                    <span className="ml-2 font-medium text-purple-300 text-xs">
                      {`${Number(stat.resumeRating.rating).toFixed(2)}/10`}
                    </span>
                  </div>

                  {/* Collapsible Analysis Section */}
                  <div className="mt-2">
                    <button
                      onClick={() => toggleExplanation(stat._id)}
                      className="flex items-center justify-between w-full text-left text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <span>View Analysis</span>
                      {expandedExplanations.has(stat._id) ? (
                        <FiChevronUp className="w-4 h-4" />
                      ) : (
                        <FiChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {expandedExplanations.has(stat._id) && (
                      <div className="mt-2 space-y-2 text-xs text-purple-200">
                        {stat.resumeRating.roleMatch && (
                          <div>
                            <p className="font-medium mb-1 text-purple-300">Strengths:</p>
                            <ul className="list-disc list-inside mb-1 space-y-0.5">
                              {stat.resumeRating.roleMatch.strengthAreas.map((strength, idx) => (
                                <li key={idx}>{strength}</li>
                              ))}
                            </ul>
                            
                            <p className="font-medium mb-1 text-purple-300">Improvements:</p>
                            <ul className="list-disc list-inside space-y-0.5">
                              {stat.resumeRating.roleMatch.improvementAreas.map((area, idx) => (
                                <li key={idx}>{area}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
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
                <p className="text-xs text-purple-400 mt-1">No analysis available</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="mt-3 flex flex-col space-y-2">
            {!isApproved && (
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleApprove(stat)}
                  className="px-3 py-1.5 bg-purple-600/20 text-purple-300 rounded-lg hover:bg-purple-600/30 transition-colors text-sm font-medium flex items-center"
                >
                  <FiCheck className="w-4 h-4 mr-1" />
                  Shortlist
                </button>
                <button
                  onClick={() => handleReject(stat._id)}
                  className="px-3 py-1.5 bg-red-900/20 text-red-300 rounded-lg hover:bg-red-900/30 transition-colors text-sm font-medium flex items-center"
                >
                  <FiX className="w-4 h-4 mr-1" />
                  Reject
                </button>
              </div>
            )}
            
            <button
              onClick={() => handleViewProfile(stat)}
              className="w-full bg-gray-800 text-purple-300 px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors border border-purple-900 text-sm"
            >
              <FiUser className="inline w-4 h-4 mr-1" />
              View Profile
            </button>
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 text-purple-100 p-4 sm:p-6">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex flex-col justify-between items-start mb-6"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent mb-1 sm:mb-2">
              Application Dashboard
            </h2>
            <p className="text-purple-400/80 text-sm">Track and manage internship applications</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchStats}
              className="bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 
                text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/20 
                flex items-center justify-center group text-sm sm:text-base"
            >
              <FiRefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Refresh Data
            </motion.button>
            
            {!hasStartedAnalysis && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startAnalysis}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 
                  text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-500/20 
                  flex items-center justify-center group text-sm sm:text-base"
              >
                <FiShield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:rotate-90 transition-transform duration-500" />
                Start Analysis
              </motion.button>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          {[
            {
              label: 'Total',
              value: stats.filter(s => s.status !== "Rejected").length,
              color: 'purple',
              icon: <FiFileText className="w-5 h-5" />
            },
            {
              label: 'Pending',
              value: stats.filter(s => s.status === "Pending").length,
              color: 'yellow',
              icon: <FiClock className="w-5 h-5" />
            },
            {
              label: 'Approved',
              value: stats.filter(s => s.status === "Accepted").length,
              color: 'green',
              icon: <FiCheck className="w-5 h-5" />
            },
            {
              label: 'Rejected',
              value: stats.filter(s => s.status === "Rejected").length,
              color: 'red',
              icon: <FiX className="w-5 h-5" />
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-${stat.color}-500/20
                hover:border-${stat.color}-500/40 transition-all duration-300 group`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-${stat.color}-900/30 rounded-lg group-hover:bg-${stat.color}-900/50 
                  transition-colors duration-300`}>
                  <div className={`text-${stat.color}-400`}>{stat.icon}</div>
                </div>
                <div>
                  <p className={`text-${stat.color}-400 text-xs`}>{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {loading && (
          <motion.div 
            className="flex justify-center items-center py-12 sm:py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative">
              <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
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
              className="p-3 sm:p-4 bg-red-900/20 backdrop-blur-sm text-red-300 rounded-lg mb-4 sm:mb-6 border border-red-800 text-sm"
            >
              <div className="flex items-center">
                <FiAlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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
            className="space-y-6"
          >
            {stats.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <FiAlertTriangle className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-purple-500" />
                <h3 className="mt-2 text-lg sm:text-xl font-medium text-purple-300">No applications found</h3>
                <p className="mt-1 text-purple-400 text-sm">There are currently no applications to display.</p>
                <div className="mt-4">
                  <button
                    onClick={fetchStats}
                    className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    <FiRefreshCw className="-ml-1 mr-2 w-4 h-4" />
                    Refresh
                  </button>
                </div>
              </div>
            ) : (
              <>
                {Object.entries(groupAndSortApplications(stats)).map(([key, applications]) => (
                  <div key={key} className="mb-6 sm:mb-10">
                    <div className="flex items-center mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-900 rounded-lg border border-purple-900/50">
                      <h3 className="text-lg sm:text-xl font-semibold text-purple-300">
                        {key.split('-')[0]}
                      </h3>
                      <span className="ml-2 px-2 py-0.5 bg-purple-900/50 text-purple-300 text-xs rounded-full">
                        {key.split('-')[1]}
                      </span>
                      <span className="ml-auto text-xs sm:text-sm text-purple-400">
                        {applications.length} {applications.length === 1 ? 'application' : 'applications'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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