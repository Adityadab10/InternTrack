import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Landing from './Landing'
import Login from './Login'
import ViewerLogin from './viewer/ViewerLogin'
import FacultyLogin from './faculty/FacultyLogin'
import ManagementLogin from './management/ManagementLogin'
import AdminLogin from './admin/AdminLogin'
import StudentLogin from './student/StudentLogin'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/viewer/ViewerLogin" element={<ViewerLogin />} />
        <Route path="/faculty/FacultyLogin" element={<FacultyLogin />} />
        <Route path="/management/ManagementLogin" element={<ManagementLogin />} />
        <Route path="/admin/AdminLogin" element={<AdminLogin />} />
        <Route path="/student/StudentLogin" element={<StudentLogin />} />
      </Routes>
    </Router>
  )
}

export default App
