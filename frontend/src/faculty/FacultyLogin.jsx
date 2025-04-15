import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const InstructorLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    instructorId: "123",
    email: "adityadab27@gmail.com",
    accessPin: "123"
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Verify hardcoded credentials
    if (
      formData.instructorId === "123" &&
      formData.email === "adityadab27@gmail.com" &&
      formData.accessPin === "123"
    ) {
      try {
        await login(formData);
        navigate('/faculty/instructor-dashboard');
      } catch (error) {
        setError('Login failed. Please try again.');
        console.error('Login failed:', error);
      }
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-900 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-3">
            <img src="/instructor-icon.svg" alt="Instructor Icon" className="w-8 h-8 invert" />
          </div>
          <h2 className="text-2xl font-bold text-white">Course Instructor Login</h2>
          <p className="text-sm text-indigo-200 mt-1 text-center">
            Access your teaching dashboard and student records
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="instructorId" className="block text-sm text-indigo-300 mb-1">Instructor ID</label>
            <input
              id="instructorId"
              name="instructorId"
              type="text"
              value={formData.instructorId}
              onChange={handleChange}
              required
              placeholder="Enter your instructor ID"
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-indigo-500 text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-indigo-300 mb-1">Official Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your official email"
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-indigo-500 text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="accessPin" className="block text-sm text-indigo-300 mb-1">Access PIN</label>
            <input
              id="accessPin"
              name="accessPin"
              type="password"
              value={formData.accessPin}
              onChange={handleChange}
              required
              placeholder="Enter your access PIN"
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-indigo-500 text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-indigo-300 hover:text-indigo-100">
            ← Back to user selection
          </a>
        </div>
      </div>
    </div>
  );
};

export default InstructorLogin;
