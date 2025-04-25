import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import axios from 'axios';

const StudentFeedback = () => {
  const { socket, messages = [], sendMessage, registerUser } = useWebSocket() || {};
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  
  // Update faculty email to match your backend
  const FACULTY_EMAIL = 'faculty@gmail.com';

  // Register faculty user and fetch students on component mount
  useEffect(() => {
    if (registerUser) {
      registerUser(FACULTY_EMAIL);
      console.log('Faculty registered with email:', FACULTY_EMAIL);
    }

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/student-profiles');
        if (response.data && response.data.data) {
          const formattedStudents = response.data.data.map(student => ({
            ...student,
            id: student._id || Math.random().toString(36).substr(2, 9)
          }));
          setStudents(formattedStudents);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [registerUser]);

  // Update message receiving logic
  useEffect(() => {
    if (socket) {
      socket.on('receive_message', async (message) => {
        console.log('Received message:', message);
        
        // Only update UI if message is relevant to current conversation
        if (selectedStudent && 
            ((message.senderId === selectedStudent.email && message.recipientId === FACULTY_EMAIL) ||
             (message.senderId === FACULTY_EMAIL && message.recipientId === selectedStudent.email))) {
          setChatMessages(prevMessages => {
            // Avoid duplicate messages
            const isDuplicate = prevMessages.some(msg => 
              msg._id === message._id || 
              (msg.timestamp === message.timestamp && msg.message === message.message)
            );
            return isDuplicate ? prevMessages : [...prevMessages, message];
          });
        }
      });

      socket.on('message_sent_confirmation', (data) => {
        console.log('Message sent confirmation:', data);
      });

      return () => {
        socket.off('receive_message');
        socket.off('message_sent_confirmation');
      };
    }
  }, [socket, selectedStudent, FACULTY_EMAIL]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleStudentSelect = async (student) => {
    console.log('Selecting student:', student);
    setSelectedStudent(student);
    setLoading(true);
    
    try {
      // Use the correct endpoint for fetching messages
      const response = await axios.get(`http://localhost:5001/api/messages/${student.email}/${FACULTY_EMAIL}`);
      
      if (response.data) {
        console.log('Fetched messages:', response.data);
        // Sort messages by timestamp
        const sortedMessages = response.data.sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        );
        setChatMessages(sortedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setChatMessages([]); // Reset messages on error
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedStudent || !sendMessage) return;

    // Create message data with content field instead of message
    const messageData = {
      content: newMessage,
      sender: {
        id: FACULTY_EMAIL,
        name: 'Faculty',
        role: 'faculty'
      },
      recipient: {
        id: selectedStudent.email,
        name: selectedStudent.name,
        role: 'student'
      },
      senderId: FACULTY_EMAIL,
      senderName: 'Faculty',
      senderRole: 'faculty',
      recipientId: selectedStudent.email,
      recipientName: selectedStudent.name,
      timestamp: new Date().toISOString()
    };

    try {
      // Store in database
      const response = await axios.post('http://localhost:5001/api/messages', messageData);

      if (response.data) {
        console.log('Message stored in database:', response.data);
        
        // Send through WebSocket for real-time update
        sendMessage({
          ...messageData,
          _id: response.data._id
        });

        // Update local chat messages with the stored message
        setChatMessages(prevMessages => [...prevMessages, response.data]);
        
        // Clear input
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error details:', error.response?.data);
      console.error('Full error:', error);
      
      // Show user-friendly error message
      if (error.response?.status === 400) {
        alert('Invalid message format. Please try again.');
      } else if (error.response?.status === 401) {
        alert('Not authorized to send messages. Please log in again.');
      } else {
        alert('Failed to send message. Please try again later.');
      }
    }
  };

  if (loading && !selectedStudent) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#0f0c29] to-[#302b63]">
        <div className="animate-spin h-8 w-8 border-4 border-[#6a11cb] rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gradient-to-b from-[#0f0c29] to-[#302b63] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Student Feedback & Review</h2>
        
        {/* Student Selection Table */}
        <div className="bg-[#1f1b3a] rounded-lg shadow-lg p-4 md:p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-300">Select Student</h3>
          
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-[#3a295d]">
              <thead className="bg-[#2e1a47]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Degree</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-[#1f1b3a] divide-y divide-[#3a295d]">
                {students.map((student) => (
                  <tr key={student._id || student.id} className="hover:bg-[#2e1a47] transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{student.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 hidden sm:table-cell">{student.email}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{student.degree}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleStudentSelect(student)}
                        className={`px-3 py-1 md:px-4 md:py-2 rounded-md transition-colors ${
                          selectedStudent?._id === student._id
                            ? 'bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white'
                            : 'bg-[#3a295d] text-gray-200 hover:bg-[#4a396d]'
                        }`}
                      >
                        {selectedStudent?._id === student._id ? 'Selected' : 'Select'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chat Section */}
        {selectedStudent && (
          <div className="bg-[#1f1b3a] rounded-lg shadow-lg p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-300 mb-2 md:mb-0">
                Chat with {selectedStudent.name}
              </h3>
              <div className="text-sm text-gray-400">
                <span className="font-medium text-purple-300">Degree:</span> {selectedStudent.degree} |{' '}
                <span className="font-medium text-purple-300 hidden md:inline">Field:</span> {selectedStudent.fieldOfStudy}
              </div>
            </div>
            
            {/* Chat Messages */}
            <div 
              ref={chatContainerRef} 
              className="h-[300px] md:h-[400px] overflow-y-auto mb-4 p-4 rounded-lg bg-[#0f0c29] border border-[#3a295d]"
            >
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin h-6 w-6 border-2 border-[#6a11cb] rounded-full border-t-transparent"></div>
                </div>
              ) : chatMessages.length > 0 ? (
                chatMessages.map((msg, index) => (
                  <div
                    key={msg._id || `${msg.timestamp}-${index}`}
                    className={`mb-3 ${msg.senderId === FACULTY_EMAIL ? 'ml-auto text-right' : ''}`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg max-w-[80%] md:max-w-[70%] ${
                        msg.senderId === FACULTY_EMAIL
                          ? 'bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white' 
                          : 'bg-[#3a295d] text-gray-200'
                      }`}
                    >
                      <p className="text-sm font-semibold mb-1">
                        {msg.senderId === FACULTY_EMAIL ? 'You' : msg.senderName}
                      </p>
                      <p className="break-words">{msg.content || msg.message}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center h-full text-gray-400">
                  No messages yet. Start the conversation!
                </div>
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 p-3 rounded-lg bg-[#0f0c29] text-white border border-[#3a295d] focus:outline-none focus:ring-2 focus:ring-[#6a11cb] focus:border-transparent placeholder-gray-500"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 py-3 bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span className="hidden md:inline">Send</span>
                <span className="md:hidden">→</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentFeedback;