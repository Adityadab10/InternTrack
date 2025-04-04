import React, { useState } from 'react';
import StatusBadge from './StatusBadge';

const ProgressMonitoring = () => {
  const [expandedStudent, setExpandedStudent] = useState(null);

  // Mock data
  const students = [
    {
      id: 1,
      name: 'John Doe',
      company: 'Tech Corp',
      status: 'ongoing',
      milestones: [
        { id: 1, name: 'Orientation', dueDate: '2023-06-05', completed: true, completionDate: '2023-06-04' },
        { id: 2, name: 'Project Proposal', dueDate: '2023-06-15', completed: true, completionDate: '2023-06-12' },
        { id: 3, name: 'Mid-term Report', dueDate: '2023-07-15', completed: false },
        { id: 4, name: 'Final Presentation', dueDate: '2023-08-25', completed: false },
      ],
      lastUpdate: '2023-06-12'
    },
    {
      id: 2,
      name: 'Jane Smith',
      company: 'Data Systems',
      status: 'ongoing',
      milestones: [
        { id: 1, name: 'Orientation', dueDate: '2023-05-20', completed: true, completionDate: '2023-05-18' },
        { id: 2, name: 'Project Proposal', dueDate: '2023-06-01', completed: true, completionDate: '2023-05-28' },
        { id: 3, name: 'Mid-term Report', dueDate: '2023-07-01', completed: true, completionDate: '2023-06-28' },
        { id: 4, name: 'Final Presentation', dueDate: '2023-08-10', completed: false },
      ],
      lastUpdate: '2023-06-28'
    },
  ];

  const toggleExpand = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Internship Progress Monitoring</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {students.map(student => (
          <div key={student.id} className="border-b border-gray-200 last:border-b-0">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={() => toggleExpand(student.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">{student.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-medium">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.company}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <StatusBadge status={student.status} />
                <span className="text-sm text-gray-500">Last update: {student.lastUpdate}</span>
                <span className="text-gray-400">
                  {expandedStudent === student.id ? '▲' : '▼'}
                </span>
              </div>
            </div>
            
            {expandedStudent === student.id && (
              <div className="p-4 bg-gray-50">
                <h4 className="font-medium mb-3">Milestones</h4>
                <div className="space-y-3">
                  {student.milestones.map(milestone => (
                    <div key={milestone.id} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                      <div>
                        <p className="font-medium">{milestone.name}</p>
                        <p className="text-sm text-gray-500">Due: {milestone.dueDate}</p>
                      </div>
                      <div>
                        {milestone.completed ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Completed on {milestone.completionDate}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium mb-2">Send Message</h4>
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="Type your message..." 
                      className="flex-1 p-2 border border-gray-300 rounded-md"
                    />
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressMonitoring;