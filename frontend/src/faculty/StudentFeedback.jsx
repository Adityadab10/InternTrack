import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import DataTable from './DataTable';
import axios from 'axios';

const StudentFeedback = () => {
  const { messages = [], sendMessage, registerUser } = useWebSocket() || {};
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const facultyId = localStorage.getItem('userId');
    if (registerUser) {
      registerUser(facultyId, 'faculty');
    }

    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/student-profiles');
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

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStudentSelect = (student) => {
    console.log('Selecting student:', student); // Debug log
    setSelectedStudent(student);
  };

  // Create a custom render function for the action buttons
  const renderActionButton = (studentData) => {
    return (
      <button
        onClick={() => handleStudentSelect(studentData)}
        className={`px-4 py-2 text-sm font-medium rounded-md ${
          selectedStudent && selectedStudent._id === studentData._id
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {selectedStudent && selectedStudent._id === studentData._id ? 'Selected' : 'Select'}
      </button>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Student Feedback & Review</h2>
      
      {/* Student Selection Table */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Select Student</h3>
        
        {/* Manual table implementation instead of using DataTable component */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Degree</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student._id || student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.degree}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {renderActionButton(student)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chat Room Section */}
      {selectedStudent && selectedStudent._id && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Chat with {selectedStudent.name}
            </h3>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Degree:</span> {selectedStudent.degree} |{' '}
              <span className="font-medium">Field:</span> {selectedStudent.fieldOfStudy}
            </div>
          </div>
          
          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="h-[400px] overflow-y-auto mb-4 p-4 border rounded-lg bg-gray-50"
          >
            {messages
              .filter(msg => 
                msg.senderId === selectedStudent._id || 
                msg.recipientId === selectedStudent._id
              )
              .map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 ${
                    msg.senderId === localStorage.getItem('userId')
                      ? 'ml-auto text-right'
                      : ''
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg max-w-[70%] ${
                      msg.senderId === localStorage.getItem('userId')
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200'
                    }`}
                  >
                    <p className="text-sm font-semibold mb-1">{msg.senderName}</p>
                    <p className="break-words">{msg.message}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          {/* Message Input */}
          <form onSubmit={(e) => {
            e.preventDefault();
            if (newMessage.trim() && selectedStudent?._id) {
              sendMessage?.(selectedStudent._id, newMessage, 'Faculty');
              setNewMessage('');
            }
          }} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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