import React, { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';
import DataTable from './DataTable';
import axios from 'axios';

const StudentFeedback = () => {
  const { sendFeedback } = useWebSocket();
  const [students, setStudents] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [rating, setRating] = useState(0);

  // Fetch students from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/student-profiles');
        if (response.data && response.data.data) {
          const studentData = response.data.data.map(student => ({
            id: student._id,
            name: student.name,
            email: student.email,
            degree: student.degree,
            fieldOfStudy: student.fieldOfStudy
          }));
          setStudents(studentData);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudents([]);
      }
    };

    fetchStudents();
  }, []);

  const handleSubmitFeedback = () => {
    if (!selectedStudent || !feedback) return;

    const feedbackData = {
      studentId: selectedStudent,
      feedback,
      rating,
      timestamp: new Date().toISOString()
    };

    // Send via WebSocket
    sendFeedback(feedbackData);

    // Reset form
    setFeedback('');
    setRating(0);
    setSelectedStudent(null);

    alert('Feedback submitted successfully!');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Student Feedback & Evaluation</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Select Student</h3>
            <DataTable
              columns={[
                { Header: 'Name', accessor: 'name' },
                { Header: 'Email', accessor: 'email' },
                { Header: 'Degree', accessor: 'degree' },
                { Header: 'Field', accessor: 'fieldOfStudy' },
                {
                  Header: 'Action',
                  accessor: 'id',
                  Cell: ({ value }) => (
                    <button
                      onClick={() => setSelectedStudent(value)}
                      className={`px-3 py-1 rounded ${
                        selectedStudent === value 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {selectedStudent === value ? 'Selected' : 'Select'}
                    </button>
                  )
                }
              ]}
              data={students}
              pagination
              searchable
            />
          </div>
          
          {selectedStudent && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Provide Feedback</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-2xl focus:outline-none"
                    >
                      {star <= rating ? '⭐' : '☆'}
                    </button>
                  ))}
                  <span className="ml-2 text-gray-500">{rating}/5</span>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter your feedback for the student..."
                ></textarea>
              </div>
              
              <button
                onClick={handleSubmitFeedback}
                disabled={!feedback}
                className={`px-4 py-2 rounded-md ${
                  feedback 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Feedback
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentFeedback;