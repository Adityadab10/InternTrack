import { useState } from "react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import StatisticsOverview from "./StatisticsOverview"
import InternshipList from "./IntershipList"
import ProjectOutcomes from "./ProjectOutcomes"
import ContactSection from "./ContactSection"

function ViewerPage() {
  const [activeTab, setActiveTab] = useState("statistics")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filters, setFilters] = useState({
    department: "",
    sdg: "",
    po: "",
    sector: "",
  })
  
  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value,
    })
  }
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }
  
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar isOpen={sidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main content wrapper with proper margin/padding to avoid sidebar overlap */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
        sidebarOpen ? "md:ml-64" : "ml-0"
      }`}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeTab === "statistics" && <StatisticsOverview filters={filters} />}
          
          {activeTab === "internships" && <InternshipList filters={filters} onFilterChange={handleFilterChange} />}
          
          {activeTab === "outcomes" && <ProjectOutcomes filters={filters} />}
          
          {activeTab === "contact" && <ContactSection />}
        </main>
      </div>
    </div>
  )
}

export default ViewerPage
