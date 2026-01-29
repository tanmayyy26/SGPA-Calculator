import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSGPA } from '../../context/SGPAContext';
import { subjectsBySemester } from '../../../data/subject';

const AnalyticsDashboard = () => {
  const { currentGrades, currentSemester, allSemesters, history, calculateCGPA } = useSGPA();
  const [activeTab, setActiveTab] = useState('overview');

  // Get subjects for current semester
  const subjects = subjectsBySemester[currentSemester] || subjectsBySemester["Semester 2"];

  // Calculate analytics
  const analytics = useMemo(() => {
    const currentGradesList = Object.values(currentGrades).filter(grade => grade > 0);
    const allGrades = history.flatMap(h => Object.values(h.grades || {})).filter(g => g > 0);
    
    return {
      current: {
        average: currentGradesList.length > 0 ? 
          (currentGradesList.reduce((sum, g) => sum + g, 0) / currentGradesList.length).toFixed(2) : 0,
        highest: Math.max(...currentGradesList, 0),
        lowest: currentGradesList.length > 0 ? Math.min(...currentGradesList) : 0,
        distribution: getGradeDistribution(currentGrades)
      },
      overall: {
        totalCalculations: history.length,
        averageSGPA: history.length > 0 ? 
          (history.reduce((sum, h) => sum + parseFloat(h.sgpa || 0), 0) / history.length).toFixed(2) : 0,
        bestSGPA: Math.max(...history.map(h => parseFloat(h.sgpa || 0)), 0),
        trend: calculateTrend(history),
        subjectPerformance: getSubjectPerformance()
      }
    };
  }, [currentGrades, history]);

  function getGradeDistribution(grades) {
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    
    Object.entries(grades).forEach(([key, grade]) => {
      if (!grade || grade <= 0) return;
      const subject = subjects[key];
      if (!subject) return;
      
      const percentage = (grade / subject.outOf) * 100;
      if (percentage >= 80) distribution.A++;
      else if (percentage >= 70) distribution.B++;
      else if (percentage >= 60) distribution.C++;
      else if (percentage >= 50) distribution.D++;
      else distribution.F++;
    });
    
    return distribution;
  }

  function calculateTrend(historyData) {
    if (historyData.length < 2) return 'stable';
    
    const recent = historyData.slice(0, 3).map(h => parseFloat(h.sgpa || 0));
    const older = historyData.slice(3, 6).map(h => parseFloat(h.sgpa || 0));
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((a, b) => a + b, 0) / older.length : recentAvg;
    
    if (recentAvg > olderAvg + 0.2) return 'improving';
    if (recentAvg < olderAvg - 0.2) return 'declining';
    return 'stable';
  }

  function getSubjectPerformance() {
    const performance = {};
    
    Object.keys(subjects).forEach(key => {
      const grades = history.map(h => h.grades?.[key]).filter(g => g > 0);
      if (grades.length > 0) {
        const average = grades.reduce((a, b) => a + b, 0) / grades.length;
        const trend = grades.length > 1 ? 
          (grades[0] - grades[grades.length - 1]) > 0 ? 'up' : 'down' : 'stable';
        
        performance[key] = {
          average: average.toFixed(1),
          trend,
          count: grades.length,
          subject: subjects[key]
        };
      }
    });
    
    return performance;
  }

  const GradeChart = ({ distribution }) => {
    const total = Object.values(distribution).reduce((a, b) => a + b, 0);
    if (total === 0) return <div className="text-gray-400 text-center py-8">No data available</div>;

    return (
      <div className="space-y-3">
        {Object.entries(distribution).map(([grade, count]) => {
          const percentage = (count / total) * 100;
          const colors = {
            A: 'bg-green-500',
            B: 'bg-blue-500', 
            C: 'bg-yellow-500',
            D: 'bg-orange-500',
            F: 'bg-red-500'
          };

          return (
            <div key={grade} className="flex items-center space-x-3">
              <div className="w-8 text-sm font-semibold text-white">{grade}</div>
              <div className="flex-1 bg-gray-700 rounded-full h-4 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className={`h-full ${colors[grade]} rounded-full`}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                  {count} ({percentage.toFixed(1)}%)
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const TrendIndicator = ({ trend }) => {
    const configs = {
      improving: { icon: '↗️', color: 'text-green-400', text: 'Improving' },
      declining: { icon: '↘️', color: 'text-red-400', text: 'Declining' },
      stable: { icon: '➡️', color: 'text-yellow-400', text: 'Stable' }
    };

    const config = configs[trend] || configs.stable;

    return (
      <div className={`flex items-center space-x-2 ${config.color}`}>
        <span className="text-lg">{config.icon}</span>
        <span className="font-semibold">{config.text}</span>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'distribution', label: 'Grade Distribution' },
    { id: 'subjects', label: 'Subject Analysis' },
    { id: 'predictions', label: 'Predictions' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h2>
        <p className="text-gray-400">Detailed insights into your academic performance</p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center mb-6 bg-gray-800/50 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <h3 className="text-gray-400 text-sm font-medium mb-1">Current Average</h3>
                <p className="text-2xl font-bold text-white">{analytics.current.average}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <h3 className="text-gray-400 text-sm font-medium mb-1">CGPA</h3>
                <p className="text-2xl font-bold text-yellow-400">{calculateCGPA()}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <h3 className="text-gray-400 text-sm font-medium mb-1">Best SGPA</h3>
                <p className="text-2xl font-bold text-green-400">{analytics.overall.bestSGPA}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <h3 className="text-gray-400 text-sm font-medium mb-1">Performance Trend</h3>
                <TrendIndicator trend={analytics.overall.trend} />
              </div>
            </div>

            {/* Current Semester Summary */}
            {Object.keys(currentGrades).length > 0 && (
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">Current Semester</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Highest Score</p>
                    <p className="text-lg font-bold text-green-400">{analytics.current.highest}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Lowest Score</p>
                    <p className="text-lg font-bold text-red-400">{analytics.current.lowest}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Subjects Completed</p>
                    <p className="text-lg font-bold text-blue-400">
                      {Object.values(currentGrades).filter(g => g > 0).length} / {Object.keys(subjects).length}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'distribution' && (
          <motion.div
            key="distribution"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Grade Distribution</h3>
            <GradeChart distribution={analytics.current.distribution} />
          </motion.div>
        )}

        {activeTab === 'subjects' && (
          <motion.div
            key="subjects"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Subject Performance</h3>
            {Object.keys(analytics.overall.subjectPerformance).length === 0 ? (
              <p className="text-gray-400 text-center py-8">No historical data available</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(analytics.overall.subjectPerformance).map(([key, data]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-white">{data.subject.label}</h4>
                      <p className="text-sm text-gray-400">Average: {data.average} | {data.count} calculations</p>
                    </div>
                    <TrendIndicator trend={data.trend} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'predictions' && (
          <motion.div
            key="predictions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Performance Predictions</h3>
            
            {analytics.overall.totalCalculations < 2 ? (
              <p className="text-gray-400 text-center py-8">
                Need at least 2 calculations to generate predictions
              </p>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700">
                  <h4 className="font-semibold text-blue-400 mb-2">Next Semester Prediction</h4>
                  <p className="text-gray-300">
                    Based on your {analytics.overall.trend} trend, your next SGPA is predicted to be{' '}
                    <span className="font-bold text-white">
                      {(parseFloat(analytics.overall.averageSGPA) + 
                        (analytics.overall.trend === 'improving' ? 0.3 : 
                         analytics.overall.trend === 'declining' ? -0.3 : 0)).toFixed(2)}
                    </span>
                  </p>
                </div>

                <div className="p-4 bg-green-900/20 rounded-lg border border-green-700">
                  <h4 className="font-semibold text-green-400 mb-2">Target Achievement</h4>
                  <p className="text-gray-300">
                    To achieve a CGPA of 8.0, you need an average SGPA of{' '}
                    <span className="font-bold text-white">8.0</span> in remaining semesters.
                  </p>
                </div>

                <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-700">
                  <h4 className="font-semibold text-yellow-400 mb-2">Improvement Areas</h4>
                  <div className="space-y-2">
                    {Object.entries(analytics.current.distribution).map(([grade, count]) => {
                      if ((grade === 'C' || grade === 'D' || grade === 'F') && count > 0) {
                        return (
                          <p key={grade} className="text-gray-300">
                            • Focus on improving {count} subject{count > 1 ? 's' : ''} with grade {grade}
                          </p>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnalyticsDashboard;