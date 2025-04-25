import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUser, FiBook, FiMail, FiUsers, FiPlus, FiX } from 'react-icons/fi';

const MentorshipAssignment = () => {
  const [mentorsData, setMentorsData] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [suggestedMentor, setSuggestedMentor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mentorsResponse, studentsResponse] = await Promise.all([
          axios.get("http://localhost:5001/api/mentors"),
          axios.get('http://localhost:5001/api/student-profiles')
        ]);

        // Handle mentors data
        if (mentorsResponse.data && Array.isArray(mentorsResponse.data.data)) {
          setMentorsData(mentorsResponse.data.data);
        } else {
          console.error("Unexpected mentors API response format", mentorsResponse.data);
          setMentorsData([]);
        }

        // Handle students data
        if (studentsResponse.data && studentsResponse.data.data) {
          setStudents(studentsResponse.data.data);
        } else {
          console.error("Unexpected students API response format", studentsResponse.data);
          setStudents([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMentorsData([]);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const findSuggestedMentor = (student) => {
    try {
      // Filter out mentors who have reached their maximum capacity
      const availableMentors = mentorsData.filter(mentor => {
        const currentStudentCount = mentor.currentStudents?.length || 0;
        return currentStudentCount < mentor.maxStudents;
      });

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

      // Sort by score (highest first) and get the best match
      matchingMentors.sort((a, b) => b.score - a.score);
      return matchingMentors[0]?.mentor || availableMentors[0];
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
        // Refresh data
        const [studentsResponse, mentorsResponse] = await Promise.all([
          axios.get('http://localhost:5001/api/student-profiles'),
          axios.get('http://localhost:5001/api/mentors')
        ]);
        
        setStudents(studentsResponse.data.data);
        setMentorsData(Array.isArray(mentorsResponse.data.data) ? mentorsResponse.data.data : []);
        
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error assigning mentor:', error);
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
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gray-900/90 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto border border-purple-500/30 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-purple-300">Assign Mentor</h3>
            <button 
              onClick={() => setShowModal(false)}
              className="text-purple-400 hover:text-purple-200 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
          
          {/* Student Info */}
          <div className="mb-6 bg-gray-800 p-4 rounded-lg border border-purple-900">
            <h4 className="text-lg font-semibold text-purple-300 mb-3">Student Information</h4>
            <div className="space-y-2">
              <p className="text-purple-200">
                <span className="font-medium text-purple-400">Name:</span> {selectedStudent?.name}
              </p>
              <p className="text-purple-200">
                <span className="font-medium text-purple-400">Field:</span> {selectedStudent?.fieldOfStudy}
              </p>
            </div>
          </div>

          {/* Suggested Mentor */}
          {suggestedMentor && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-green-400 mb-3">Suggested Mentor</h4>
              <div className="bg-gray-800 p-4 rounded-lg border border-green-500/30">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center">
                    <FiUser className="text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{suggestedMentor.name}</p>
                    <p className="text-sm text-purple-300">{suggestedMentor.department}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-purple-300">
                    <span className="text-purple-400">Expertise:</span> {suggestedMentor.expertise}
                  </p>
                  <p className="text-purple-300">
                    <span className="text-purple-400">Students:</span> {suggestedMentor.currentStudents?.length || 0}/{suggestedMentor.maxStudents}
                  </p>
                </div>
                <button
                  onClick={() => handleAssignMentor(suggestedMentor._id)}
                  className="mt-4 w-full bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-green-500 hover:to-teal-500 transition-colors"
                >
                  Assign Suggested Mentor
                </button>
              </div>
            </div>
          )}

          {/* Other Available Mentors */}
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-purple-300 mb-3">Other Available Mentors</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {availableMentors
                .filter(mentor => mentor._id !== suggestedMentor?._id)
                .map((mentor, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg border border-purple-900 hover:border-purple-500/50 transition-colors">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center">
                        <FiUser className="text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{mentor.name}</p>
                        <p className="text-sm text-purple-300">{mentor.department}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <p className="text-purple-300">
                        <span className="text-purple-400">Expertise:</span> {mentor.expertise}
                      </p>
                      <p className="text-purple-300">
                        <span className="text-purple-400">Students:</span> {mentor.currentStudents?.length || 0}/{mentor.maxStudents}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAssignMentor(mentor._id)}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-colors text-sm"
                    >
                      Assign This Mentor
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
          Mentorship Assignment
        </h2>
        <p className="text-purple-300/80 mt-2">Manage and assign mentors to students</p>
      </div>
      
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-xl p-6 mb-8">
        <h3 className="text-xl font-semibold text-purple-300 mb-6">Available Mentors</h3>
        {mentorsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentorsData.map((mentor, index) => (
              <div 
                key={index} 
                className="bg-gray-900/50 rounded-xl border border-purple-500/30 p-5 hover:border-purple-500/50 transition-colors group"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white">
                    <FiUser className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-white group-hover:text-purple-200 transition-colors">
                      {mentor.name}
                    </h4>
                    <p className="text-purple-400 text-sm">{mentor.department}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-purple-300">
                    <FiMail className="inline mr-2 text-purple-400" />
                    {mentor.email}
                  </p>
                  <p className="text-purple-300">
                    <FiBook className="inline mr-2 text-purple-400" />
                    {mentor.expertise}
                  </p>
                  <p className="text-purple-300">
                    <FiUsers className="inline mr-2 text-purple-400" />
                    {mentor.currentStudents?.length || 0}/{mentor.maxStudents} students
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-900/30 rounded-lg border border-dashed border-purple-500/30">
            <FiUsers className="mx-auto h-12 w-12 text-purple-500/50" />
            <p className="mt-2 text-purple-300/80">No mentors available</p>
          </div>
        )}
      </div>

      <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-xl p-6">
        <h3 className="text-xl font-semibold text-purple-300 mb-6">Students List</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student, index) => (
            <div 
              key={index}
              className="bg-gray-900/50 rounded-xl border border-purple-500/30 p-5 hover:border-purple-500/50 transition-colors group"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                  <FiUser className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-white group-hover:text-blue-200 transition-colors">
                    {student.name}
                  </h4>
                  <p className="text-purple-400 text-sm">{student.degree}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <p className="text-purple-300">
                  <FiMail className="inline mr-2 text-purple-400" />
                  {student.email}
                </p>
                <p className="text-purple-300">
                  <FiBook className="inline mr-2 text-purple-400" />
                  {student.fieldOfStudy}
                </p>
              </div>
              
              {student.mentor ? (
                <div className="bg-green-900/20 p-3 rounded-lg border border-green-500/30">
                  <p className="font-medium text-green-400">Assigned Mentor:</p>
                  <p className="text-white">{student.mentor.name}</p>
                  <p className="text-xs text-green-300">{student.mentor.department}</p>
                </div>
              ) : (
                <button
                  onClick={() => handleAssignClick(student)}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-colors flex items-center justify-center"
                >
                  <FiPlus className="mr-2" />
                  Assign Mentor
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <AssignmentModal />
    </div>
  );
};

export default MentorshipAssignment;