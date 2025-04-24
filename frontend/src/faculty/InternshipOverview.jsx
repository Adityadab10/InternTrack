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
    { Header: 'Role', accessor: 'role' },
    { 
      Header: 'Application Status', 
      accessor: 'status',
      Cell: ({ value }) => <StatusBadge status={value} />
    },
    { Header: 'Applied Date', accessor: 'appliedDate' }
  ];

  const fetchInternshipData = async () => {
    try {
      setLoading(true);
      // Fetch applications data
      const response = await axios.get('http://localhost:5001/api/applications');
      
      console.log('Applications data:', response.data);

      // Process the applications data with student profile name
      const processedApplications = response.data.map(application => ({
        id: application._id,
        // Update the name access to get from the correct field
        studentName: application.name || // if name is directly on application
                    application.studentProfile?.fullName || // try studentProfile's fullName
                    application.studentName || // try studentName field
                    (application.student && typeof application.student === 'object' ? 
                      application.student.name || application.student.fullName : // try student object's name/fullName
                      application.student) || // if student is just the name string
                    'N/A',
        companyName: application.companyName || application.company || 'N/A',
        role: application.position || application.role || 'N/A',
        status: application.status || 'Pending',
        appliedDate: application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'N/A'
      }));

      // Log processed data to verify the transformation
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
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold  text-white ">Applications Overview</h2>
        <div className="flex space-x-4">
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Export Data
          </button>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Refresh
          </button>
        </div>
      </div>
      
      <div className=" from-gray-900 via-black to-purple-950 rounded-lg shadow p-6">
        <div className="grid grid-cols-4 gap-4 mb-6 ">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-gray-500">Total Applications</h3>
            <p className="text-2xl font-bold">{stats.totalApplications}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-gray-500">Pending Review</h3>
            <p className="text-2xl font-bold">{stats.pendingApplications}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-gray-500">Approved</h3>
            <p className="text-2xl font-bold">{stats.approvedApplications}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-gray-500">Rejected</h3>
            <p className="text-2xl font-bold">{stats.rejectedApplications}</p>
          </div>
        </div>
        
        {internships.length > 0 ? (
          <DataTable 
            columns={columns} 
            data={internships} 
            pagination 
            searchable 
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No applications available
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipOverview;