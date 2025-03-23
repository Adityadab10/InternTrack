import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const StudentDashboard = () => {
  const location = useLocation();
  const [internships, setInternships] = useState([]);
  const [appliedInternships, setAppliedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get studentId from location state, localStorage, or use "guest"
  const studentId = location.state?.studentId || localStorage.getItem("studentId") || "guest";

  // Store studentId in localStorage for persistence
  useEffect(() => {
    if (location.state?.studentId) {
      localStorage.setItem("studentId", location.state.studentId);
    }
  }, [location.state?.studentId]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Add full URL with the API endpoint
      const response = await fetch('http://localhost:5000/api/internships', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched internships:", data);
      
      setInternships(data);
      setAppliedInternships([]);
      setError(null);

    } catch (err) {
      console.error("Error fetching internships:", err);
      setError("Failed to load internships. Please check if the server is running.");
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
      const apiBaseUrl = import.meta.env.VITE_API_URL || "";
      const internship = internships.find(i => i._id === internshipId);
      
      const response = await fetch(`/api/applications`, {
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
    } catch (err) {
      console.error("Error applying for internship:", err);
      alert(err.message || "Failed to apply. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <p className="text-sm text-gray-600 mb-4">Logged in as: {studentId}</p>

      {loading && <p className="text-gray-600">Loading internships...</p>}
      
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
          {error}
          <button 
            onClick={handleRetry}
            className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Available Internships</h2>
            {internships.length === 0 ? (
              <p className="text-gray-600">No internships available at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {internships.map((internship) => (
                  <div key={internship._id} className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md">
                    <h3 className="font-bold text-lg text-blue-600">{internship.title}</h3>
                    <p className="text-gray-700">{internship.company}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Location:</span> {internship.location || "Remote"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Duration:</span> {internship.duration}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Stipend:</span> ₹{internship.stipend || "Unpaid"}
                      </p>
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() => handleApply(internship._id)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Applied Internships</h2>
            {appliedInternships.length === 0 ? (
              <p className="text-gray-600">No internships applied yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {appliedInternships.map((internship) => (
                  <div key={internship._id} className="p-4 border rounded-lg shadow-sm bg-gray-100 hover:shadow-md">
                    <h3 className="font-bold text-lg text-blue-600">{internship.title}</h3>
                    <p className="text-gray-700">{internship.company}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Location:</span> {internship.location || "Remote"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Duration:</span> {internship.duration}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Stipend:</span> ₹{internship.stipend || "Unpaid"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;