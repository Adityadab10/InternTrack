import React from 'react';

const ReportGenerator = () => {
  return (
    <div className="p-6 bg-black/50 rounded-xl border border-purple-500/20">
      <h2 className="text-2xl font-bold text-purple-200 mb-4">Report Generation</h2>
      
      <div className="space-y-6">
        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30 hover:bg-purple-900/50 transition-all">
            <h3 className="text-lg font-semibold text-purple-200 mb-2">Performance Report</h3>
            <p className="text-sm text-purple-300">Generate detailed performance analytics</p>
          </button>

          <button className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30 hover:bg-purple-900/50 transition-all">
            <h3 className="text-lg font-semibold text-purple-200 mb-2">SDG Alignment Report</h3>
            <p className="text-sm text-purple-300">Analyze SDG contribution metrics</p>
          </button>

          <button className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30 hover:bg-purple-900/50 transition-all">
            <h3 className="text-lg font-semibold text-purple-200 mb-2">Department Analytics</h3>
            <p className="text-sm text-purple-300">View department-wise statistics</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;