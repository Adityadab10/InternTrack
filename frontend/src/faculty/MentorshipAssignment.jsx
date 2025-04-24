import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MentorshipAssignment = () => {
  const [mentorsData, setMentorsData] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [suggestedMentor, setSuggestedMentor] = useState(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/mentors");
        console.log("Mentor API Response:", response.data);
        
        // Access the mentors array from response.data.data
        if (response.data && Array.isArray(response.data.data)) {
          setMentorsData(response.data.data);
        } else {
          console.error("Unexpected API response format", response.data);
          setMentorsData([]);
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
        setMentorsData([]);
      }
    };
  
    fetchMentors();
  }, []);
  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/student-profiles');
        if (response.data && response.data.data) {
          setStudents(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const findSuggestedMentor = (student) => {
    try {
      console.log('Finding mentor for student:', student);
      console.log('Available mentors:', mentorsData);

      // Filter out mentors who have reached their maximum capacity
      const availableMentors = mentorsData.filter(mentor => {
        const currentStudentCount = mentor.currentStudents?.length || 0;
        const hasCapacity = currentStudentCount < mentor.maxStudents;
        console.log(`Mentor ${mentor.name} has ${currentStudentCount}/${mentor.maxStudents} students`);
        return hasCapacity;
      });

      console.log('Mentors with capacity:', availableMentors);

      // Find best matching mentor based on field of study and expertise
      const matchingMentors = availableMentors.map(mentor => {
        const expertiseMatch = mentor.expertise.toLowerCase().includes(student.fieldOfStudy.toLowerCase()) ||
                             student.fieldOfStudy.toLowerCase().includes(mentor.expertise.toLowerCase());
        
        const departmentMatch = mentor.department.toLowerCase().includes(student.fieldOfStudy.toLowerCase()) ||
                               student.fieldOfStudy.toLowerCase().includes(mentor.department.toLowerCase());
        
        return {
          mentor,
          score: (expertiseMatch ? 2 : 0) + (departmentMatch ? 1 : 0)
        };
      });

      console.log('Mentor matches with scores:', matchingMentors);

      // Sort by score (highest first) and get the best match
      matchingMentors.sort((a, b) => b.score - a.score);
      
      const bestMatch = matchingMentors[0]?.mentor || availableMentors[0];
      console.log('Selected mentor:', bestMatch);

      return bestMatch;
    } catch (error) {
      console.error('Error in findSuggestedMentor:', error);
      return null;
    }
  };

  const handleAssignClick = (student) => {
    setSelectedStudent(student);
    const suggested = findSuggestedMentor(student);
    setSuggestedMentor(suggested);
    setShowModal(true);
  };

  const handleAssignMentor = async (mentorId) => {
    try {
      const response = await axios.post('http://localhost:5001/api/assign-mentor', {
        studentId: selectedStudent._id,
        mentorId: mentorId
      });

      if (response.data.success) {
        // Refresh both students and mentors lists
        const studentsResponse = await axios.get('http://localhost:5001/api/student-profiles');
        setStudents(studentsResponse.data.data);
        
        const mentorsResponse = await axios.get('http://localhost:5001/api/mentors');
        setMentorsData(Array.isArray(mentorsResponse.data) ? mentorsResponse.data : [mentorsResponse.data]);
        
        setShowModal(false);
        alert('Mentor assigned successfully!');
      }
    } catch (error) {
      console.error('Error assigning mentor:', error);
      alert('Failed to assign mentor. Please try again.');
    }
  };

  // Modal Component
  const AssignmentModal = () => {
    if (!showModal) return null;

    // Filter available mentors (not at capacity)
    const availableMentors = mentorsData.filter(mentor => {
      const currentStudentCount = mentor.currentStudents?.length || 0;
      return currentStudentCount < mentor.maxStudents;
    });

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Assign Mentor</h3>
          
          {/* Student Info */}
          <div className="mb-4">
            <p><span className="font-medium">Student:</span> {selectedStudent?.name}</p>
            <p><span className="font-medium">Field:</span> {selectedStudent?.fieldOfStudy}</p>
          </div>

          {/* Suggested Mentor */}
          {suggestedMentor && (
            <div className="mb-4">
              <p className="font-medium text-green-600">Suggested Mentor (Best Match):</p>
              <div className="border border-green-500 p-3 rounded mt-2 bg-green-50">
                <p className="font-medium">{suggestedMentor.name}</p>
                <p>Expertise: {suggestedMentor.expertise}</p>
                <p>Department: {suggestedMentor.department}</p>
                <p>Current Students: {suggestedMentor.currentStudents?.length || 0}/{suggestedMentor.maxStudents}</p>
                <button
                  onClick={() => handleAssignMentor(suggestedMentor._id)}
                  className="mt-2 w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Assign Suggested Mentor
                </button>
              </div>
            </div>
          )}

          {/* Other Available Mentors */}
          <div className="mb-4">
            <p className="font-medium mb-2">Other Available Mentors:</p>
            <div className="max-h-48 overflow-y-auto">
              {availableMentors
                .filter(mentor => mentor._id !== suggestedMentor?._id)
                .map((mentor, index) => (
                  <div key={index} className="border p-2 rounded mb-2 hover:bg-gray-50">
                    <p className="font-medium">{mentor.name}</p>
                    <p className="text-sm">Expertise: {mentor.expertise}</p>
                    <p className="text-sm">Department: {mentor.department}</p>
                    <p className="text-sm">Students: {mentor.currentStudents?.length || 0}/{mentor.maxStudents}</p>
                    <button
                      onClick={() => handleAssignMentor(mentor._id)}
                      className="mt-1 w-full bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Assign This Mentor
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Cancel Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Mentorship Assignment</h2>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Available Mentors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(mentorsData) && mentorsData.length > 0 ? (
            mentorsData.map((mentor, index) => (
              <div 
                key={index} 
                className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold text-lg mb-2">{mentor.name}</h4>
                <div className="space-y-1">
                  <p><span className="font-medium">Department:</span> {mentor.department}</p>
                  <p><span className="font-medium">Expertise:</span> {mentor.expertise}</p>
                  <p><span className="font-medium">Email:</span> {mentor.email}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No mentors available</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Students List</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student, index) => (
            <div 
              key={index}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold text-lg mb-2">{student.name}</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Email:</span> {student.email}</p>
                <p><span className="font-medium">Degree:</span> {student.degree}</p>
                <p><span className="font-medium">Field:</span> {student.fieldOfStudy}</p>
                
                {/* Mentor Information */}
                {student.mentor ? (
                  <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                    <p className="font-medium text-green-700">Assigned Mentor:</p>
                    <p>{student.mentor.name}</p>
                    <p className="text-sm text-green-600">{student.mentor.department}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAssignClick(student)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full"
                  >
                    Assign Mentor
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AssignmentModal />
    </div>
  );
};

export default MentorshipAssignment;
