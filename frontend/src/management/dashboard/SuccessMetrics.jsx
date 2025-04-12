import React from 'react';

const SuccessMetrics = () => {
  return (
    <div className="p-6 bg-black/50 rounded-xl border border-purple-500/20">
      <h2 className="text-2xl font-bold text-purple-200 mb-4">Program Success Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Feedback */}
        <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
          <h3 className="text-lg font-semibold text-purple-200 mb-3">Student Feedback</h3>
          <p className="text-sm text-purple-300">No feedback data available</p>
        </div>

        {/* Performance Metrics */}
        <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
          <h3 className="text-lg font-semibold text-purple-200 mb-3">Performance Overview</h3>
          <p className="text-sm text-purple-300">No performance data available</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessMetrics;