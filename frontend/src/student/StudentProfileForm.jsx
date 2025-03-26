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
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState(() => {
    const savedProfile = localStorage.getItem('studentProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      name: "",
      email: "",
      phone: "",
      dob: "",
      degree: "",
      fieldOfStudy: "",
      yearOfGraduation: "",
      skills: [],
      linkedIn: "",
      github: "",
    };
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDegreeChange = (selectedOption) => {
    setFormData({ ...formData, degree: selectedOption.value });
  };

  const handleFieldOfStudyChange = (selectedOption) => {
    setFormData({ ...formData, fieldOfStudy: selectedOption.value });
  };

  const handleSkillsChange = (selectedOptions) => {
    setFormData({ ...formData, skills: selectedOptions.map((option) => option.value) });
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const form = new FormData();
    
    // Append all form fields
    for (const key in formData) {
      if (key === 'skills') {
        form.append(key, JSON.stringify(formData[key]));
      } else {
        form.append(key, formData[key]);
      }
    }
    
    // Append resume file
    if (resume) {
      form.append("resume", resume);
    }

    try {
      const response = await fetch('/api/student-profile', {
        method: "POST",
        body: form,
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit profile");
      }

      const data = await response.json();
      if (data.success) {
        // Save user data in context and localStorage
        const userData = {
          id: data.data._id,
          email: formData.email,
          name: formData.name,
          profile: data.data
        };
        login(userData);
        localStorage.setItem('studentProfile', JSON.stringify(formData));
        
        navigate("/student/StudentDashboard");
      }
    } catch (error) {
      console.error("Error submitting profile:", error);
      setError(error.message || "Failed to submit profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-purple-900/20 via-black/40 to-indigo-900/20 rounded-lg border border-purple-500/30 p-8 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-purple-300 mb-6">Complete Your Profile</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-purple-200 font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-purple-950/50 border border-purple-500/30 rounded-md px-4 py-2 text-purple-100 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-purple-200 font-medium mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-purple-950/50 border border-purple-500/30 rounded-md px-4 py-2 text-purple-100 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-purple-200 font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-purple-950/50 border border-purple-500/30 rounded-md px-4 py-2 text-purple-100 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-purple-200 font-medium mb-2">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full bg-purple-950/50 border border-purple-500/30 rounded-md px-4 py-2 text-purple-100 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-purple-200 font-medium mb-2">Degree</label>
              <Select
                options={degreeOptions}
                onChange={handleDegreeChange}
                placeholder="Select Degree"
                isClearable
                className="w-full bg-purple-950/50 border border-purple-500/30 rounded-md px-4 py-2 text-purple-100 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label className="block text-purple-200 font-medium mb-2">Field of Study</label>
              <Select
                options={fieldOfStudyOptions}
                onChange={handleFieldOfStudyChange}
                placeholder="Select Field of Study"
                isClearable
                className="w-full bg-purple-950/50 border border-purple-500/30 rounded-md px-4 py-2 text-purple-100 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label className="block text-purple-200 font-medium mb-2">Year of Graduation</label>
              <input
                type="number"
                name="yearOfGraduation"
                value={formData.yearOfGraduation}
                onChange={handleChange}
                className="w-full bg-purple-950/50 border border-purple-500/30 rounded-md px-4 py-2 text-purple-100 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-purple-200 font-medium mb-2">Skills</label>
              <Select
                options={skillsOptions}
                isMulti
                onChange={handleSkillsChange}
                placeholder="Select Skills"
                className="w-full bg-purple-950/50 border border-purple-500/30 rounded-md px-4 py-2 text-purple-100 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label className="block text-purple-200 font-medium mb-2">LinkedIn Profile</label>
              <input
                type="url"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleChange}
                className="w-full bg-purple-950/50 border border-purple-500/30 rounded-md px-4 py-2 text-purple-100 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-purple-200 font-medium mb-2">GitHub Profile</label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="w-full bg-purple-950/50 border border-purple-500/30 rounded-md px-4 py-2 text-purple-100 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-purple-200 font-medium mb-2">Resume</label>
              <input type="file" onChange={handleFileChange} className="w-full bg-purple-950/50 border border-purple-500/30 rounded-md px-4 py-2 text-purple-100 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20" required />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-md hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Profile"}
        </button>
      </div>
    </form>
  );
};

export default StudentProfileForm;