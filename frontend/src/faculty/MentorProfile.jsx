import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const MentorProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeChats: 0,
    averageResponseTime: '0',
    studentSuccessRate: '0'
  });

  useEffect(() => {
    const fetchMentorProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/mentors/details/${user.email}`,
          { withCredentials: true }
        );

        if (response.data.mentor) {
          setMentorData(response.data.mentor);
          // Calculate stats
          setStats({
            totalStudents: response.data.mentor.currentStudents?.length || 0,
            activeChats: response.data.mentor.currentStudents?.filter(s => s.hasActiveChat)?.length || 0,
            averageResponseTime: '24', // You can fetch this from backend
            studentSuccessRate: '75' // You can fetch this from backend
          });
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching mentor profile:', err);
        setError('Failed to load mentor profile');
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchMentorProfile();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-black flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/faculty/mentor-dashboard')}
            className="text-purple-300 hover:text-purple-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          
          <motion.button
            onClick={logout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 
              rounded-lg text-red-300 hover:text-red-200 transition-all duration-200 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </motion.button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {mentorData && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-purple-500/20">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-4xl font-bold text-white border-4 border-purple-500/30">
                  {mentorData.name[0]}
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold text-white mb-2">{mentorData.name}</h1>
                  <p className="text-purple-300 text-lg">{mentorData.department}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-500/20 rounded-full text-sm text-purple-200">
                      {mentorData.expertise}
                    </span>
                    <span className="px-3 py-1 bg-indigo-500/20 rounded-full text-sm text-indigo-200">
                      {mentorData.department}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-purple-500/20">
                <h3 className="text-purple-300 text-sm mb-1">Total Students</h3>
                <p className="text-3xl font-bold text-white">{stats.totalStudents}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-purple-500/20">
                <h3 className="text-purple-300 text-sm mb-1">Active Chats</h3>
                <p className="text-3xl font-bold text-white">{stats.activeChats}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-purple-500/20">
                <h3 className="text-purple-300 text-sm mb-1">Avg. Response Time</h3>
                <p className="text-3xl font-bold text-white">{stats.averageResponseTime}h</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-purple-500/20">
                <h3 className="text-purple-300 text-sm mb-1">Student Success Rate</h3>
                <p className="text-3xl font-bold text-white">{stats.studentSuccessRate}%</p>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-purple-500/20">
                <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-purple-300 text-sm">Email</h3>
                    <p className="text-white">{mentorData.email}</p>
                  </div>
                  <div>
                    <h3 className="text-purple-300 text-sm">Department</h3>
                    <p className="text-white">{mentorData.department}</p>
                  </div>
                  <div>
                    <h3 className="text-purple-300 text-sm">Office Location</h3>
                    <p className="text-white">{mentorData.officeLocation || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Expertise & Skills */}
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-purple-500/20">
                <h2 className="text-xl font-semibold text-white mb-4">Expertise & Skills</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-purple-300 text-sm">Primary Expertise</h3>
                    <p className="text-white">{mentorData.expertise}</p>
                  </div>
                  <div>
                    <h3 className="text-purple-300 text-sm">Areas of Interest</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {mentorData.areasOfInterest?.map((area, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-500/20 rounded-full text-sm text-purple-200">
                          {area}
                        </span>
                      )) || 'Not specified'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Students List */}
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-purple-500/20">
              <h2 className="text-xl font-semibold text-white mb-4">Current Students</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mentorData.currentStudents?.map((student) => (
                  <div key={student._id} className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-white font-bold">
                        {student.name[0]}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{student.name}</h3>
                        <p className="text-purple-300 text-sm">{student.email}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs text-purple-200">{student.fieldOfStudy}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorProfile; 