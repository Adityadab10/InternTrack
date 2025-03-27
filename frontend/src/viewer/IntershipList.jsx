"use client"

import { useState } from "react"
import { SearchIcon, FilterIcon, ExternalLinkIcon } from "./Icons"

const InternshipList = ({ filters, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("")

  // Sample data - in a real app, this would come from an API
  const internships = [
    {
      id: 1,
      title: "Software Development Intern",
      company: "TechCorp",
      department: "Computer Science",
      duration: "3 months",
      location: "Remote",
      sdgs: [9, 4],
      pos: ["PO1", "PO3", "PO5"],
      peos: ["PEO1", "PEO2"],
      description: "Work on developing innovative software solutions for enterprise clients.",
      requirements: "Proficiency in JavaScript, React, and Node.js. Knowledge of database systems.",
      sector: "Technology",
    },
    {
      id: 2,
      title: "Electrical Design Intern",
      company: "PowerSystems Inc.",
      department: "ECS Engineering",
      duration: "6 months",
      location: "Hybrid",
      sdgs: [7, 9, 11],
      pos: ["PO2", "PO3", "PO4"],
      peos: ["PEO1", "PEO3"],
      description: "Assist in designing electrical systems for renewable energy projects.",
      requirements: "Knowledge of electrical circuit design, AutoCAD, and power systems.",
      sector: "Energy",
    },
    {
      id: 3,
      title: "Mechanical Design Intern",
      company: "AutoTech",
      department: "Mechanical Engineering",
      duration: "4 months",
      location: "On-site",
      sdgs: [9, 11, 12],
      pos: ["PO1", "PO4", "PO6"],
      peos: ["PEO2", "PEO3"],
      description: "Work on designing mechanical components for electric vehicles.",
      requirements: "Proficiency in SolidWorks, knowledge of material science and thermodynamics.",
      sector: "Automotive",
    },
    {
      id: 4,
      title: "Data Science Intern",
      company: "AnalyticsPro",
      department: "Computer Science",
      duration: "3 months",
      location: "Remote",
      sdgs: [4, 9],
      pos: ["PO1", "PO2", "PO5"],
      peos: ["PEO1", "PEO2"],
      description: "Analyze large datasets to extract insights for business decision-making.",
      requirements:
        "Knowledge of Python, R, and machine learning algorithms. Experience with data visualization tools.",
      sector: "Technology",
    },
    {
      id: 5,
      title: "Mechin learning Intern",
      company: "TECHHACK",
      department: "AIDS Engineering",
      duration: "6 months",
      location: "Remote",
      sdgs: [9, 11],
      pos: ["PO3", "PO4", "PO6"],
      peos: ["PEO2", "PEO3"],
      description: "Analyze large datasets to extract insights for business decision-making.",
      requirements: "Knowledge of Python and Machin learning algorithms.",
      sector: "Construction",
    },
  ]

  // Filter internships based on search term and filters
  const filteredInternships = internships.filter((internship) => {
    const matchesSearch =
      searchTerm === "" ||
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = filters.department === "" || internship.department === filters.department
    const matchesSector = filters.sector === "" || internship.sector === filters.sector
    const matchesSDG = filters.sdg === "" || (filters.sdg && internship.sdgs.includes(Number.parseInt(filters.sdg)))
    const matchesPO = filters.po === "" || (filters.po && internship.pos.includes(filters.po))

    return matchesSearch && matchesDepartment && matchesSector && matchesSDG && matchesPO
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Internship Opportunities</h2>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search internships..."
              className="input-field pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <button className="btn-secondary flex items-center justify-center">
            <FilterIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          className="select-field"
          value={filters.department}
          onChange={(e) => onFilterChange("department", e.target.value)}
        >
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Electrical Engineering">ECS Engineering</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
          <option value="Civil Engineering">AIDS Engineering</option>
        </select>

        <select className="select-field" value={filters.sdg} onChange={(e) => onFilterChange("sdg", e.target.value)}>
          <option value="">All SDGs</option>
          <option value="4">SDG 4: Quality Education</option>
          <option value="7">SDG 7: Affordable and Clean Energy</option>
          <option value="9">SDG 9: Industry, Innovation and Infrastructure</option>
          <option value="11">SDG 11: Sustainable Cities and Communities</option>
          <option value="12">SDG 12: Responsible Consumption and Production</option>
        </select>

        <select className="select-field" value={filters.po} onChange={(e) => onFilterChange("po", e.target.value)}>
          <option value="">All Program Outcomes</option>
          <option value="PO1">PO1: Engineering Knowledge</option>
          <option value="PO2">PO2: Problem Analysis</option>
          <option value="PO3">PO3: Design/Development of Solutions</option>
          <option value="PO4">PO4: Investigation</option>
          <option value="PO5">PO5: Modern Tool Usage</option>
          <option value="PO6">PO6: Engineer and Society</option>
        </select>

        <select
          className="select-field"
          value={filters.sector}
          onChange={(e) => onFilterChange("sector", e.target.value)}
        >
          <option value="">All Sectors</option>
          <option value="Technology">Technology</option>
          <option value="Energy">Energy</option>
          <option value="Automotive">Automotive</option>
          <option value="Construction">Construction</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredInternships.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-lg text-gray-400">No internships match your search criteria.</p>
            <button
              className="mt-4 text-purple-400 hover:text-purple-300"
              onClick={() => {
                setSearchTerm("")
                onFilterChange("department", "")
                onFilterChange("sdg", "")
                onFilterChange("po", "")
                onFilterChange("sector", "")
              }}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          filteredInternships.map((internship) => (
            <div key={internship.id} className="card hover:border-purple-500 transition-colors">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <div className="flex items-center">
                    <h3 className="text-xl font-bold">{internship.title}</h3>
                    <span className="ml-3 px-3 py-1 bg-purple-700 text-xs rounded-full">{internship.duration}</span>
                  </div>
                  <p className="text-gray-300 mt-1">
                    {internship.company} • {internship.location}
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <button className="btn-primary flex items-center">
                    View Details
                    <ExternalLinkIcon className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="mt-4 text-gray-300">{internship.description}</p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Department</h4>
                  <p>{internship.department}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Requirements</h4>
                  <p className="text-sm">{internship.requirements}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Industry Sector</h4>
                  <p>{internship.sector}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">SDG Alignment</h4>
                  <div className="flex flex-wrap gap-2">
                    {internship.sdgs.map((sdg) => (
                      <span key={sdg} className="px-2 py-1 bg-gray-700 rounded text-xs">
                        SDG {sdg}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Program Outcomes</h4>
                  <div className="flex flex-wrap gap-2">
                    {internship.pos.map((po) => (
                      <span key={po} className="px-2 py-1 bg-gray-700 rounded text-xs">
                        {po}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Educational Objectives</h4>
                  <div className="flex flex-wrap gap-2">
                    {internship.peos.map((peo) => (
                      <span key={peo} className="px-2 py-1 bg-gray-700 rounded text-xs">
                        {peo}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default InternshipList

