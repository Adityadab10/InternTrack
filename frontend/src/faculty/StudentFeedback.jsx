import React, { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';
import DataTable from './DataTable';

const StudentFeedback = () => {
  const { sendFeedback, notifications } = useWebSocket();
  const [students, setStudents] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [rating, setRating] = useState(0);
  const [sdgMapping, setSdgMapping] = useState([]);
  const [poMapping, setPoMapping] = useState([]);
  const [peoMapping, setPeoMapping] = useState([]);

  // Mock data - replace with API calls
  useEffect(() => {
    const fetchStudents = async () => {
      // Simulate API call
      const mockStudents = [
        { id: 1, name: 'John Doe', company: 'Tech Corp', department: 'CS' },
        { id: 2, name: 'Jane Smith', company: 'Data Systems', department: 'IT' },
      ];
      setStudents(mockStudents);
    };

    fetchStudents();
  }, []);

  const handleSubmitFeedback = () => {
    if (!selectedStudent || !feedback) return;

    const feedbackData = {
      studentId: selectedStudent,
      feedback,
      rating,
      sdgs: sdgMapping.filter(sdg => sdg.selected).map(sdg => sdg.id),
      pos: poMapping.filter(po => po.selected).map(po => po.id),
      peos: peoMapping.filter(peo => peo.selected).map(peo => peo.id),
      timestamp: new Date().toISOString()
    };

    // Send via WebSocket
    sendFeedback(feedbackData);

    // Reset form
    setFeedback('');
    setRating(0);
    setSelectedStudent(null);
    setSdgMapping(sdgMapping.map(sdg => ({ ...sdg, selected: false })));
    setPoMapping(poMapping.map(po => ({ ...po, selected: false })));
    setPeoMapping(peoMapping.map(peo => ({ ...peo, selected: false })));

    alert('Feedback submitted successfully!');
  };

  // Initialize SDG/PO/PEO mappings
  useEffect(() => {
    // These would normally come from an API
    setSdgMapping([
      { id: 1, name: 'SDG 1: No Poverty', selected: false },
      { id: 2, name: 'SDG 4: Quality Education', selected: false },
      { id: 3, name: 'SDG 8: Decent Work', selected: false },
      { id: 4, name: 'SDG 9: Industry Innovation', selected: false },
    ]);

    setPoMapping([
      { id: 1, name: 'PO1: Engineering Knowledge', selected: false },
      { id: 2, name: 'PO2: Problem Analysis', selected: false },
      { id: 3, name: 'PO3: Design/Development', selected: false },
    ]);

    setPeoMapping([
      { id: 1, name: 'PEO1: Technical Expertise', selected: false },
      { id: 2, name: 'PEO2: Professional Skills', selected: false },
    ]);
  }, []);

  const toggleSdgSelection = (id) => {
    setSdgMapping(sdgMapping.map(sdg => 
      sdg.id === id ? { ...sdg, selected: !sdg.selected } : sdg
    ));
  };

  const togglePoSelection = (id) => {
    setPoMapping(poMapping.map(po => 
      po.id === id ? { ...po, selected: !po.selected } : po
    ));
  };

  const togglePeoSelection = (id) => {
    setPeoMapping(peoMapping.map(peo => 
      peo.id === id ? { ...peo, selected: !peo.selected } : peo
    ));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Student Feedback & Evaluation</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Select Student</h3>
            <DataTable
              columns={[
                { Header: 'Name', accessor: 'name' },
                { Header: 'Company', accessor: 'company' },
                { Header: 'Department', accessor: 'department' },
                {
                  Header: 'Action',
                  accessor: 'id',
                  Cell: ({ value }) => (
                    <button
                      onClick={() => setSelectedStudent(value)}
                      className={`px-3 py-1 rounded ${selectedStudent === value ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
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
                className={`px-4 py-2 rounded-md ${feedback ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                Submit Feedback
              </button>
            </div>
          )}
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Map to SDGs</h3>
            <div className="space-y-2">
              {sdgMapping.map(sdg => (
                <div key={sdg.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sdg.selected}
                    onChange={() => toggleSdgSelection(sdg.id)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label className="ml-2 text-sm">{sdg.name}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Map to Program Outcomes (POs)</h3>
            <div className="space-y-2">
              {poMapping.map(po => (
                <div key={po.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={po.selected}
                    onChange={() => togglePoSelection(po.id)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label className="ml-2 text-sm">{po.name}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Map to Program Educational Objectives (PEOs)</h3>
            <div className="space-y-2">
              {peoMapping.map(peo => (
                <div key={peo.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={peo.selected}
                    onChange={() => togglePeoSelection(peo.id)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label className="ml-2 text-sm">{peo.name}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFeedback;