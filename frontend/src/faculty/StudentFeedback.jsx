import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import axios from 'axios';

const StudentFeedback = () => {
  const { socket, messages = [], sendMessage, registerUser } = useWebSocket() || {};
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
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
        const response = await axios.get('http://localhost:5001/api/student-profiles');
        if (response.data && response.data.data) {
          const formattedStudents = response.data.data.map(student => ({
            ...student,
            id: student._id || Math.random().toString(36).substr(2, 9)
          }));
          console.log('Formatted students:', formattedStudents);
          setStudents(formattedStudents);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
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
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedStudent || !sendMessage) return;

    // Create message data with content field instead of message
    const messageData = {
      content: newMessage, // Changed from message to content
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

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-white">Student Feedback & Review</h2>
      
      {/* Student Selection Table */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-300">Select Student</h3>
        
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Degree</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {students.map((student) => (
                <tr key={student._id || student.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{student.degree}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleStudentSelect(student)}
                      className={`px-4 py-2 rounded-md transition-colors ${
                        selectedStudent?._id === student._id
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
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
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-purple-300">
              Chat with {selectedStudent.name}
            </h3>
            <div className="text-sm text-gray-400">
              <span className="font-medium text-purple-300">Degree:</span> {selectedStudent.degree} |{' '}
              <span className="font-medium text-purple-300">Field:</span> {selectedStudent.fieldOfStudy}
            </div>
          </div>
          
          {/* Chat Messages */}
          <div 
            ref={chatContainerRef} 
            className="h-[400px] overflow-y-auto mb-4 p-4 rounded-lg bg-gray-900 border border-gray-700"
          >
            {chatMessages.map((msg, index) => (
              <div
                key={msg._id || `${msg.timestamp}-${index}`}
                className={`mb-3 ${msg.senderId === FACULTY_EMAIL ? 'ml-auto text-right' : ''}`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-[70%] ${
                    msg.senderId === FACULTY_EMAIL
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-200'
                  }`}
                >
                  <p className="text-sm font-semibold mb-1">
                    {msg.senderId === FACULTY_EMAIL ? 'You' : msg.senderName}
                  </p>
                  <p className="break-words">{msg.content || msg.message}</p> {/* Handle both content and message fields */}
                  <p className="text-xs mt-1 opacity-75">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudentFeedback;