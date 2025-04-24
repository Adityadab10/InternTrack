import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiCheckCircle, FiX } from 'react-icons/fi';

const MappingOversight = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    compliant: 0,
    nonCompliant: 0
  });

  // Add SDG descriptions
  const sdgDescriptions = {
    '1': 'No Poverty',
    '2': 'Zero Hunger',
    '3': 'Good Health and Well-being',
    '4': 'Quality Education',
    '5': 'Gender Equality',
    '6': 'Clean Water and Sanitation',
    '7': 'Affordable and Clean Energy',
    '8': 'Decent Work and Economic Growth',
    '9': 'Industry, Innovation and Infrastructure',
    '10': 'Reduced Inequalities',
    '11': 'Sustainable Cities and Communities',
    '12': 'Responsible Consumption and Production',
    '13': 'Climate Action',
    '14': 'Life Below Water',
    '15': 'Life on Land',
    '16': 'Peace, Justice and Strong Institutions',
    '17': 'Partnerships for the Goals'
  };

  // Add PO descriptions
  const poDescriptions = {
    'PO1': 'Engineering Knowledge',
    'PO2': 'Problem Analysis',
    'PO3': 'Design/Development of Solutions',
    'PO4': 'Investigation',
    'PO5': 'Modern Tool Usage',
    'PO6': 'Engineer and Society',
    'PO7': 'Environment and Sustainability',
    'PO8': 'Ethics',
    'PO9': 'Individual and Team Work',
    'PO10': 'Communication',
    'PO11': 'Project Management',
    'PO12': 'Life-long Learning'
  };

  // Add PEO descriptions
  const peoDescriptions = {
    'PEO1': 'Professional Excellence',
    'PEO2': 'Core Competence',
    'PEO3': 'Adaptability and Innovation',
    'PEO4': 'Leadership and Ethics',
    'PEO5': 'Continuous Learning'
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/internships', {
        credentials: 'include'
      });
      const data = await response.json();
      
      // Process internships and calculate statistics
      const processedInternships = data.map(internship => ({
        ...internship,
        isCompliant: Boolean(
          internship.sdgs?.length && 
          internship.pos?.length && 
          internship.peos?.length
        ),
        missingSdgs: !internship.sdgs?.length,
        missingPos: !internship.pos?.length,
        missingPeos: !internship.peos?.length
      }));

      setInternships(processedInternships);

      // Calculate statistics
      const compliantCount = processedInternships.filter(i => i.isCompliant).length;
      setStats({
        total: processedInternships.length,
        compliant: compliantCount,
        nonCompliant: processedInternships.length - compliantCount
      });

      setLoading(false);
    } catch (err) {
      console.error('Error fetching internships:', err);
      setError('Failed to load internship data');
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const handleInternshipClick = (internship) => {
    setSelectedInternship(internship);
  };

  const closeModal = () => {
    setSelectedInternship(null);
  };

  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2 }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className="p-8 space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-purple-400 to-purple-200 bg-clip-text text-transparent">
          SDG, PO & PEO Mapping Oversight
        </h2>
        <p className="text-purple-400/80 mt-2">Monitor and ensure proper mapping compliance</p>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-purple-300 text-lg font-semibold mb-2">Total Internships</h3>
          <p className="text-4xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-green-900/30 backdrop-blur-xl rounded-xl p-6 border border-green-500/20">
          <h3 className="text-green-300 text-lg font-semibold mb-2">Compliant</h3>
          <p className="text-4xl font-bold text-white">{stats.compliant}</p>
        </div>
        <div className="bg-red-900/30 backdrop-blur-xl rounded-xl p-6 border border-red-500/20">
          <h3 className="text-red-300 text-lg font-semibold mb-2">Non-Compliant</h3>
          <p className="text-4xl font-bold text-white">{stats.nonCompliant}</p>
        </div>
      </motion.div>

      {/* Internships List */}
      <motion.div variants={itemVariants} className="mt-8">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-purple-500/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-purple-900/30">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Internship</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Company</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-purple-300">SDGs</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-purple-300">POs</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-purple-300">PEOs</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-purple-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {internships.map((internship) => (
                  <tr 
                    key={internship._id} 
                    className="hover:bg-purple-900/20 transition-colors cursor-pointer"
                    onClick={() => handleInternshipClick(internship)}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">{internship.title}</p>
                        <p className="text-sm text-purple-300">{new Date(internship.deadline).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-purple-200">{internship.company}</td>
                    <td className="px-6 py-4">
                      <div className={`flex justify-center items-center ${internship.missingSdgs ? 'text-red-400' : 'text-green-400'}`}>
                        {internship.missingSdgs ? <FiAlertCircle size={20} /> : <FiCheckCircle size={20} />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex justify-center items-center ${internship.missingPos ? 'text-red-400' : 'text-green-400'}`}>
                        {internship.missingPos ? <FiAlertCircle size={20} /> : <FiCheckCircle size={20} />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex justify-center items-center ${internship.missingPeos ? 'text-red-400' : 'text-green-400'}`}>
                        {internship.missingPeos ? <FiAlertCircle size={20} /> : <FiCheckCircle size={20} />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          internship.isCompliant 
                            ? 'bg-green-900/50 text-green-200 border border-green-500/30'
                            : 'bg-red-900/50 text-red-200 border border-red-500/30'
                        }`}>
                          {internship.isCompliant ? 'Compliant' : 'Non-Compliant'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Mapping Details Modal */}
      <AnimatePresence>
        {selectedInternship && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              className="bg-gray-900/90 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-purple-500/30"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-purple-500/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-purple-200">
                      {selectedInternship.title}
                    </h3>
                    <p className="text-purple-400 mt-1">{selectedInternship.company}</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* SDGs Section */}
                <div>
                  <h4 className="text-lg font-semibold text-purple-300 mb-4">Sustainable Development Goals</h4>
                  {selectedInternship.sdgs && selectedInternship.sdgs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedInternship.sdgs.map(sdg => (
                        <div key={sdg} className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">🎯</span>
                            <div>
                              <p className="font-medium text-white">SDG {sdg}</p>
                              <p className="text-sm text-purple-300">{sdgDescriptions[sdg]}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-red-400">No SDGs mapped</p>
                  )}
                </div>

                {/* POs Section */}
                <div>
                  <h4 className="text-lg font-semibold text-purple-300 mb-4">Program Outcomes</h4>
                  {selectedInternship.pos && selectedInternship.pos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedInternship.pos.map(po => (
                        <div key={po} className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">🎓</span>
                            <div>
                              <p className="font-medium text-white">{po}</p>
                              <p className="text-sm text-purple-300">{poDescriptions[po]}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-red-400">No POs mapped</p>
                  )}
                </div>

                {/* PEOs Section */}
                <div>
                  <h4 className="text-lg font-semibold text-purple-300 mb-4">Program Educational Objectives</h4>
                  {selectedInternship.peos && selectedInternship.peos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedInternship.peos.map(peo => (
                        <div key={peo} className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">🎯</span>
                            <div>
                              <p className="font-medium text-white">{peo}</p>
                              <p className="text-sm text-purple-300">{peoDescriptions[peo]}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-red-400">No PEOs mapped</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MappingOversight; 