import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SDGTracker = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedView, setSelectedView] = useState('overview'); // 'overview', 'department', 'detailed'
  const [stats, setStats] = useState({
    sdgs: {},
    pos: {},
    peos: {},
    departmentStats: {},
    detailedMapping: []
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

  // Update viewOptions to remove the empty analysis sections
  const viewOptions = {
    'overview': 'Overview',
    'company': 'By Company',
    'detailed': 'All Details'
  };

  // Custom colors for charts
  const COLORS = [
    '#8B5CF6', '#6366F1', '#EC4899', '#F43F5E', '#10B981',
    '#6EE7B7', '#3B82F6', '#60A5FA', '#F59E0B', '#FBBF24'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/internships');
        
        // Initialize counters
        const sdgCounts = {};
        const poCounts = {};
        const peoCounts = {};
        const departmentStats = {};
        const detailedMapping = [];

        // Process each internship
        response.data.forEach(internship => {
          const department = internship.department || 'Unspecified';
          
          // Initialize department if not exists
          if (!departmentStats[department]) {
            departmentStats[department] = {
              sdgs: {},
              pos: {},
              peos: {},
              internshipCount: 0,
              internships: []
            };
          }

          // Increment department internship count
          departmentStats[department].internshipCount++;

          // Add to detailed mapping
          detailedMapping.push({
            id: internship._id,
            title: internship.title,
            company: internship.company,
            department: department,
            sdgs: internship.sdgs || [],
            pos: internship.pos || [],
            peos: internship.peos || []
          });

          // Process SDGs
          if (internship.sdgs && Array.isArray(internship.sdgs)) {
            internship.sdgs.forEach(sdg => {
              const sdgNum = parseInt(sdg.replace('SDG ', ''));
              if (!isNaN(sdgNum)) {
                sdgCounts[sdgNum] = (sdgCounts[sdgNum] || 0) + 1;
                departmentStats[department].sdgs[sdgNum] = 
                  (departmentStats[department].sdgs[sdgNum] || 0) + 1;
              }
            });
          }

          // Process POs
          if (internship.pos && Array.isArray(internship.pos)) {
            internship.pos.forEach(po => {
              poCounts[po] = (poCounts[po] || 0) + 1;
              departmentStats[department].pos[po] = 
                (departmentStats[department].pos[po] || 0) + 1;
            });
          }

          // Process PEOs
          if (internship.peos && Array.isArray(internship.peos)) {
            internship.peos.forEach(peo => {
              peoCounts[peo] = (peoCounts[peo] || 0) + 1;
              departmentStats[department].peos[peo] = 
                (departmentStats[department].peos[peo] || 0) + 1;
            });
          }
        });

        setStats({
          sdgs: sdgCounts,
          pos: poCounts,
          peos: peoCounts,
          departmentStats,
          detailedMapping
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

  const renderExecutiveOverview = () => {
    // Prepare data for SDG distribution pie chart
    const sdgData = Object.entries(stats.sdgs).map(([sdgId, count]) => ({
      name: `SDG ${sdgId}`,
      value: count,
      fullName: allSdgs[sdgId]
    }));

    // Prepare data for PO bar chart
    const poData = Object.entries(stats.pos).map(([poId, count]) => ({
      name: poId,
      count: count,
      fullName: allPos[poId]
    }));

    return (
      <div className="space-y-8">
        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-purple-900/30 to-black/30 p-6 rounded-lg border border-purple-500/30">
            <h4 className="text-purple-300 text-sm font-medium mb-2">Total Internships</h4>
            <p className="text-3xl font-bold text-purple-200">{stats.detailedMapping.length}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-900/30 to-black/30 p-6 rounded-lg border border-blue-500/30">
            <h4 className="text-blue-300 text-sm font-medium mb-2">SDGs Covered</h4>
            <p className="text-3xl font-bold text-blue-200">{Object.keys(stats.sdgs).length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-900/30 to-black/30 p-6 rounded-lg border border-green-500/30">
            <h4 className="text-green-300 text-sm font-medium mb-2">POs Aligned</h4>
            <p className="text-3xl font-bold text-green-200">{Object.keys(stats.pos).length}</p>
          </div>
          <div className="bg-gradient-to-br from-pink-900/30 to-black/30 p-6 rounded-lg border border-pink-500/30">
            <h4 className="text-pink-300 text-sm font-medium mb-2">Companies</h4>
            <p className="text-3xl font-bold text-pink-200">
              {new Set(stats.detailedMapping.map(item => item.company)).size}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SDG Distribution */}
          <div className="bg-black/30 p-6 rounded-lg border border-purple-500/20">
            <h3 className="text-lg font-semibold text-purple-200 mb-4">SDG Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sdgData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {sdgData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ payload }) => {
                      if (payload && payload[0]) {
                        const { name, fullName, value } = payload[0].payload;
                        return (
                          <div className="bg-black/90 p-2 rounded border border-purple-500/20">
                            <p className="text-purple-200">{`${name}: ${fullName}`}</p>
                            <p className="text-purple-300">{`Count: ${value}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PO Achievement */}
          <div className="bg-black/30 p-6 rounded-lg border border-purple-500/20">
            <h3 className="text-lg font-semibold text-purple-200 mb-4">Program Outcomes Achievement</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={poData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#E9D5FF" />
                  <YAxis stroke="#E9D5FF" />
                  <Tooltip
                    content={({ payload }) => {
                      if (payload && payload[0]) {
                        const { name, fullName, count } = payload[0].payload;
                        return (
                          <div className="bg-black/90 p-2 rounded border border-purple-500/20">
                            <p className="text-purple-200">{`${name}: ${fullName}`}</p>
                            <p className="text-purple-300">{`Count: ${count}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#8B5CF6">
                    {poData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Performance */}
          <div className="col-span-2 bg-black/30 p-6 rounded-lg border border-purple-500/20">
            <h3 className="text-lg font-semibold text-purple-200 mb-4">Department-wise SDG Contribution</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-purple-900/30">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-purple-200 uppercase">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-purple-200 uppercase">Internships</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-purple-200 uppercase">Top SDGs</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-purple-200 uppercase">Top POs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/30">
                  {Object.entries(stats.departmentStats).map(([dept, data]) => (
                    <tr key={dept} className="hover:bg-purple-900/20">
                      <td className="px-4 py-3 text-sm text-purple-200">{dept}</td>
                      <td className="px-4 py-3 text-sm text-purple-200">{data.internshipCount}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(data.sdgs)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 3)
                            .map(([sdgId, count]) => (
                              <span key={sdgId} className="px-2 py-1 text-xs bg-blue-900/50 text-blue-200 rounded-full">
                                SDG {sdgId} ({count})
                              </span>
                            ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(data.pos)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 3)
                            .map(([poId, count]) => (
                              <span key={poId} className="px-2 py-1 text-xs bg-green-900/50 text-green-200 rounded-full">
                                {poId} ({count})
                              </span>
                            ))}
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
    );
  };

  const renderCompanyView = () => {
    // Group internships by company
    const companyGroups = stats.detailedMapping.reduce((acc, internship) => {
      if (!acc[internship.company]) {
        acc[internship.company] = [];
      }
      acc[internship.company].push(internship);
      return acc;
    }, {});

    return (
      <div className="space-y-6">
        {Object.entries(companyGroups).map(([company, internships]) => (
          <div key={company} className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-indigo-200">{company}</h3>
              <span className="px-3 py-1 bg-indigo-900/50 text-indigo-200 rounded-full text-sm">
                {internships.length} Internships
              </span>
            </div>

            <div className="grid gap-4">
              {internships.map(internship => (
                <div key={internship.id} className="bg-black/30 p-3 rounded-lg">
                  <h4 className="text-indigo-200 font-medium mb-2">{internship.title}</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h5 className="text-xs font-medium text-indigo-300 mb-1">SDGs</h5>
                      <div className="flex flex-wrap gap-1">
                        {internship.sdgs.map(sdg => (
                          <span key={sdg} className="px-2 py-1 text-xs bg-blue-900/50 text-blue-200 rounded-full">
                            {sdg}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xs font-medium text-indigo-300 mb-1">POs</h5>
                      <div className="flex flex-wrap gap-1">
                        {internship.pos.map(po => (
                          <span key={po} className="px-2 py-1 text-xs bg-green-900/50 text-green-200 rounded-full">
                            {po}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xs font-medium text-indigo-300 mb-1">PEOs</h5>
                      <div className="flex flex-wrap gap-1">
                        {internship.peos.map(peo => (
                          <span key={peo} className="px-2 py-1 text-xs bg-purple-900/50 text-purple-200 rounded-full">
                            {peo}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDetailedView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-black/30 rounded-lg">
        <thead className="bg-purple-900/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Internship</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Department</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">SDGs</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">POs</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">PEOs</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-900/30">
          {stats.detailedMapping.map((item, index) => (
            <tr key={item.id} className={index % 2 === 0 ? 'bg-purple-900/10' : 'bg-purple-900/20'}>
              <td className="px-4 py-3">
                <div className="text-sm text-purple-200">{item.title}</div>
                <div className="text-xs text-purple-400">{item.company}</div>
              </td>
              <td className="px-4 py-3 text-sm text-purple-200">{item.department}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {item.sdgs.map(sdg => (
                    <span key={sdg} className="px-2 py-1 text-xs bg-blue-900/50 text-blue-200 rounded-full">
                      {sdg}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {item.pos.map(po => (
                    <span key={po} className="px-2 py-1 text-xs bg-green-900/50 text-green-200 rounded-full">
                      {po}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {item.peos.map(peo => (
                    <span key={peo} className="px-2 py-1 text-xs bg-purple-900/50 text-purple-200 rounded-full">
                      {peo}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-purple-400">
            Institutional SDG Impact Analysis
          </h2>
          <p className="text-purple-300/80">Comprehensive overview of SDG alignment and program outcomes</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(viewOptions).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedView(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${selectedView === key 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/20' 
                  : 'bg-purple-900/30 text-purple-200 hover:bg-purple-900/50'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/30 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {selectedView === 'overview' && renderExecutiveOverview()}
      {selectedView === 'company' && renderCompanyView()}
      {selectedView === 'detailed' && renderDetailedView()}
    </div>
  );
};

export default SDGTracker;