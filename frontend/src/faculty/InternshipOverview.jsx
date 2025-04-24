import React, { useState, useEffect } from 'react';
import DataTable from './DataTable';
import StatusBadge from './StatusBadge';
import axios from 'axios';

const InternshipOverview = () => {
  const [internships, setInternships] = useState([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { Header: 'Student Name', accessor: 'studentName' },
    { Header: 'Company', accessor: 'companyName' },
    { 
      Header: 'Application Status', 
      accessor: 'status',
      Cell: ({ value }) => <StatusBadge status={value} />
    },
    { 
      Header: 'Applied Date', 
      accessor: 'appliedDate',
      Cell: ({ value }) => (
        <span className="text-purple-200">
          {new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      )
    }
  ];

  const fetchInternshipData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/applications');
      
      console.log('Applications data:', response.data);

      // Process the applications data with student profile name
      const processedApplications = response.data.map(application => ({
        id: application._id,
        studentName: application.name || 
                    application.studentProfile?.fullName || 
                    application.studentName || 
                    (application.student && typeof application.student === 'object' ? 
                      application.student.name || application.student.fullName : 
                      application.student) || 
                    'N/A',
        companyName: application.companyName || application.company || 'N/A',
        status: application.status || 'Pending',
        appliedDate: application.appliedDate // Just use the appliedDate directly from the database
      }));

      console.log('Processed applications:', processedApplications);
      setInternships(processedApplications);

      // Calculate application statistics
      const statsData = {
        totalApplications: processedApplications.length,
        pendingApplications: processedApplications.filter(i => i.status?.toLowerCase() === 'pending').length,
        approvedApplications: processedApplications.filter(i => i.status?.toLowerCase() === 'approved').length,
        rejectedApplications: processedApplications.filter(i => i.status?.toLowerCase() === 'rejected').length
      };

      console.log('Application stats:', statsData);
      setStats(statsData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching application data:', err);
      setError('Failed to fetch application data. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternshipData();
  }, []);

  const handleRefresh = () => {
    fetchInternshipData();
  };

  const handleExport = () => {
    // Create CSV content
    const headers = columns.map(col => col.Header).join(',');
    const rows = internships.map(internship => 
      columns.map(col => internship[col.accessor]).join(',')
    ).join('\n');
    const csvContent = `${headers}\n${rows}`;

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applications_report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent mx-auto mb-4"></div>
          <p className="text-purple-300 font-medium">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-6 rounded-lg flex items-center">
          <svg 
            className="w-6 h-6 mr-3 flex-shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Applications Overview</h2>
        <div className="flex space-x-4">
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-purple-600/80 text-white rounded-lg hover:bg-purple-700 
              transition-colors duration-200 border border-purple-500/30 flex items-center"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
              />
            </svg>
            Export Data
          </button>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-indigo-600/80 text-white rounded-lg hover:bg-indigo-700 
              transition-colors duration-200 border border-indigo-500/30 flex items-center"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>
      
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-purple-500/20 shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Total Applications */}
          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30 transition-all duration-200 hover:bg-purple-900/30">
            <h3 className="text-purple-300 text-sm font-medium">Total Applications</h3>
            <p className="text-2xl font-bold text-white mt-1">{stats.totalApplications}</p>
            <div className="mt-2">
              <span className="text-xs text-purple-400">All time applications</span>
            </div>
          </div>

          {/* Pending Applications */}
          <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/30 transition-all duration-200 hover:bg-yellow-900/30">
            <h3 className="text-yellow-300 text-sm font-medium">Pending Review</h3>
            <p className="text-2xl font-bold text-white mt-1">{stats.pendingApplications}</p>
            <div className="mt-2">
              <span className="text-xs text-yellow-400">Awaiting response</span>
            </div>
          </div>

          {/* Approved Applications */}
          <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30 transition-all duration-200 hover:bg-green-900/30">
            <h3 className="text-green-300 text-sm font-medium">Approved</h3>
            <p className="text-2xl font-bold text-white mt-1">{stats.approvedApplications}</p>
            <div className="mt-2">
              <span className="text-xs text-green-400">Successfully placed</span>
            </div>
          </div>

          {/* Rejected Applications */}
          <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30 transition-all duration-200 hover:bg-red-900/30">
            <h3 className="text-red-300 text-sm font-medium">Rejected</h3>
            <p className="text-2xl font-bold text-white mt-1">{stats.rejectedApplications}</p>
            <div className="mt-2">
              <span className="text-xs text-red-400">Not accepted</span>
            </div>
          </div>
        </div>
        
        {internships.length > 0 ? (
          <div className="bg-gradient-to-b from-black/30 to-purple-900/10 rounded-xl border border-purple-500/20 overflow-hidden shadow-xl">
            <div className="p-2">
              <DataTable 
                columns={columns} 
                data={internships} 
                pagination 
                searchable 
                className="min-w-full divide-y divide-purple-500/20"
                theadClassName="bg-gradient-to-r from-purple-900/40 to-indigo-900/40"
                thClassName="px-6 py-4 text-left text-xs font-semibold text-purple-200 uppercase tracking-wider first:rounded-l-lg last:rounded-r-lg"
                tdClassName="px-6 py-4 whitespace-nowrap text-sm text-gray-200 transition-colors duration-200"
                trClassName="hover:bg-purple-500/10 transition-colors duration-200 border-b border-purple-500/10"
                paginationClassName="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 px-6 py-4 flex items-center justify-between border-t border-purple-500/20"
                searchClassName="bg-black/30 border border-purple-500/30 text-white placeholder-purple-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 mb-4 w-full max-w-md"
                paginationButtonClassName="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-purple-500/30"
                paginationActiveButtonClassName="bg-purple-500/40 text-white border-purple-500/50"
                searchPlaceholder="Search applications..."
                noDataComponent={
                  <div className="text-purple-300 text-center py-8">
                    No matching applications found
                  </div>
                }
                customStyles={{
                  table: {
                    style: {
                      backgroundColor: 'transparent',
                    },
                  },
                  rows: {
                    style: {
                      minHeight: '60px',
                    },
                  },
                  headRow: {
                    style: {
                      minHeight: '52px',
                    },
                  },
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-black/20 rounded-lg border border-purple-500/20">
            <svg 
              className="w-16 h-16 text-purple-500/50 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <p className="text-purple-300 text-lg font-medium mb-2">No Applications Available</p>
            <p className="text-purple-400 text-sm">Applications will appear here once students start applying</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipOverview;