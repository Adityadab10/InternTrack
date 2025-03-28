import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useAuth } from '../context/AuthContext';

const degreeOptions = [
  { value: "Bachelors", label: "Bachelors" },
  { value: "Masters", label: "Masters" },
  { value: "PhD", label: "PhD" },
];

const fieldOfStudyOptions = [
  { value: "Computer Science", label: "Computer Science" },
  { value: "Mechanical Engineering", label: "Mechanical Engineering" },
  { value: "Electrical Engineering", label: "Electrical Engineering" },
  { value: "Civil Engineering", label: "Civil Engineering" },
  { value: "Marketing", label: "Marketing" },
  { value: "Finance", label: "Finance" },
];

const skillsOptions = [
  { value: "JavaScript", label: "JavaScript" },
  { value: "Python", label: "Python" },
  { value: "React", label: "React" },
  { value: "Node.js", label: "Node.js" },
  { value: "Java", label: "Java" },
  { value: "SQL", label: "SQL" },
  { value: "Machine Learning", label: "Machine Learning" },
  { value: "Data Analysis", label: "Data Analysis" },
  { value: "Communication", label: "Communication" },
  { value: "Leadership", label: "Leadership" },
  { value: "Problem-Solving", label: "Problem-Solving" },
  { value: "Project Management", label: "Project Management" },
];

const StudentProfileForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    dob: '',
    degree: '',
    fieldOfStudy: '',
    yearOfGraduation: '',
    skills: [],
    linkedIn: '',
    github: '',
    resume: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDegreeChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      degree: selectedOption.value
    }));
  };

  const handleFieldOfStudyChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      fieldOfStudy: selectedOption.value
    }));
  };

  const handleSkillsChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      skills: selectedOptions.map(option => option.value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();

      // Append all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'skills') {
          // Convert skills array to JSON string
          formDataToSend.append('skills', JSON.stringify(formData.skills));
        } else if (key === 'resume' && formData[key]) {
          // Append resume file if it exists
          formDataToSend.append('resume', formData[key]);
        } else {
          // Append other fields normally
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch('http://localhost:5000/api/student-profile', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create profile');
      }

      const data = await response.json();
      localStorage.setItem('studentProfile', JSON.stringify(data.profile));
      navigate('/student/StudentDashboard');
    } catch (error) {
      console.error('Error creating profile:', error);
      setError(error.message || 'Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-purple-300 mb-6">Create Your Profile</h2>
        {error && (
          <div className="mb-4 p-4 bg-red-100/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6 bg-gradient-to-br from-purple-900/20 via-black/40 to-indigo-900/20 rounded-lg border border-purple-500/30 p-6 backdrop-blur-sm">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-300">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md bg-purple-900/50 border border-purple-500/30 text-purple-100 px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md bg-purple-900/50 border border-purple-500/30 text-purple-100 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md bg-purple-900/50 border border-purple-500/30 text-purple-100 px-3 py-2"
              />
            </div>
          </div>

          {/* Education */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-300">Degree</label>
              <Select
                options={degreeOptions}
                onChange={handleDegreeChange}
                className="mt-1 text-gray-900"
                classNamePrefix="select"
                placeholder="Select your degree"
                value={degreeOptions.find(option => option.value === formData.degree)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300">Field of Study</label>
              <Select
                options={fieldOfStudyOptions}
                onChange={handleFieldOfStudyChange}
                className="mt-1 text-gray-900"
                classNamePrefix="select"
                placeholder="Select your field of study"
                value={fieldOfStudyOptions.find(option => option.value === formData.fieldOfStudy)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300">Year of Graduation</label>
              <input
                type="number"
                name="yearOfGraduation"
                value={formData.yearOfGraduation}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md bg-purple-900/50 border border-purple-500/30 text-purple-100 px-3 py-2"
              />
            </div>
          </div>

          {/* Skills and Links */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-300">Skills</label>
              <Select
                isMulti
                options={skillsOptions}
                onChange={handleSkillsChange}
                className="mt-1 text-gray-900"
                classNamePrefix="select"
                placeholder="Select your skills"
                value={skillsOptions.filter(option => formData.skills.includes(option.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300">LinkedIn Profile</label>
              <input
                type="url"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md bg-purple-900/50 border border-purple-500/30 text-purple-100 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300">GitHub Profile</label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md bg-purple-900/50 border border-purple-500/30 text-purple-100 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300">Resume</label>
              <input
                type="file"
                name="resume"
                onChange={handleChange}
                accept=".pdf,.doc,.docx"
                required
                className="mt-1 block w-full text-purple-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white rounded-md py-2 px-4 hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating Profile..." : "Create Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentProfileForm;