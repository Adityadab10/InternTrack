import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Add this import

export default function ManagementLogin() {
  const navigate = useNavigate(); // Add this hook
  const [formData, setFormData] = useState({
    instituteCode: "",
    officialEmail: "",
    accessPin: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { instituteCode, officialEmail, accessPin } = formData;

    if (
      instituteCode === "123" &&
      officialEmail === "adityadab27@gmail.com" &&
      accessPin === "123"
    ) {
      setSuccess(true);
      setError("");
      // Add a slight delay before navigation to show the success message
      setTimeout(() => {
        navigate('/management/dashboard'); // Navigate to dashboard
      }, 1000);
    } else {
      setSuccess(false);
      setError("Access Denied: Invalid credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950/50 to-gray-900 flex items-center justify-center px-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[120px]" />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/20 blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-violet-500/20 blur-[80px]" />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-md w-full"
      >
        {/* Card Container */}
        <div className="backdrop-blur-xl bg-gray-900/80 p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
          border border-purple-500/20">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 blur-[2px] rounded-xl opacity-50" />
                <div className="relative bg-gray-900 p-3 rounded-xl border border-purple-500/30">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mb-2 bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent text-sm uppercase tracking-wider font-bold">
              Administrative Portal
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Management Login</h2>
            <p className="text-sm text-purple-300/80">
              Secure access for institutional administrators
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {['instituteCode', 'officialEmail', 'accessPin'].map((field) => (
              <motion.div 
                key={field}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: ['instituteCode', 'officialEmail', 'accessPin'].indexOf(field) * 0.1 }}
                className="relative group"
              >
                <label className="block text-sm font-medium text-purple-300 mb-1.5">
                  {field === 'instituteCode' ? 'Institute Code' : 
                   field === 'officialEmail' ? 'Official Email' : 'Access PIN'}
                </label>
                <div className="relative">
                  <input
                    type={field === 'accessPin' ? 'password' : field === 'officialEmail' ? 'email' : 'text'}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-800/50 text-white border border-purple-500/30
                      focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300
                      placeholder-purple-300/30"
                    placeholder={field === 'instituteCode' ? 'INST-001' : 
                               field === 'officialEmail' ? 'admin@institution.edu' : 
                               '••••••••'}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </motion.div>
            ))}

            {/* Error/Success Messages */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error && (
                <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/30 text-center">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              {success && (
                <div className="p-3 rounded-lg bg-green-900/20 border border-green-500/30 text-center">
                  <p className="text-green-400 text-sm">Access Granted ✓</p>
                </div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 
                hover:to-indigo-500 text-white font-semibold rounded-xl transition duration-300 shadow-lg 
                shadow-purple-900/30 hover:shadow-purple-900/50"
            >
              Secure Login
            </motion.button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Main Portal
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
