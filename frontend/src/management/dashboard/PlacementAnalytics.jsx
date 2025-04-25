import React from 'react';

const PlacementAnalytics = () => {
  return (
    <div className="p-6 bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/20 shadow-lg">
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-purple-400 mb-6">
        Internship Placement Analytics
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-900/30 to-black/30 p-6 rounded-lg 
          border border-purple-500/30 shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
          <h3 className="text-lg font-semibold text-purple-200 mb-3">Placement Rates</h3>
          <div className="flex items-center justify-center h-40 bg-purple-900/20 rounded-lg border border-purple-500/10">
            <p className="text-sm text-purple-300">No placement data available</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-black/30 p-6 rounded-lg 
          border border-purple-500/30 shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
          <h3 className="text-lg font-semibold text-purple-200 mb-3">Industry Distribution</h3>
          <div className="flex items-center justify-center h-40 bg-purple-900/20 rounded-lg border border-purple-500/10">
            <p className="text-sm text-purple-300">No distribution data available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementAnalytics;