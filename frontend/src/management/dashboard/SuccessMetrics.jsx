import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SuccessMetrics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    applications: {
      total: 0,
      accepted: 0,
      rejected: 0,
      pending: 0
    },
    performance: {
      acceptanceRate: 0,
      averageRating: 0,
      completedInternships: 0,
      ongoingInternships: 0
    }
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        // Fetch applications data
        const response = await axios.get('http://localhost:5001/api/applications');
        
        const applications = response.data;
        
        // Calculate metrics
        const stats = {
          applications: {
            total: applications.length,
            accepted: applications.filter(app => app.status === 'Accepted').length,
            rejected: applications.filter(app => app.status === 'Rejected').length,
            pending: applications.filter(app => app.status === 'Pending').length
          },
          performance: {
            acceptanceRate: applications.length > 0 
              ? (applications.filter(app => app.status === 'Accepted').length / applications.length * 100).toFixed(1)
              : 0,
            averageRating: applications.reduce((acc, app) => acc + (app.rating || 0), 0) / applications.length || 0,
            completedInternships: applications.filter(app => app.status === 'Accepted' && app.completed).length,
            ongoingInternships: applications.filter(app => app.status === 'Accepted' && !app.completed).length
          }
        };

        setMetrics(stats);
        setError(null);
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError('Failed to load metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-black/50 rounded-xl border border-purple-500/20">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-black/50 rounded-xl border border-purple-500/20">
      <h2 className="text-2xl font-bold text-purple-200 mb-4">Program Success Metrics</h2>
      
      {error && (
        <div className="bg-red-900/30 border border-red-500/30 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Application Statistics */}
        <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
          <h3 className="text-lg font-semibold text-purple-200 mb-4">Application Statistics</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Total Applications */}
            <div className="bg-purple-900/20 p-3 rounded-lg">
              <p className="text-sm text-purple-300">Total Applications</p>
              <p className="text-2xl font-bold text-purple-100">{metrics.applications.total}</p>
            </div>

            {/* Acceptance Rate */}
            <div className="bg-green-900/20 p-3 rounded-lg">
              <p className="text-sm text-green-300">Acceptance Rate</p>
              <p className="text-2xl font-bold text-green-100">{metrics.performance.acceptanceRate}%</p>
            </div>

            {/* Status Breakdown */}
            <div className="col-span-2 bg-purple-900/20 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-purple-300">Application Status</span>
              </div>
              <div className="space-y-2">
                {/* Accepted */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-green-300">Accepted</span>
                    <span className="text-green-300">{metrics.applications.accepted}</span>
                  </div>
                  <div className="w-full bg-purple-900/30 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(metrics.applications.accepted / metrics.applications.total) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Pending */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-yellow-300">Pending</span>
                    <span className="text-yellow-300">{metrics.applications.pending}</span>
                  </div>
                  <div className="w-full bg-purple-900/30 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(metrics.applications.pending / metrics.applications.total) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Rejected */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-300">Rejected</span>
                    <span className="text-red-300">{metrics.applications.rejected}</span>
                  </div>
                  <div className="w-full bg-purple-900/30 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(metrics.applications.rejected / metrics.applications.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
          <h3 className="text-lg font-semibold text-purple-200 mb-4">Performance Overview</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Ongoing Internships */}
            <div className="bg-blue-900/20 p-3 rounded-lg">
              <p className="text-sm text-blue-300">Ongoing Internships</p>
              <p className="text-2xl font-bold text-blue-100">{metrics.performance.ongoingInternships}</p>
            </div>

            {/* Completed Internships */}
            <div className="bg-green-900/20 p-3 rounded-lg">
              <p className="text-sm text-green-300">Completed Internships</p>
              <p className="text-2xl font-bold text-green-100">{metrics.performance.completedInternships}</p>
            </div>

            {/* Success Rate Visualization */}
            <div className="col-span-2 bg-purple-900/20 p-3 rounded-lg">
              <p className="text-sm text-purple-300 mb-2">Program Success Rate</p>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-200 bg-purple-900/30">
                      Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-purple-200">
                      {metrics.performance.acceptanceRate}%
                    </span>
                  </div>
                </div>
                <div className="flex h-2 mb-4 overflow-hidden rounded-full bg-purple-900/30">
                  <div
                    style={{ width: `${metrics.performance.acceptanceRate}%` }}
                    className="flex flex-col justify-center rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500 shadow-none whitespace-nowrap"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessMetrics;