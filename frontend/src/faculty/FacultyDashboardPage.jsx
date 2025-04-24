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
import { FiLogOut, FiBook, FiUsers, FiTrendingUp, FiMessageSquare, FiMap } from 'react-icons/fi';

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
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-950">
        {/* Sidebar */}
        <div className="w-72 h-screen bg-black/40 backdrop-blur-xl shadow-2xl border-r border-purple-500/20 flex flex-col shrink-0 overflow-hidden">
          {/* Profile Section */}
          <div className="p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-transparent">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                F
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                  Faculty Portal
                </h2>
                <p className="text-sm text-purple-300/80">Guiding Excellence</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2 flex-1 overflow-hidden">
            {[
              { id: 'overview', icon: <FiBook className="text-lg" />, label: 'Internship Overview', desc: 'View all internships' },
              { id: 'mentorship', icon: <FiUsers className="text-lg" />, label: 'Mentorship', desc: 'Assign mentors' },
              { id: 'progress', icon: <FiTrendingUp className="text-lg" />, label: 'Progress', desc: 'Monitor students' },
              { id: 'feedback', icon: <FiMessageSquare className="text-lg" />, label: 'Feedback', desc: 'Student reviews' },
              { id: 'mapping', icon: <FiMap className="text-lg" />, label: 'SDG/POE Mapping', desc: 'Track outcomes' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-300 relative group
                  ${activeTab === item.id 
                    ? 'bg-gradient-to-r from-purple-600/50 to-indigo-600/50 text-white shadow-lg shadow-purple-500/20' 
                    : 'hover:bg-purple-900/30 text-purple-200 hover:text-white'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                    activeTab === item.id 
                      ? 'bg-white/10' 
                      : 'bg-black/20 group-hover:bg-white/5'
                    } backdrop-blur-sm transition-colors`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-xs text-purple-300/70">{item.desc}</div>
                  </div>
                </div>
                
                {activeTab === item.id && (
                  <div className="absolute inset-y-0 -right-4 w-1 bg-purple-500 rounded-full"></div>
                )}
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-purple-500/20 bg-black/20 backdrop-blur-sm">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-900/50 to-purple-900/50 text-white rounded-xl 
                hover:from-red-800 hover:to-purple-800 transition-all duration-300 
                flex items-center justify-center space-x-2 group"
            >
              <FiLogOut className="text-xl group-hover:rotate-12 transition-transform" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 h-screen overflow-y-auto">
          <div className="px-8 py-6">
            <div className="max-w-7xl mx-auto">
              {/* Content Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                  {activeTab === 'overview' && 'Internship Overview'}
                  {activeTab === 'mentorship' && 'Mentorship Assignment'}
                  {activeTab === 'progress' && 'Progress Monitoring'}
                  {activeTab === 'feedback' && 'Student Feedback'}
                  {activeTab === 'mapping' && 'SDG/POE Mapping'}
                </h1>
                <p className="text-purple-300/80 mt-2">
                  {activeTab === 'overview' && 'View and manage all internship opportunities'}
                  {activeTab === 'mentorship' && 'Assign mentors to students'}
                  {activeTab === 'progress' && 'Monitor student progress and performance'}
                  {activeTab === 'feedback' && 'Review student feedback and evaluations'}
                  {activeTab === 'mapping' && 'Track SDG and POE outcomes'}
                </p>
              </div>

              {/* Content Container */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-xl p-6">
                <div className="min-h-[500px]">
                  {renderTab()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WebSocketProvider>
  );
};

export default FacultyDashboardPage;