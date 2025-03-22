import React, { useState, useEffect } from "react";

const AdminStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/applications");
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      const data = await response.json();
      console.log("Raw application data:", data); // Debug log
      setStats(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Failed to load stats. Please try again.");
    } finally {
      setLoading(false);
    }
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
      {error && <div className="p-4 bg-red-100 text-red-700 rounded mb-4">{error}</div>}

      {!loading && !error && (
        <div>
          {stats.length === 0 ? (
            <p className="text-gray-600">No applications found.</p>
          ) : (
            <>
              <p className="mb-4 text-gray-600">Total Applications: {stats.length}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.applicationId}
                    className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md"
                  >
                    <h3 className="font-bold text-lg text-blue-600">
                      {stat.internshipTitle}
                    </h3>
                    <p className="text-gray-700">Company: {stat.company}</p>
                    <p className="text-gray-700">
                      Student ID: {stat.candidateId}
                    </p>
                    <p className="text-gray-700">
                      Student Name: {stat.candidateName}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Status: </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          stat.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          stat.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {stat.status}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Applied: </span>
                        {new Date(stat.appliedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminStats;

