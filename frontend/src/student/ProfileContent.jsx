import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ProgressCircle = ({ percentage }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 transform -rotate-90">
        <circle
          className="text-gray-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="48"
          cy="48"
        />
        <circle
          className="text-blue-600"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="48"
          cy="48"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
        {Math.round(percentage)}%
      </span>
    </div>
  );
};

const InternshipCard = ({ internship, onTaskToggle }) => {
  const completedTasks = internship.tasks.filter(task => task.completed).length;
  const totalTasks = internship.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-blue-600">
            {internship.internshipTitle}
          </h3>
          <p className="text-gray-600">{internship.company}</p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          Approved
        </span>
      </div>
      
      <div className="mt-4 flex gap-6">
        <div className="flex-1">
          <h4 className="font-medium text-gray-700 mb-2">Assigned Tasks:</h4>
          <ul className="space-y-2">
            {internship.tasks.map((task, index) => (
              <li key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onTaskToggle(internship._id, index)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className={`text-gray-600 ${task.completed ? 'line-through' : ''}`}>
                  {task.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-center justify-center">
          <ProgressCircle percentage={progress} />
          <p className="text-sm text-gray-600 mt-2">Progress</p>
        </div>
      </div>
    </div>
  );
};

const ProfileContent = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [approvedInternships, setApprovedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, internshipsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/student-profile/${user.email}`, {
            credentials: 'include'
          }),
          fetch(`http://localhost:5000/api/application-status/student/${user.email}`, {
            credentials: 'include'
          })
        ]);

        if (!profileRes.ok) {
          throw new Error('Failed to fetch profile');
        }

        const profileData = await profileRes.json();
        setProfile(profileData);

        if (internshipsRes.ok) {
          const internshipsData = await internshipsRes.json();
          // Transform tasks into objects with completion status
          const internshipsWithTaskStatus = internshipsData
            .filter(app => app.status === 'Accepted')
            .map(internship => ({
              ...internship,
              tasks: internship.tasks.map((task, index) => ({
                text: task,
                completed: internship.taskStatus ? internship.taskStatus[index] : false
              }))
            }));
          console.log('Transformed internships:', internshipsWithTaskStatus); // Debug log
          setApprovedInternships(internshipsWithTaskStatus);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.email]);

  const handleTaskToggle = async (internshipId, taskIndex) => {
    try {
      const updatedInternships = approvedInternships.map(internship => {
        if (internship._id === internshipId) {
          const updatedTasks = [...internship.tasks];
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            completed: !updatedTasks[taskIndex].completed
          };
          return { ...internship, tasks: updatedTasks };
        }
        return internship;
      });

      setApprovedInternships(updatedInternships);

      const updatedInternship = updatedInternships.find(i => i._id === internshipId);
      await fetch(`http://localhost:5000/api/application-status/tasks/${internshipId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          taskIndex,
          completed: updatedInternship.tasks[taskIndex].completed
        })
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      // Revert the change if the update fails
      setApprovedInternships(prev => [...prev]);
    }
  };

  if (loading) return <div className="text-center">Loading profile...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!profile) return <div className="text-center">No profile found</div>;

  return (
    <div className="space-y-8">
      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
          <button className="text-blue-600 hover:text-blue-800">
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Personal Details</h3>
            <div className="space-y-3">
              <p className="text-gray-600">
                <span className="font-medium">Name:</span> {profile.name}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {profile.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Phone:</span> {profile.phone}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Date of Birth:</span>{' '}
                {new Date(profile.dob).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Academic Information</h3>
            <div className="space-y-3">
              <p className="text-gray-600">
                <span className="font-medium">Degree:</span> {profile.degree}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Field of Study:</span> {profile.fieldOfStudy}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Year of Graduation:</span>{' '}
                {profile.yearOfGraduation}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Skills & Links</h3>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
            <p className="text-gray-600">
              <span className="font-medium">LinkedIn:</span>{' '}
              <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {profile.linkedIn}
              </a>
            </p>
            <p className="text-gray-600">
              <span className="font-medium">GitHub:</span>{' '}
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {profile.github}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Resume</h3>
          <a
            href={`http://localhost:5000/${profile.resumeUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <span>View Resume</span>
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Internships Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Internships</h2>
        {approvedInternships.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No internships completed yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {approvedInternships.map((internship) => (
              <InternshipCard
                key={internship._id}
                internship={internship}
                onTaskToggle={handleTaskToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileContent; 