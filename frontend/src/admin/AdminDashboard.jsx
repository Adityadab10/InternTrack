import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InternshipForm from "./InternshipForm";
import InternshipDisplay from "./InternshipDisplay";
import AdminStats from "./AdminStats";
import InternshipStats from './reports/InternshipStats';
import { useAuth } from '../context/AuthContext';

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
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-purple-300">Internship Management</h1>
              <button
                onClick={() => setShowForm(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
              >
                Add New Internship
              </button>
            </div>

            {loading && <p className="text-purple-200 animate-pulse">Loading internships...</p>}
            {error && (
              <div className="bg-red-900 text-red-200 p-4 rounded border border-red-700">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {internships.map((internship) => (
                  <div
                    key={internship._id}
                    className="p-4 border border-gray-700 rounded-lg shadow-md hover:shadow-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors"
                    onClick={() => setSelectedInternship(internship)}
                  >
                    <h3 className="font-bold text-lg text-purple-400">{internship.title}</h3>
                    <p className="text-gray-300">{internship.company}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-300">
                        <span className="font-medium text-purple-300">Location:</span> {internship.location}
                      </p>
                      <p className="text-sm text-gray-300">
                        <span className="font-medium text-purple-300">Duration:</span> {internship.duration}
                      </p>
                      <p className="text-sm text-gray-300">
                        <span className="font-medium text-purple-300">Stipend:</span> ₹{internship.stipend}
                      </p>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        Deadline: {new Date(internship.deadline).toLocaleDateString()}
                      </span>
                      <span className="bg-purple-900 text-purple-200 text-xs px-2 py-1 rounded-full">
                        {internship.positions} position{internship.positions !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          internship.status === "Pending Approval"
                            ? "bg-yellow-900 text-yellow-200"
                            : "bg-green-900 text-green-200"
                        }`}
                      >
                        {internship.status}
                      </span>
                    </div>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditInternship(internship);
                        }}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteInternship(internship._id);
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'applications':
        return <AdminStats />;
      case 'reports':
        return <InternshipStats />;
      case 'settings':
        return <div className="text-purple-300 text-lg">Admin Settings</div>;
      default:
        return <div className="text-purple-300 text-lg">Select an option</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-black shadow-lg border-r border-purple-900">
        <div className="p-6 border-b border-purple-900">
          <h2 className="text-xl font-semibold text-purple-300">Admin Portal</h2>
          <p className="text-sm text-purple-200">Manage Internships & Applications</p>
        </div>
        <nav className="mt-4">
          <button
            onClick={() => setActiveTab('internships')}
            className={`w-full text-left px-6 py-3 hover:bg-gray-900 transition-colors ${
              activeTab === 'internships' ? 'bg-purple-900 bg-opacity-30 text-purple-300 border-l-4 border-purple-500' : 'text-gray-300'
            }`}
          >
            📑 Internships
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`w-full text-left px-6 py-3 hover:bg-gray-900 transition-colors ${
              activeTab === 'applications' ? 'bg-purple-900 bg-opacity-30 text-purple-300 border-l-4 border-purple-500' : 'text-gray-300'
            }`}
          >
            👥 Applications
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full text-left px-6 py-3 hover:bg-gray-900 transition-colors ${
              activeTab === 'reports' ? 'bg-purple-900 bg-opacity-30 text-purple-300 border-l-4 border-purple-500' : 'text-gray-300'
            }`}
          >
            📊 Stats
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-6 py-3 hover:bg-gray-900 transition-colors ${
              activeTab === 'settings' ? 'bg-purple-900 bg-opacity-30 text-purple-300 border-l-4 border-purple-500' : 'text-gray-300'
            }`}
          >
            ⚙️ Settings
          </button>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-purple-900">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-red-400 hover:bg-red-900 hover:bg-opacity-30 rounded transition-colors"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>

      {/* Modal for adding/editing internship */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-700 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-purple-300">Add New Internship</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <InternshipForm
              onSuccess={(newInternship) => {
                setInternships(prev => [newInternship, ...prev]);
                setShowForm(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Modal for internship details */}
      {selectedInternship && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-700 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-purple-300">Internship Details</h2>
              <button 
                onClick={() => setSelectedInternship(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <InternshipDisplay internship={selectedInternship} />
          </div>
        </div>
      )}

      {/* Custom scrollbar styles */}
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        ::-webkit-scrollbar-thumb {
          background: #4C1D95;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #7C3AED;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;