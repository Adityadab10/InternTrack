import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InternshipForm from "./InternshipForm";
import InternshipDisplay from "./InternshipDisplay";
import AdminStats from "./AdminStats";
import InternshipStats from './reports/InternshipStats';
import { useAuth } from '../context/AuthContext';
import ReportGeneration from './reports/ReportGeneration';

const AdminDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [activeTab, setActiveTab] = useState('internships');
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Fetch internships when component mounts
  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/internships");
      if (!response.ok) {
        throw new Error("Failed to fetch internships");
      }
      const data = await response.json();
      console.log("Fetched data:", data); // Debug log
      
      // Since our backend returns the internships directly, not wrapped in data property
      setInternships(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching internships:", err);
      setError("Failed to load internships. Please try again.");
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInternshipCreated = (newInternship) => {
    setInternships((prevInternships) => [newInternship, ...prevInternships]);
    setShowForm(false);
  };

  const handleEditInternship = (internship) => {
    setSelectedInternship(internship);
    setShowForm(true);
  };

  const handleDeleteInternship = async (id) => {
    if (!window.confirm('Are you sure you want to delete this internship?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/internships/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete internship');
      }

      // Remove the deleted internship from state
      setInternships(prevInternships => 
        prevInternships.filter(internship => internship._id !== id)
      );
      
      alert('Internship deleted successfully');
    } catch (error) {
      console.error('Error deleting internship:', error);
      alert('Failed to delete internship. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'internships':
        return (
          <div className="space-y-8">
            {/* Enhanced Header with Animation */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-purple-500/20">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                  Internship Management
                </h1>
                <p className="text-purple-300/80 mt-2">Create and manage internship opportunities</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl
                  hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 
                  shadow-lg hover:shadow-purple-500/20 flex items-center space-x-2"
              >
                <svg 
                  className="w-5 h-5 text-white transform group-hover:rotate-180 transition-transform duration-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-white font-medium">Create New Internship</span>
              </button>
            </div>

            {/* Enhanced Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                  </div>
                </div>
                <p className="text-purple-300/80 animate-pulse">Loading internships...</p>
              </div>
            )}

            {/* Enhanced Error State */}
            {error && (
              <div className="bg-red-900/20 backdrop-blur-sm p-6 rounded-xl border border-red-500/30 flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-red-300 font-semibold mb-1">Error Loading Internships</h3>
                  <p className="text-red-300/80">{error}</p>
                </div>
              </div>
            )}

            {/* Enhanced Internship Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {internships.map((internship) => (
                  <div
                    key={internship._id}
                    className="group relative bg-gradient-to-br from-gray-900/90 to-purple-950/90 rounded-xl 
                      border border-purple-500/20 shadow-lg hover:shadow-purple-500/10 transition-all duration-300 
                      backdrop-blur-xl overflow-hidden cursor-pointer"
                    onClick={() => setSelectedInternship(internship)}
                  >
                    {/* Background Gradient Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-purple-500/10 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative p-6 space-y-4">
                      {/* Status Badge */}
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-4 py-1 rounded-full text-sm font-medium 
                          ${internship.status === "Pending Approval"
                            ? "bg-yellow-900/50 text-yellow-200 border border-yellow-500/30"
                            : "bg-green-900/50 text-green-200 border border-green-500/30"}`}
                        >
                          {internship.status}
                        </span>
                        <span className="bg-purple-900/50 text-purple-200 px-3 py-1 rounded-full text-sm border border-purple-500/30">
                          {internship.positions} position{internship.positions !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Main Content */}
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                          {internship.title}
                        </h3>
                        <p className="text-purple-300 mt-1">{internship.company}</p>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-1">
                          <p className="text-sm text-purple-300">Location</p>
                          <p className="text-white font-medium">{internship.location}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-purple-300">Duration</p>
                          <p className="text-white font-medium">{internship.duration}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-purple-300">Stipend</p>
                          <p className="text-white font-medium">₹{internship.stipend}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-purple-300">Deadline</p>
                          <p className="text-white font-medium">{new Date(internship.deadline).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-between pt-4 border-t border-purple-500/20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditInternship(internship);
                          }}
                          className="px-4 py-2 bg-purple-600/80 hover:bg-purple-500 text-white rounded-lg 
                            transition-all duration-300 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteInternship(internship._id);
                          }}
                          className="px-4 py-2 bg-red-600/80 hover:bg-red-500 text-white rounded-lg 
                            transition-all duration-300 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'applications':
        return <AdminStats />;
      case 'stats':
        return <InternshipStats />;
      case 'reports':
        return <ReportGeneration />;
      default:
        return <div className="text-purple-300 text-lg">Select an option</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-950">
      {/* Fixed Sidebar - added overflow-hidden and h-screen */}
      <div className="w-72 h-screen bg-black/40 backdrop-blur-xl shadow-2xl border-r border-purple-500/20 
        flex flex-col shrink-0 overflow-hidden">
        {/* Admin Profile Section */}
        <div className="p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-transparent">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
              A
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                Admin Portal
              </h2>
              <p className="text-sm text-purple-300/80">Managing Excellence</p>
            </div>
          </div>
        </div>

        {/* Nav section - added max-height and overflow-hidden */}
        <nav className="p-4 space-y-2 flex-1 overflow-hidden">
          {[
            { id: 'internships', icon: '📑', label: 'Internships', desc: 'Manage listings' },
            { id: 'applications', icon: '👥', label: 'Applications', desc: 'Review & track' },
            { id: 'stats', icon: '📊', label: 'Statistics', desc: 'Analytics data' },
            { id: 'reports', icon: '📋', label: 'Reports', desc: 'Generate insights' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-300 relative group
                ${activeTab === item.id 
                  ? 'bg-gradient-to-r from-purple-600/50 to-indigo-600/50 text-white shadow-lg shadow-purple-500/20' 
                  : 'hover:bg-purple-900/30 text-purple-200 hover:text-white'
                }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                  activeTab === item.id 
                    ? 'bg-white/10' 
                    : 'bg-black/20 group-hover:bg-white/5'
                  } backdrop-blur-sm transition-colors`}>
                  <span className="text-xl">{item.icon}</span>
                </div>
                <div>
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-xs text-purple-300/70">{item.desc}</div>
                </div>
              </div>
              
              {activeTab === item.id && (
                <div className="absolute inset-y-0 -right-4 w-1 bg-purple-500 rounded-full"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Logout button section */}
        <div className="p-4 border-t border-purple-500/20 bg-black/20 backdrop-blur-sm">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-gradient-to-r from-red-900/50 to-purple-900/50 text-white rounded-xl 
              hover:from-red-800 hover:to-purple-800 transition-all duration-300 
              flex items-center justify-center space-x-2 group"
          >
            <span className="text-xl group-hover:rotate-12 transition-transform">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Scrollable Main Content - added h-screen and overflow-y-auto */}
      <div className="flex-1 h-screen overflow-y-auto">
        <div className="px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Content Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
              <p className="text-purple-300/80 mt-2">
                {activeTab === 'internships' && 'Manage and monitor internship opportunities'}
                {activeTab === 'applications' && 'Track and review student applications'}
                {activeTab === 'stats' && 'Analyze performance metrics'}
                {activeTab === 'reports' && 'Generate comprehensive reports'}
              </p>
            </div>

            {/* Enhanced Content Rendering */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-xl p-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="relative">
                    <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="min-h-[500px]">{renderContent()}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modals */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900/90 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-300">
                {selectedInternship ? 'Edit Internship' : 'Add New Internship'}
              </h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-purple-300 hover:text-white transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            <InternshipForm
              internship={selectedInternship}
              onSuccess={handleInternshipCreated}
            />
          </div>
        </div>
      )}

      {/* Custom Scrollbar */}
      <style>
        {`
          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background: rgba(139, 92, 246, 0.3);
            border-radius: 3px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(139, 92, 246, 0.5);
          }
        `}
      </style>
    </div>
  );
};

export default AdminDashboard;