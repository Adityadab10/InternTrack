import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SDGPOEMapping = () => {
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Comprehensive SDGs list
  const allSdgs = [
    { id: 1, name: 'No Poverty' },
    { id: 2, name: 'Zero Hunger' },
    { id: 3, name: 'Good Health and Well-being' },
    { id: 4, name: 'Quality Education' },
    { id: 5, name: 'Gender Equality' },
    { id: 6, name: 'Clean Water and Sanitation' },
    { id: 7, name: 'Affordable and Clean Energy' },
    { id: 8, name: 'Decent Work and Economic Growth' },
    { id: 9, name: 'Industry, Innovation and Infrastructure' },
    { id: 10, name: 'Reduced Inequalities' },
    { id: 11, name: 'Sustainable Cities and Communities' },
    { id: 12, name: 'Responsible Consumption and Production' },
    { id: 13, name: 'Climate Action' },
    { id: 14, name: 'Life Below Water' },
    { id: 15, name: 'Life on Land' },
    { id: 16, name: 'Peace, Justice and Strong Institutions' },
    { id: 17, name: 'Partnerships for the Goals' }
  ];

  const allPos = [
    { id: 1, name: 'Engineering Knowledge' },
    { id: 2, name: 'Problem Analysis' },
    { id: 3, name: 'Design/Development Solutions' },
    { id: 4, name: 'Investigation' },
    { id: 5, name: 'Modern Tool Usage' },
    { id: 6, name: 'Engineer and Society' },
    { id: 7, name: 'Environment and Sustainability' },
    { id: 8, name: 'Ethics' },
    { id: 9, name: 'Individual and Team Work' },
    { id: 10, name: 'Communication' },
    { id: 11, name: 'Project Management' },
    { id: 12, name: 'Lifelong Learning' }
  ];

  const allPeos = [
    { id: 1, name: 'Technical Expertise' },
    { id: 2, name: 'Professional Skills' },
    { id: 3, name: 'Research and Innovation' },
    { id: 4, name: 'Leadership and Management' },
    { id: 5, name: 'Ethical and Social Responsibility' }
  ];

  // Function to generate random mappings
  const generateRandomMappings = (student) => {
    // Generate 2-4 random SDGs
    const numSdgs = Math.floor(Math.random() * 3) + 2;
    const sdgs = Array.from({ length: numSdgs }, () => 
      allSdgs[Math.floor(Math.random() * allSdgs.length)].id
    );

    // Generate 2-3 random POs
    const numPos = Math.floor(Math.random() * 2) + 2;
    const pos = Array.from({ length: numPos }, () => 
      allPos[Math.floor(Math.random() * allPos.length)].id
    );

    // Generate 1-2 random PEOs
    const numPeos = Math.floor(Math.random() * 2) + 1;
    const peos = Array.from({ length: numPeos }, () => 
      allPeos[Math.floor(Math.random() * allPeos.length)].id
    );

    return {
      id: student._id,
      student: student.name,
      degree: student.degree,
      fieldOfStudy: student.fieldOfStudy,
      sdgs: [...new Set(sdgs)], // Remove duplicates
      pos: [...new Set(pos)],   // Remove duplicates
      peos: [...new Set(peos)]  // Remove duplicates
    };
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/student-profiles');
        
        if (!response.data.success) {
          throw new Error('Failed to fetch student profiles');
        }

        // Generate mappings for each student
        const studentMappings = response.data.data.map(student => 
          generateRandomMappings(student)
        );

        setMappings(studentMappings);
        setError(null);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load student data');
        // Set dummy data in case of error
        setMappings([
          generateRandomMappings({
            _id: '1',
            name: 'Sample Student',
            degree: 'B.Tech',
            fieldOfStudy: 'Computer Science'
          })
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">SDG/PO/PEO Mapping</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Degree</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field of Study</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SDGs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">POs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PEOs</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mappings.map(mapping => (
              <tr key={mapping.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{mapping.student}</td>
                <td className="px-6 py-4 whitespace-nowrap">{mapping.degree}</td>
                <td className="px-6 py-4 whitespace-nowrap">{mapping.fieldOfStudy}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {mapping.sdgs.map(sdgId => {
                      const sdg = allSdgs.find(s => s.id === sdgId);
                      return (
                        <span key={sdgId} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          SDG {sdgId}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {mapping.pos.map(poId => {
                      const po = allPos.find(p => p.id === poId);
                      return (
                        <span key={poId} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          PO {poId}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {mapping.peos.map(peoId => {
                      const peo = allPeos.find(p => p.id === peoId);
                      return (
                        <span key={peoId} className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                          PEO {peoId}
                        </span>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SDGPOEMapping;