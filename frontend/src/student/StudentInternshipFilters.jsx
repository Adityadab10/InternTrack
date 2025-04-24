import React from 'react';
import { FiFilter, FiX } from 'react-icons/fi';

const StudentInternshipFilters = ({ filters, setFilters, clearFilters }) => {
  return (
    <div className="bg-black/50 backdrop-blur-sm p-4 rounded-lg border border-purple-500/20 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="flex items-center mb-3 sm:mb-0">
          <FiFilter className="w-5 h-5 text-purple-400 mr-2" />
          <h3 className="text-lg font-semibold text-purple-300">Filter Internships</h3>
        </div>
        <button
          onClick={clearFilters}
          className="text-sm text-purple-400 hover:text-purple-300 flex items-center"
        >
          <FiX className="w-4 h-4 mr-1" />
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search by title or company */}
        <div className="space-y-1">
          <label className="text-sm text-purple-300">Search</label>
          <input
            type="text"
            placeholder="Search title or company..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-3 py-2 text-purple-100 text-sm focus:outline-none focus:border-purple-500/50"
          />
        </div>

        {/* Stipend Range */}
        <div className="space-y-1">
          <label className="text-sm text-purple-300">Minimum Stipend</label>
          <input
            type="number"
            placeholder="Min stipend..."
            value={filters.minStipend}
            onChange={(e) => setFilters({ ...filters, minStipend: e.target.value })}
            className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-3 py-2 text-purple-100 text-sm focus:outline-none focus:border-purple-500/50"
          />
        </div>

        {/* Location */}
        <div className="space-y-1">
          <label className="text-sm text-purple-300">Location</label>
          <input
            type="text"
            placeholder="Filter by location..."
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-3 py-2 text-purple-100 text-sm focus:outline-none focus:border-purple-500/50"
          />
        </div>

        {/* Duration */}
        <div className="space-y-1">
          <label className="text-sm text-purple-300">Duration</label>
          <select
            value={filters.duration}
            onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
            className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-3 py-2 text-purple-100 text-sm focus:outline-none focus:border-purple-500/50"
          >
            <option value="">All Durations</option>
            <option value="1-3">1-3 months</option>
            <option value="3-6">3-6 months</option>
            <option value="6+">6+ months</option>
          </select>
        </div>

        {/* Application Deadline */}
        <div className="space-y-1">
          <label className="text-sm text-purple-300">Deadline Before</label>
          <input
            type="date"
            value={filters.deadlineBefore}
            onChange={(e) => setFilters({ ...filters, deadlineBefore: e.target.value })}
            className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-3 py-2 text-purple-100 text-sm focus:outline-none focus:border-purple-500/50"
          />
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="text-sm text-purple-300">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-3 py-2 text-purple-100 text-sm focus:outline-none focus:border-purple-500/50"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default StudentInternshipFilters; 