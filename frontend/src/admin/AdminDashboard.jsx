import React, { useState, useEffect } from "react";
import InternshipForm from "./InternshipForm";
import InternshipDisplay from "./InternshipDisplay";

const AdminDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);

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
  
  
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setSelectedInternship(null);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? "Hide Form" : "Post an Internship"}
        </button>

        <button
          onClick={fetchInternships}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
          Refresh
        </button>
      </div>

      {showForm && (
        <InternshipForm
          onSuccess={handleInternshipCreated}
          internship={selectedInternship}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading && <p className="text-gray-600">Loading internships...</p>}
      {error && <div className="p-4 bg-red-100 text-red-700 rounded mb-4">{error}</div>}

      {!showForm && !loading && !error && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4">Internship Listings</h2>
          {internships.length === 0 ? (
            <p className="text-gray-600">No internships found. Create one to get started!</p>
          ) : (
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
      )}
    </div>
  );
};

export default AdminDashboard;
