import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Landing from './Landing'
import Login from './Login'
import FacultyLogin from './faculty/FacultyLogin'
import ManagementLogin from './management/ManagementLogin'
import AdminLogin from './admin/AdminLogin'
import StudentLogin from './student/StudentLogin'
import AdminDashboard from './admin/AdminDashboard'
import StudentDashboard from './student/StudentDashboard'
import StudentProfileForm from './student/StudentProfileForm'
import ViewerPage from './viewer/ViewerPage'
import { AuthProvider, useAuth } from './context/AuthContext'
import { FacultyProvider } from './faculty/FacultyContext'
import { WebSocketProvider } from './context/WebSocketContext'
import FacultyDashboardPage from './faculty/FacultyDashboardPage'
import ManagementDashboard from './management/ManagementDashboard'
import FacultyLoginSelector from './faculty/FacultyLoginSelector';
import MentorGoogleAuth from './faculty/MentorGoogleAuth';
import MentorRegistration from './faculty/MentorRegistration';
import MentorDashboard from './faculty/MentorDashboard';

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/faculty/login" element={<FacultyLoginSelector />} />
            <Route path="/faculty/mentor-login" element={<MentorGoogleAuth />} />
            <Route path="/faculty/mentor-registration" element={<MentorRegistration />} />
            <Route 
              path="/faculty/dashboard" 
              element={
                <ProtectedRoute>
                  <FacultyProvider>
                    <FacultyDashboardPage />
                  </FacultyProvider>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/faculty/mentor-dashboard" 
              element={
                <ProtectedRoute>
                  <MentorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/management/ManagementLogin" element={<ManagementLogin />} />
            <Route path="/management/dashboard" element={<ManagementDashboard />} />
            <Route path="/admin/AdminLogin" element={<AdminLogin />} />
            <Route path="/student/StudentLogin" element={<StudentLogin />} />
            <Route path="/admin/AdminDashboard" element={<AdminDashboard />} />
            <Route path="/viewer/ViewerPage" element={<ViewerPage />} />
            <Route 
              path="/student/StudentDashboard" 
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/student/StudentProfileForm" element={<StudentProfileForm />} />
          </Routes>
        </Router>
      </WebSocketProvider>
    </AuthProvider>
  )
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default App
