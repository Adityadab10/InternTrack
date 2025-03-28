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
        const response = await fetch(`http://localhost:5000/api/student-profile/${user.email}`, {
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
    return <div className="text-center py-4">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-red-600 py-4">{error}</div>;
  }

  if (!profile) {
    return <div className="text-center py-4">No profile found</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-purple-300 mb-6">Personal Information</h2>
        <div className="bg-gradient-to-br from-purple-900/20 via-black/40 to-indigo-900/20 rounded-lg border border-purple-500/30 p-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-purple-300">Basic Details</h3>
                <div className="mt-2 space-y-2">
                  <p className="text-purple-100">
                    <span className="font-medium text-purple-300">Name:</span> {profile.name}
                  </p>
                  <p className="text-purple-100">
                    <span className="font-medium text-purple-300">Email:</span> {profile.email}
                  </p>
                  <p className="text-purple-100">
                    <span className="font-medium text-purple-300">Phone:</span> {profile.phone}
                  </p>
                  <p className="text-purple-100">
                    <span className="font-medium text-purple-300">Date of Birth:</span>{" "}
                    {new Date(profile.dob).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-purple-300">Education</h3>
                <div className="mt-2 space-y-2 text-purple-100/80">
                  <p className="text-purple-100">
                    <span className="font-medium text-purple-300">Degree:</span> {profile.degree}
                  </p>
                  <p className="text-purple-100">
                    <span className="font-medium text-purple-300">Field of Study:</span> {profile.fieldOfStudy}
                  </p>
                  <p className="text-purple-100">
                    <span className="font-medium text-purple-300">Year of Graduation:</span>{" "}
                    {profile.yearOfGraduation}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-purple-300">Skills</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-900/50 text-purple-200 rounded-full text-sm border border-purple-500/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-purple-300">Professional Links</h3>
                <div className="mt-2 space-y-2 text-purple-100/80">
                  <p className="text-purple-100">
                    <span className="font-medium text-purple-300">LinkedIn:</span>{" "}
                    <a
                      href={profile.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:text-purple-200 hover:underline transition-colors"
                    >
                      {profile.linkedIn}
                    </a>
                  </p>
                  <p className="text-purple-100">
                    <span className="font-medium text-purple-300">GitHub:</span>{" "}
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:text-purple-200 hover:underline transition-colors"
                    >
                      {profile.github}
                    </a>
                  </p>
                  
                  {profile?.resumeFile && (
                    <p className="text-purple-100">
                      <span className="font-medium text-purple-300">Resume:</span>{" "}
                      <a
                        href={`http://localhost:5000/uploads/resumes/${profile.resumeFile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-purple-300 hover:text-purple-200 hover:underline transition-colors"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 mr-2" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                          />
                        </svg>
                        View Resume
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Note: Resume section is removed as it's shown in Your Internships */}
    </div>
  );
};

export default UserProfile; 