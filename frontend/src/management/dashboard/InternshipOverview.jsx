import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const InternshipOverview = () => {
  const [stats, setStats] = useState({
    totalInternships: 0,
    studentParticipation: 0,
    industryPartners: [],
    departmentData: [],
    sdgAlignment: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [managementStats, internshipStats] = await Promise.all([
          axios.get('http://localhost:5001/api/management/stats'),
          axios.get('http://localhost:5001/api/internship-stats')
        ]);

        setStats({
          ...managementStats.data,
          ...internshipStats.data,
          isLoading: false,
          error: null
        });
      } catch (error) {
        setStats(prev => ({
          ...prev,
          isLoading: false,
          error: error.message
        }));
      }
    };

    fetchStats();
  }, []);

  // Calculate dynamic details for stats cards
  const getIndustryBreakdown = () => {
    return stats.industryPartners
      .sort((a, b) => b.internshipsOffered - a.internshipsOffered)
      .slice(0, 3)
      .map(partner => ({
        label: partner.company,
        value: partner.internshipsOffered
      }));
  };

  const getDepartmentBreakdown = () => {
    return stats.departmentData
      .sort((a, b) => b.participationRate - a.participationRate)
      .slice(0, 3)
      .map(dept => ({
        label: dept.department,
        value: `${dept.participationRate}%`
      }));
  };

  const getSdgBreakdown = () => {
    return stats.sdgAlignment
      .sort((a, b) => b.projects - a.projects)
      .slice(0, 3)
      .map(sdg => ({
        label: `SDG ${sdg.sdg}`,
        value: sdg.projects
      }));
  };

  const statsCards = [
    {
      title: 'Total Internships',
      value: stats.totalInternships,
      subText: 'Active opportunities',
      details: stats.isLoading ? [] : [
        { label: 'Open Positions', value: stats.industryPartners.reduce((acc, curr) => acc + curr.internshipsOffered, 0) },
        { label: 'Applications', value: stats.industryPartners.reduce((acc, curr) => acc + curr.totalApplications, 0) },
        { label: 'Departments', value: new Set(stats.departmentData.map(d => d.department)).size }
      ],
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Student Participation',
      value: `${stats.studentParticipation}%`,
      subText: 'Overall engagement',
      details: stats.isLoading ? [] : getDepartmentBreakdown(),
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: 'Industry Partners',
      value: stats.industryPartners.length,
      subText: 'Collaborating companies',
      details: stats.isLoading ? [] : getIndustryBreakdown(),
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ];

  // Add this new section after the existing stats cards
  const renderDepartmentStats = () => {
    if (!stats.departmentData?.length) return null;

    const COLORS = [
      '#8B5CF6', '#6366F1', '#EC4899', '#F43F5E', '#10B981',
      '#6EE7B7', '#3B82F6', '#60A5FA', '#F59E0B', '#FBBF24'
    ];

    return (
      <div className="mt-8 space-y-6">
        <h3 className="text-xl font-semibold text-purple-200">Department-wise Statistics</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Participation Rate Chart */}
          <div className="bg-black/30 p-6 rounded-lg border border-purple-500/20">
            <h4 className="text-lg font-medium text-purple-300 mb-4">Participation Rates</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.departmentData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="department" 
                    stroke="#E9D5FF"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="#E9D5FF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar 
                    name="Participation Rate (%)" 
                    dataKey="participationRate" 
                    fill="#8B5CF6" 
                  />
                  <Bar 
                    name="Placement Rate (%)" 
                    dataKey="placementRate" 
                    fill="#10B981" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Average Stipend Distribution */}
          <div className="bg-black/30 p-6 rounded-lg border border-purple-500/20">
            <h4 className="text-lg font-medium text-purple-300 mb-4">Average Stipend Distribution</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="averageStipend"
                    nameKey="department"
                    label={({ department, averageStipend }) => 
                      `${department}: ₹${averageStipend.toLocaleString()}`
                    }
                  >
                    {stats.departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `₹${value.toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Department Statistics Table */}
        <div className="bg-black/30 p-6 rounded-lg border border-purple-500/20">
          <h4 className="text-lg font-medium text-purple-300 mb-4">Detailed Department Statistics</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-purple-900/30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                    Total Students
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                    Participating Students
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                    Participation Rate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                    Placement Rate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                    Avg. Stipend
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/30">
                {stats.departmentData.map((dept, index) => (
                  <tr 
                    key={dept.department}
                    className={index % 2 === 0 ? 'bg-purple-900/10' : 'bg-purple-900/20'}
                  >
                    <td className="px-4 py-3 text-sm text-purple-200">
                      {dept.department}
                    </td>
                    <td className="px-4 py-3 text-sm text-purple-200">
                      {dept.totalStudents}
                    </td>
                    <td className="px-4 py-3 text-sm text-purple-200">
                      {dept.participatingStudents}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-16 bg-purple-900/30 rounded-full h-2 mr-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${dept.participationRate}%` }}
                          />
                        </div>
                        <span className="text-sm text-purple-200">
                          {dept.participationRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-16 bg-green-900/30 rounded-full h-2 mr-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${dept.placementRate}%` }}
                          />
                        </div>
                        <span className="text-sm text-green-200">
                          {dept.placementRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-purple-200">
                      ₹{dept.averageStipend.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  if (stats.error) {
    return (
      <div className="p-6 bg-red-900/20 rounded-xl border border-red-500/20">
        <p className="text-red-400">Error loading stats: {stats.error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/20 shadow-lg">
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-purple-400 mb-6">
        Institution-Wide Overview
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative group bg-gradient-to-br from-purple-900/30 to-black/30 p-6 rounded-lg 
              border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300
              shadow-lg hover:shadow-purple-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            
            <div className="relative flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm text-purple-300">{card.title}</h3>
                <p className="text-xs text-purple-400/60 mt-1">{card.subText}</p>
              </div>
              {card.icon}
            </div>
            
            {stats.isLoading ? (
              <div className="animate-pulse h-8 bg-purple-500/20 rounded w-16" />
            ) : (
              <>
                <p className="text-3xl font-bold text-white relative z-10 mb-4">{card.value}</p>
                <div className="space-y-2 pt-4 border-t border-purple-500/20">
                  {card.details.map((detail, i) => (
                    <div key={detail.label} className="flex justify-between items-center">
                      <span className="text-sm text-purple-300/80">{detail.label}</span>
                      <span className="text-sm font-medium text-white">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* New department statistics section */}
      {!stats.isLoading && renderDepartmentStats()}
    </div>
  );
};

export default InternshipOverview;