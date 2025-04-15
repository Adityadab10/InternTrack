import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  ChevronDown,
} from "lucide-react";
import SplineModel from './SplineModel';

export default function Landing() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("All Departments");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department: "",
    sdg: "",
    po: "",
    industry: "",
  });

  // Sample data
  const departments = [
    "Computer Science",
    "Engineering",
    "Business",
    "Arts",
    "Science",
  ];
  const sdgs = Array.from({ length: 17 }, (_, i) => `SDG ${i + 1}`);
  const pos = ["PO1", "PO2", "PO3", "PO4", "PO5"];
  const industries = [
    "Tech",
    "Finance",
    "Healthcare",
    "Education",
    "Government",
  ];

  const featuredInternships = [
    {
      id: 1,
      company: "Tech Innovations Inc.",
      department: "Computer Science",
      description:
        "Develop web applications using modern frameworks and contribute to open-source projects.",
      sdgs: [4, 8, 9],
      pos: ["PO1", "PO3"],
      location: "Remote",
      duration: "3 months",
    },
    {
      id: 2,
      company: "Green Energy Solutions",
      department: "Engineering",
      description:
        "Work on sustainable energy projects and help design eco-friendly solutions.",
      sdgs: [7, 13],
      pos: ["PO2", "PO4"],
      location: "New York, NY",
      duration: "6 months",
    },
    {
      id: 3,
      company: "Global Finance Corp",
      department: "Business",
      description:
        "Analyze market trends and assist in financial planning strategies.",
      sdgs: [8, 10],
      pos: ["PO1", "PO5"],
      location: "Chicago, IL",
      duration: "4 months",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tabs = [
    "All Departments",
    "Computer Science",
    "Engineering",
    "Business",
    "SDG Aligned",
  ];

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", contactForm);
    alert("Thank you for your message! We'll get back to you soon.");
    setContactForm({ name: "", email: "", message: "" });
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      department: "",
      sdg: "",
      po: "",
      industry: "",
    });
  };

  {
    /* Add a simple animation keyframe at the top of your CSS file */
  }
  <style jsx>{`
    @keyframes float {
      0% {
        transform: translateY(0) translateX(0);
        opacity: 0;
      }
      50% {
        opacity: 0.8;
      }
      100% {
        transform: translateY(-100vh) translateX(20px);
        opacity: 0;
      }
    }
  `}</style>;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header (same as before) */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-black shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="text-purple-500 font-bold text-2xl">
              <span className="text-white">Intern</span>Track
            </div>

            {/* Desktop Menu */}
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

            {/* Mobile Toggle Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 animate-fadeIn bg-black border-t border-gray-700">
              <nav className="flex flex-col space-y-3 pt-4">
                {["Home", "About", "Internship Statistics", "How It Works", "Contact"].map(
                  (label, i) => (
                    <a
                      key={i}
                      href="#"
                      className="text-white hover:text-purple-400 font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {label}
                    </a>
                  )
                )}
              </nav>
              <div className="mt-6 flex flex-col space-y-2">
                <button
                  onClick={handleLoginClick}
                  className="w-full px-4 py-2 text-white hover:text-purple-400 font-medium"
                >
                  Login
                </button>
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                  Register
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section (same as before) */}
      <section className="pt-20 md:pt-32 pb-12 md:pb-20 bg-gradient-to-br from-purple-900 to-black text-white relative overflow-hidden">
  {/* 3D animated background elements - reduced on mobile */}
  <div className="absolute inset-0 overflow-hidden">
    {/* Abstract 3D shapes - reduced opacity on mobile */}
    <div className="absolute top-0 right-0 w-full h-full opacity-10 md:opacity-20">
      <div className="absolute top-1/4 left-1/3 w-64 md:w-96 h-64 md:h-96 rounded-full bg-purple-600 blur-xl md:blur-3xl animate-pulse"></div>
      <div
        className="absolute top-3/4 right-1/4 w-56 md:w-80 h-56 md:h-80 rounded-full bg-indigo-700 blur-xl md:blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-1/3 left-1/4 w-48 md:w-72 h-48 md:h-72 rounded-full bg-fuchsia-800 blur-xl md:blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
    </div>

    {/* Animated grid - smaller scale on mobile */}
    <div
      className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDYwaDYwVjBoLTYweiIvPjxwYXRoIGQ9Ik02MCAzMGEzMCAzMCAwIDExLTYwIDAgMzAgMzAgMCAwMTYwIDB6IiBzdHJva2U9InJnYmEoMTYxLCA5OCwgMjQ3LCAwLjIpIiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9nPjwvc3ZnPg==')]"
      style={{
        opacity: 0.05,
        transform: "perspective(1000px) rotateX(20deg) scale(1.5)",
        transformOrigin: "center bottom",
      }}
    ></div>
  </div>

  {/* Content container */}
  <div className="container mx-auto px-4 sm:px-6 relative z-10">
    <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
      {/* Left content box - full width on mobile */}
      <div className="w-full md:w-1/2 mb-8 md:mb-0">
        <div className="relative">
          {/* Decorative elements - hidden on mobile */}
          <div className="hidden md:block absolute -top-12 -left-12 w-24 h-24 border-l-2 border-t-2 border-purple-400 opacity-50"></div>
          <div className="hidden md:block absolute -bottom-12 -right-12 w-24 h-24 border-r-2 border-b-2 border-purple-400 opacity-50"></div>

          {/* Content card with glassmorphism - adjusted padding for mobile */}
          <div className="bg-purple-900/30 backdrop-blur-md md:backdrop-blur-lg p-6 sm:p-8 md:p-10 rounded-xl border border-purple-500/30 shadow-xl md:shadow-2xl transform transition-all hover:translate-y-1 hover:shadow-purple-500/20">
            <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 p-1 md:p-2 bg-purple-600 rounded-lg shadow-lg">
              <svg
                className="w-6 h-6 md:w-8 md:h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                ></path>
              </svg>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Track, Showcase, and Manage
              <div className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400">
                  Internships
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-2 md:h-3 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-50 blur-sm"></span>
              </div>
            </h1>

            <p className="text-lg sm:text-xl text-gray-200 mb-6 md:mb-8 font-light leading-relaxed">
              A comprehensive platform to discover opportunities, track
              progress, and align internships with academic &
              sustainability goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <button className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-lg hover:from-purple-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-purple-600/30 transform hover:-translate-y-1 flex items-center justify-center group text-sm sm:text-base">
                <svg
                  className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
                Find Internships
              </button>
              <button className="px-6 py-3 sm:px-8 sm:py-4 bg-transparent border border-purple-400/50 md:border-2 text-white rounded-lg hover:bg-purple-900/30 transition-all shadow-lg hover:shadow-white/10 transform hover:-translate-y-1 flex items-center justify-center group text-sm sm:text-base">
                <svg
                  className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
                Showcase Statistics
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right content box - full width on mobile */}
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
          {/* Spline Model Container */}
          <div className="relative w-full h-full">
            <SplineModel />
          </div>

          {/* Floating badges - smaller on mobile */}
          <div
            className="absolute -right-2 -top-2 md:-right-4 md:-top-4 bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-2 md:p-3 rounded-full shadow-lg animate-bounce z-10"
            style={{ animationDuration: "3s" }}
          >
            <svg
              className="w-4 h-4 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>

          <div
            className="absolute -left-1 bottom-8 md:bottom-12 md:-left-2 bg-gradient-to-br from-fuchsia-600 to-purple-700 text-white p-2 md:p-3 rounded-full shadow-lg animate-bounce z-10"
            style={{ animationDuration: "4s", animationDelay: "1s" }}
          >
            <svg
              className="w-4 h-4 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Floating particles - fewer on mobile */}
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
    {[...Array(10)].map((_, i) => (
      <div
        key={i}
        className="absolute bg-white opacity-20 md:opacity-30 rounded-full"
        style={{
          width: Math.random() * 3 + 1 + "px",
          height: Math.random() * 3 + 1 + "px",
          top: Math.random() * 100 + "%",
          left: Math.random() * 100 + "%",
          animation: `float ${Math.random() * 10 + 10}s linear infinite`,
        }}
      ></div>
    ))}
  </div>
