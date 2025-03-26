import React, { useState, useEffect } from 'react';

const MentorAllotment = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Static list of mentors
  const mentors = [
    { id: 1, name: "Dr. Sarah Johnson", department: "Computer Science", expertise: "AI/ML", currentStudents: 3 },
    { id: 2, name: "Prof. Michael Chen", department: "Computer Science", expertise: "Web Development", currentStudents: 2 },
    { id: 3, name: "Dr. Emily Brown", department: "Electrical Engineering", expertise: "IoT", currentStudents: 4 },
    { id: 4, name: "Prof. David Wilson", department: "Computer Science", expertise: "Cybersecurity", currentStudents: 1 },
    { id: 5, name: "Dr. Lisa Anderson", department: "Computer Science", expertise: "Data Science", currentStudents: 3 }
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/student-profile/student-profiles', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }

        const { data } = await response.json();
        setStudents(data || []);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleMentorSelect = (student, mentorId) => {
    setSelectedStudent(student);
    setSelectedMentor(mentorId);
    // Here you would typically make an API call to update the mentor assignment
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-800 mb-6">Mentor Allotment</h1>
      
      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-4 bg-purple-800 text-white">
          <h2 className="text-lg font-semibold">Student List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-purple-800">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-purple-800">Department</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-purple-800">Assign Mentor</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{student.name}</td>
                  <td className="px-4 py-3">{student.degree}</td>
                  <td className="px-4 py-3">
                    <select
                      className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={selectedMentor}
                      onChange={(e) => handleMentorSelect(student, e.target.value)}
                    >
                      <option value="">Select Mentor</option>
                      {mentors.map((mentor) => (
                        <option key={mentor.id} value={mentor.id}>
                          {mentor.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Mentors */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-purple-800 text-white">
          <h2 className="text-lg font-semibold">Available Mentors</h2>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-purple-800">{mentor.name}</h3>
              <p className="text-gray-600">Department: {mentor.department}</p>
              <p className="text-gray-600">Expertise: {mentor.expertise}</p>
              <p className="text-gray-600">Current Students: {mentor.currentStudents}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorAllotment; 