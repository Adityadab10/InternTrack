"use client"
import { ChartBarIcon, BriefcaseIcon, AcademicCapIcon, MailIcon, HomeIcon } from "./Icons"

const Sidebar = ({ isOpen, activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "statistics", label: "Statistics Overview", icon: ChartBarIcon },
    { id: "internships", label: "Internship Details", icon: BriefcaseIcon },
    { id: "outcomes", label: "Project Outcomes", icon: AcademicCapIcon },
    { id: "contact", label: "Contact", icon: MailIcon },
  ]
  
  return (
    <aside
      className={`bg-gray-800 border-r border-gray-700 w-64 fixed inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-30 shadow-lg`}
    >
      {/* Header Section */}
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <HomeIcon className="h-8 w-8 text-purple-500" />
        <span className="text-white text-xl font-bold ml-2">InternTrack</span>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full p-3 rounded-lg text-sm transition-all duration-200 ease-in-out ${
                  activeTab === item.id
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                aria-label={item.label}
              >
                <item.icon className={`h-5 w-5 ${activeTab === item.id ? "text-white" : "text-gray-400"}`} />
                <span className="ml-3">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar