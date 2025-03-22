import React, { useState, useEffect } from "react";

const StudentDashboard = () => {
  const [internships, setInternships] = useState([]);
  const [appliedInternships, setAppliedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const studentId = "Adidab"; // Replace with actual student ID

  // Combined fetch function
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // First fetch applied internships
      const appliedResponse = await fetch(`/api/applied-internships/${studentId}`);
      if (!appliedResponse.ok) {
        throw new Error("Failed to fetch applied internships");
      }
      const appliedData = await appliedResponse.json();

      // Fetch all internships
      const internshipsResponse = await fetch("/api/internships");
      if (!internshipsResponse.ok) {
        throw new Error("Failed to fetch internships");
      }
      const allInternships = await internshipsResponse.json();

      // Set applied internships
      const appliedDetails = await Promise.all(
        appliedData.map(async (application) => {
          const matchingInternship = allInternships.find(
            internship => internship._id === application.internshipId
          );
          return matchingInternship || null;
        })
      );
      
      const validAppliedInternships = appliedDetails.filter(item => item !== null);
      setAppliedInternships(validAppliedInternships);

      // Filter out applied internships from available internships
      const availableInternships = allInternships.filter(
        internship => !validAppliedInternships.some(
          applied => applied._id === internship._id
        )
      );
      setInternships(availableInternships);

      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Single useEffect to fetch all data
  useEffect(() => {
    fetchAllData();
  }, []); // Empty dependency array means this runs once on mount

  const handleApply = async (internshipId) => {
    try {
      const response = await fetch("/api/applied-internships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, internshipId }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to apply for internship");
      }

      // Update local state
      const appliedInternship = internships.find((i) => i._id === internshipId);
      setAppliedInternships(prev => [...prev, appliedInternship]);
      setInternships(prev => prev.filter((i) => i._id !== internshipId));
      
      alert("Applied successfully!");
    } catch (err) {
      console.error("Error applying for internship:", err);
      alert("Failed to apply. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>

      {loading && <p className="text-gray-600">Loading internships...</p>}
      {error && <div className="p-4 bg-red-100 text-red-700 rounded mb-4">{error}</div>}

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
