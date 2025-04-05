import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const StudentMentor = () => {
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        // Fetch student profile using email
        const response = await fetch(
          `http://localhost:5000/api/student-profile/by-email/${user.email}`,
          { 
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch student profile');
        }

        const data = await response.json();
        setStudentProfile(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching student profile:', err);
        setError('Unable to load profile information');
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchStudentProfile();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/20 via-black/40 to-indigo-900/20 rounded-lg p-6 border border-purple-500/30">
      <h2 className="text-2xl font-bold text-purple-300 mb-6">Your Mentor</h2>
      
      {studentProfile?.mentor ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
              M
            </div>
            <div>
              <h3 className="text-xl font-semibold text-purple-200">
                Mentor ID
              </h3>
              <p className="text-purple-300">{studentProfile.mentor}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-purple-300">
          <p>No mentor has been assigned yet.</p>
        </div>
      )}
    </div>
  );
};

export default StudentMentor;