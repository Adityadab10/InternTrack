import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import InternshipCard from './InternshipCard.jsx';

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

const ProfileContent = () => {
  const { user } = useAuth();
  const [approvedInternships, setApprovedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApprovedInternships = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/application-status/approved/${user.email}`,
          {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch approved internships');
        }

        const data = await response.json();
        setApprovedInternships(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching approved internships:', err);
        setError('Failed to load internships');
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchApprovedInternships();
    }
  }, [user?.email]);

  const handleTaskToggle = async (internshipId, taskIndex) => {
    try {
      // Update local state first for immediate feedback
      setApprovedInternships(prevInternships => 
        prevInternships.map(internship => {
          if (internship._id === internshipId) {
            const newTaskStatus = [...(internship.taskStatus || Array(internship.tasks.length).fill(false))];
            newTaskStatus[taskIndex] = !newTaskStatus[taskIndex];
            return {
              ...internship,
              taskStatus: newTaskStatus
            };
          }
          return internship;
        })
      );

      // Then update the server
      const response = await fetch(`http://localhost:5000/api/application-status/${internshipId}/tasks`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          taskIndex,
          completed: !approvedInternships.find(i => i._id === internshipId)?.taskStatus?.[taskIndex]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update task status');
      }

      // Update state with server response
      if (data.success) {
        setApprovedInternships(prevInternships => 
          prevInternships.map(internship => {
            if (internship._id === internshipId) {
              return {
                ...internship,
                taskStatus: data.taskStatus
              };
            }
            return internship;
          })
        );
      }

    } catch (error) {
      console.error('Error updating task status:', error);
      // Silently revert the change without showing alert
      setApprovedInternships(prevInternships => 
        prevInternships.map(internship => {
          if (internship._id === internshipId) {
            return {
              ...internship,
              taskStatus: [...(internship.taskStatus || Array(internship.tasks.length).fill(false))]
            };
          }
          return internship;
        })
      );
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading internships...</div>;
  }

  if (error) {
    return <div className="text-red-600 py-4">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Active Internships</h2>
        {approvedInternships.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">No active internships found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
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