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
} from "lucide-react"

export default function Landing() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState("All Departments")

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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-purple-900 to-black text-white relative overflow-hidden">
  {/* Abstract background shapes */}
  <div className="absolute top-0 left-0 w-full h-full opacity-10">
    <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-purple-500 blur-3xl"></div>
    <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-indigo-600 blur-3xl"></div>
  </div>

  <div className="container mx-auto px-4 md:px-6 relative z-10">
    <div className="flex flex-col md:flex-row items-center">
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
      <div className="md:w-1/2 flex justify-center items-center">
        <div className="relative w-3/5 mx-auto">
          <div className="absolute inset-0 bg-purple-600 rounded-lg blur-md -m-2 transform -rotate-3"></div>
          <div className="relative overflow-hidden rounded-lg shadow-2xl transform hover:scale-102 transition-transform duration-500 border-2 border-purple-500/30">
            <img
              src="/api/placeholder/600/450"
              alt="Internship Management Dashboard"
              className="w-full h-auto rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent opacity-60 hover:opacity-40 transition-opacity"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Statistics Section */}
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

      {/* How It Works */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Our platform serves different stakeholders with tailored features and workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-b-2 border-purple-600">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-900 rounded-full mb-6 mx-auto">
                <GraduationCap className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">For Students</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-900 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-purple-400 text-xs font-bold">1</span>
                  </div>
                  <span>Find and apply for internships</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-900 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-purple-400 text-xs font-bold">2</span>
                  </div>
                  <span>Track application progress</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-900 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-purple-400 text-xs font-bold">3</span>
                  </div>
                  <span>Receive mentorship</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-900 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-purple-400 text-xs font-bold">4</span>
                  </div>
                  <span>Submit reports and get feedback</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-b-2 border-purple-500">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-900 rounded-full mb-6 mx-auto">
                <BookOpen className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">For Faculty</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-900 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-purple-400 text-xs font-bold">1</span>
                  </div>
                  <span>Assign mentors to students</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-900 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-purple-400 text-xs font-bold">2</span>
                  </div>
                  <span>Evaluate student progress</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-900 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-purple-400 text-xs font-bold">3</span>
                  </div>
                  <span>Provide feedback and guidance</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-900 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-purple-400 text-xs font-bold">4</span>
                  </div>
                  <span>Track SDG and academic alignment</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-b-2 border-purple-400">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-900 rounded-full mb-6 mx-auto">
                <Building2 className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">For Employers</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-900 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-purple-400 text-xs font-bold">1</span>
                  </div>
                  <span>Post internship opportunities</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-900 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-purple-400 text-xs font-bold">2</span>
                  </div>
                  <span>Review student applications</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-900 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-purple-400 text-xs font-bold">3</span>
                  </div>
                  <span>Connect with institutions</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-900 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-purple-400 text-xs font-bold">4</span>
                  </div>
                  <span>Provide feedback on interns</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-b-2 border-purple-300">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-900 rounded-full mb-6 mx-auto">
                <BarChart3 className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">For Admins</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-900 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-purple-400 text-xs font-bold">1</span>
                  </div>
                  <span>Manage internship listings</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-900 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-purple-400 text-xs font-bold">2</span>
                  </div>
                  <span>Monitor platform performance</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-900 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-purple-400 text-xs font-bold">3</span>
                  </div>
                  <span>Generate detailed reports</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-900 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-purple-400 text-xs font-bold">4</span>
                  </div>
                  <span>Oversee faculty assignments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
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

