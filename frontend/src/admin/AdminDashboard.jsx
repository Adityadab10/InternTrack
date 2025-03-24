import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InternshipForm from "./InternshipForm";
import InternshipDisplay from "./InternshipDisplay";
import AdminStats from "./AdminStats";
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
              <h1 className="text-2xl font-bold text-gray-800">Internship Management</h1>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add New Internship
              </button>
            </div>

            {loading && <p className="text-gray-600">Loading internships...</p>}
            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {internships.map((internship) => (
                  <div
                    key={internship._id}
                    className="p-4 border rounded-lg shadow-sm hover:shadow-md cursor-pointer bg-white"
                    onClick={() => setSelectedInternship(internship)}
                  >
                    <h3 className="font-bold text-lg text-blue-600">{internship.title}</h3>
                    <p className="text-gray-700">{internship.company}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Location:</span> {internship.location}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Duration:</span> {internship.duration}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Stipend:</span> ₹{internship.stipend}
                      </p>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Deadline: {new Date(internship.deadline).toLocaleDateString()}
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {internship.positions} position{internship.positions !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          internship.status === "Pending Approval"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
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
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteInternship(internship._id);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
        return <div>Reports Dashboard</div>;
      case 'settings':
        return <div>Admin Settings</div>;
      default:
        return <div>Select an option</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Admin Portal</h2>
          <p className="text-sm text-gray-600">Manage Internships & Applications</p>
        </div>
        <nav className="mt-4">
          <button
            onClick={() => setActiveTab('internships')}
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
              activeTab === 'internships' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : ''
            }`}
          >
            📑 Internships
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
              activeTab === 'applications' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : ''
            }`}
          >
            👥 Applications
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
              activeTab === 'reports' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : ''
            }`}
          >
            📊 Reports
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
              activeTab === 'settings' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : ''
            }`}
          >
            ⚙️ Settings
          </button>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Internship</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Internship Details</h2>
              <button 
                onClick={() => setSelectedInternship(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <InternshipDisplay internship={selectedInternship} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
