import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from './context/AuthContext'

export default function Login() {
  const { user } = useAuth()
  const [userType, setUserType] = useState("")
  const navigate = useNavigate()

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

  const handleBackToHome = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-900 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-64 h-64 bg-purple-800 opacity-20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-32 right-1/3 w-80 h-80 bg-purple-700 opacity-30 rounded-full blur-3xl"></div>
        
        {/* Geometric line elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-1/3 h-px bg-gradient-to-r from-purple-500 to-transparent"></div>
          <div className="absolute top-10 left-10 w-px h-1/4 bg-gradient-to-b from-purple-500 to-transparent"></div>
          <div className="absolute bottom-10 right-10 w-1/4 h-px bg-gradient-to-l from-purple-700 to-transparent"></div>
          <div className="absolute bottom-10 right-10 w-px h-1/5 bg-gradient-to-t from-purple-700 to-transparent"></div>
        </div>
      </div>
      
      {/* Main content container */}
      <div className="relative w-full max-w-md z-10">
        <div className="bg-gray-900/60 backdrop-blur-xl p-8 rounded-3xl border-l-2 border-t border-purple-500/10 shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute -top-3 -left-3 w-6 h-6 bg-purple-500 rounded-full"></div>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-purple-300 rounded-full"></div>
          
          {/* Header */}
          <div className="flex items-start mb-10 space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center transform rotate-6 shadow-lg">
              <img src="/api/placeholder/24/24" alt="Logo" className="w-6 h-6 invert" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-purple-400 to-purple-200">InterTrack</h1>
              <p className="text-purple-200/60 text-sm mt-1">Internship Showcase</p>
            </div>
          </div>
          
          {/* Form elements */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="userType" className="flex items-center text-sm font-medium text-purple-200">
                <span className="w-1 h-4 bg-purple-400 mr-2"></span>
                Select your affiliation
              </label>
              <div className="relative">
                <select
                  id="userType"
                  value={userType}
                  onChange={handleSelectChange}
                  className="w-full px-4 py-3 rounded-xl bg-purple-900/30 border border-purple-500/20 text-purple-100 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent appearance-none"
                >
                  <option value="" disabled>Choose your role</option>
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Admin">Admin</option>
                  <option value="Management">Management</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-purple-400">
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <button
                onClick={handleContinue}
                disabled={!userType}
                className="group w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-900 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-purple-800 to-purple-500"></span>
                <span className="relative flex items-center justify-center text-white font-medium">
                  <span>Proceed</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </button>
            </div>
            
            <div className="flex justify-center pt-4">
              <button
                onClick={handleBackToHome}
                className="text-purple-300/70 hover:text-purple-300 text-sm transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Return to landing page
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative side element */}
        <div className="absolute -right-6 top-1/4 h-1/2 w-3 bg-gradient-to-b from-purple-300 via-purple-500 to-purple-700 rounded-full blur-sm"></div>
      </div>
    </div>
  );
}