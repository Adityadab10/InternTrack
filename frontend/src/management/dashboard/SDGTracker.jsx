import React from 'react';

const SDGTracker = () => {
  return (
    <div className="p-6 bg-black/50 rounded-xl border border-purple-500/20">
      <h2 className="text-2xl font-bold text-purple-200 mb-4">SDG Contribution Tracking</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SDG Section */}
        <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
          <h3 className="text-lg font-semibold text-purple-200 mb-3">SDGs</h3>
          <p className="text-sm text-purple-300">No data available</p>
        </div>

        {/* POs Section */}
        <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
          <h3 className="text-lg font-semibold text-purple-200 mb-3">Program Outcomes</h3>
          <p className="text-sm text-purple-300">No data available</p>
        </div>

        {/* PEOs Section */}
        <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
          <h3 className="text-lg font-semibold text-purple-200 mb-3">Program Educational Objectives</h3>
          <p className="text-sm text-purple-300">No data available</p>
        </div>
      </div>
    </div>
  );
};

export default SDGTracker;