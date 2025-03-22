import React from "react";

const InternshipDisplay = ({ internship }) => {
  // Helper function to format arrays for display
  const formatArrayToString = (array) => {
    if (!array || array.length === 0) return "None";
    return array.join(", ");
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow-md">
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-2xl font-bold">{internship.title}</h1>
        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
          New
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold text-blue-600">{internship.company}</h2>
        <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {internship.location || "Remote"}
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {internship.duration}
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            {internship.stipend ? `₹${internship.stipend}` : "Unpaid"}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-gray-700">{internship.description || "No description provided."}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Requirements</h3>
        <p className="text-gray-700">{internship.requirements || "No specific requirements."}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="font-semibold mb-2">Positions Available</h3>
          <p className="text-gray-700">{internship.positions}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Application Deadline</h3>
          <p className="text-gray-700">{new Date(internship.deadline).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Contact</h3>
        <p className="text-gray-700">{internship.contact || "Contact details not provided."}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <h3 className="font-semibold mb-2">SDGs</h3>
          <p className="text-gray-700">{formatArrayToString(internship.sdgs)}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Program Outcomes</h3>
          <p className="text-gray-700">{formatArrayToString(internship.pos)}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Program Educational Objectives</h3>
          <p className="text-gray-700">{formatArrayToString(internship.peos)}</p>
        </div>
      </div>

      {/* <button className="w-full bg-blue-500 text-white p-2 rounded mt-4">
        Apply Now
      </button> */}
    </div>
  );
};

export default InternshipDisplay;