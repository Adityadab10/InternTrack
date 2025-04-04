import React from 'react';
import { useWebSocket } from './WebSocketContext';
import NotificationBell from './NotificationBell';

const FacultySidebar = ({ activeTab, setActiveTab }) => {
  const { notifications } = useWebSocket();
  
  const tabs = [
    { id: 'overview', name: 'Internship Overview', icon: '📊' },
    { id: 'mentorship', name: 'Mentorship Assignment', icon: '👥' },
    { id: 'progress', name: 'Progress Monitoring', icon: '🚀' },
    { id: 'feedback', name: 'Student Feedback', icon: '💬' },
    { id: 'mapping', name: 'SDG/PO/PEO Mapping', icon: '🎯' },
  ];

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold">Faculty Dashboard</h1>
        <div className="flex items-center mt-2">
          <NotificationBell count={notifications.length} />
          <span className="ml-2 text-sm text-gray-600">{notifications.length} new notifications</span>
        </div>
      </div>
      <nav className="p-4">
        <ul>
          {tabs.map((tab) => (
            <li key={tab.id} className="mb-2">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
              >
                <span className="mr-3">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default FacultySidebar;