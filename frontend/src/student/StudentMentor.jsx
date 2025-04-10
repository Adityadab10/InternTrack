import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';

const StudentMentor = () => {
  const [studentProfile, setStudentProfile] = useState(null);
  const [mentorDetails, setMentorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const { messages = [], sendMessage, registerUser } = useWebSocket() || {};
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (user?._id && registerUser) {
      registerUser(user._id, 'student');
    }
  }, [user]);

  useEffect(() => {
    const fetchProfileAndMentor = async () => {
      try {
        setLoading(true);

        const profileResponse = await fetch(
          `http://localhost:5000/api/student-profile/by-email/${user.email}`,
          {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch student profile');
        }

        const profileData = await profileResponse.json();
        setStudentProfile(profileData);

        if (profileData.mentor) {
          const mentorResponse = await fetch(
            `http://localhost:5000/api/mentors/${profileData.mentor}`,
            {
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
            }
          );

          if (mentorResponse.ok) {
            const mentorData = await mentorResponse.json();
            setMentorDetails(mentorData);
          } else {
            console.error('Failed to fetch mentor details');
          }
        }

        setError(null);
      } catch (err) {
        console.error('Error:', err);
        setError('Unable to load mentor information');
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchProfileAndMentor();
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
        <div className="space-y-6">
          {/* Mentor Card */}
          <div className="bg-black/30 rounded-lg p-6 border border-purple-500/30">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
                {mentorDetails?.name?.[0] || 'M'}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-200">
                  {mentorDetails?.name || 'Loading...'}
                </h3>
                <p className="text-purple-400">{mentorDetails?.department}</p>
              </div>
            </div>

            {/* Mentor Info */}
            {mentorDetails && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                    <p className="text-purple-300 font-medium">Department</p>
                    <p className="text-purple-100">{mentorDetails.department}</p>
                  </div>
                  <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                    <p className="text-purple-300 font-medium">Expertise</p>
                    <p className="text-purple-100">{mentorDetails.expertise}</p>
                  </div>
                  <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                    <p className="text-purple-300 font-medium">Email</p>
                    <p className="text-purple-100">{mentorDetails.email}</p>
                  </div>
                  <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                    <p className="text-purple-300 font-medium">Students Mentoring</p>
                    <p className="text-purple-100">
                      {mentorDetails.currentStudents?.length || 0}/{mentorDetails.maxStudents || 5}
                    </p>
                  </div>
                </div>

                {/* Email Contact */}
                <div className="mt-6">
                  <a
                    href={`mailto:${mentorDetails.email}`}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Mentor
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* WebSocket Chat Section */}
          {mentorDetails && (
            <div className="mt-10 bg-purple-950/30 p-4 rounded-lg border border-purple-500/20">
              <h3 className="text-lg font-semibold text-purple-200 mb-2">
                Chat with Mentor
              </h3>

              <div className="h-60 overflow-y-auto bg-black/20 rounded p-3 space-y-2 text-sm">
                {messages
                  .filter((msg) => {
                    // Show messages where:
                    return (
                      // Student is sender and recipient is faculty
                      (msg.senderId === user.email && msg.recipientId === 'FACULTY') ||
                      // Faculty is sender and recipient is this student
                      (msg.senderRole === 'faculty' && msg.recipientId === user.email)
                    );
                  })
                  .map((msg, index) => (
                    <div
                      key={`${msg.timestamp}-${index}`}
                      className={`flex ${msg.senderId === user.email ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs p-2 rounded ${
                          msg.senderId === user.email
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-200 text-black'
                        }`}
                      >
                        <p className="font-medium text-xs">
                          {msg.senderId === user.email ? 'You' : msg.senderName || 'Faculty'}
                        </p>
                        <p>{msg.message}</p>
                        <p className="text-[10px] text-gray-200 text-right">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newMessage.trim()) {
                    sendMessage(
                      'FACULTY', // Using 'FACULTY' as a broadcast identifier
                      newMessage,
                      {
                        senderRole: 'student',
                        senderName: user?.name || 'Student',
                        senderEmail: user?.email,
                        mentorId: mentorDetails?._id,
                        studentId: user?._id
                      }
                    );
                    setNewMessage('');
                  }
                }}
                className="flex mt-3 gap-2"
              >
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-3 py-2 rounded bg-black/30 border border-purple-400 text-white placeholder:text-purple-300"
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                >
                  Send
                </button>
              </form>
            </div>
          )}
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
