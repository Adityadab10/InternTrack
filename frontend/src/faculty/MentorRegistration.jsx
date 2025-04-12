import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const MentorRegistration = () => {
  const navigate = useNavigate();
  const { user, verifyMentor, verificationStatus } = useAuth(); // Get user from auth context

  const [formData, setFormData] = useState({
    name: '',
    department: '',
    expertise: '',
    email: '',
    maxStudents: 5
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Pre-fill email from Google Auth
    if (user?.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email
      }));
    } else {
      // Redirect if no authenticated user
      navigate('/faculty/mentor-login');
    }
  }, [user, navigate]);

  const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Information Technology',
    'Chemical',
    'Biotechnology'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsVerifying(true);
    try {
      await verifyMentor(file);
    } catch (error) {
      setVerificationMessage(error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/mentor/register', formData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true // Add this line
      });

      if (response.data) {
        // Show success message
        console.log('Registration successful:', response.data);
        navigate('/faculty/mentor-dashboard');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-black p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Complete Mentor Profile</h1>
          <p className="text-purple-200">Using email: {formData.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-200">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-purple-500/30 
                text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-200">Department</label>
            <select
              name="department"
              required
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-purple-500/30 
                text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-200">Area of Expertise</label>
            <input
              type="text"
              name="expertise"
              required
              value={formData.expertise}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-purple-500/30 
                text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              placeholder="e.g., Machine Learning, VLSI, etc."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-200">Maximum Students</label>
            <input
              type="number"
              name="maxStudents"
              required
              min="1"
              max="10"
              value={formData.maxStudents}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-purple-500/30 
                text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-200">
              Upload Identity Proof
              <span className="text-xs text-purple-400 ml-2">
                (Faculty ID Card/Appointment Letter)
              </span>
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-purple-500/30 
                text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50
                file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                file:text-sm file:font-semibold file:bg-purple-500/20
                file:text-purple-200 hover:file:bg-purple-500/30"
            />

            {isVerifying && (
              <div className="flex items-center space-x-2 text-purple-200">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Verifying document...</span>
              </div>
            )}

            {verificationStatus !== null && (
              <div className={`p-4 rounded-lg ${
                verificationStatus ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'
              } border`}>
                <p className={`text-sm ${
                  verificationStatus ? 'text-green-400' : 'text-red-400'
                }`}>
                  {verificationStatus ? 'Mentor verification successful!' : 'Verification failed. Please try again with a valid document.'}
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/30 text-center">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <motion.button
            type="submit"
            disabled={loading || !verificationStatus || isVerifying}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-4 ${loading ? 'bg-purple-700/50' : 'bg-purple-600 hover:bg-purple-700'} 
              text-white font-medium rounded-lg transition duration-200 flex items-center justify-center`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              'Complete Registration'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default MentorRegistration;
