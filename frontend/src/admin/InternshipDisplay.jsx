import React from "react";
import { motion } from "framer-motion";

const InternshipDisplay = ({ internship, onDelete, onEdit }) => {
  const formatArrayToString = (array) => {
    if (!array || array.length === 0) return "None";
    return array.join(", ");
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className="p-8 max-w-4xl mx-auto bg-gradient-to-br from-gray-900/95 via-purple-950/95 to-gray-900/95 rounded-3xl 
        shadow-[0_0_50px_-12px] shadow-purple-500/30 border border-purple-500/20 backdrop-blur-xl"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Enhanced Header Section */}
      <div className="relative mb-12">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-2xl blur-3xl"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <div className="relative flex justify-between items-start">
          <div>
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {internship.title}
            </motion.h1>
            <motion.h2 
              className="text-xl font-semibold text-purple-400 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {internship.company}
            </motion.h2>
          </div>
          <motion.div 
            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-2xl 
              text-sm font-medium shadow-lg shadow-green-500/20 backdrop-blur-xl border border-green-400/20
              transform hover:scale-105 transition-all duration-300"
            whileHover={{ y: -2 }}
          >
            New Opportunity
          </motion.div>
        </div>
      </div>

      {/* Enhanced Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
            subIcon: "M15 11a3 3 0 11-6 0 3 3 0 016 0z",
            label: "Location",
            value: internship.location || "Remote",
            gradient: "from-blue-500/20 to-purple-500/20"
          },
          {
            icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
            label: "Duration",
            value: internship.duration,
            gradient: "from-purple-500/20 to-pink-500/20"
          },
          {
            icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z",
            label: "Stipend",
            value: internship.stipend ? `₹${internship.stipend}` : "Unpaid",
            gradient: "from-pink-500/20 to-rose-500/20"
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            className={`relative group overflow-hidden`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-50 group-hover:opacity-70 
              transition-opacity duration-300 rounded-xl`} />
            <div className="relative flex items-center space-x-4 bg-gray-900/40 backdrop-blur-xl p-6 rounded-xl 
              border border-purple-500/20 group-hover:border-purple-500/40 transition-all duration-300">
              <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors duration-300">
                <svg className="h-6 w-6 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  {item.subIcon && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.subIcon} />}
                </svg>
              </div>
              <div>
                <p className="text-sm text-purple-300 group-hover:text-purple-200 transition-colors duration-300">
                  {item.label}
                </p>
                <p className="text-white font-medium text-lg group-hover:scale-105 transform transition-transform duration-300">
                  {item.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Content Cards */}
      <div className="space-y-6 mb-8">
        {[
          { title: "Description", content: internship.description || "No description provided." },
          { title: "Requirements", content: internship.requirements || "No specific requirements." }
        ].map((item, index) => (
          <motion.div
            key={index}
            className="relative group overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-purple-500/10 
              opacity-50 group-hover:opacity-70 transition-opacity duration-300 rounded-xl" />
            <div className="relative bg-gray-900/40 backdrop-blur-xl p-8 rounded-xl border border-purple-500/20 
              group-hover:border-purple-500/40 transition-all duration-300">
              <h3 className="text-xl font-semibold text-purple-300 mb-4 group-hover:text-purple-200 transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-purple-100/90 leading-relaxed group-hover:text-purple-100 transition-colors duration-300">
                {item.content}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div 
          className="bg-purple-900/10 p-6 rounded-xl border border-purple-500/20"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-purple-300 mb-3">Positions Available</h3>
          <p className="text-4xl font-bold text-white">{internship.positions}</p>
        </motion.div>

        <motion.div 
          className="bg-purple-900/10 p-6 rounded-xl border border-purple-500/20"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-purple-300 mb-3">Application Deadline</h3>
          <p className="text-4xl font-bold text-white">
            {new Date(internship.deadline).toLocaleDateString()}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: 'SDGs', data: internship.sdgs },
          { title: 'Program Outcomes', data: internship.pos },
          { title: 'Program Educational Objectives', data: internship.peos }
        ].map((item, index) => (
          <motion.div 
            key={item.title}
            className="bg-purple-900/10 p-6 rounded-xl border border-purple-500/20"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-purple-300 mb-3">{item.title}</h3>
            <p className="text-purple-100/90">{formatArrayToString(item.data)}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-purple-500/20">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => onEdit(internship)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl 
            hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 
            flex items-center space-x-2 shadow-lg hover:shadow-purple-500/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Edit Internship</span>
        </motion.button>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => onDelete(internship._id)}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl 
            hover:from-red-500 hover:to-rose-500 transition-all duration-300 
            flex items-center space-x-2 shadow-lg hover:shadow-red-500/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Delete Internship</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default InternshipDisplay;