import React, { useState, useEffect } from "react";

const AdminStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/applications', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      const applications = await response.json();
      console.log('Fetched applications:', applications);

      // Validate and transform the data
      const validApplications = applications.filter(app => app._id && app.internshipTitle && app.company);
      
      if (validApplications.length !== applications.length) {
        console.warn('Some applications were filtered out due to missing required fields');
      }

      setStats(validApplications);
      setError(null);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Failed to load stats. Please try again.");
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
        <p className="text-gray-700">
          Student Name: {stat.studentName || `Student ${stat.studentId}`}
        </p>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Status: </span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                stat.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {stat.status}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Applied: </span>
            {new Date(stat.appliedAt).toLocaleString()}
          </p>
        </div>

        {isApproved && stat.tasks ? (
          // Show assigned tasks for approved applications
          <div className="mt-4 bg-gray-50 p-3 rounded">
            <h4 className="font-medium text-gray-700 mb-2">Assignment Details</h4>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Tasks:</span>
              <ul className="list-disc list-inside mt-1">
                {stat.tasks.map((task, index) => (
                  <li key={index} className="ml-2">{task}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          // Show approve/reject buttons for pending applications
          <div className="mt-4 flex justify-between">
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
    );
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
