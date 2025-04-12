import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check localStorage on initial load
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [verificationStatus, setVerificationStatus] = useState(null);

  // Update localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await signOut(auth); // Firebase signout
      setUser(null); // Clear user from context
      // Clear any stored tokens or user data
      localStorage.removeItem('user');
    } catch (error) {
      throw error;
    }
  };

  const verifyMentor = async (file) => {
    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await axios.post(
        'http://localhost:5000/api/mentor/verify-document',
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      verifyMentor,
      verificationStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);