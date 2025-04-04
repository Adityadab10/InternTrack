import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MentorshipAssignment = () => {
  const [mentorsData, setMentorsData] = useState([]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/mentors");
        console.log("Mentor API Response:", response.data);
        
        // Access the mentors array from response.data.data
        if (response.data && Array.isArray(response.data.data)) {
          setMentorsData(response.data.data);
        } else {
          console.error("Unexpected API response format", response.data);
          setMentorsData([]);
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
        setMentorsData([]);
      }
    };
  
    fetchMentors();
  }, []);
  
  

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Mentorship Assignment</h2>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Available Mentors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(mentorsData) && mentorsData.length > 0 ? (
            mentorsData.map((mentor, index) => (
              <div 
                key={index} 
                className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold text-lg mb-2">{mentor.name}</h4>
                <div className="space-y-1">
                  <p><span className="font-medium">Department:</span> {mentor.department}</p>
                  <p><span className="font-medium">Expertise:</span> {mentor.expertise}</p>
                  <p><span className="font-medium">Email:</span> {mentor.email}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No mentors available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorshipAssignment;
