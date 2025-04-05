import React, { useState } from 'react';
import { WebSocketProvider } from '../context/WebSocketContext';
import FacultySidebar from './FacultySidebar';
import InternshipOverview from './InternshipOverview';
import MentorshipAssignment from './MentorshipAssignment';
import ProgressMonitoring from './ProgressMonitoring';
import StudentFeedback from './StudentFeedback';
import SDGPOEMapping from './SDGPOEMapping';

const FacultyDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

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
        <main className="flex-1 overflow-y-auto p-6">
          {renderTab()}
        </main>
      </div>
    </WebSocketProvider>
  );
};

export default FacultyDashboardPage;