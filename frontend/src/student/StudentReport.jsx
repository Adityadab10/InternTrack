import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const StudentReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const generateReport = async () => {
      try {
        // First get student profile ID
        const profileResponse = await fetch(
          `http://localhost:5000/api/student-profile/by-email/${user.email}`,
          { credentials: 'include' }
        );
        
        if (!profileResponse.ok) throw new Error('Failed to fetch profile');
        const profile = await profileResponse.json();

        // Generate report using profile ID
        const reportResponse = await fetch(
          `http://localhost:5000/api/reports/generate-student-report/${profile._id}`,
          { 
            method: 'POST',
            credentials: 'include'
          }
        );

        if (!reportResponse.ok) throw new Error('Failed to generate report');
        const reportData = await reportResponse.json();
        setReport(reportData);
        setError(null);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to generate report');
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      generateReport();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] bg-gradient-to-br from-purple-900/20 via-black/40 to-indigo-900/20 rounded-lg border border-purple-500/30">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-l-4 border-purple-500"></div>
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-l-4 border-indigo-500 absolute top-3 left-3"></div>
        </div>
        <p className="mt-4 text-purple-300">Generating your personal report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-red-900/20 via-black/40 to-purple-900/20 rounded-lg border border-red-500/30 shadow-lg">
        <div className="flex items-center mb-4">
          <div className="mr-4 text-red-400 text-3xl">⚠️</div>
          <div>
            <h3 className="font-bold text-red-300 mb-1">Report Generation Failed</h3>
            <p className="text-red-200">{error}</p>
          </div>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-800/50 hover:bg-red-700/50 text-red-200 px-4 py-2 rounded-lg transition-colors duration-300 border border-red-500/30"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-purple-900/20 via-black/40 to-indigo-900/20 rounded-lg border border-purple-500/30 shadow-lg">
      {/* Header */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 opacity-30 animate-pulse"></div>
        <div className="relative bg-black/60 p-6 rounded-lg border border-purple-500/30">
          <h2 className="text-2xl font-bold text-purple-300 mb-2">Your Internship Journey Report</h2>
          <p className="text-purple-200">A comprehensive analysis of your progress and potential growth areas</p>
        </div>
      </div>

      {report && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Column 1: Overview and Strengths */}
          <div className="space-y-6">
            {/* Overview Section */}
            <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-6 rounded-lg border border-purple-500/30 shadow-inner">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg">
                  📊
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-200">Overall Progress</h3>
                  <p className="text-purple-300 text-xs">Your journey at a glance</p>
                </div>
              </div>
              <p className="text-purple-100 leading-relaxed text-sm">{report.overallProgress}</p>
            </div>

            {/* Strengths Section */}
            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-6 rounded-lg border border-green-500/30 shadow-inner">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-xl shadow-lg">
                  💪
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-200">Areas of Strength</h3>
                  <p className="text-green-300 text-xs">Your key competencies</p>
                </div>
              </div>
              <p className="text-green-100 leading-relaxed text-sm">{report.strengthAreas}</p>
            </div>
          </div>

          {/* Column 2: Improvements and SDG Impact */}
          <div className="space-y-6">
            {/* Improvements Section */}
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-6 rounded-lg border border-blue-500/30 shadow-inner">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-xl shadow-lg">
                  🚀
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-200">Growth Areas</h3>
                  <p className="text-blue-300 text-xs">Opportunities to improve</p>
                </div>
              </div>
              <p className="text-blue-100 leading-relaxed text-sm">{report.improvementAreas}</p>
            </div>

            {/* SDG Impact Section */}
            <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 p-6 rounded-lg border border-amber-500/30 shadow-inner">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-xl shadow-lg">
                  🌍
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-200">SDG Impact</h3>
                  <p className="text-amber-300 text-xs">Sustainability contribution</p>
                </div>
              </div>
              <p className="text-amber-100 leading-relaxed text-sm">{report.sdgImpact}</p>
            </div>
          </div>

          {/* Column 3: Career Path and Recommendations */}
          <div className="space-y-6">
            {/* Career Path Section */}
            <div className="bg-gradient-to-br from-pink-900/20 to-rose-900/20 p-6 rounded-lg border border-pink-500/30 shadow-inner">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-xl shadow-lg">
                  🧭
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-pink-200">Career Path</h3>
                  <p className="text-pink-300 text-xs">Your professional direction</p>
                </div>
              </div>
              <p className="text-pink-100 leading-relaxed text-sm">{report.careerPath}</p>
            </div>

            {/* Recommendations Section */}
            <div className="bg-gradient-to-br from-violet-900/20 to-indigo-900/20 p-6 rounded-lg border border-violet-500/30 shadow-inner">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg">
                  💡
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-violet-200">Action Items</h3>
                  <p className="text-violet-300 text-xs">Recommended next steps</p>
                </div>
              </div>
              <div className="space-y-3">
                {report.recommendations.map((rec, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-2 group bg-black/20 p-3 rounded-lg border border-violet-500/20 hover:border-violet-500/40 transition-all duration-300"
                  >
                    <div className="text-violet-400 group-hover:text-violet-300">✦</div>
                    <p className="text-violet-100 text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 pt-6 mt-6 border-t border-purple-500/30">
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-purple-500/20 flex items-center gap-2">
          <span>⬇️</span>
          Download Report
        </button>
        <button className="bg-purple-900/40 text-purple-200 px-6 py-3 rounded-lg font-medium hover:bg-purple-800/40 border border-purple-500/30 transition-all duration-300 flex items-center gap-2">
          <span>📤</span>
          Share with Mentor
        </button>
      </div>
    </div>
  );
};

export default StudentReport;