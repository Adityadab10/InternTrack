import React, { useState, useEffect } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

const InternshipStats = () => {
  const [stats, setStats] = useState({
    departmentData: [],
    industryPartners: [],
    sdgAlignment: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Updated color scheme with purple and black theme
  const COLORS = ['#A78BFA', '#7C3AED', '#4C1D95', '#8B5CF6', '#C4B5FD'];
  const CHART_COLORS = {
    primary: '#8B5CF6', // Vibrant purple
    secondary: '#C4B5FD', // Light purple
    accent: '#4C1D95', // Dark purple
    highlight: '#A78BFA' // Medium purple
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/internship-stats', {
        credentials: 'include'
      });
      const data = await response.json();
      setStats(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load statistics');
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64 bg-gray-900 text-purple-300">
      <div className="animate-pulse text-lg">Loading statistics...</div>
    </div>
  );

  if (error) return (
    <div className="bg-gray-900 p-6 rounded-lg text-red-400 text-center font-medium">
      {error}
    </div>
  );

  return (
    <div className="p-6 space-y-8 bg-gray-900 text-gray-100">
      <h2 className="text-3xl font-bold text-purple-300 mb-6 border-b border-purple-700 pb-2">
        Internship Statistics Dashboard
      </h2>

      {/* Department-wise Statistics */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 border-l-4 border-purple-600">
        <h3 className="text-xl font-semibold mb-6 text-purple-300">Department-wise Participation</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Participation Rate Chart */}
          <div className="h-80 bg-gray-900 p-4 rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.departmentData}>
                <XAxis dataKey="department" stroke="#C4B5FD" />
                <YAxis stroke="#C4B5FD" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4C1D95', borderRadius: '4px' }}
                  labelStyle={{ color: '#C4B5FD' }}
                />
                <Legend wrapperStyle={{ color: '#C4B5FD' }} />
                <Bar dataKey="participationRate" fill={CHART_COLORS.primary} name="Participation Rate (%)" />
                <Bar dataKey="placementRate" fill={CHART_COLORS.secondary} name="Placement Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Department Summary */}
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {stats.departmentData.map((dept) => (
              <div key={dept.department} className="bg-gray-900 p-4 rounded-lg border-l-2 border-purple-500 hover:bg-gray-800 transition-colors">
                <h4 className="font-semibold text-purple-300">{dept.department}</h4>
                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                  <div className="bg-gray-800 p-3 rounded">
                    <p className="text-purple-200 text-xs">Total Students</p>
                    <p className="font-medium text-white text-lg">{dept.totalStudents}</p>
                  </div>
                  <div className="bg-gray-800 p-3 rounded">
                    <p className="text-purple-200 text-xs">Participating</p>
                    <p className="font-medium text-white text-lg">{dept.participatingStudents}</p>
                  </div>
                  <div className="bg-gray-800 p-3 rounded">
                    <p className="text-purple-200 text-xs">Placement Rate</p>
                    <p className="font-medium text-white text-lg">{dept.placementRate}%</p>
                  </div>
                  <div className="bg-gray-800 p-3 rounded">
                    <p className="text-purple-200 text-xs">Avg. Stipend</p>
                    <p className="font-medium text-white text-lg">₹{dept.averageStipend}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Industry Partners */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 border-l-4 border-purple-600">
        <h3 className="text-xl font-semibold mb-6 text-purple-300">Industry Partners Distribution</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80 bg-gray-900 p-4 rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.industryPartners}
                  dataKey="count"
                  nameKey="sector"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {stats.industryPartners.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4C1D95', borderRadius: '4px' }}
                  labelStyle={{ color: '#C4B5FD' }}
                />
                <Legend wrapperStyle={{ color: '#C4B5FD' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {stats.industryPartners.map((partner, index) => (
              <div key={partner.sector} className="bg-gray-900 p-4 rounded-lg border-l-2 border-purple-500 hover:bg-gray-800 transition-colors">
                <h4 className="font-semibold text-purple-300">{partner.sector}</h4>
                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                  <div className="bg-gray-800 p-3 rounded">
                    <p className="text-purple-200 text-xs">Companies</p>
                    <p className="font-medium text-white text-lg">{partner.count}</p>
                  </div>
                  <div className="bg-gray-800 p-3 rounded">
                    <p className="text-purple-200 text-xs">Internships Offered</p>
                    <p className="font-medium text-white text-lg">{partner.internshipsOffered}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SDG Alignment */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 border-l-4 border-purple-600">
        <h3 className="text-xl font-semibold mb-6 text-purple-300">SDG Alignment</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80 bg-gray-900 p-4 rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.sdgAlignment}>
                <XAxis dataKey="sdg" stroke="#C4B5FD" />
                <YAxis stroke="#C4B5FD" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4C1D95', borderRadius: '4px' }}
                  labelStyle={{ color: '#C4B5FD' }}
                />
                <Legend wrapperStyle={{ color: '#C4B5FD' }} />
                <Bar dataKey="projects" fill={CHART_COLORS.highlight} name="Number of Projects" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {stats.sdgAlignment.map((sdg) => (
              <div key={sdg.sdg} className="bg-gray-900 p-4 rounded-lg border-l-2 border-purple-500 hover:bg-gray-800 transition-colors">
                <h4 className="font-semibold text-purple-300">SDG {sdg.sdg}</h4>
                <div className="mt-3 text-sm">
                  <div className="bg-gray-800 p-3 rounded mb-3">
                    <p className="text-purple-200 text-xs">Projects</p>
                    <p className="font-medium text-white text-lg">{sdg.projects}</p>
                  </div>
                  <p className="text-purple-200 mb-2">Impact Areas:</p>
                  <ul className="space-y-1">
                    {sdg.impactAreas.map((area, i) => (
                      <li key={i} className="text-gray-300 flex items-start">
                        <span className="text-purple-400 mr-2">•</span> {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1F2937;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4C1D95;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7C3AED;
        }
      `}</style>
    </div>
  );
};

export default InternshipStats;