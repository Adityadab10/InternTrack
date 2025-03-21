import { useState } from "react";

export default function FacultyLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Faculty login attempt:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-black p-4">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-purple-700 rounded-full flex items-center justify-center mb-4">
            <img
              src="/placeholder.svg"
              alt="Faculty Icon"
              className="w-8 h-8 invert"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Faculty Login</h1>
          <p className="text-purple-200 text-center mt-2">Monitor and mentor student internships</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-purple-200">
              Faculty Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-purple-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="faculty.name@university.edu"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-purple-200">
                Password
              </label>
              <a href="#" className="text-sm text-purple-300 hover:text-purple-200">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-purple-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 rounded border-purple-500 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-purple-200">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition duration-200"
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-purple-300 hover:text-purple-200">
            ← Back to user selection
          </a>
        </div>
      </div>
    </div>
  );
}