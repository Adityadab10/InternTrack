import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/student-profile/${user.email}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const profileData = await response.json();
        setProfile(profileData);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user.email]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100/10 border border-red-400 text-red-400 px-4 py-3 rounded-lg">
        <p className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
          </svg>
          {error}
        </p>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-4">No profile found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
  <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
    {/* Profile Header */}
    <div className="mb-10 text-center">
      <div className="relative inline-block">
        <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-4xl font-bold text-white mb-4 mx-auto">
          {profile?.name?.[0] || user?.email?.[0]?.toUpperCase()}
        </div>
        <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-gray-900"></div>
      </div>
      <h1 className="text-3xl font-bold text-white mt-4">{profile?.name}</h1>
      <p className="text-purple-300">{profile?.email}</p>
    </div>

    {/* Main Content Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column */}
      <div className="space-y-8">
        {/* Personal Information Card */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-xl hover:shadow-purple-500/10 transition-shadow">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-purple-900/50 rounded-lg mr-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Personal Information</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-purple-900/20 p-4 rounded-lg">
                <p className="text-sm text-purple-300 mb-1">Phone</p>
                <p className="text-white">{profile?.phone}</p>
              </div>
              <div className="bg-purple-900/20 p-4 rounded-lg">
                <p className="text-sm text-purple-300 mb-1">Date of Birth</p>
                <p className="text-white">{new Date(profile?.dob).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Education Card */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-xl hover:shadow-purple-500/10 transition-shadow">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-purple-900/50 rounded-lg mr-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0L3 9m9 5v7m0-7l9-5" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Education</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm text-purple-300 mb-1">Degree</p>
              <p className="text-white">{profile?.degree}</p>
            </div>
            <div className="bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm text-purple-300 mb-1">Field of Study</p>
              <p className="text-white">{profile?.fieldOfStudy}</p>
            </div>
            <div className="bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm text-purple-300 mb-1">Graduation Year</p>
              <p className="text-white">{profile?.yearOfGraduation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-8">
        {/* Skills Card */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-xl hover:shadow-purple-500/10 transition-shadow">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-purple-900/50 rounded-lg mr-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Skills</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile?.skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-purple-900/40 text-purple-200 rounded-full text-sm border border-purple-500/30 hover:bg-purple-800/40 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Professional Links Card */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-xl hover:shadow-purple-500/10 transition-shadow">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-purple-900/50 rounded-lg mr-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Professional Links</h2>
          </div>

          <div className="space-y-4">
            {profile?.linkedIn && (
              <a
                href={profile.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-purple-900/20 rounded-lg hover:bg-purple-800/30 transition-colors group"
              >
                <svg className="w-6 h-6 text-purple-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span className="text-white group-hover:text-purple-200">LinkedIn Profile</span>
              </a>
            )}

            {profile?.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-purple-900/20 rounded-lg hover:bg-purple-800/30 transition-colors group"
              >
                <svg className="w-6 h-6 text-purple-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-white group-hover:text-purple-200">GitHub Profile</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default UserProfile;