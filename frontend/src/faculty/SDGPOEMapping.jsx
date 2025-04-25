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
      <div className="flex justify-center items-center h-64 bg-gradient-to-b from-[#0f0c29] to-[#302b63]">
        <div className="animate-spin h-8 w-8 border-4 border-[#6a11cb] rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#0f0c29] to-[#302b63] min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">SDG/PO/PEO Mapping</h2>
        
        {error && (
          <div className="bg-[#1f1b3a] border border-[#3a295d] text-gray-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="bg-[#1f1b3a] rounded-lg shadow-lg p-4 md:p-6 overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-[#3a295d]">
                <thead className="bg-[#2e1a47]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">Degree</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell">Field of Study</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">SDGs</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">POs</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell">PEOs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3a295d]">
                  {mappings.map(mapping => (
                    <tr key={mapping.id} className="hover:bg-[#2e1a47] transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-white">
                        <div className="flex flex-col">
                          <span className="font-medium">{mapping.student}</span>
                          <span className="text-xs text-gray-300 sm:hidden">{mapping.degree}</span>
                          <span className="text-xs text-gray-300 md:hidden">{mapping.fieldOfStudy}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-300 hidden sm:table-cell">
                        {mapping.degree}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-300 hidden md:table-cell">
                        {mapping.fieldOfStudy}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {mapping.sdgs.map(sdgId => {
                            const sdg = allSdgs.find(s => s.id === sdgId);
                            return (
                              <span key={sdgId} className="inline-block bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white text-xs px-2 py-1 rounded-full">
                                SDG {sdgId}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {mapping.pos.map(poId => {
                            const po = allPos.find(p => p.id === poId);
                            return (
                              <span key={poId} className="inline-block bg-[#8e2de2] text-white text-xs px-2 py-1 rounded-full">
                                PO {poId}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {mapping.peos.map(peoId => {
                            const peo = allPeos.find(p => p.id === peoId);
                            return (
                              <span key={peoId} className="inline-block bg-[#3a295d] text-white text-xs px-2 py-1 rounded-full">
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
        </div>
      </div>
    </div>
  );
};

export default SDGPOEMapping;