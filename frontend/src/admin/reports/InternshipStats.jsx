import React, { useState, useEffect } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion'; // Add this import

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="p-8 space-y-8 bg-gradient-to-br from-gray-900 via-black to-purple-950"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Enhanced Header */}
      <motion.div 
        className="text-center mb-12"
        variants={cardVariants}
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-purple-400 to-purple-200 bg-clip-text text-transparent">
          Internship Analytics Dashboard
        </h2>
        <p className="text-purple-400/80 mt-2">Comprehensive insights into internship performance and impact</p>
      </motion.div>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            className="flex justify-center items-center h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-900/20 backdrop-blur-sm p-4 rounded-xl border border-red-500/30 text-red-300"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && !error && (
        <motion.div 
          className="grid gap-8"
          variants={containerVariants}
        >
          {/* Department Statistics Card */}
          <motion.div
            variants={cardVariants}
            className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-purple-900/50 rounded-xl">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-purple-200">Department Analytics</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
          </motion.div>

          {/* Industry Partners Card */}
          <motion.div
            variants={cardVariants}
            className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-purple-900/50 rounded-xl">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-purple-200">Industry Partnerships</h3>
            </div>

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
          </motion.div>

          {/* SDG Impact Card */}
          <motion.div
            variants={cardVariants}
            className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-purple-900/50 rounded-xl">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-purple-200">SDG Impact Analysis</h3>
            </div>

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
          </motion.div>
        </motion.div>
      )}

      {/* Enhanced scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </motion.div>
  );
};

export default InternshipStats;