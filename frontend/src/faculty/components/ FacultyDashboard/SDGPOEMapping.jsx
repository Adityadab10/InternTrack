import React from 'react';

const SDGPOEMapping = () => {
  // Mock data - replace with API calls
  const mappings = [
    { id: 1, student: 'John Doe', company: 'Tech Corp', sdgs: [4, 8], pos: [1, 3], peos: [1] },
    { id: 2, student: 'Jane Smith', company: 'Data Systems', sdgs: [9], pos: [2], peos: [2] },
  ];

  const allSdgs = [
    { id: 1, name: 'No Poverty' },
    { id: 4, name: 'Quality Education' },
    { id: 8, name: 'Decent Work' },
    { id: 9, name: 'Industry Innovation' },
  ];

  const allPos = [
    { id: 1, name: 'Engineering Knowledge' },
    { id: 2, name: 'Problem Analysis' },
    { id: 3, name: 'Design/Development' },
  ];

  const allPeos = [
    { id: 1, name: 'Technical Expertise' },
    { id: 2, name: 'Professional Skills' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">SDG/PO/PEO Mapping</h2>
      
      <div className="bg-white rounded-lg shadow p-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SDGs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">POs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PEOs</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mappings.map(mapping => (
              <tr key={mapping.id}>
                <td className="px-6 py-4 whitespace-nowrap">{mapping.student}</td>
                <td className="px-6 py-4 whitespace-nowrap">{mapping.company}</td>
                <td className="px-6 py-4">
                  {mapping.sdgs.map(sdgId => {
                    const sdg = allSdgs.find(s => s.id === sdgId);
                    return (
                      <span key={sdgId} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                        SDG {sdgId}: {sdg?.name}
                      </span>
                    );
                  })}
                </td>
                <td className="px-6 py-4">
                  {mapping.pos.map(poId => {
                    const po = allPos.find(p => p.id === poId);
                    return (
                      <span key={poId} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                        {po?.name}
                      </span>
                    );
                  })}
                </td>
                <td className="px-6 py-4">
                  {mapping.peos.map(peoId => {
                    const peo = allPeos.find(p => p.id === peoId);
                    return (
                      <span key={peoId} className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                        {peo?.name}
                      </span>
                    );
                  })}
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