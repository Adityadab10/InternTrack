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
    <div className="min-h-screen bg-[#0D0B1F] relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black/50 to-black pointer-events-none" />
      
      {/* Purple accent lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-purple-500/20 via-purple-500/5 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-purple-500/20 via-purple-500/5 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 bg-black/40 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-purple-400">
                Management Dashboard
              </h1>
              <p className="text-purple-300/80">Monitor and analyze institutional internship programs</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
              text-white rounded-lg transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-red-500/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-6 bg-black/40 p-3 rounded-xl border border-purple-500/20 backdrop-blur-sm">
            <div className="flex space-x-2">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'sdg', label: 'SDG Tracking', icon: '🎯' },
                { id: 'metrics', label: 'Success Metrics', icon: '📈' },
                // { id: 'reports', label: 'Reports', icon: '📑' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 min-w-[140px]
                    ${activeTab === tab.id 
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/20 border border-purple-500/50'
                      : 'text-purple-300 hover:bg-purple-900/30 border border-transparent hover:border-purple-500/30'}`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementDashboard;