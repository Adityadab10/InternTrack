import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const InternshipOverview = () => {
  const [stats, setStats] = useState({
    totalInternships: 0,
    activeInternships: 0,
    totalApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
    shortlistedApplications: 0,
    pendingApplications: 0,
    companyStats: {},
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Only fetch applications data since we'll get company info directly from there
        const applicationsRes = await axios.get('http://localhost:5001/api/applications');
        const applications = applicationsRes.data;

        // Log the first application to see its structure
        console.log('Sample application:', applications[0]);

        // Process company-wise statistics directly from applications
        const companyStats = applications.reduce((acc, app) => {
          // Use company directly from the application data
          const company = app.company || 'Unspecified';
          
          if (!acc[company]) {
            acc[company] = {
              total: 0,
              accepted: 0,
              rejected: 0,
              shortlisted: 0,
              pending: 0
            };
          }

          acc[company].total++;

          // Count by status
          switch(app.status?.toLowerCase()) {
            case 'accepted':
            case 'approve':
              acc[company].accepted++;
              break;
            case 'rejected':
            case 'reject':
              acc[company].rejected++;
              break;
            case 'shortlisted':
            case 'shortlist':
              acc[company].shortlisted++;
              break;
            default:
              acc[company].pending++;
          }

          return acc;
        }, {});

        // Calculate overall statistics
        const acceptedApplications = applications.filter(app => 
          app.status?.toLowerCase() === 'accepted' || 
          app.status?.toLowerCase() === 'approve'
        ).length;

        const rejectedApplications = applications.filter(app => 
          app.status?.toLowerCase() === 'rejected' ||
          app.status?.toLowerCase() === 'reject'
        ).length;

        const shortlistedApplications = applications.filter(app => 
          app.status?.toLowerCase() === 'shortlisted' ||
          app.status?.toLowerCase() === 'shortlist'
        ).length;

        const pendingApplications = applications.filter(app => 
          !app.status || 
          app.status?.toLowerCase() === 'pending' ||
          app.status?.toLowerCase() === 'new'
        ).length;

        setStats({
          companyStats,
          totalApplications: applications.length,
          acceptedApplications,
          rejectedApplications,
          shortlistedApplications,
          pendingApplications,
          isLoading: false,
          error: null
        });

      } catch (error) {
        console.error('Error fetching overview stats:', error);
        setStats(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load overview statistics'
        }));
      }
    };

    fetchStats();
  }, []);

  // Update the success rate calculation to handle zero cases
  const calculateSuccessRate = () => {
    const successfulApps = stats.acceptedApplications + stats.shortlistedApplications;
    const totalProcessed = successfulApps + stats.rejectedApplications;
    
    if (totalProcessed === 0) return '0.0';
    return ((successfulApps / totalProcessed) * 100).toFixed(1);
  };

  // Update chart data preparation for companies
  const getCompanyChartData = () => {
    return Object.entries(stats.companyStats)
      .sort((a, b) => b[1].total - a[1].total) // Sort by total applications
      .map(([company, data]) => ({
        company,
        'Total Applications': data.total,
        'Accepted': data.accepted,
        'Shortlisted': data.shortlisted,
        'Rejected': data.rejected,
        'Pending': data.pending
      }));
  };

  const statsCards = [
    {
      title: 'Total Internships',
      value: stats.totalInternships,
      subText: 'Available opportunities',
      details: stats.isLoading ? [] : [
        { label: 'Active Positions', value: stats.activeInternships },
        { label: 'Total Applications', value: stats.totalApplications }
      ],
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Application Status',
      value: stats.totalApplications,
      subText: 'Application breakdown',
      details: stats.isLoading ? [] : [
        { 
          label: 'Accepted', 
          value: stats.acceptedApplications,
          className: 'text-green-400'
        },
        { 
          label: 'Shortlisted', 
          value: stats.shortlistedApplications,
          className: 'text-blue-400'
        },
        { 
          label: 'Rejected', 
          value: stats.rejectedApplications,
          className: 'text-red-400'
        },
        { 
          label: 'Pending Review', 
          value: stats.pendingApplications,
          className: 'text-yellow-400'
        }
      ],
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Success Metrics',
      value: `${calculateSuccessRate()}%`,
      subText: 'Positive response rate',
      details: stats.isLoading ? [] : [
        { 
          label: 'Successful', 
          value: stats.acceptedApplications + stats.shortlistedApplications,
          className: 'text-green-400'
        },
        { 
          label: 'Rejected', 
          value: stats.rejectedApplications,
          className: 'text-red-400'
        },
        { 
          label: 'Success Rate', 
          value: `${calculateSuccessRate()}%`,
          className: 'text-purple-400'
        }
      ],
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  // Update the rendering function for company stats
  const renderCompanyStats = () => (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-purple-300 mb-4">Company-wise Application Statistics</h3>
      
      {/* Chart */}
      <div className="bg-black/30 p-4 rounded-lg mb-6" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={getCompanyChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis 
              dataKey="company" 
              angle={-45} 
              textAnchor="end" 
              height={80} 
              stroke="#9ca3af"
            />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '0.375rem'
              }}
            />
            <Legend />
            <Bar dataKey="Accepted" fill="#4ade80" />
            <Bar dataKey="Shortlisted" fill="#60a5fa" />
            <Bar dataKey="Rejected" fill="#f87171" />
            <Bar dataKey="Pending" fill="#fbbf24" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-black/30 rounded-lg">
          <thead>
            <tr className="border-b border-purple-500/20">
              <th className="px-4 py-3 text-left text-sm font-semibold text-purple-300">Company</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-purple-300">Total Applications</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-green-400">Accepted</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-400">Shortlisted</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-red-400">Rejected</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-yellow-400">Pending</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats.companyStats)
              .sort((a, b) => b[1].total - a[1].total) // Sort by total applications
              .map(([company, data]) => (
                <tr key={company} className="border-b border-purple-500/10 hover:bg-purple-500/5">
                  <td className="px-4 py-3 text-sm text-purple-200">{company}</td>
                  <td className="px-4 py-3 text-sm text-white">{data.total}</td>
                  <td className="px-4 py-3 text-sm text-green-400">{data.accepted}</td>
                  <td className="px-4 py-3 text-sm text-blue-400">{data.shortlisted}</td>
                  <td className="px-4 py-3 text-sm text-red-400">{data.rejected}</td>
                  <td className="px-4 py-3 text-sm text-yellow-400">{data.pending}</td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

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
                      <span className={`text-sm font-medium ${detail.className || 'text-white'}`}>
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Updated company statistics section */}
      {!stats.isLoading && !stats.error && renderCompanyStats()}
    </div>
  );
};

export default InternshipOverview;