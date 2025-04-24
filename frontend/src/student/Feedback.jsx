import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Feedback = () => {
  const { user } = useAuth();
  const [facultyMessages, setFacultyMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const FACULTY_EMAIL = 'faculty@gmail.com';

  useEffect(() => {
    fetchFacultyMessages();
  }, [user]);

  const fetchFacultyMessages = async () => {
    try {
      // Get messages where faculty is the sender and current user is the recipient
      const response = await axios.get(`http://localhost:5001/api/messages/${FACULTY_EMAIL}/${user.email}`);
      if (response.data) {
        // Sort messages by timestamp in descending order (newest first)
        const sortedMessages = response.data.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        setFacultyMessages(sortedMessages);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching faculty messages:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Faculty Messages Section */}
      <div className="bg-black/50 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-purple-300 mb-6">Messages from Course Instructor</h2>
        
        {facultyMessages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No messages from faculty yet</p>
            <p className="text-sm mt-2 text-purple-400">Messages from your course instructor will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {facultyMessages.map((message, index) => (
              <div
                key={message._id || index}
                className="bg-indigo-900/30 rounded-lg p-4 border border-indigo-500/20 hover:border-indigo-500/40 transition-colors duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center">
                      <span className="text-xl">👨‍🏫</span>
                    </div>
                    <div>
                      <span className="text-indigo-300 font-semibold block">
                        Course Instructor
                      </span>
                      <span className="text-sm text-gray-400">
                        {new Date(message.timestamp).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-indigo-900/50 text-indigo-200 rounded-full text-sm">
                    Feedback
                  </span>
                </div>
                <div className="ml-13 pl-13">
                  <p className="text-gray-300 mt-2 pl-13 ml-13 whitespace-pre-wrap">
                    {message.content || message.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback; 