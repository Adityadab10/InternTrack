import React, { useState } from "react";

const InternshipForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
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

  const sdgOptions = ["No Poverty", "Zero Hunger", "Quality Education", "Clean Water"];
  const poOptions = ["Engineering Knowledge", "Problem Analysis", "Design Solutions"];
  const peoOptions = ["Leadership Skills", "Problem Solving", "Communication Skills"];

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
    <form onSubmit={handleSubmit} className="p-6 max-w-lg mx-auto bg-gray-100 rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Post an Internship</h1>

      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        placeholder="Internship Title"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        type="text"
        name="company"
        value={formData.company}
        onChange={handleInputChange}
        placeholder="Company Name"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Internship Description"
        className="w-full p-2 mb-4 border rounded"
      />
      <textarea
        name="requirements"
        value={formData.requirements}
        onChange={handleInputChange}
        placeholder="Requirements"
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="number"
        name="positions"
        value={formData.positions}
        onChange={handleInputChange}
        placeholder="Number of Positions"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleInputChange}
        placeholder="Location"
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="text"
        name="stipend"
        value={formData.stipend}
        onChange={handleInputChange}
        placeholder="Stipend (e.g., 5000)"
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="text"
        name="duration"
        value={formData.duration}
        onChange={handleInputChange}
        placeholder="Duration (e.g., 3 months)"
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="date"
        name="deadline"
        value={formData.deadline}
        onChange={handleInputChange}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        type="text"
        name="contact"
        value={formData.contact}
        onChange={handleInputChange}
        placeholder="Contact Email or Phone"
        className="w-full p-2 mb-4 border rounded"
      />

      <label>SDGs:</label>
      <select
        multiple
        name="sdgs"
        value={formData.sdgs}
        onChange={(e) => handleMultiSelect(e, "sdgs")}
        className="w-full p-2 mb-4 border rounded"
      >
        {sdgOptions.map((sdg, index) => (
          <option key={index} value={sdg}>
            {sdg}
          </option>
        ))}
      </select>

      <label>POs:</label>
      <select
        multiple
        name="pos"
        value={formData.pos}
        onChange={(e) => handleMultiSelect(e, "pos")}
        className="w-full p-2 mb-4 border rounded"
      >
        {poOptions.map((po, index) => (
          <option key={index} value={po}>
            {po}
          </option>
        ))}
      </select>

      <label>PEOs:</label>
      <select
        multiple
        name="peos"
        value={formData.peos}
        onChange={(e) => handleMultiSelect(e, "peos")}
        className="w-full p-2 mb-4 border rounded"
      >
        {peoOptions.map((peo, index) => (
          <option key={index} value={peo}>
            {peo}
          </option>
        ))}
      </select>

      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Submit Internship
      </button>
    </form>
  );
};

export default InternshipForm;