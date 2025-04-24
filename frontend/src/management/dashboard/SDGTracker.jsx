import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SDGTracker = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    sdgs: {},
    pos: {},
    peos: {}
  });

  // Define all possible SDGs, POs, and PEOs
  const allSdgs = {
    1: 'No Poverty',
    2: 'Zero Hunger',
    3: 'Good Health and Well-being',
    4: 'Quality Education',
    5: 'Gender Equality',
    6: 'Clean Water and Sanitation',
    7: 'Affordable and Clean Energy',
    8: 'Decent Work and Economic Growth',
    9: 'Industry, Innovation and Infrastructure',
    10: 'Reduced Inequalities',
    11: 'Sustainable Cities and Communities',
    12: 'Responsible Consumption and Production',
    13: 'Climate Action',
    14: 'Life Below Water',
    15: 'Life on Land',
    16: 'Peace, Justice and Strong Institutions',
    17: 'Partnerships for the Goals'
  };

  const allPos = {
    'PO1': 'Engineering Knowledge',
    'PO2': 'Problem Analysis',
    'PO3': 'Design/Development Solutions',
    'PO4': 'Investigation',
    'PO5': 'Modern Tool Usage',
    'PO6': 'Engineer and Society',
    'PO7': 'Environment and Sustainability',
    'PO8': 'Ethics',
    'PO9': 'Individual and Team Work',
    'PO10': 'Communication',
    'PO11': 'Project Management',
    'PO12': 'Lifelong Learning'
  };

  const allPeos = {
    'PEO1': 'Technical Expertise',
    'PEO2': 'Professional Skills',
    'PEO3': 'Research and Innovation',
    'PEO4': 'Leadership and Management',
    'PEO5': 'Ethical and Social Responsibility'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch internships data
        const response = await axios.get('http://localhost:5001/api/internships');
        
        // Initialize counters
        const sdgCounts = {};
        const poCounts = {};
        const peoCounts = {};

        // Process each internship
        response.data.forEach(internship => {
          // Count SDGs
          if (internship.sdgs && Array.isArray(internship.sdgs)) {
            internship.sdgs.forEach(sdg => {
              // Convert string SDG numbers to integers if needed
              const sdgNum = parseInt(sdg.replace('SDG ', ''));
              if (!isNaN(sdgNum)) {
                sdgCounts[sdgNum] = (sdgCounts[sdgNum] || 0) + 1;
              }
            });
          }

          // Count POs
          if (internship.pos && Array.isArray(internship.pos)) {
            internship.pos.forEach(po => {
              poCounts[po] = (poCounts[po] || 0) + 1;
            });
          }

          // Count PEOs
          if (internship.peos && Array.isArray(internship.peos)) {
            internship.peos.forEach(peo => {
              peoCounts[peo] = (peoCounts[peo] || 0) + 1;
            });
          }
        });

        setStats({
          sdgs: sdgCounts,
          pos: poCounts,
          peos: peoCounts
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-black/50 rounded-xl border border-purple-500/20">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-black/50 rounded-xl border border-purple-500/20">
      <h2 className="text-2xl font-bold text-purple-200 mb-4">SDG Contribution Tracking</h2>
      
      {error && (
        <div className="bg-red-900/30 border border-red-500/30 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SDG Section */}
        <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
          <h3 className="text-lg font-semibold text-purple-200 mb-3">SDGs</h3>
          {Object.keys(stats.sdgs).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.sdgs)
                .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
                .map(([sdgId, count]) => (
                  <div key={sdgId}>
                    <div className="flex justify-between text-sm text-purple-200 mb-1">
                      <span className="truncate">SDG {sdgId}: {allSdgs[sdgId]}</span>
                      <span className="ml-2">{count}</span>
                    </div>
                    <div className="w-full bg-purple-900/30 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(count / Math.max(...Object.values(stats.sdgs))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-purple-300">No SDG data available</p>
          )}
        </div>

        {/* POs Section */}
        <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
          <h3 className="text-lg font-semibold text-purple-200 mb-3">Program Outcomes</h3>
          {Object.keys(stats.pos).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.pos)
                .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
                .map(([poId, count]) => (
                  <div key={poId}>
                    <div className="flex justify-between text-sm text-purple-200 mb-1">
                      <span className="truncate">{poId}: {allPos[poId]}</span>
                      <span className="ml-2">{count}</span>
                    </div>
                    <div className="w-full bg-purple-900/30 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(count / Math.max(...Object.values(stats.pos))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-purple-300">No PO data available</p>
          )}
        </div>

        {/* PEOs Section */}
        <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
          <h3 className="text-lg font-semibold text-purple-200 mb-3">Program Educational Objectives</h3>
          {Object.keys(stats.peos).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.peos)
                .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
                .map(([peoId, count]) => (
                  <div key={peoId}>
                    <div className="flex justify-between text-sm text-purple-200 mb-1">
                      <span className="truncate">{peoId}: {allPeos[peoId]}</span>
                      <span className="ml-2">{count}</span>
                    </div>
                    <div className="w-full bg-purple-900/30 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${(count / Math.max(...Object.values(stats.peos))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-purple-300">No PEO data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SDGTracker;