import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const InternshipOverview = () => {
  const [stats, setStats] = useState({
    totalInternships: 0,
    studentParticipation: 0,
    industryPartners: 0,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/management/stats');
        setStats({
          ...response.data,
          isLoading: false,
          error: null
        });
      } catch (error) {
        setStats(prev => ({
          ...prev,
          isLoading: false,
          error: error.message
        }));
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Total Internships',
      value: stats.totalInternships,
      subText: 'Active opportunities',
      details: [
        { label: 'Open Positions', value: stats.totalInternships * 2 },
        { label: 'Applications', value: stats.totalInternships * 5 },
        { label: 'Departments', value: '4' }
      ],
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Student Participation',
      value: `${stats.studentParticipation}%`,
      subText: 'Overall engagement',
      details: [
        { label: 'Applied', value: '128' },
        { label: 'Shortlisted', value: '64' },
        { label: 'Placed', value: '32' }
      ],
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: 'Industry Partners',
      value: stats.industryPartners,
      subText: 'Collaborating companies',
      details: [
        { label: 'Technology', value: '12' },
        { label: 'Finance', value: '8' },
        { label: 'Healthcare', value: '6' }
      ],
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ];

  if (stats.error) {
    return (
      <div className="p-6 bg-red-900/20 rounded-xl border border-red-500/20">
        <p className="text-red-400">Error loading stats: {stats.error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-black/50 rounded-xl border border-purple-500/20">
      <h2 className="text-2xl font-bold text-purple-200 mb-4">Institution-Wide Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative group bg-purple-900/30 p-6 rounded-lg border border-purple-500/30 
              hover:bg-purple-900/40 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            
            <div className="relative flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm text-purple-300">{card.title}</h3>
                <p className="text-xs text-purple-400/60 mt-1">{card.subText}</p>
              </div>
              {card.icon}
            </div>
            
            {stats.isLoading ? (
              <div className="animate-pulse h-8 bg-purple-500/20 rounded w-16" />
            ) : (
              <>
                <p className="text-3xl font-bold text-white relative z-10 mb-4">{card.value}</p>
                <div className="space-y-2 pt-4 border-t border-purple-500/20">
                  {card.details.map((detail, i) => (
                    <div key={detail.label} className="flex justify-between items-center">
                      <span className="text-sm text-purple-300/80">{detail.label}</span>
                      <span className="text-sm font-medium text-white">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InternshipOverview;