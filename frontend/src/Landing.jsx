import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Clock,
  Facebook,
  Globe,
  GraduationCap,
  Instagram,
  Linkedin,
  MapPin,
  Menu,
  Search,
  Twitter,
  Users,
  Mail,
  Phone,
  Send,
  Filter,
  Target,
  Bookmark,
  CheckCircle,
  ChevronDown
} from "lucide-react"

export default function Landing() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState("All Departments")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    department: "",
    sdg: "",
    po: "",
    industry: ""
  })

  // Sample data
  const departments = ["Computer Science", "Engineering", "Business", "Arts", "Science"]
  const sdgs = Array.from({length: 17}, (_, i) => `SDG ${i+1}`)
  const pos = ["PO1", "PO2", "PO3", "PO4", "PO5"]
  const industries = ["Tech", "Finance", "Healthcare", "Education", "Government"]
  
  const featuredInternships = [
    {
      id: 1,
      company: "Tech Innovations Inc.",
      department: "Computer Science",
      description: "Develop web applications using modern frameworks and contribute to open-source projects.",
      sdgs: [4, 8, 9],
      pos: ["PO1", "PO3"],
      location: "Remote",
      duration: "3 months"
    },
    {
      id: 2,
      company: "Green Energy Solutions",
      department: "Engineering",
      description: "Work on sustainable energy projects and help design eco-friendly solutions.",
      sdgs: [7, 13],
      pos: ["PO2", "PO4"],
      location: "New York, NY",
      duration: "6 months"
    },
    {
      id: 3,
      company: "Global Finance Corp",
      department: "Business",
      description: "Analyze market trends and assist in financial planning strategies.",
      sdgs: [8, 10],
      pos: ["PO1", "PO5"],
      location: "Chicago, IL",
      duration: "4 months"
    }
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const tabs = ["All Departments", "Computer Science", "Engineering", "Business", "SDG Aligned"]

  const handleLoginClick = () => {
    navigate('/login')
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", contactForm)
    alert("Thank you for your message! We'll get back to you soon.")
    setContactForm({ name: "", email: "", message: "" })
  }

  const handleContactChange = (e) => {
    const { name, value } = e.target
    setContactForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const resetFilters = () => {
    setFilters({
      department: "",
      sdg: "",
      po: "",
      industry: ""
    })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header (same as before) */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-black shadow-md py-2" : "bg-transparent py-4"}`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-purple-500 font-bold text-2xl">
                <span className="text-white">Intern</span>Track
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-white hover:text-purple-400 font-medium">
                Home
              </a>
              <a href="#" className="text-white hover:text-purple-400 font-medium">
                About
              </a>
              <a href="#" className="text-white hover:text-purple-400 font-medium">
                Internship Statistics
              </a>
              <a href="#" className="text-white hover:text-purple-400 font-medium">
                How It Works
              </a>
              <a href="#" className="text-white hover:text-purple-400 font-medium">
                Contact
              </a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={handleLoginClick}
                className="px-4 py-2 text-white hover:text-purple-400 font-medium transition-colors"
              >
                Login
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Register
              </button>
            </div>

            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 animate-fadeIn bg-black">
              <nav className="flex flex-col space-y-3">
                <a href="#" className="text-white hover:text-purple-400 font-medium">
                  Home
                </a>
                <a href="#" className="text-white hover:text-purple-400 font-medium">
                  About
                </a>
                <a href="#" className="text-white hover:text-purple-400 font-medium">
                  Internship Statistics
                </a>
                <a href="#" className="text-white hover:text-purple-400 font-medium">
                  How It Works
                </a>
                <a href="#" className="text-white hover:text-purple-400 font-medium">
                  Contact
                </a>
              </nav>
              <div className="mt-4 flex space-x-4">
                <button 
                  onClick={handleLoginClick}
                  className="px-4 py-2 text-white hover:text-purple-400 font-medium"
                >
                  Login
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                  Register
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section (same as before) */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-purple-900 to-black text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
    <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-purple-500 blur-3xl"></div>
    <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-indigo-600 blur-3xl"></div>
  </div>

  <div className="container mx-auto px-4 md:px-6 relative z-10">
    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
      {/* Left content box */}
      <div className="md:w-1/2 mb-10 md:mb-0">
        <div className="bg-purple-900/20 backdrop-blur-sm p-8 rounded-xl border border-purple-800/30 shadow-lg">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Track, Showcase, and Manage Internships <span className="text-purple-400">Seamlessly!</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            A platform to explore internships, track progress, and align them with academic & sustainability goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-500 transition-all shadow-md hover:shadow-purple-500/20 transform hover:-translate-y-1 flex items-center justify-center">
              <Search className="mr-2 h-5 w-5" />
              Find Internships
            </button>
            <button className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-all shadow-md hover:shadow-white/10 transform hover:-translate-y-1 flex items-center justify-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Showcase Statistics
            </button>
          </div>
        </div>
      </div>

      {/* Right image box */}
      <div className="md:w-1/2 flex justify-center items-center">
        <div className="relative w-full max-w-xl mx-auto">
          <div className="absolute inset-0 bg-purple-600 rounded-lg blur-md -m-2 transform -rotate-3"></div>
          <div className="relative overflow-hidden rounded-lg shadow-2xl transform hover:scale-102 transition-transform duration-500 border-2 border-purple-500/30">
            <img
              src="/assets/CentreHero.jpeg"
              alt="Internship Management Platform"
              className="w-full h-[450px] object-cover object-center rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent opacity-60 hover:opacity-40 transition-opacity"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
      </section>

      {/* Statistics Section (same as before) */}
      <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Internship Statistics Overview</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Real-time insights into internship opportunities, placements, and industry collaborations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-black p-6 rounded-lg shadow-md border-t-4 border-purple-600 hover:shadow-xl transition-shadow transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-900 rounded-full mb-4">
                <BriefcaseBusiness className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">1,200+</h3>
              <p className="text-gray-300">Total Internships Available</p>
            </div>

            <div className="bg-black p-6 rounded-lg shadow-md border-t-4 border-purple-500 hover:shadow-xl transition-shadow transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-900 rounded-full mb-4">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">850</h3>
              <p className="text-gray-300">Active Internships</p>
            </div>

            <div className="bg-black p-6 rounded-lg shadow-md border-t-4 border-purple-400 hover:shadow-xl transition-shadow transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-900 rounded-full mb-4">
                <Building2 className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">350+</h3>
              <p className="text-gray-300">Industry Collaborations</p>
            </div>

            <div className="bg-black p-6 rounded-lg shadow-md border-t-4 border-purple-300 hover:shadow-xl transition-shadow transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-900 rounded-full mb-4">
                <GraduationCap className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">92%</h3>
              <p className="text-gray-300">Placement Success Rate</p>
            </div>
          </div>

          <div className="bg-black p-6 rounded-lg shadow-inner border border-gray-800">
            <div className="flex flex-wrap gap-2 justify-center mb-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeTab === tab
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="h-64 bg-gray-800 rounded-lg shadow-inner p-4 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                <p className="text-gray-300">Interactive statistics chart will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Internship Showcase Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Explore Internship Opportunities</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Browse through available internships and find the perfect match for your academic and career goals.
            </p>
          </div>

          {/* Filters Section */}
          <div className="mb-8 bg-gray-900 rounded-lg p-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors"
            >
              <Filter className="h-5 w-5" />
              {showFilters ? "Hide Filters" : "Show Filters"}
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Department</label>
                  <select
                    name="department"
                    value={filters.department}
                    onChange={handleFilterChange}
                    className="w-full bg-gray-800 text-white rounded-md p-2 border border-gray-700"
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">SDG Alignment</label>
                  <select
                    name="sdg"
                    value={filters.sdg}
                    onChange={handleFilterChange}
                    className="w-full bg-gray-800 text-white rounded-md p-2 border border-gray-700"
                  >
                    <option value="">All SDGs</option>
                    {sdgs.map(sdg => (
                      <option key={sdg} value={sdg}>{sdg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">Program Outcome</label>
                  <select
                    name="po"
                    value={filters.po}
                    onChange={handleFilterChange}
                    className="w-full bg-gray-800 text-white rounded-md p-2 border border-gray-700"
                  >
                    <option value="">All POs</option>
                    {pos.map(po => (
                      <option key={po} value={po}>{po}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">Industry</label>
                  <select
                    name="industry"
                    value={filters.industry}
                    onChange={handleFilterChange}
                    className="w-full bg-gray-800 text-white rounded-md p-2 border border-gray-700"
                  >
                    <option value="">All Industries</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 items-end">
                  <button 
                    onClick={resetFilters}
                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Reset Filters
                  </button>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Internship Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredInternships.map(internship => (
              <div key={internship.id} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-800 hover:border-purple-500/30">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{internship.company}</h3>
                    <span className="bg-purple-600 text-xs px-2 py-1 rounded">{internship.department}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-400 text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{internship.location}</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{internship.duration}</span>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{internship.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">SDG Alignment</h4>
                    <div className="flex flex-wrap gap-2">
                      {internship.sdgs.map(sdg => (
                        <span key={sdg} className="bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded flex items-center">
                          <Target className="h-3 w-3 mr-1" />
                          {sdg}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Program Outcomes</h4>
                    <div className="flex flex-wrap gap-2">
                      {internship.pos.map(po => (
                        <span key={po} className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded flex items-center">
                          <Bookmark className="h-3 w-3 mr-1" />
                          {po}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition-colors flex items-center justify-center">
                      <Send className="h-4 w-4 mr-2" />
                      Apply Now
                    </button>
                    <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDG Alignment Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Sustainable Development Goals Alignment</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              See how our internships contribute to the United Nations Sustainable Development Goals
            </p>
          </div>

          <div className="bg-black p-6 rounded-lg shadow-inner border border-gray-800">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 4, 5, 7, 8, 9, 10, 13].map(sdg => (
                <div key={sdg} className="bg-gray-800 p-4 rounded-lg text-center hover:bg-gray-700 transition-colors">
                  <div className="w-16 h-16 mx-auto mb-3 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold">
                    {sdg}
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">SDG {sdg}</h3>
                  <p className="text-xs text-gray-400">{sdgDescriptions[sdg]}</p>
                  <div className="mt-2 text-purple-400 text-sm font-medium">
                    {Math.floor(Math.random() * 30) + 15}% of internships
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-16 bg-black" id="contact">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-lg text-gray-300">
                Have questions or want to collaborate? Reach out to our team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-6">Get in Touch</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-900/50 p-3 rounded-full">
                      <Mail className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400">Email</h4>
                      <p className="text-white">info@interntrack.edu</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-900/50 p-3 rounded-full">
                      <Phone className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400">Phone</h4>
                      <p className="text-white">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-900/50 p-3 rounded-full">
                      <MapPin className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400">Address</h4>
                      <p className="text-white">123 Education Street</p>
                      <p className="text-white">Academic City, AC 12345</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-6">Send Us a Message</h3>
                
                <form onSubmit={handleContactSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={contactForm.message}
                      onChange={handleContactChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (same as before) */}
      <footer className="bg-black text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-white font-bold text-2xl mb-4">
                <span className="text-purple-400">Intern</span>Track
              </div>
              <p className="mb-4">A comprehensive platform for internship management, tracking, and showcasing.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Internship Statistics
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
              <address className="not-italic">
                <p className="mb-2">123 Education Street</p>
                <p className="mb-2">Academic City, AC 12345</p>
                <p className="mb-2">Email: info@interntrack.com</p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p>© {new Date().getFullYear()} InternTrack. All rights reserved.</p>
              <div className="mt-4 md:mt-0">
                <p>Powered by Modern Web Technologies</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Helper data for SDGs
const sdgDescriptions = {
  1: "No Poverty",
  4: "Quality Education",
  5: "Gender Equality",
  7: "Affordable and Clean Energy",
  8: "Decent Work and Economic Growth",
  9: "Industry, Innovation and Infrastructure",
  10: "Reduced Inequalities",
  13: "Climate Action"
}

