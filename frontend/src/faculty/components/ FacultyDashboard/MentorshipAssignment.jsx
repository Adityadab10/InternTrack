import React, { useState } from 'react';
import DataTable from '../common/DataTable';

const MentorshipAssignment = () => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState('');

  // Mock data
  const students = [
    { id: 1, name: 'John Doe', department: 'CS', internship: 'Tech Corp', mentor: 'Dr. Smith' },
    { id: 2, name: 'Jane Smith', department: 'IT', internship: 'Data Systems', mentor: '' },
    { id: 3, name: 'Mike Johnson', department: 'CS', internship: 'Web Solutions', mentor: '' },
  ];

  const mentors = [
    { id: 1, name: 'Dr. Smith', department: 'CS', maxStudents: 5, currentStudents: 3 },
    { id: 2, name: 'Dr. Johnson', department: 'IT', maxStudents: 4, currentStudents: 1 },
    { id: 3, name: 'Dr. Williams', department: 'CS', maxStudents: 6, currentStudents: 2 },
  ];

  const columns = [
    { 
      Header: 'Select',
      accessor: 'id',
      Cell: ({ value }) => (
        <input 
          type="checkbox" 
          checked={selectedStudents.includes(value)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedStudents([...selectedStudents, value]);
            } else {
              setSelectedStudents(selectedStudents.filter(id => id !== value));
            }
          }}
          className="h-4 w-4 text-blue-600 rounded"
        />
      )
    },
    { Header: 'Student Name', accessor: 'name' },
    { Header: 'Department', accessor: 'department' },
    { Header: 'Internship Company', accessor: 'internship' },
    { Header: 'Current Mentor', accessor: 'mentor' },
  ];

  const handleAssignMentor = () => {
    if (selectedStudents.length === 0 || !selectedMentor) return;
    
    // Here you would make an API call to assign the mentor
    console.log(`Assigning mentor ${selectedMentor} to students:`, selectedStudents);
    
    // Reset selection
    setSelectedStudents([]);
    setSelectedMentor('');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Mentorship Assignment</h2>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Assign Mentor to Selected Students</h3>
        
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Mentor</label>
            <select
              value={selectedMentor}
              onChange={(e) => setSelectedMentor(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a mentor</option>
              {mentors.map(mentor => (
                <option key={mentor.id} value={mentor.id}>
                  {mentor.name} ({mentor.department}) - {mentor.currentStudents}/{mentor.maxStudents} students
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleAssignMentor}
            disabled={selectedStudents.length === 0 || !selectedMentor}
            className={`px-4 py-2 rounded-md ${selectedStudents.length && selectedMentor ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Assign Mentor
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <DataTable 
          columns={columns} 
          data={students} 
          pagination 
          searchable 
        />
      </div>
    </div>
  );
};

export default MentorshipAssignment;