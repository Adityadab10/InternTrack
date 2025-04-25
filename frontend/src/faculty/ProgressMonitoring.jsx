import React, { useState, useEffect } from 'react';
import StatusBadge from './StatusBadge';
import axios from 'axios';
import { FiChevronDown, FiChevronUp, FiCheck, FiClock, FiMessageSquare, FiSend } from 'react-icons/fi';

const ProgressMonitoring = () => {
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  // Static internship data pool to randomly assign
  const internshipPool = [
    {
      company: 'Microsoft',
      role: 'Software Development Intern',
      projects: ['Azure Cloud Integration', 'Teams API Development', 'Windows App Feature'],
      technologies: ['C#', '.NET', 'Azure', 'React']
    },
    {
      company: 'Google',
      role: 'Data Science Intern',
      projects: ['Search Analytics', 'User Behavior Analysis', 'ML Model Optimization'],
      technologies: ['Python', 'TensorFlow', 'BigQuery', 'Data Studio']
    },
    {
      company: 'Amazon',
      role: 'Full Stack Developer Intern',
      projects: ['AWS Lambda Functions', 'Shopping Cart Optimization', 'Prime Video Features'],
      technologies: ['Node.js', 'React', 'AWS', 'DynamoDB']
    },
    {
      company: 'Meta',
      role: 'Frontend Engineering Intern',
      projects: ['Instagram Stories Feature', 'React Component Library', 'Performance Optimization'],
      technologies: ['React', 'TypeScript', 'GraphQL', 'Jest']
    },
    {
      company: 'IBM',
      role: 'Cloud Engineering Intern',
      projects: ['IBM Cloud Migration', 'Kubernetes Deployment', 'CI/CD Pipeline'],
      technologies: ['Docker', 'Kubernetes', 'Jenkins', 'Go']
    }
  ];

  // Generate random milestones based on company
  const generateMilestones = (company) => {
    const baselineMilestones = [
      { name: 'Orientation & Onboarding', duration: '1 week' },
      { name: 'Project Assignment', duration: '1 week' },
      { name: 'Initial Development Phase', duration: '2 weeks' },
      { name: 'Mid-term Evaluation', duration: '1 week' },
      { name: 'Feature Implementation', duration: '3 weeks' },
      { name: 'Testing & Documentation', duration: '2 weeks' },
      { name: 'Final Presentation', duration: '1 week' }
    ];

    const currentDate = new Date();
    let lastDate = currentDate;
    
    return baselineMilestones.map((milestone, index) => {
      const dueDate = new Date(lastDate);
      dueDate.setDate(dueDate.getDate() + (parseInt(milestone.duration) * 7));
      lastDate = dueDate;

      return {
        id: index + 1,
        name: milestone.name,
        dueDate: dueDate.toLocaleDateString(),
        completed: index < 3, // First 3 milestones are completed
        completionDate: index < 3 ? new Date(dueDate.getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000).toLocaleDateString() : null
      };
    });
  };

  // Fetch real students and combine with fake internship data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/student-profiles');
        
        if (!response.data.success) {
          throw new Error('Failed to fetch student profiles');
        }

        // Map real students to enhanced profiles with random internship data
        const enhancedStudents = response.data.data.map(student => {
          const randomInternship = internshipPool[Math.floor(Math.random() * internshipPool.length)];
          const progressPercentage = Math.floor(Math.random() * (100 - 30) + 30);
          
          return {
            id: student._id,
            name: student.name || 'N/A',
            email: student.email || 'N/A',
            degree: student.degree || 'N/A',
            fieldOfStudy: student.fieldOfStudy || 'N/A',
            company: randomInternship.company,
            role: randomInternship.role,
            status: progressPercentage === 100 ? 'completed' : 'ongoing',
            progress: progressPercentage,
            projects: randomInternship.projects,
            technologies: randomInternship.technologies,
            milestones: generateMilestones(randomInternship.company),
            lastUpdate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            mentorFeedback: [
              {
                date: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                comment: `Great progress on ${randomInternship.projects[0]}. Keep up the good work!`
              },
              {
                date: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                comment: `Successfully implemented ${randomInternship.technologies[0]} in the project.`
              }
            ]
          };
        });

        setStudents(enhancedStudents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        // Set some dummy data if API fails
        const dummyStudents = [
          {
            id: '1',
            name: 'Sample Student',
            email: 'sample@example.com',
            degree: 'B.Tech',
            fieldOfStudy: 'Computer Science',
            company: internshipPool[0].company,
            role: internshipPool[0].role,
            status: 'ongoing',
            progress: 65,
            projects: internshipPool[0].projects,
            technologies: internshipPool[0].technologies,
            milestones: generateMilestones(internshipPool[0].company),
            lastUpdate: new Date().toLocaleDateString(),
            mentorFeedback: []
          }
        ];
        setStudents(dummyStudents);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const toggleExpand = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const handleSendFeedback = (studentId) => {
    if (!feedback.trim()) return;
    
    setStudents(prevStudents => 
      prevStudents.map(student => {
        if (student.id === studentId) {
          return {
            ...student,
            mentorFeedback: [
              {
                date: new Date().toLocaleDateString(),
                comment: feedback
              },
              ...student.mentorFeedback
            ]
          };
        }
        return student;
      })
    );
    
    setFeedback('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
            Progress Monitoring
          </h1>
          <p className="text-purple-300/80 mt-2">Track and manage student internship progress</p>
        </div>
      </div>

      <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-xl overflow-hidden">
        {students.map(student => (
          <div key={student.id} className="border-b border-purple-500/20 last:border-b-0">
            <div 
              className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-purple-900/10 transition-colors"
              onClick={() => toggleExpand(student.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white">
                  <span className="font-medium">{student.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-medium text-white">{student.name}</h3>
                  <p className="text-sm text-purple-300">{student.company} - {student.role}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
                <div className="w-full sm:w-40">
                  <div className="text-sm text-purple-400 mb-1">Progress</div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full h-2" 
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-purple-300 mt-1">{student.progress}% complete</div>
                </div>
                <div className="min-w-[120px]">
                  <StatusBadge status={student.status} />
                </div>
                <div className="text-sm text-purple-400">Updated: {student.lastUpdate}</div>
                <div className="text-purple-400 ml-auto">
                  {expandedStudent === student.id ? (
                    <FiChevronUp className="w-5 h-5" />
                  ) : (
                    <FiChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>
            </div>
            
            {expandedStudent === student.id && (
              <div className="p-6 bg-gray-900/50">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-800 p-5 rounded-xl border border-purple-500/20">
                    <h4 className="text-lg font-semibold text-purple-300 mb-4">Current Projects</h4>
                    <ul className="space-y-3">
                      {student.projects.map((project, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-purple-500 mt-0.5">
                            <FiCheck />
                          </div>
                          <p className="ml-3 text-purple-100">{project}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-800 p-5 rounded-xl border border-purple-500/20">
                    <h4 className="text-lg font-semibold text-purple-300 mb-4">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {student.technologies.map((tech, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-purple-900/50 text-purple-200 rounded-full text-sm border border-purple-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-purple-300 mb-4">Milestones</h4>
                <div className="space-y-3 mb-6">
                  {student.milestones.map(milestone => (
                    <div key={milestone.id} className="bg-gray-800 p-4 rounded-lg border border-purple-500/20 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{milestone.name}</p>
                        <p className="text-sm text-purple-400">Due: {milestone.dueDate}</p>
                      </div>
                      <div>
                        {milestone.completed ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-900/50 text-green-300 border border-green-500/30 text-sm">
                            <FiCheck className="mr-1" />
                            Completed on {milestone.completionDate}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-900/50 text-yellow-300 border border-yellow-500/30 text-sm">
                            <FiClock className="mr-1" />
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-purple-300 mb-4">Mentor Feedback</h4>
                  <div className="space-y-3">
                    {student.mentorFeedback.map((feedback, idx) => (
                      <div key={idx} className="bg-gray-800 p-4 rounded-lg border border-purple-500/20">
                        <p className="text-sm text-purple-400 mb-2">{feedback.date}</p>
                        <p className="text-purple-100">{feedback.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-purple-500/20">
                  <h4 className="text-lg font-semibold text-purple-300 mb-4">Add Feedback</h4>
                  <div className="flex space-x-3">
                    <input 
                      type="text" 
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Type your feedback..." 
                      className="flex-1 bg-gray-800 border border-purple-500/30 text-white placeholder-purple-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    />
                    <button 
                      onClick={() => handleSendFeedback(student.id)}
                      className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-colors flex items-center"
                    >
                      <FiSend className="mr-2" />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressMonitoring;