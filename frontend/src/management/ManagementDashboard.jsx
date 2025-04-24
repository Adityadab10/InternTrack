import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InternshipOverview from './dashboard/InternshipOverview';
import SDGTracker from './dashboard/SDGTracker';
import SuccessMetrics from './dashboard/SuccessMetrics';
import PlacementAnalytics from './dashboard/PlacementAnalytics';
import ReportGenerator from './dashboard/ReportGenerator';

const ManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-purple-200">Management Dashboard</h1>
            <p className="text-purple-300/80">Monitor and analyze institutional internship programs</p>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
            <span>Logout</span>
          </button>
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