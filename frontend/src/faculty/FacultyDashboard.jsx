import React, { useState } from 'react';
import { Home, Users, BookOpen, CheckCircle, FileText, Settings } from 'lucide-react';

// Sidebar Component
const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', tab: 'overview' },
    { icon: Users, label: 'Mentorship', tab: 'mentorship' },
    { icon: BookOpen, label: 'Internship Progress', tab: 'progress' },
    { icon: CheckCircle, label: 'SDG Alignment', tab: 'sdg' },
    { icon: FileText, label: 'Reports', tab: 'reports' },
    { icon: Settings, label: 'Settings', tab: 'settings' }
  ];

  return (
    <div className="w-64 bg-gray-100 h-screen p-4 border-r">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-blue-600">Faculty Dashboard</h1>
      </div>
      <nav>
        {menuItems.map((item) => (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab)}
            className={`w-full flex items-center p-3 rounded-lg mb-2 ${
              activeTab === item.tab 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-gray-200 text-gray-700'
            }`}
          >
            <item.icon className="mr-3" size={20} />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

// Overview Component
const InternshipOverview = () => {
  const students = [
    { name: 'John Doe', internship: 'Tech Innovations', company: 'Google' },
    { name: 'Jane Smith', internship: 'Data Analytics', company: 'Microsoft' },
    { name: 'Alex Johnson', internship: 'UX Design', company: 'Adobe' }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Internship Overview</h2>
      <div className="bg-white shadow rounded-lg p-4">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Student Name</th>
              <th className="p-3 text-left">Internship</th>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{student.name}</td>
                <td className="p-3">{student.internship}</td>
                <td className="p-3">{student.company}</td>
                <td className="p-3">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Mentorship Assignment Component
const MentorshipAssignment = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const students = [
    { id: 1, name: 'John Doe', department: 'Computer Science' },
    { id: 2, name: 'Jane Smith', department: 'Data Science' }
  ];

  const mentors = [
    { id: 1, name: 'Dr. Sarah Williams', specialization: 'Software Engineering' },
    { id: 2, name: 'Prof. Mike Brown', specialization: 'Data Analytics' }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Mentorship Assignment</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-bold mb-4">Students</h3>
          {students.map(student => (
            <div 
              key={student.id} 
              onClick={() => setSelectedStudent(student)}
              className={`p-3 cursor-pointer ${
                selectedStudent?.id === student.id 
                  ? 'bg-blue-100' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {student.name} - {student.department}
            </div>
          ))}
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-bold mb-4">Mentors</h3>
          {mentors.map(mentor => (
            <div 
              key={mentor.id} 
              className="p-3 hover:bg-gray-100 cursor-pointer"
            >
              {mentor.name} - {mentor.specialization}
            </div>
          ))}
        </div>
      </div>
      <button 
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        disabled={!selectedStudent}
      >
        Assign Mentor
      </button>
    </div>
  );
};

// Main Dashboard Component
const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 bg-gray-50">
        {activeTab === 'overview' && <InternshipOverview />}
        {activeTab === 'mentorship' && <MentorshipAssignment />}
      </div>
    </div>
  );
};

export default FacultyDashboard;