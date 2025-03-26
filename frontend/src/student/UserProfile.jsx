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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Basic Details</h3>
                <div className="mt-2 space-y-2">
                  <p className="text-gray-800">
                    <span className="font-medium">Name:</span> {profile.name}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">Email:</span> {profile.email}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">Phone:</span> {profile.phone}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">Date of Birth:</span>{" "}
                    {new Date(profile.dob).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Education</h3>
                <div className="mt-2 space-y-2">
                  <p className="text-gray-800">
                    <span className="font-medium">Degree:</span> {profile.degree}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">Field of Study:</span> {profile.fieldOfStudy}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">Year of Graduation:</span>{" "}
                    {profile.yearOfGraduation}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Skills</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Professional Links</h3>
                <div className="mt-2 space-y-2">
                  <p className="text-gray-800">
                    <span className="font-medium">LinkedIn:</span>{" "}
                    <a
                      href={profile.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profile.linkedIn}
                    </a>
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">GitHub:</span>{" "}
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profile.github}
                    </a>
                  </p>
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