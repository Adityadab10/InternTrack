import React, { useState, useEffect } from 'react';
import DataTable from './DataTable';
import StatusBadge from './StatusBadge';
import axios from 'axios';
import { FiRefreshCw, FiDownload, FiAlertTriangle, FiFileText } from 'react-icons/fi';

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
    { 
      Header: 'Student Name', 
      accessor: 'studentName',
      Cell: ({ value }) => <span className="text-white">{value}</span>
    },
    { 
      Header: 'Company', 
      accessor: 'companyName',
      Cell: ({ value }) => <span className="text-gray-300">{value}</span>
    },
    { 
      Header: 'Status', 
      accessor: 'status',
      Cell: ({ value }) => <StatusBadge status={value} />
    },
    { 
      Header: 'Applied Date', 
      accessor: 'appliedDate',
      Cell: ({ value }) => (
        <span className="text-gray-400">
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
        appliedDate: application.appliedDate || new Date().toISOString()
      }));

      setInternships(processedApplications);

      // Calculate application statistics
      setStats({
        totalApplications: processedApplications.length,
        pendingApplications: processedApplications.filter(i => i.status?.toLowerCase() === 'pending').length,
        approvedApplications: processedApplications.filter(i => i.status?.toLowerCase() === 'approved').length,
        rejectedApplications: processedApplications.filter(i => i.status?.toLowerCase() === 'rejected').length
      });
      
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
      <div className="flex justify-center items-center h-64 bg-gradient-to-b from-[#0f0c29] to-[#302b63]">
        <div className="animate-spin h-8 w-8 border-4 border-[#6a11cb] rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[200px] flex items-center justify-center bg-gradient-to-b from-[#0f0c29] to-[#302b63]">
        <div className="bg-[#1f1b3a] p-6 rounded-xl border border-red-500/30 flex items-center space-x-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <FiAlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-red-300 font-semibold mb-1">Error Loading Applications</h3>
            <p className="text-red-300/80">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-6 bg-gradient-to-b from-[#0f0c29] to-[#302b63]">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
              Applications Overview
            </h1>
            <p className="text-gray-400 mt-2">Track and manage student internship applications</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleExport}
              className="group px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-[#6a11cb] to-[#2575fc] rounded-lg
                hover:from-[#6a11cb]/90 hover:to-[#2575fc]/90 transition-all duration-300 
                shadow-lg hover:shadow-purple-500/20 flex items-center space-x-2"
            >
              <FiDownload className="w-4 h-4 md:w-5 md:h-5 text-white transform group-hover:scale-110 transition-transform" />
              <span className="text-white text-sm md:text-base font-medium">Export Data</span>
            </button>
            <button 
              onClick={handleRefresh}
              className="group px-4 py-2 md:px-6 md:py-3 bg-[#1f1b3a] rounded-lg border border-[#3a295d]
                hover:bg-[#2e1a47] transition-all duration-300 
                shadow-lg hover:shadow-gray-500/20 flex items-center space-x-2"
            >
              <FiRefreshCw className="w-4 h-4 md:w-5 md:h-5 text-white transform group-hover:rotate-180 transition-transform" />
              <span className="text-white text-sm md:text-base font-medium">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Applications */}
          <div className="bg-[#1f1b3a] p-4 rounded-xl border border-[#3a295d] hover:border-[#6a11cb] transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#6a11cb]/20 rounded-lg group-hover:bg-[#6a11cb]/30 transition-colors duration-300">
                <FiFileText className="text-[#8e2de2] text-lg" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Applications</p>
                <p className="text-xl md:text-2xl font-bold text-white mt-1">{stats.totalApplications}</p>
              </div>
            </div>
          </div>

          {/* Pending Applications */}
          <div className="bg-[#1f1b3a] p-4 rounded-xl border border-[#3a295d] hover:border-yellow-500 transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-500/20 rounded-lg group-hover:bg-yellow-500/30 transition-colors duration-300">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Pending Review</p>
                <p className="text-xl md:text-2xl font-bold text-white mt-1">{stats.pendingApplications}</p>
              </div>
            </div>
          </div>

          {/* Approved Applications */}
          <div className="bg-[#1f1b3a] p-4 rounded-xl border border-[#3a295d] hover:border-green-500 transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors duration-300">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Approved</p>
                <p className="text-xl md:text-2xl font-bold text-white mt-1">{stats.approvedApplications}</p>
              </div>
            </div>
          </div>

          {/* Rejected Applications */}
          <div className="bg-[#1f1b3a] p-4 rounded-xl border border-[#3a295d] hover:border-red-500 transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-colors duration-300">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Rejected</p>
                <p className="text-xl md:text-2xl font-bold text-white mt-1">{stats.rejectedApplications}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-[#1f1b3a] rounded-xl border border-[#3a295d] shadow-lg p-4 md:p-6">
          {internships.length > 0 ? (
            <div className="overflow-x-auto">
              <DataTable 
                columns={columns} 
                data={internships} 
                pagination 
                searchable 
                className="min-w-full divide-y divide-[#3a295d]"
                theadClassName="bg-[#2e1a47]"
                thClassName="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
                tdClassName="px-4 py-3 whitespace-nowrap text-sm text-gray-200 border-b border-[#3a295d]"
                trClassName="hover:bg-[#2e1a47]/50 transition-colors duration-200"
                paginationClassName="bg-[#2e1a47] px-4 py-3 flex items-center justify-between border-t border-[#3a295d]"
                searchClassName="bg-[#0f0c29] border border-[#3a295d] text-white placeholder-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6a11cb] focus:border-[#6a11cb] transition-all duration-200 mb-4 w-full max-w-md"
                paginationButtonClassName="px-3 py-1 rounded-md bg-[#3a295d] text-gray-300 hover:bg-[#6a11cb] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                paginationActiveButtonClassName="bg-[#6a11cb] text-white"
                searchPlaceholder="Search applications..."
                noDataComponent={
                  <div className="text-center py-8 bg-[#0f0c29] rounded-lg border border-dashed border-[#3a295d]">
                    <FiFileText className="mx-auto h-12 w-12 text-[#6a11cb]/50" />
                    <p className="mt-2 text-black-400">No matching applications found</p>
                  </div>
                }
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-[#0f0c29] rounded-lg border border-dashed border-[#3a295d]">
              <FiFileText className="w-12 h-12 text-[#6a11cb]/50 mb-4" />
              <p className="text-black text-lg font-medium mb-2">No Applications Available</p>
              <p className="text-black-500 text-sm">Applications will appear here once students start applying</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternshipOverview;