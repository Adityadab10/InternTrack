import React, { useState } from "react";
import { motion } from "framer-motion";

const InternshipForm = ({ onSuccess, internship }) => {
  const [formData, setFormData] = useState(internship || {
    title: "",
    company: "",
    description: "",
    requirements: "",
    positions: "",
    location: "",
    stipend: "",
    duration: "",
    deadline: "",
    contact: "",
    sdgs: [],
    pos: [],
    peos: [],
  });

  const sdgOptions = [
    "1. No Poverty",
    "2. Zero Hunger",
    "3. Good Health and Well-being",
    "4. Quality Education",
    "5. Gender Equality",
    "6. Clean Water and Sanitation",
    "7. Affordable and Clean Energy",
    "8. Decent Work and Economic Growth",
    "9. Industry, Innovation, and Infrastructure",
    "10. Reduced Inequalities",
    "11. Sustainable Cities and Communities",
    "12. Responsible Consumption and Production",
    "13. Climate Action",
    "14. Life Below Water",
    "15. Life on Land",
    "16. Peace, Justice, and Strong Institutions",
    "17. Partnerships for the Goals"
  ];
  
  const poOptions = ["Engineering Knowledge", "Problem Analysis", "Design Solutions"];
  const peoOptions = ["Leadership Skills", "Problem Solving", "Communication Skills"];

  const formFields = [
    { name: 'title', label: 'Internship Title', type: 'text', required: true, icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'company', label: 'Company Name', type: 'text', required: true, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { name: 'location', label: 'Location', type: 'text', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
    { name: 'positions', label: 'Number of Positions', type: 'number', required: true, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'stipend', label: 'Stipend Amount', type: 'text', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'duration', label: 'Duration', type: 'text', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'deadline', label: 'Application Deadline', type: 'date', required: true, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'contact', label: 'Contact Information', type: 'text', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelect = (e, field) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, [field]: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/internships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to create internship');
      }

      const data = await response.json();
      alert("Internship posted successfully!");
      
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(data.data);
      }
      
      // Reset form
      setFormData({
        title: "",
        company: "",
        description: "",
        requirements: "",
        positions: "",
        location: "",
        stipend: "",
        duration: "",
        deadline: "",
        contact: "",
        sdgs: [],
        pos: [],
        peos: [],
      });
    } catch (error) {
      console.error("Error posting internship:", error);
      alert("Error posting internship. Please try again.");
    }
  };

  return (
<motion.form
  onSubmit={handleSubmit}
  className="space-y-8 px-4 sm:px-6 md:px-8 lg:px-12 py-8"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
>
  {/* Input Fields */}
  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">
    {formFields.map((field) => (
      <motion.div 
        key={field.name}
        className="relative group"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-xl 
          group-hover:from-purple-500/10 group-hover:to-indigo-500/10 transition-all duration-300" />
        <div className="relative">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={field.icon} />
            </svg>
            <label className="block text-sm font-medium text-purple-300">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
          </div>
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name]}
            onChange={handleInputChange}
            required={field.required}
            className="w-full px-4 py-3 bg-gray-900/50 border border-purple-500/20 rounded-xl text-white 
              placeholder-purple-300/50 focus:outline-none focus:border-purple-500/50 
              focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        </div>
      </motion.div>
    ))}
  </div>

  {/* Description and Requirements */}
  <div className="space-y-6">
    {[{ name: 'description', label: 'Internship Description', icon: 'M4 6h16M4 12h16M4 18h7' },
          { name: 'requirements', label: 'Requirements', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'}].map((field) => (
      <motion.div 
        key={field.name}
        className="relative group"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-xl 
          group-hover:from-purple-500/10 group-hover:to-indigo-500/10 transition-all duration-300" />
        <div className="relative">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={field.icon} />
            </svg>
            <label className="block text-sm font-medium text-purple-300">{field.label}</label>
          </div>
          <textarea
            name={field.name}
            value={formData[field.name]}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 bg-gray-900/50 border border-purple-500/20 rounded-xl text-white 
              placeholder-purple-300/50 focus:outline-none focus:border-purple-500/50 
              focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        </div>
      </motion.div>
    ))}
  </div>

  {/* Multi-select */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {[ { name: 'sdgs', label: 'SDGs', options: sdgOptions, icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
          { name: 'pos', label: 'Program Outcomes', options: poOptions, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
          { name: 'peos', label: 'Program Educational Objectives', options: peoOptions, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }].map((field) => (
      <motion.div 
        key={field.name}
        className="relative group"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-xl 
          group-hover:from-purple-500/10 group-hover:to-indigo-500/10 transition-all duration-300" />
        <div className="relative">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={field.icon} />
            </svg>
            <label className="block text-sm font-medium text-purple-300">
              {field.label}
              <span className="text-purple-400/60 text-xs ml-1">(Multi-select)</span>
            </label>
          </div>
          <select
            multiple
            name={field.name}
            value={formData[field.name]}
            onChange={(e) => handleMultiSelect(e, field.name)}
            className="w-full h-32 px-4 py-3 bg-gray-900/50 border border-purple-500/20 rounded-xl text-white 
              focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 
              transition-all duration-300 scrollbar-thin scrollbar-thumb-purple-500/20 
              scrollbar-track-transparent"
          >
            {field.options.map((option, index) => (
              <option key={index} value={option} className="bg-gray-900 py-1">
                {option}
              </option>
            ))}
          </select>
        </div>
      </motion.div>
    ))}
  </div>

  {/* Submit Button */}
  <motion.button
    type="submit"
    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl
      hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 
      shadow-lg hover:shadow-purple-500/20 flex items-center justify-center space-x-2 group"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" 
      fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span className="font-medium text-lg">Submit Internship</span>
  </motion.button>
</motion.form>

  );
};

export default InternshipForm;