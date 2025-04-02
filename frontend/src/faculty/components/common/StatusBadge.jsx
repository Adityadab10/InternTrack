import React from 'react';

const StatusBadge = ({ status }) => {
  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    ongoing: 'bg-blue-100 text-blue-800',
    upcoming: 'bg-yellow-100 text-yellow-800',
    delayed: 'bg-red-100 text-red-800',
  };

  const statusText = {
    completed: 'Completed',
    ongoing: 'Ongoing',
    upcoming: 'Upcoming',
    delayed: 'Delayed',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {statusText[status] || status}
    </span>
  );
};

export default StatusBadge;