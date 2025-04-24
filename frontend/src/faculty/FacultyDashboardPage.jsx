import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { WebSocketProvider } from '../context/WebSocketContext';
import FacultySidebar from './FacultySidebar';
import InternshipOverview from './InternshipOverview';
import MentorshipAssignment from './MentorshipAssignment';
import ProgressMonitoring from './ProgressMonitoring';
import StudentFeedback from './StudentFeedback';
import SDGPOEMapping from './SDGPOEMapping';

const FacultyDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/faculty/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <InternshipOverview />;
      case 'mentorship':
        return <MentorshipAssignment />;
      case 'progress':
        return <ProgressMonitoring />;
      case 'feedback':
        return <StudentFeedback />;
      case 'mapping':
        return <SDGPOEMapping />;
      default:
        return <InternshipOverview />;
    }
  };

  return (
    <WebSocketProvider>
      <div className="flex h-screen bg-gray-50">
        <FacultySidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">Faculty Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
            >
              <svg 
                className="w-5 h-5 mr-2" 
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
              Logout
            </button>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            {renderTab()}
          </main>
        </div>
      </div>
    </WebSocketProvider>
  );
};

export default FacultyDashboardPage;