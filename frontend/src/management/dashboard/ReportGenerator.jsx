import React from 'react';

const ReportGenerator = () => {
  return (
    <div className="p-6 bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/20 shadow-lg">
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-purple-400 mb-6">
        Report Generation
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Performance Report',
            description: 'Generate detailed performance analytics',
            icon: '📊'
          },
          {
            title: 'SDG Alignment Report',
            description: 'Analyze SDG contribution metrics',
            icon: '🎯'
          },
          {
            title: 'Department Analytics',
            description: 'View department-wise statistics',
            icon: '📈'
          }
        ].map((report, index) => (
          <button
            key={report.title}
            className="p-6 bg-gradient-to-br from-purple-900/30 to-black/30 rounded-lg 
              border border-purple-500/30 hover:border-purple-500/50 
              transition-all duration-300 text-left group
              shadow-lg hover:shadow-purple-500/10"
          >
            <div className="text-3xl mb-4">{report.icon}</div>
            <h3 className="text-lg font-semibold text-purple-200 mb-2 group-hover:text-purple-100">
              {report.title}
            </h3>
            <p className="text-sm text-purple-300 group-hover:text-purple-200">
              {report.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReportGenerator;