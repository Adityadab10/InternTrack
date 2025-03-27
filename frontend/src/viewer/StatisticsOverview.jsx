import React, { useState } from 'react';
import { PieChart } from './Charts';

function InternshipStatistics() {
  const [selectedYear, setSelectedYear] = useState('2023-2024');

  const departmentStats = [
    { name: 'Computer Science', count: 145 },
    { name: 'ECS Engineering', count: 98 },
    { name: 'Mechanical Engineering', count: 76 },
    { name: 'AIDS Engineering', count: 104 },
  ];

  const sectorStats = [
    { name: 'Technology', value: 35 },
    { name: 'Manufacturing', value: 25 },
    { name: 'Healthcare', value: 15 },
    { name: 'Finance', value: 15 },
    { name: 'Others', value: 10 },
  ];

  const monthlyTrends = [
    { month: 'Q1', count: 45 },
    { month: 'Q2', count: 52 },
    { month: 'Q3', count: 61 },
    { month: 'Q4', count: 58 },
  ];

  const lastYearData = { internships: 390, companies: 80, mentors: 40, sdgs: 12 };
  const stats = [
    { title: 'Total Internships', value: 435, lastValue: lastYearData.internships },
    { title: 'Companies', value: 87, lastValue: lastYearData.companies },
    { title: 'Faculty Mentors', value: 42, lastValue: lastYearData.mentors },
    { title: 'SDGs Covered', value: 14, lastValue: lastYearData.sdgs }
  ].map(stat => ({ ...stat, growth: ((stat.value - stat.lastValue) / stat.lastValue * 100).toFixed(1) }));

  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8C33'];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-400">InternTrack</h1>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            <option>2023-2024</option>
            <option>2022-2023</option>
            <option>2021-2022</option>
          </select>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
              <h3 className="text-sm text-gray-400 mb-2">{stat.title}</h3>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-purple-400">{stat.value}</p>
                <span className="text-green-500 text-sm">+{stat.growth}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Internships by Department</h2>
            <div className="grid grid-cols-2 gap-2">
              {departmentStats.map((dept, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                  <span className="text-sm">{dept.name}</span>
                  <span className="ml-auto text-purple-300">{dept.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Industry Sectors</h2>
            <div className="grid grid-cols-2 gap-2">
              {sectorStats.map((sector, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                  <span className="text-sm">{sector.name}</span>
                  <span className="ml-auto text-purple-300">{sector.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-purple-400">Quarterly Internship Trends</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-4">
            {monthlyTrends.map((trend, index) => (
              <div 
                key={trend.month} 
                className="bg-gray-700 rounded-lg p-4 flex flex-col items-center"
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-2 text-white font-bold"
                  style={{ 
                    backgroundColor: `hsl(${index * 90}, 70%, 50%)`,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  {trend.month}
                </div>
                <span className="text-sm text-gray-300">Internships</span>
                <p className="text-xl font-bold text-purple-300">{trend.count}</p>
                <div className="w-full bg-gray-600 h-1 mt-2 rounded">
                  <div 
                    className="h-1 rounded" 
                    style={{ 
                      width: `${(trend.count / Math.max(...monthlyTrends.map(t => t.count))) * 100}%`,
                      backgroundColor: `hsl(${index * 90}, 70%, 50%)`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
         
          <div className="flex flex-col justify-center pl-4">
            <h3 className="text-lg font-semibold text-purple-300 mb-4"> Performance</h3>
            <div className="space-y-2">
              {monthlyTrends.map((trend, index) => {
                const percentage = ((trend.count / monthlyTrends.reduce((sum, t) => sum + t.count, 0)) * 100).toFixed(1);
                return (
                  <div key={trend.month} className="flex items-center">
                    <div 
                      className="w-3 h-3 mr-3 rounded-full" 
                      style={{ backgroundColor: `hsl(${index * 30}, 70%, 50%)` }}
                    />
                    <span className="flex-grow text-sm">{trend.month}</span>
                    <span className="text-purple-300 font-bold">{percentage}%</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <p>Total Internships: {monthlyTrends.reduce((sum, t) => sum + t.count, 0)}</p>
              <p>Highest Month: {monthlyTrends.reduce((max, t) => t.count > max.count ? t : max).month}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4">Top SDG Contributions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { id: 4, name: 'Quality Education', count: 87, color: 'bg-red-600' },
              { id: 9, name: 'Industry & Innovation', count: 76, color: 'bg-orange-600' },
              { id: 8, name: 'Decent Work', count: 65, color: 'bg-yellow-600' },
              { id: 11, name: 'Sustainable Cities', count: 54, color: 'bg-green-600' },
              { id: 3, name: 'Good Health', count: 43, color: 'bg-blue-600' },
            ].map((sdg) => (
              <div key={sdg.id} className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
                <div className={`${sdg.color} w-12 h-12 rounded-full flex items-center justify-center mb-2`}>
                  <span className="font-bold text-white">{sdg.id}</span>
                </div>
                <h4 className="text-sm font-medium text-center">{sdg.name}</h4>
                <p className="text-lg font-bold mt-1">{sdg.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InternshipStatistics;
