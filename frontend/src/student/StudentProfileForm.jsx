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
    <form onSubmit={handleSubmit} className="p-6 max-w-lg mx-auto bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Student Profile</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block font-medium mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Degree</label>
        <Select
          options={degreeOptions}
          onChange={handleDegreeChange}
          placeholder="Select Degree"
          isClearable
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Field of Study</label>
        <Select
          options={fieldOfStudyOptions}
          onChange={handleFieldOfStudyChange}
          placeholder="Select Field of Study"
          isClearable
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Year of Graduation</label>
        <input
          type="number"
          name="yearOfGraduation"
          value={formData.yearOfGraduation}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Skills</label>
        <Select
          options={skillsOptions}
          isMulti
          onChange={handleSkillsChange}
          placeholder="Select Skills"
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">LinkedIn Profile</label>
        <input
          type="url"
          name="linkedIn"
          value={formData.linkedIn}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">GitHub Profile</label>
        <input
          type="url"
          name="github"
          value={formData.github}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Resume</label>
        <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded" required />
      </div>

      <button 
        type="submit" 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default StudentProfileForm;