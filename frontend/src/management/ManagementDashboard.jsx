import React, { useState } from 'react';
import InternshipOverview from './dashboard/InternshipOverview';
import SDGTracker from './dashboard/SDGTracker';
import SuccessMetrics from './dashboard/SuccessMetrics';
import PlacementAnalytics from './dashboard/PlacementAnalytics';
import ReportGenerator from './dashboard/ReportGenerator';

const ManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return <InternshipOverview />;
      case 'sdg':
        return <SDGTracker />;
      case 'metrics':
        return <SuccessMetrics />;
      case 'analytics':
        return <PlacementAnalytics />;
      case 'reports':
        return <ReportGenerator />;
      default:
        return <InternshipOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-200">Management Dashboard</h1>
          <p className="text-purple-300/80">Monitor and analyze institutional internship programs</p>
        </div>

        {/* Navigation */}
        <div className="mb-6 flex space-x-4">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'sdg', label: 'SDG Tracking' },
            { id: 'metrics', label: 'Success Metrics' },
            // { id: 'analytics', label: 'Analytics' }
            { id: 'reports', label: 'Reports' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id 
                  ? 'bg-purple-600 text-white'
                  : 'text-purple-300 hover:bg-purple-900/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ManagementDashboard;