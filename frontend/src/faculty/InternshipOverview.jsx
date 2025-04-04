import React from 'react';
import DataTable from './DataTable';
import StatusBadge from './StatusBadge';

const InternshipOverview = () => {
  // Mock data - replace with API calls
  const internships = [
    { id: 1, student: 'John Doe', company: 'Tech Corp', department: 'Computer Science', status: 'ongoing', startDate: '2023-06-01', endDate: '2023-08-31' },
    { id: 2, student: 'Jane Smith', company: 'Data Systems', department: 'Information Technology', status: 'completed', startDate: '2023-05-15', endDate: '2023-08-15' },
    { id: 3, student: 'Mike Johnson', company: 'Web Solutions', department: 'Computer Science', status: 'upcoming', startDate: '2023-09-01', endDate: '2023-12-31' },
  ];

  const columns = [
    { Header: 'Student', accessor: 'student' },
    { Header: 'Company', accessor: 'company' },
    { Header: 'Department', accessor: 'department' },
    { 
      Header: 'Status', 
      accessor: 'status',
      Cell: ({ value }) => <StatusBadge status={value} />
    },
    { Header: 'Start Date', accessor: 'startDate' },
    { Header: 'End Date', accessor: 'endDate' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Internship Overview</h2>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Export Data
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Refresh
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-gray-500">Total Internships</h3>
            <p className="text-2xl font-bold">124</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-gray-500">Completed</h3>
            <p className="text-2xl font-bold">87</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-gray-500">Ongoing</h3>
            <p className="text-2xl font-bold">24</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-gray-500">Upcoming</h3>
            <p className="text-2xl font-bold">13</p>
          </div>
        </div>
        
        <DataTable 
          columns={columns} 
          data={internships} 
          pagination 
          searchable 
        />
      </div>
    </div>
  );
};

export default InternshipOverview;