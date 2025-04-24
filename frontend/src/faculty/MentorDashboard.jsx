import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useWebSocket } from '../context/WebSocketContext';

const MentorDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [mentorResponse, setMentorResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { sendMessage, registerUser } = useWebSocket();
  const [studentInternships, setStudentInternships] = useState([]);
  const [studentStats, setStudentStats] = useState(null);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'profile'

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

  useEffect(() => {
    const registerMentor = async () => {
      if (user?.email && registerUser) {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Give socket time to connect
          registerUser(user.email, 'mentor');
        } catch (error) {
          console.error('Error registering mentor:', error);
        }
      }
    };

    registerMentor();
  }, [user?.email, registerUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedStudent || !user?.email) return;

      try {
        const response = await axios.get(
          `http://localhost:5001/api/messages/${user.email}/${selectedStudent.email}`,
          { withCredentials: true }
        );
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [selectedStudent, user?.email]);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!selectedStudent?.email) return;

      try {
        // Fetch student's internships
        const internshipsResponse = await axios.get(
          `http://localhost:5001/api/applications/student/${selectedStudent.email}`,
          { withCredentials: true }
        );
        setStudentInternships(internshipsResponse.data);

        // Fetch student's stats
        const statsResponse = await axios.get(
          `http://localhost:5001/api/student-profile/stats/${selectedStudent.email}`,
          { withCredentials: true }
        );
        setStudentStats(statsResponse.data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, [selectedStudent]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedStudent) return;

    try {
      // Send message through WebSocket
      sendMessage(selectedStudent.email, newMessage, {
        type: 'message',
        senderRole: 'mentor',
        senderName: mentorResponse?.data?.mentor?.name || 'Mentor',
        senderEmail: user.email,
        timestamp: new Date()
      });

      // Store message in database
      await axios.post('http://localhost:5001/api/messages', {
        senderId: user.email,
        recipientId: selectedStudent.email,
        content: newMessage,
        messageType: 'message'
      }, { withCredentials: true });

      setNewMessage('');
      
      // Add message to UI immediately
      setMessages(prev => [...prev, {
        senderId: user.email,
        content: newMessage,
        timestamp: new Date()
      }]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-black flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent mx-auto mb-4"></div>
          <p className="text-purple-200 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Mentor Dashboard</h1>
            {mentorResponse?.data?.mentor && (
              <p className="text-purple-300">
                Welcome back, {mentorResponse.data.mentor.name}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate('/faculty/profile')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-purple-800/40 hover:bg-purple-800/60 border border-purple-500/30 
                rounded-lg text-purple-200 hover:text-white transition-all duration-200 flex items-center"
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
              Profile
            </motion.button>
            
          <motion.button
              onClick={logout}
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
        </header>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6 flex items-center"
          >
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Profile and Students */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mentor Profile Card */}
          {mentorResponse?.data?.mentor && (
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-purple-500/20 shadow-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-purple-600/30 flex items-center justify-center text-white text-2xl font-bold border-2 border-purple-500/50">
                    {mentorResponse.data.mentor.name.charAt(0)}
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-white">{mentorResponse.data.mentor.name}</h2>
                    <p className="text-purple-300 text-sm">{mentorResponse.data.mentor.department}</p>
                  </div>
                </div>
                
                <div className="space-y-3 pt-3 border-t border-purple-500/20">
                  <div className="flex justify-between">
                    <span className="text-purple-300 text-sm">Email</span>
                    <span className="text-white text-sm font-medium">{user.email}</span>
                </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300 text-sm">Expertise</span>
                    <span className="text-white text-sm font-medium">{mentorResponse.data.mentor.expertise}</span>
              </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300 text-sm">Students</span>
                    <span className="text-white text-sm font-medium">{mentorResponse.data.mentor.currentStudents?.length || 0}</span>
                </div>
              </div>
            </div>
          )}

            {/* Students List */}
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-purple-500/20 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Students</h2>
                <span className="bg-purple-600/30 text-purple-200 text-xs px-2 py-1 rounded-full">
                  {mentorResponse?.data?.mentor?.currentStudents?.length || 0} Total
                </span>
        </div>

            {mentorResponse?.data?.mentor?.currentStudents?.length === 0 ? (
                <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/20 text-center">
              <p className="text-purple-200">No students assigned yet.</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
                {mentorResponse?.data?.mentor?.currentStudents.map((student) => (
                  <motion.div
                    key={student._id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedStudent?.email === student.email
                          ? 'bg-purple-600/30 border-purple-500/50'
                          : 'bg-purple-900/20 border-purple-500/20 hover:bg-purple-800/30'
                      }`}
                    onClick={() => setSelectedStudent(student)}
                  >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-white text-sm font-bold border border-purple-500/30">
                          {student.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium truncate">{student.name}</h3>
                          <p className="text-purple-300 text-xs truncate">{student.email}</p>
                        </div>
                      </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {student.degree && (
                          <span className="px-2 py-0.5 bg-purple-500/20 rounded-full text-xs text-purple-200">
                          {student.degree}
                        </span>
                      )}
                        {student.fieldOfStudy && (
                          <span className="px-2 py-0.5 bg-indigo-500/20 rounded-full text-xs text-indigo-200">
                            {student.fieldOfStudy}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            </div>
          </div>

          {/* Right Column - Chat/Profile Area */}
          <div className="lg:col-span-3">
            {!selectedStudent ? (
              <div className="bg-white/5 backdrop-blur-md h-full rounded-xl border border-purple-500/20 shadow-lg flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Student Selected</h3>
                  <p className="text-purple-300 max-w-md mx-auto">
                    Select a student from the list to view their profile and start a conversation.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-md rounded-xl border border-purple-500/20 shadow-lg flex flex-col h-[700px]">
                {/* Header with Tabs */}
                <div className="p-4 border-b border-purple-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-white font-bold border border-purple-500/30">
                        {selectedStudent.name.charAt(0)}
                </div>
                <div>
                        <h3 className="text-white font-medium">{selectedStudent.name}</h3>
                        <p className="text-purple-300 text-xs">{selectedStudent.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-purple-500/20 rounded-full text-xs text-purple-200">
                        {selectedStudent.degree || 'No Degree'}
                      </span>
                      <span className="px-2 py-1 bg-indigo-500/20 rounded-full text-xs text-indigo-200">
                        {selectedStudent.fieldOfStudy || 'No Field'}
                      </span>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-4 border-b border-purple-500/20">
                    <button
                      onClick={() => setActiveTab('chat')}
                      className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                        activeTab === 'chat' 
                          ? 'text-purple-300' 
                          : 'text-purple-400 hover:text-purple-300'
                      }`}
                    >
                      Chat
                      {activeTab === 'chat' && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                        />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                        activeTab === 'profile' 
                          ? 'text-purple-300' 
                          : 'text-purple-400 hover:text-purple-300'
                      }`}
                    >
                      Profile & Stats
                      {activeTab === 'profile' && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto">
                  {activeTab === 'chat' ? (
                    // Existing Chat Content
                    <div className="flex-1 overflow-y-auto bg-black/10 p-4 space-y-4">
                      {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center p-6 bg-purple-900/20 rounded-lg border border-purple-500/20 max-w-md">
                            <svg className="w-12 h-12 text-purple-400 mx-auto mb-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <h4 className="text-lg font-medium text-white mb-2">No messages yet</h4>
                            <p className="text-purple-300 text-sm">
                              Start the conversation with {selectedStudent.name} by sending a message below.
                            </p>
                          </div>
                        </div>
                      ) : (
                        messages.map((msg, index) => {
                          const isMentor = msg.senderId === user.email;
                          const showDate = index === 0 || new Date(msg.timestamp).toDateString() !== new Date(messages[index-1].timestamp).toDateString();
                          
                          return (
                            <React.Fragment key={index}>
                              {showDate && (
                                <div className="flex justify-center my-4">
                                  <span className="text-xs text-purple-300 bg-purple-900/30 px-3 py-1 rounded-full">
                                    {new Date(msg.timestamp).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                              
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${isMentor ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-[75%] p-3 rounded-2xl ${
                                    isMentor
                                      ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white'
                                      : 'bg-white/10 backdrop-blur-sm text-white border border-purple-500/20'
                                  }`}
                                >
                                  <p className="text-sm break-words">{msg.content}</p>
                                  <p className={`text-xs mt-1 text-right ${isMentor ? 'text-purple-200' : 'text-purple-300'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </p>
                                </div>
                              </motion.div>
                            </React.Fragment>
                          );
                        })
                      )}
                    </div>
                  ) : (
                    // New Profile & Stats Content
                    <div className="p-6 space-y-6">
                      {/* Student Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                          <h4 className="text-purple-300 text-sm font-medium mb-1">Applications</h4>
                          <p className="text-2xl font-bold text-white">
                            {studentInternships.length}
                          </p>
                        </div>
                        <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                          <h4 className="text-purple-300 text-sm font-medium mb-1">Accepted</h4>
                          <p className="text-2xl font-bold text-white">
                            {studentInternships.filter(app => app.status === 'Accepted').length}
                          </p>
                        </div>
                        <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                          <h4 className="text-purple-300 text-sm font-medium mb-1">Success Rate</h4>
                          <p className="text-2xl font-bold text-white">
                            {studentInternships.length > 0
                              ? Math.round((studentInternships.filter(app => app.status === 'Accepted').length / studentInternships.length) * 100)
                              : 0}%
                          </p>
                        </div>
                      </div>

                      {/* Internship History */}
                      <div className="bg-purple-900/20 rounded-lg border border-purple-500/30">
                        <div className="p-4 border-b border-purple-500/30">
                          <h3 className="text-lg font-semibold text-white">Internship History</h3>
                        </div>
                        <div className="p-4">
                          {studentInternships.length === 0 ? (
                            <p className="text-purple-300 text-center py-4">No internship applications yet</p>
                          ) : (
                            <div className="space-y-4">
                              {studentInternships.map((internship, index) => (
                                <div 
                                  key={index}
                                  className="bg-black/20 p-4 rounded-lg border border-purple-500/20"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h4 className="text-white font-medium">{internship.internshipTitle}</h4>
                                      <p className="text-purple-300 text-sm">{internship.company}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      internship.status === 'Accepted' 
                                        ? 'bg-green-500/20 text-green-300'
                                        : internship.status === 'Rejected'
                                        ? 'bg-red-500/20 text-red-300'
                                        : 'bg-yellow-500/20 text-yellow-300'
                                    }`}>
                                      {internship.status}
                                    </span>
                                  </div>
                                  <div className="text-xs text-purple-400">
                                    Applied: {new Date(internship.appliedDate).toLocaleDateString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Additional Stats */}
                      {studentStats && (
                        <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                          <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-purple-300 text-sm font-medium mb-1">Average Response Time</h4>
                              <p className="text-white">
                                {studentStats.avgResponseTime || 'N/A'} days
                              </p>
                            </div>
                            <div>
                              <h4 className="text-purple-300 text-sm font-medium mb-1">Interview Success Rate</h4>
                              <p className="text-white">
                                {studentStats.interviewSuccessRate || 'N/A'}%
                              </p>
                </div>
              </div>
            </div>
          )}
                    </div>
                  )}
                </div>

                {/* Keep the message input form only for chat tab */}
                {activeTab === 'chat' && (
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-purple-500/20 bg-black/20">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-full bg-white/5 border border-purple-400/30 
                                 text-white placeholder:text-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30"
                        placeholder={`Message ${selectedStudent.name}...`}
                      />
                      <motion.button
                        type="submit"
                        disabled={!newMessage.trim()}
                        whileHover={newMessage.trim() ? { scale: 1.05 } : {}}
                        whileTap={newMessage.trim() ? { scale: 0.95 } : {}}
                        className={`p-3 rounded-full transition-all duration-200 flex items-center justify-center
                          ${newMessage.trim() 
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-700/20' 
                            : 'bg-purple-600/50 cursor-not-allowed text-white/50'}`}
                      >
                        <svg 
                          className="w-6 h-6" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                          />
                        </svg>
                      </motion.button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;