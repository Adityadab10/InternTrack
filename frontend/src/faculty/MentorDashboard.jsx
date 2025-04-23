import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const MentorDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [mentorResponse, setMentorResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Function to get mentor details and their students
  const fetchMentorAndStudents = async () => {
    try {
      if (!user?.email) {
        setError('User not authenticated');
        navigate('/faculty/login');
        return;
      }

      // Get mentor details
      const response = await axios.get(`http://localhost:5001/api/mentors/details/${user.email}`);
      console.log('Mentor details:', response.data);

      if (!response.data.mentor) {
        setError('Mentor profile not found');
        navigate('/faculty/mentor-registration');
        return;
      }

      setMentorResponse(response);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Failed to fetch mentor data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorAndStudents();
  }, [user]);

  const handleFeedbackSubmit = async (studentId) => {
    try {
      await axios.post(`http://localhost:5001/api/mentor/feedback/${studentId}`, {
        feedback,
      }, {
        withCredentials: true
      });
      setFeedback('');
      // Refresh student data
      fetchMentorAndStudents();
    } catch (err) {
      setError('Failed to submit feedback');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Mentor Dashboard</h1>
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 
              rounded-lg text-red-300 hover:text-red-200 transition-all duration-200 flex items-center"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
            Logout
          </motion.button>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Mentor Profile</h2>
          {mentorResponse?.data?.mentor && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-purple-200 text-sm">Name</h3>
                  <p className="text-white font-medium">{mentorResponse.data.mentor.name}</p>
                </div>
                <div>
                  <h3 className="text-purple-200 text-sm">Department</h3>
                  <p className="text-white">{mentorResponse.data.mentor.department}</p>
                </div>
                <div>
                  <h3 className="text-purple-200 text-sm">Expertise</h3>
                  <p className="text-white">{mentorResponse.data.mentor.expertise}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-purple-200 text-sm">Email</h3>
                  <p className="text-white">{user.email}</p>
                </div>
                <div>
                  <h3 className="text-purple-200 text-sm">Students Assigned</h3>
                  <p className="text-white">{mentorResponse.data.mentor.currentStudents?.length || 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Students List */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Assigned Students</h2>
            {mentorResponse?.data?.mentor?.currentStudents?.length === 0 ? (
              <p className="text-purple-200">No students assigned yet.</p>
            ) : (
              <div className="space-y-4">
                {mentorResponse?.data?.mentor?.currentStudents.map((student) => (
                  <motion.div
                    key={student._id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30 cursor-pointer"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <h3 className="text-white font-medium">{student.name}</h3>
                    <p className="text-purple-200 text-sm">{student.fieldOfStudy}</p>
                    <p className="text-purple-300 text-xs mt-1">{student.email}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {student.degree && (
                        <span className="px-2 py-1 bg-purple-500/20 rounded-full text-xs text-purple-200">
                          {student.degree}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Student Details & Feedback */}
          {selectedStudent && (
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Student Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-purple-200 text-sm">Name</h3>
                  <p className="text-white">{selectedStudent.name}</p>
                </div>
                <div>
                  <h3 className="text-purple-200 text-sm">Internship</h3>
                  <p className="text-white">{selectedStudent.internshipTitle}</p>
                </div>
                <div>
                  <h3 className="text-purple-200 text-sm">Progress</h3>
                  <div className="w-full bg-purple-900/30 rounded-full h-2 mt-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${selectedStudent.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Feedback Form */}
                <div className="mt-6">
                  <h3 className="text-purple-200 text-sm mb-2">Provide Feedback</h3>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full bg-black/30 border border-purple-500/30 rounded-lg p-3 text-white 
                      focus:outline-none focus:border-purple-500/60 resize-none h-32"
                    placeholder="Enter your feedback here..."
                  ></textarea>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleFeedbackSubmit(selectedStudent._id)}
                    className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg 
                      transition-colors duration-200"
                  >
                    Submit Feedback
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;