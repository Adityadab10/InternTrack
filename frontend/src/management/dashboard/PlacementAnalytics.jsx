import React from 'react';

const PlacementAnalytics = () => {
  return (
    <div className="p-6 bg-black/50 rounded-xl border border-purple-500/20">
      <h2 className="text-2xl font-bold text-purple-200 mb-4">Internship Placement Analytics</h2>
      
      <div className="space-y-6">
        {/* Placement Rates */}
        <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
          <h3 className="text-lg font-semibold text-purple-200 mb-3">Placement Rates</h3>
          <p className="text-sm text-purple-300">No placement data available</p>
        </div>

        {/* Industry Distribution */}
        <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
          <h3 className="text-lg font-semibold text-purple-200 mb-3">Industry Distribution</h3>
          <p className="text-sm text-purple-300">No distribution data available</p>
        </div>
      </div>
    </div>
  );
};

export default PlacementAnalytics;