import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CourseInstructorDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignedCourses();
  }, []);

  const fetchAssignedCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/instructor/courses', {
        withCredentials: true
      });
      setCourses(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch assigned courses');
      setLoading(false);
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
          <h1 className="text-3xl font-bold text-white">Course Instructor Dashboard</h1>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <motion.div
              key={course._id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-purple-500/30"
            >
              <h2 className="text-xl font-semibold text-white mb-2">{course.name}</h2>
              <p className="text-purple-200 mb-4">{course.code}</p>
              <div className="space-y-2">
                <p className="text-purple-300 text-sm">Students: {course.studentCount}</p>
                <p className="text-purple-300 text-sm">Semester: {course.semester}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseInstructorDashboard;