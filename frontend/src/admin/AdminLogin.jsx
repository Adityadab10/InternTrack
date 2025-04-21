import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FiLock, FiKey, FiEye, FiEyeOff, FiAlertTriangle, FiShield, FiLogIn } from "react-icons/fi"

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const token = e.target.token.value;
    const password = e.target.password.value;

    // Check if both token and password are "123"
    if (token === "123" && password === "123") {
      setIsLoading(true)
      // Simulate successful login
      setTimeout(() => {
        setIsLoading(false)
        // Use navigate instead of window.location.href
        navigate('/admin/AdminDashboard')
      }, 1500)
    } else {
      alert("Invalid credentials. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Abstract background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-black">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-blue-500"
                style={{
                  width: `${Math.random() * 300 + 50}px`,
                  height: `${Math.random() * 300 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.3,
                  filter: 'blur(40px)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Security grid pattern */}
      <div className="absolute inset-0 bg-slate-900 opacity-40" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(25, 35, 60, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(25, 35, 60, 0.3) 1px, transparent 1px)',
          backgroundSize: '30px 30px' 
        }} />

      <div className="max-w-md w-full space-y-6 bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl border border-blue-100/20 relative z-10">
        {/* Logo/Badge - adjusted for mobile */}
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-xl sm:rounded-2xl shadow-md flex items-center justify-center transform rotate-45">
            <div className="transform -rotate-45">
              <FiShield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
          </div>
        </div>
        
        <div className="pt-6 sm:pt-8">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900">Admin Access</h2>
          <p className="mt-1 sm:mt-2 text-center text-xs sm:text-sm text-gray-600">
            <span className="font-medium text-blue-600">Restricted Area</span> • Authorized Only
          </p>
        </div>

        <form className="mt-4 sm:mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="token" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Admin Token
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiKey className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="token"
                  name="token"
                  type="text"
                  required
                  className="pl-9 sm:pl-10 block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md sm:rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-sm sm:text-base"
                  placeholder="Secure token"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="pl-9 sm:pl-10 block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md sm:rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-sm sm:text-base"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FiEye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-md sm:rounded-lg text-sm sm:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md sm:shadow-lg"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <FiLogIn className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 group-hover:text-blue-300" />
                  </span>
                  Access Panel
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500 text-xs sm:text-sm">
              Forgot credentials?
            </a>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 bg-white text-gray-500">Security Notice</span>
            </div>
          </div>
          
          <div className="text-xs text-center text-gray-500">
            <div className="flex items-center justify-center mb-1">
              <FiAlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mr-1" />
              <span>Unauthorized access will be logged</span>
            </div>
            <p className="text-xs">Contact system administrator for assistance</p>
          </div>
        </form>
      </div>
    </div>
  )
}