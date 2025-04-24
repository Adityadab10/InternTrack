import React, { useState, useEffect } from 'react';
import StatusBadge from './StatusBadge';
import axios from 'axios';

const ProgressMonitoring = () => {
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

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
        // Updated endpoint to the correct one
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

        console.log('Enhanced students:', enhancedStudents); // For debugging
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Internship Progress Monitoring</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {students.map(student => (
          <div key={student.id} className="border-b border-gray-200 last:border-b-0">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={() => toggleExpand(student.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-medium">{student.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-medium">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.company} - {student.role}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="w-32">
                  <div className="text-sm text-gray-600 mb-1">Progress</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 rounded-full h-2" 
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                </div>
                <StatusBadge status={student.status} />
                <span className="text-sm text-gray-500">Updated: {student.lastUpdate}</span>
                <span className="text-gray-400">
                  {expandedStudent === student.id ? '▲' : '▼'}
                </span>
              </div>
            </div>
            
            {expandedStudent === student.id && (
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium mb-2">Current Projects</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {student.projects.map((project, idx) => (
                        <li key={idx} className="text-gray-600">{project}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium mb-2">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {student.technologies.map((tech, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <h4 className="font-medium mb-3">Milestones</h4>
                <div className="space-y-3">
                  {student.milestones.map(milestone => (
                    <div key={milestone.id} className="flex items-center justify-between p-3 bg-white rounded shadow-sm">
                      <div>
                        <p className="font-medium">{milestone.name}</p>
                        <p className="text-sm text-gray-500">Due: {milestone.dueDate}</p>
                      </div>
                      <div>
                        {milestone.completed ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Completed on {milestone.completionDate}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-3">Mentor Feedback</h4>
                  <div className="space-y-3">
                    {student.mentorFeedback.map((feedback, idx) => (
                      <div key={idx} className="bg-white p-3 rounded shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">{feedback.date}</p>
                        <p className="text-gray-700">{feedback.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium mb-2">Add Feedback</h4>
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="Type your feedback..." 
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
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