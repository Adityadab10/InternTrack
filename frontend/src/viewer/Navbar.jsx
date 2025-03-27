"use client"
import { MenuIcon, SearchIcon, BellIcon } from "./Icons"

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-gray-800 border-b border-gray-700 py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-white mr-4 md:hidden">
          <MenuIcon className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-white">
          Internship sa<span className="text-purple-500">Statistics</span>
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-700 text-white rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
          />
          <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <button className="p-2 rounded-full hover:bg-gray-700">
          <BellIcon className="h-5 w-5 text-white" />
        </button>

        <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
          <span className="text-sm font-medium">GS</span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

