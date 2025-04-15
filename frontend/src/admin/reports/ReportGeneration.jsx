import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Add framer-motion

const ReportGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.4 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5001/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate report');
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!data) {
        throw new Error('No data received');
      }

      setReport({
        sdgAnalysis: data.sdgAnalysis || 'No SDG analysis available',
        departmentStats: data.departmentStats || 'No department statistics available',
        performanceMetrics: data.performanceMetrics || 'No performance metrics available',
        recommendations: data.recommendations || 'No recommendations available'
      });
    } catch (error) {
      console.error('Error generating report:', error);
      setError(error.message);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced Error State
  if (error) {
    return (
      <motion.div 
        className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-black to-purple-950"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div 
          className="bg-red-900/20 backdrop-blur-xl border border-red-500/50 rounded-2xl p-8 max-w-2xl mx-auto shadow-xl"
          variants={cardVariants}
        >
          <div className="text-center space-y-6">
            <div className="inline-block p-4 bg-red-900/30 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-red-400">Error Generating Report</h2>
            <p className="text-red-300/90 text-lg">{error}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setError(null);
                generateReport();
              }}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-xl 
                hover:from-red-500 hover:to-red-700 transition-all duration-300 shadow-lg 
                hover:shadow-red-500/20 flex items-center justify-center mx-auto space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Try Again</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Enhanced Loading State
  if (loading) {
    return (
      <motion.div 
        className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-black to-purple-950"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div 
          className="bg-gray-900/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 max-w-2xl mx-auto shadow-xl"
          variants={cardVariants}
        >
          <div className="flex flex-col items-center justify-center space-y-8">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-purple-400/20 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-400/20 border-t-indigo-500 rounded-full animate-spin"></div>
              </div>
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
                Generating Report
              </h2>
              <p className="text-purple-300/80 text-lg">
                Analyzing data and preparing insights...
              </p>
            </div>
            <div className="w-full max-w-md space-y-2">
              <div className="h-1.5 bg-purple-900/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <p className="text-purple-400/60 text-sm text-center">Please wait while we process your request</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Enhanced Report Display
  if (report) {
    return (
      <motion.div 
        className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-black to-purple-950"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div 
          className="bg-gray-900/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 max-w-5xl mx-auto shadow-xl"
          variants={cardVariants}
        >
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
                Generated Report
              </h2>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setReport(null)}
                className="px-4 py-2 bg-purple-900/50 text-purple-300 rounded-xl hover:bg-purple-800/50 
                  transition-all duration-300 flex items-center space-x-2 border border-purple-500/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>New Report</span>
              </motion.button>
            </div>

            {/* Report sections with enhanced styling */}
            {Object.entries(report).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-purple-300 mb-4 flex items-center space-x-2">
                  <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                </h3>
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-purple-200/90 font-sans">{value}</pre>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Enhanced Initial State
  return (
    <motion.div 
      className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-black to-purple-950"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div 
        className="bg-gray-900/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 max-w-2xl mx-auto shadow-xl"
        variants={cardVariants}
      >
        <div className="text-center space-y-8">
          <div className="inline-block p-4 bg-purple-900/30 rounded-full mb-4">
            <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent mb-4">
              Report Generation
            </h2>
            <p className="text-purple-300/80 text-lg max-w-xl mx-auto">
              Generate a comprehensive report analyzing internship statistics, student performance, and SDG contributions.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateReport}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl 
              hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 shadow-lg 
              hover:shadow-purple-500/20 flex items-center justify-center mx-auto space-x-3 group"
          >
            <svg className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-lg font-medium">Generate Report</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReportGeneration;