import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InternshipForm from "./InternshipForm";
import InternshipDisplay from "./InternshipDisplay";
import AdminStats from "./AdminStats";
import InternshipStats from './reports/InternshipStats';
import { useAuth } from '../context/AuthContext';
import ReportGeneration from './reports/ReportGeneration';
import MappingOversight from './reports/MappingOversight';
import { FiMenu, FiX, FiPlus, FiEdit2, FiTrash2, FiAlertCircle, FiLogOut } from "react-icons/fi";
import InternshipFilters from './InternshipFilters';

const AdminDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [activeTab, setActiveTab] = useState('internships');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    minStipend: '',
    minPositions: '',
    deadlineBefore: '',
    location: '',
    duration: '',
    status: ''
  });

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
      console.log("Fetched data:", data);
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

  const getInternshipStatus = (deadline) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    return deadlineDate < today ? "Expired" : "Active";
  };

  const extractStipendAmount = (stipendString) => {
    if (!stipendString) return 0;
    // Extract the first number from the string
    const match = stipendString.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const getFilteredInternships = () => {
    return internships.filter(internship => {
      // Search filter
      if (filters.search && !(`${internship.title} ${internship.company}`)
        .toLowerCase()
        .includes(filters.search.toLowerCase())) {
        return false;
      }

      // Stipend filter - Updated logic
      if (filters.minStipend) {
        const internshipStipend = extractStipendAmount(internship.stipend);
        if (internshipStipend < Number(filters.minStipend)) {
          return false;
        }
      }

      // Positions filter
      if (filters.minPositions && internship.positions < Number(filters.minPositions)) {
        return false;
      }

      // Deadline filter
      if (filters.deadlineBefore && new Date(internship.deadline) > new Date(filters.deadlineBefore)) {
        return false;
      }

      // Location filter
      if (filters.location && !internship.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Duration filter
      if (filters.duration) {
        const months = parseInt(internship.duration);
        if (filters.duration === '1-3' && (months < 1 || months > 3)) return false;
        if (filters.duration === '3-6' && (months < 3 || months > 6)) return false;
        if (filters.duration === '6+' && months < 6) return false;
      }

      // Status filter
      if (filters.status) {
        const currentStatus = getInternshipStatus(internship.deadline);
        if (currentStatus !== filters.status) {
          return false;
        }
      }

      return true;
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      minStipend: '',
      minPositions: '',
      deadlineBefore: '',
      location: '',
      duration: '',
      status: ''
    });
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'internships':
        return (
          <div className="space-y-4 md:space-y-8">
            {/* Header with responsive layout */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-purple-500/20">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                  Internship Management
                </h1>
                <p className="text-purple-300/80 mt-1 md:mt-2 text-sm md:text-base">
                  Create and manage internship opportunities
                </p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="group px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg md:rounded-xl
                  hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 
                  shadow-lg hover:shadow-purple-500/20 flex items-center space-x-1 md:space-x-2 w-full md:w-auto justify-center"
              >
                <FiPlus className="w-4 h-4 md:w-5 md:h-5 text-white transform group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-white text-sm md:text-base font-medium">Create New</span>
              </button>
            </div>

            {/* Add Filters Component */}
            <InternshipFilters 
              filters={filters}
              setFilters={setFilters}
              clearFilters={clearFilters}
            />

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center h-48 md:h-64 space-y-3 md:space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                  </div>
                </div>
                <p className="text-purple-300/80 animate-pulse text-sm md:text-base">Loading internships...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-900/20 backdrop-blur-sm p-4 md:p-6 rounded-lg md:rounded-xl border border-red-500/30 flex items-start md:items-center space-x-3 md:space-x-4">
                <div className="flex-shrink-0 w-8 h-8 md:w-12 md:h-12 rounded-full bg-red-500/20 flex items-center justify-center mt-1 md:mt-0">
                  <FiAlertCircle className="w-4 h-4 md:w-6 md:h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-red-300 font-semibold mb-1 text-sm md:text-base">Error Loading Internships</h3>
                  <p className="text-red-300/80 text-xs md:text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Internship Grid - Responsive layout */}
            {!loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {getFilteredInternships().map((internship) => {
                  const status = getInternshipStatus(internship.deadline);
                  
                  return (
                    <div
                      key={internship._id}
                      className="group relative bg-gradient-to-br from-gray-900/90 via-purple-950/90 to-gray-900/90 rounded-lg md:rounded-xl 
                        border border-purple-500/20 shadow-lg hover:shadow-purple-500/10 transition-all duration-300 
                        backdrop-blur-xl overflow-hidden cursor-pointer"
                      onClick={() => setSelectedInternship(internship)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-purple-500/10 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative p-4 md:p-6 space-y-3 md:space-y-4">
                        {/* Status Badge - adjusted for new status */}
                        <div className="flex justify-between items-start mb-2 md:mb-4">
                          <span className={`px-2 md:px-4 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-medium ${status === "Expired" ? "bg-red-900/50 text-red-200 border border-red-500/30" : "bg-green-900/50 text-green-200 border border-green-500/30"}`}>
                            {status}
                          </span>
                          <span className="bg-purple-900/50 text-purple-200 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm border border-purple-500/30">
                            {internship.positions} position{internship.positions !== 1 ? "s" : ""}
                          </span>
                        </div>

                        {/* Main Content */}
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                            {internship.title}
                          </h3>
                          <p className="text-purple-300 mt-1 text-sm md:text-base">{internship.company}</p>
                        </div>

                        {/* Details Grid - adjusted spacing */}
                        <div className="grid grid-cols-2 gap-2 md:gap-4 py-2 md:py-4">
                          <div className="space-y-0.5 md:space-y-1">
                            <p className="text-xs md:text-sm text-purple-300">Location</p>
                            <p className="text-white font-medium text-sm md:text-base">{internship.location}</p>
                          </div>
                          <div className="space-y-0.5 md:space-y-1">
                            <p className="text-xs md:text-sm text-purple-300">Duration</p>
                            <p className="text-white font-medium text-sm md:text-base">{internship.duration}</p>
                          </div>
                          <div className="space-y-0.5 md:space-y-1">
                            <p className="text-xs md:text-sm text-purple-300">Stipend</p>
                            <p className="text-white font-medium text-sm md:text-base">₹{internship.stipend}</p>
                          </div>
                          <div className="space-y-0.5 md:space-y-1">
                            <p className="text-xs md:text-sm text-purple-300">Deadline</p>
                            <p className={`font-medium text-sm md:text-base ${
                              status === "Expired" ? "text-red-400" : "text-white"
                            }`}>
                              {new Date(internship.deadline).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons - adjusted size */}
                        <div className="flex justify-between pt-2 md:pt-4 border-t border-purple-500/20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditInternship(internship);
                            }}
                            className="px-2 md:px-4 py-1 md:py-2 bg-purple-600/80 hover:bg-purple-500 text-white rounded-md md:rounded-lg 
                              transition-all duration-300 flex items-center space-x-1 md:space-x-2 text-xs md:text-sm"
                          >
                            <FiEdit2 className="w-3 h-3 md:w-4 md:h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteInternship(internship._id);
                            }}
                            className="px-2 md:px-4 py-1 md:py-2 bg-red-600/80 hover:bg-red-500 text-white rounded-md md:rounded-lg 
                              transition-all duration-300 flex items-center space-x-1 md:space-x-2 text-xs md:text-sm"
                          >
                            <FiTrash2 className="w-3 h-3 md:w-4 md:h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      case 'applications':
        return <AdminStats />;
      case 'stats':
        return <InternshipStats />;
      case 'mapping':
        return <MappingOversight />;
      case 'reports':
        return <ReportGeneration />;
      default:
        return <div className="text-purple-300 text-base md:text-lg">Select an option</div>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-950">
      {/* Mobile Header - visible only on small screens */}
      <div className="md:hidden flex items-center justify-between p-4 bg-black/40 backdrop-blur-md border-b border-purple-500/20">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-purple-300 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-purple-300 hover:text-white transition-colors"
        >
          <FiLogOut size={20} />
        </button>
      </div>

      {/* Sidebar - hidden on mobile when menu is closed */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-72 h-screen bg-black/40 backdrop-blur-xl shadow-2xl border-r border-purple-500/20 
        flex flex-col shrink-0 overflow-hidden fixed md:relative z-50 md:z-auto`}>
        {/* Admin Profile Section */}
        <div className="p-4 md:p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-transparent">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-lg md:text-xl font-bold text-white shadow-lg">
              A
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                Admin Portal
              </h2>
              <p className="text-xs md:text-sm text-purple-300/80">Managing Excellence</p>
            </div>
          </div>
        </div>

        {/* Nav section */}
        <nav className="p-2 md:p-4 space-y-1 md:space-y-2 flex-1 overflow-y-auto">
          {[
            { id: 'internships', icon: '📑', label: 'Internships', desc: 'Manage listings' },
            { id: 'applications', icon: '👥', label: 'Applications', desc: 'Review & track' },
            { id: 'stats', icon: '📊', label: 'Statistics', desc: 'Analytics data' },
            { id: 'mapping', icon: '🎯', label: 'SDG Mapping', desc: 'Track compliance' },
            { id: 'reports', icon: '📋', label: 'Reports', desc: 'Generate insights' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left p-2 md:p-3 rounded-lg md:rounded-xl transition-all duration-300 relative group
                ${activeTab === item.id 
                  ? 'bg-gradient-to-r from-purple-600/50 to-indigo-600/50 text-white shadow-lg shadow-purple-500/20' 
                  : 'hover:bg-purple-900/30 text-purple-200 hover:text-white'
                }`}
            >
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-md md:rounded-lg ${
                  activeTab === item.id 
                    ? 'bg-white/10' 
                    : 'bg-black/20 group-hover:bg-white/5'
                  } backdrop-blur-sm transition-colors`}>
                  <span className="text-lg md:text-xl">{item.icon}</span>
                </div>
                <div>
                  <div className="font-semibold text-sm md:text-base">{item.label}</div>
                  <div className="text-xs text-purple-300/70">{item.desc}</div>
                </div>
              </div>
              
              {activeTab === item.id && (
                <div className="absolute inset-y-0 -right-4 w-1 bg-purple-500 rounded-full hidden md:block"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Logout button section */}
        <div className="p-2 md:p-4 border-t border-purple-500/20 bg-black/20 backdrop-blur-sm">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 md:px-4 md:py-3 bg-gradient-to-r from-red-900/50 to-purple-900/50 text-white rounded-lg md:rounded-xl 
              hover:from-red-800 hover:to-purple-800 transition-all duration-300 
              flex items-center justify-center space-x-2 group text-sm md:text-base"
          >
            <span className="text-lg group-hover:rotate-12 transition-transform">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-auto">
        <div className="p-4 md:px-8 md:py-6">
          <div className="max-w-7xl mx-auto">
            {/* Content Header - hidden on mobile (we have mobile header instead) */}
            <div className="mb-4 md:mb-8 hidden md:block">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
              <p className="text-purple-300/80 mt-1 md:mt-2 text-sm md:text-base">
                {activeTab === 'internships' && 'Manage and monitor internship opportunities'}
                {activeTab === 'applications' && 'Track and review student applications'}
                {activeTab === 'stats' && 'Analyze performance metrics'}
                {activeTab === 'mapping' && 'Monitor SDG, PO, and PEO mapping compliance'}
                {activeTab === 'reports' && 'Generate comprehensive reports'}
              </p>
            </div>

            {/* Content Container */}
            <div className="bg-black/40 backdrop-blur-xl rounded-xl md:rounded-2xl border border-purple-500/20 shadow-xl p-4 md:p-6">
              {loading ? (
                <div className="flex items-center justify-center h-48 md:h-64">
                  <div className="relative">
                    <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="min-h-[300px] md:min-h-[500px]">{renderContent()}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 z-50">
          <div className="bg-gray-900/90 rounded-xl md:rounded-2xl p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-purple-500/30 shadow-2xl">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-purple-300">
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