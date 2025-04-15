import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from './context/AuthContext'

export default function Login() {
  const { user } = useAuth()
  const [userType, setUserType] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    // If user is already logged in, check for profile
    if (user) {
      const savedProfile = localStorage.getItem('studentProfile')
      if (savedProfile) {
        navigate('/student/StudentDashboard')
      } else {
        navigate('/student/StudentProfileForm')
      }
    }
  }, [user, navigate])

  const handleSelectChange = (e) => {
    setUserType(e.target.value)
  }

  const handleContinue = () => {
    if (userType) {
      switch (userType.toLowerCase()) {
        case 'viewer':
          navigate('/viewer/ViewerPage')
          break
        case 'faculty':
          navigate('/faculty/login')
          break
        case 'management':
          navigate('/management/ManagementLogin')
          break
        case 'admin':
          navigate('/admin/AdminLogin')
          break
        case 'student':
          navigate('/student/StudentLogin')
          break
        default:
          console.error('Unknown user type')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-black px-4 sm:px-6">
  <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md">
    {/* Logo + Title */}
    <div className="flex flex-col items-center mb-6 sm:mb-8 text-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-700 rounded-full flex items-center justify-center mb-4">
        <img src="/placeholder.svg" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 invert" />
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-white">Internship Showcase Platform</h1>
      <p className="text-purple-200 text-sm sm:text-base mt-2">Please select your user type to continue</p>
    </div>

    {/* Select Dropdown */}
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="userType" className="block text-sm font-medium text-purple-200">
          I am a:
        </label>
        <select
          id="userType"
          value={userType}
          onChange={handleSelectChange}
          className="w-full px-4 py-3 rounded-lg bg-black/30 border border-purple-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="" disabled>
            Select user type
          </option>
          <option value="Student">Student</option>
          <option value="Faculty">Faculty</option>
          <option value="Admin">Admin</option>
          <option value="Management">Management</option>
          <option value="Viewer">Viewer</option>
        </select>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!userType}
        className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  </div>
</div>

  )
}