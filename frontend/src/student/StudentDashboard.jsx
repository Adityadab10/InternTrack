import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import ProfileContent from './ProfileContent';
import UserProfile from './UserProfile';

const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [internships, setInternships] = useState([]);
  const [appliedInternships, setAppliedInternships] = useState([]);
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
      // Fetch both internships and applications in parallel
      const [internshipsResponse, applicationsResponse, approvedApplicationsResponse] = await Promise.all([
        fetch('http://localhost:5000/api/internships', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        }),
        fetch(`http://localhost:5000/api/applications/student/${studentId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        }),
        // New request to fetch approved applications
        fetch(`http://localhost:5000/api/application-status/student/${studentId}`, {
          credentials: 'include'
        })
      ]);

      if (!internshipsResponse.ok) {
        throw new Error(`Failed to fetch internships: ${internshipsResponse.status}`);
      }

      const allInternships = await internshipsResponse.json();
      let availableInternships = [...allInternships];
      let appliedInternships = [];

      // If we successfully got applications, filter the internships
      if (applicationsResponse.ok) {
        const myApplications = await applicationsResponse.json();
        const approvedApplications = await approvedApplicationsResponse.json();
        
        // Get IDs of approved applications
        const approvedInternshipIds = approvedApplications.map(app => app.internshipId);
        
        // Filter out both approved and pending applications
        appliedInternships = allInternships.filter(internship =>
          myApplications.some(app => 
            app.internshipId === internship._id && 
            !approvedInternshipIds.includes(internship._id)
          )
        );
        
        // Available internships should exclude both applied and approved
        availableInternships = allInternships.filter(internship =>
          !myApplications.some(app => app.internshipId === internship._id) &&
          !approvedInternshipIds.includes(internship._id)
        );
      }

      setInternships(availableInternships);
      setAppliedInternships(appliedInternships);
      setError(null);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please check if the server is running.");
      setInternships([]);
      setAppliedInternships([]);
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
      
      const response = await fetch('http://localhost:5000/api/applications', {
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
            <div>
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
          </div>
        );
      case 'your-internships':
        return <ProfileContent />;
      case 'tasks':
        return <div className="bg-black/70 p-6 rounded-lg border border-purple-500/30 text-purple-200">Assigned Tasks</div>;
      case 'certificates':
        return <div className="bg-black/70 p-6 rounded-lg border border-purple-500/30 text-purple-200">Certificates</div>;
      case 'profile':
        return <UserProfile />;
      default:
        return <div className="text-gray-300">Select an option</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950">
      {/* Enhanced Sidebar */}
      <div className="w-64 bg-gradient-to-b from-black to-purple-950 text-white h-full border-r border-purple-500/30 shadow-xl">
        {/* Profile Section */}
        <div className="p-6 border-b border-purple-500/30 bg-black/40">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-xl font-bold">
              {user?.name?.[0] || 'S'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-purple-300">Student Portal</h2>
              <p className="text-sm text-purple-200">{user?.name || 'Student'}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {[
            { name: 'explore', icon: '🔍', label: 'Explore' },
            { name: 'your-internships', icon: '💼', label: 'Your Internships' },
            { name: 'tasks', icon: '✓', label: 'Tasks' },
            { name: 'certificates', icon: '🎓', label: 'Certificates' },
            { name: 'profile', icon: '👤', label: 'Profile' }
          ].map(item => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 
                ${activeTab === item.name 
                  ? 'bg-gradient-to-r from-purple-600/50 to-indigo-600/50 text-white shadow-lg shadow-purple-500/20' 
                  : 'hover:bg-purple-900/30 text-purple-200 hover:text-white'
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-purple-500/30 bg-black/20">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-gradient-to-r from-red-900/50 to-purple-900/50 text-white rounded-lg hover:from-red-800 hover:to-purple-800 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-purple-500/20"
          >
            <span>🚪</span>
            <span>Logout</span>
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