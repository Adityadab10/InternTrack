// LoginPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase"; // Updated import path
import { signInWithPopup } from "firebase/auth";
import { useAuth } from '../context/AuthContext';

const StudentLogin = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth(); // Assuming your AuthContext has a login method

  const handleGoogleSignIn = async () => {
    try {
      // Clear any existing errors
      setError(null);

      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      
      // Update the auth context
      await login(result.user);

      // Navigate directly to dashboard first
      navigate('/student/StudentDashboard');

      // Check if profile exists in the background
      try {
        const response = await fetch(`http://localhost:5001/api/student-profile/${result.user.email}`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (response.ok) {
          const profile = await response.json();
          localStorage.setItem('studentProfile', JSON.stringify(profile));
        }
      } catch (error) {
        console.error("Profile check error:", error);
        // Don't redirect here, let the dashboard handle profile checks
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError("Failed to sign in. Please try again.");
    }
  };

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      const savedProfile = localStorage.getItem('studentProfile');
      if (savedProfile) {
        navigate('/student/StudentDashboard');
      }
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 to-black">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">Student Login</h1>
        {user ? (
          <div className="text-center text-white">
            <h2 className="text-lg font-medium">Welcome, {user.displayName}</h2>
            <img
              src={user.photoURL}
              alt="User Avatar"
              className="w-16 h-16 rounded-full mx-auto my-4"
            />
            <p>{user.email}</p>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={() => auth.signOut().then(() => setUser(null))}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                alt="Google Logo"
                className="w-6 h-6 mr-2 bg-white rounded-full p-1"
              />
              Sign in with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentLogin;
