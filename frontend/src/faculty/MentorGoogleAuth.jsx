import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useAuth } from '../context/AuthContext'; // Add this import

const MentorGoogleAuth = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Use auth context
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        // Store user data in auth context
        await login({
          email: result.user.email,
          name: result.user.displayName,
          photoURL: result.user.photoURL,
        });

        // Navigate to mentor registration with user data
        navigate('/faculty/mentor-registration', { 
          state: { 
            email: result.user.email,
            name: result.user.displayName,
            photoURL: result.user.photoURL
          },
          replace: true // Replace current history entry
        });
      }
    } catch (error) {
      console.error('Google Sign In Error:', error);
      setError('Sign in failed. Please try again.');
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
          <div className="w-16 h-16 bg-purple-700 rounded-full mx-auto flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Mentor Authentication</h1>
          <p className="text-purple-200">Sign in with your Google account to continue</p>
        </div>

        <motion.button
          onClick={handleGoogleSignIn}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className={`w-full p-4 ${loading ? 'bg-white/5 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'} 
            border border-purple-500/30 rounded-xl text-white flex items-center justify-center space-x-3 
            transition-all duration-300`}
        >
          {loading ? (
            <div className="flex items-center space-x-3">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Authenticating...</span>
            </div>
          ) : (
            <>
              <img src="/google.svg" alt="Google" className="w-5 h-5" />
              <span>Continue with Google</span>
            </>
          )}
        </motion.button>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-center"
          >
            <p className="text-red-200 text-sm">{error}</p>
          </motion.div>
        )}

        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/faculty/login')}
            className="text-sm text-purple-300 hover:text-purple-200 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to login options
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MentorGoogleAuth;