</section>

<section className="py-12 sm:py-14 md:py-16 bg-gray-900">
  <div className="container mx-auto px-4 sm:px-5 md:px-6">
    <div className="text-center mb-10 sm:mb-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
        Internship Statistics Overview
      </h2>
      <p className="text-sm sm:text-base text-gray-300 max-w-3xl mx-auto">
        Real-time insights into internship opportunities, placements, and industry collaborations.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
      <div className="bg-black p-4 sm:p-6 rounded-lg shadow-md border-t-4 border-purple-600 hover:shadow-xl transition transform hover:-translate-y-1">
        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-900 rounded-full mb-3">
          <BriefcaseBusiness className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">1,200+</h3>
        <p className="text-sm text-gray-300">Total Internships Available</p>
      </div>

      <div className="bg-black p-4 sm:p-6 rounded-lg shadow-md border-t-4 border-purple-500 hover:shadow-xl transition transform hover:-translate-y-1">
        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-900 rounded-full mb-3">
          <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">850</h3>
        <p className="text-sm text-gray-300">Active Internships</p>
      </div>

      <div className="bg-black p-4 sm:p-6 rounded-lg shadow-md border-t-4 border-purple-400 hover:shadow-xl transition transform hover:-translate-y-1">
        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-900 rounded-full mb-3">
          <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">350+</h3>
        <p className="text-sm text-gray-300">Industry Collaborations</p>
      </div>

      <div className="bg-black p-4 sm:p-6 rounded-lg shadow-md border-t-4 border-purple-300 hover:shadow-xl transition transform hover:-translate-y-1">
        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-900 rounded-full mb-3">
          <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">92%</h3>
        <p className="text-sm text-gray-300">Placement Success Rate</p>
      </div>
    </div>

    <div className="bg-black p-4 sm:p-6 rounded-lg shadow-inner border border-gray-800">
      <div className="flex flex-wrap gap-2 justify-center mb-4 sm:mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-600">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`whitespace-nowrap text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-colors ${
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

      <div className="h-56 sm:h-64 bg-gray-800 rounded-lg shadow-inner p-4 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-12 sm:h-16 w-12 sm:w-16 text-purple-500 mx-auto mb-3" />
          <p className="text-sm text-gray-300">
            Interactive statistics chart will be displayed here
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Internship Showcase Section */}
<section className="py-12 sm:py-14 md:py-16 bg-black">
  <div className="container mx-auto px-4 md:px-6">
    {/* Heading */}
    <div className="text-center mb-10 md:mb-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
        Explore Internship Opportunities
      </h2>
      <p className="text-base sm:text-lg text-gray-300 max-w-2xl sm:max-w-3xl mx-auto">
        Browse through available internships and find the perfect match for your academic and career goals.
      </p>
    </div>

    {/* Filters Section */}
    <div className="mb-6 sm:mb-8 bg-gray-900 rounded-lg p-4 sm:p-6">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center justify-between w-full text-white hover:text-purple-400 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
        />
      </button>

      {showFilters && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/** Department Filter */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Department</label>
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="w-full bg-gray-800 text-white rounded-md p-2 border border-gray-700"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/** SDG Filter */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">SDG Alignment</label>
            <select
              name="sdg"
              value={filters.sdg}
              onChange={handleFilterChange}
              className="w-full bg-gray-800 text-white rounded-md p-2 border border-gray-700"
            >
              <option value="">All SDGs</option>
              {sdgs.map((sdg) => (
                <option key={sdg} value={sdg}>
                  {sdg}
                </option>
              ))}
            </select>
          </div>

          {/** PO Filter */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Program Outcome</label>
            <select
              name="po"
              value={filters.po}
              onChange={handleFilterChange}
              className="w-full bg-gray-800 text-white rounded-md p-2 border border-gray-700"
            >
              <option value="">All POs</option>
              {pos.map((po) => (
                <option key={po} value={po}>
                  {po}
                </option>
              ))}
            </select>
          </div>

          {/** Industry Filter */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Industry</label>
            <select
              name="industry"
              value={filters.industry}
              onChange={handleFilterChange}
              className="w-full bg-gray-800 text-white rounded-md p-2 border border-gray-700"
            >
              <option value="">All Industries</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Buttons */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex flex-col sm:flex-row gap-2 justify-end mt-4">
            <button
              onClick={resetFilters}
              className="w-full sm:w-auto px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>

    {/* Internship Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {featuredInternships.map((internship) => (
        <div
          key={internship.id}
          className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-800 hover:border-purple-500/30"
        >
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {internship.company}
              </h3>
              <span className="bg-purple-600 text-xs px-2 py-1 rounded">
                {internship.department}
              </span>
            </div>

            <div className="flex flex-wrap items-center text-gray-400 text-sm mb-3 gap-2">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{internship.location}</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{internship.duration}</span>
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-4">{internship.description}</p>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-400 mb-2">
                SDG Alignment
              </h4>
              <div className="flex flex-wrap gap-2">
                {internship.sdgs.map((sdg) => (
                  <span
                    key={sdg}
                    className="bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded flex items-center"
                  >
                    <Target className="h-3 w-3 mr-1" />
                    {sdg}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-400 mb-2">
                Program Outcomes
              </h4>
              <div className="flex flex-wrap gap-2">
                {internship.pos.map((po) => (
                  <span
                    key={po}
                    className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded flex items-center"
                  >
                    <Bookmark className="h-3 w-3 mr-1" />
                    {po}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="w-full sm:flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition-colors flex items-center justify-center">
                <Send className="h-4 w-4 mr-2" />
                Apply Now
              </button>
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors">
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
      <h2 className="text-3xl font-bold text-white mb-4">
        Sustainable Development Goals Alignment
      </h2>
      <p className="text-lg text-gray-300 max-w-3xl mx-auto">
        See how our internships contribute to the United Nations Sustainable Development Goals
      </p>
    </div>

    <div className="bg-black p-6 rounded-lg shadow-inner border border-gray-800">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {[1, 4, 5, 7, 8, 9, 10, 13].map((sdg) => (
          <div
            key={sdg}
            className="bg-gray-800 p-4 rounded-lg text-center hover:bg-gray-700 transition-colors"
          >
            <div className="w-16 h-16 mx-auto mb-3 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold">
              {sdg}
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">SDG {sdg}</h3>
            <p className="text-xs text-gray-400">
              {sdgDescriptions[sdg]}
            </p>
            <div className="mt-2 text-purple-400 text-sm font-medium">
              {Math.floor(Math.random() * 30) + 15}% of internships
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
{/* contact section (same as before) */}
<section className="py-16 bg-black" id="contact">
  <div className="container mx-auto px-4 md:px-6">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Contact Us</h2>
        <p className="text-lg text-gray-300">
          Have questions or want to collaborate? Reach out to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Details */}
        <div className="bg-gray-900 p-6 sm:p-8 rounded-lg border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-6">Get in Touch</h3>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-purple-900/50 p-3 rounded-full">
                <Mail className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-400">Email</h4>
                <p className="text-white break-all">info@interntrack.edu</p>
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

        {/* Contact Form */}
        <div className="bg-gray-900 p-6 sm:p-8 rounded-lg border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-6">Send Us a Message</h3>

          <form onSubmit={handleContactSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
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
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
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
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
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
    {/* Top Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
      {/* Brand Section */}
      <div>
        <div className="text-white font-bold text-2xl mb-4">
          <span className="text-purple-400">Intern</span>Track
        </div>
        <p className="mb-4">
          A comprehensive platform for internship management, tracking,
          and showcasing.
        </p>
        <div className="flex flex-wrap gap-4">
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

      {/* Quick Links */}
      <div>
        <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
        <ul className="space-y-2">
          {["Home", "About", "Internship Statistics", "How It Works", "Contact"].map((link) => (
            <li key={link}>
              <a href="#" className="hover:text-purple-400 transition-colors">
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Resources */}
      <div>
        <h3 className="text-white font-bold text-lg mb-4">Resources</h3>
        <ul className="space-y-2">
          {["Privacy Policy", "Terms of Use", "FAQ", "Support", "Blog"].map((item) => (
            <li key={item}>
              <a href="#" className="hover:text-purple-400 transition-colors">
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact Info */}
      <div>
        <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
        <address className="not-italic space-y-2 text-sm">
          <p>123 Education Street</p>
          <p>Academic City, AC 12345</p>
          <p>Email: info@interntrack.com</p>
          <p>Phone: (123) 456-7890</p>
        </address>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-gray-800 mt-10 pt-6 text-center md:text-left">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm">
          © {new Date().getFullYear()} InternTrack. All rights reserved.
        </p>
        <p className="text-sm">Powered by Modern Web Technologies</p>
      </div>
    </div>
  </div>
</footer>

    </div>
  );
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
  13: "Climate Action",
};
