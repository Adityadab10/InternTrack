import React, { useState } from 'react';
import { WebSocketProvider } from '../contexts/WebSocketContext';
import FacultySidebar from '../components/ FacultyDashboard/FacultySidebar';
import InternshipOverview from '../components/ FacultyDashboard/InternshipOverview';
import MentorshipAssignment from '../components/ FacultyDashboard/MentorshipAssignment';
import ProgressMonitoring from '../components/ FacultyDashboard/ProgressMonitoring';
import StudentFeedback from '../components/ FacultyDashboard/StudentFeedback';
import SDGPOEMapping from '../components/ FacultyDashboard/SDGPOEMapping';

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