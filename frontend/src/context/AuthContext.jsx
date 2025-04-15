import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);

  // Initialize authentication state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Verify token with backend
          const response = await axios.get('http://localhost:5001/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.data.valid) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            // Clear invalid token
            localStorage.removeItem('authToken');
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        email: userData.email,
        uid: userData.uid
      }, {
        withCredentials: true
      });

      const { token, user: userDetails } = response.data;
      localStorage.setItem('authToken', token);
      setUser(userDetails);
      setIsAuthenticated(true);
      return userDetails;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('authToken');
      localStorage.removeItem('studentProfile');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const verifyMentor = async (file) => {
    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await axios.post(
        'http://localhost:5001/api/mentor/verify-document',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      setVerificationStatus(response.data.isVerified);
      return response.data.isVerified;
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationStatus(false);
      throw error;
    }
  };

  const handleFacultyLogin = async (email, role) => {
    try {
      // ... existing login logic ...
      
      if (role === 'mentor') {
        navigate('/faculty/mentor-dashboard');
      } else if (role === 'instructor') {
        navigate('/faculty/instructor-dashboard');
      }
      
    } catch (error) {
      throw error;
    }
  };

  // Add axios interceptor for token handling
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      config => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      logout,
      verifyMentor,
      verificationStatus,
      handleFacultyLogin
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);