import React, { useState } from 'react';

const ReportGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/reports/generate', {
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

  // Show error message if there's an error
  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-8 max-w-2xl mx-auto">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-400">Error Generating Report</h2>
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => {
                setError(null);
                generateReport();
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="bg-gray-900/50 border border-purple-900/50 rounded-lg p-8 max-w-2xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-purple-300">
                Generating Report...
              </h2>
              <p className="text-purple-200">
                Please wait while we analyze the data
              </p>
            </div>
            <div className="w-full max-w-md bg-gray-800 rounded-full h-2.5">
              <div className="bg-purple-600 h-2.5 rounded-full animate-pulse w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show report if available
  if (report) {
    return (
      <div className="min-h-screen p-6">
        <div className="bg-gray-900/50 border border-purple-900/50 rounded-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-purple-300 mb-6">Generated Report</h2>
          
          {/* SDG Impact */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">SDG Contributions</h3>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-purple-200">{report.sdgAnalysis}</pre>
            </div>
          </div>

          {/* Department Statistics */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">Department Insights</h3>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-purple-200">{report.departmentStats}</pre>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">Student Performance</h3>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-purple-200">{report.performanceMetrics}</pre>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-xl font-semibold text-purple-300 mb-4">Recommendations</h3>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-purple-200">{report.recommendations}</pre>
            </div>
          </div>

          <button
            onClick={() => setReport(null)}
            className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
          >
            Generate New Report
          </button>
        </div>
      </div>
    );
  }

  // Initial state with generate button
  return (
    <div className="min-h-screen p-6">
      <div className="bg-gray-900/50 border border-purple-900/50 rounded-lg p-8 max-w-2xl mx-auto">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-purple-300">Report Generation</h2>
          <p className="text-purple-200">
            Generate a comprehensive report analyzing internship statistics, student performance, and SDG contributions.
          </p>
          <button
            onClick={generateReport}
            className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors flex items-center justify-center mx-auto"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportGeneration; 