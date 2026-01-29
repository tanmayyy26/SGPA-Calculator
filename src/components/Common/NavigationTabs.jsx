import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useSGPA } from '../../context/SGPAContext';
import MainContent from '../Calculator/MainContent';
import SemesterManager from '../Features/SemesterManager';
import AnalyticsDashboard from '../Dashboard/AnalyticsDashboard';
import ExportShare from '../Features/ExportShare';
import HistoryPanel from '../Features/HistoryPanel';
import Circle from './Circle';

const NavigationTabs = ({ SGPA, setSGPA }) => {
  const { theme } = useTheme();
  const { currentSGPA } = useSGPA();
  const [activeTab, setActiveTab] = useState('calculator');

  const tabs = [
    { 
      id: 'calculator', 
      label: 'Calculator', 
      icon: '🧮',
      description: 'Calculate your SGPA'
    },
    { 
      id: 'semesters', 
      label: 'Semesters', 
      icon: '📚',
      description: 'Manage multiple semesters'
    },
    { 
      id: 'history', 
      label: 'History', 
      icon: '📋',
      description: 'View calculation history'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: '📊',
      description: 'View performance insights'
    },
    { 
      id: 'export', 
      label: 'Export', 
      icon: '📤',
      description: 'Share and export data'
    }
  ];

  const tabVariants = {
    inactive: {
      backgroundColor: 'rgba(0,0,0,0)',
      scale: 0.95
    },
    active: {
      backgroundColor: theme.colors.primary,
      scale: 1
    }
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  // Show result circle if SGPA is calculated and we're on calculator tab
  if (SGPA != 0 && activeTab === 'calculator') {
    return (
      <div className="w-full">
        <Circle SGPA={SGPA} setSGPA={setSGPA} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className={`flex space-x-1 p-1 rounded-xl ${theme.styles.surface} border ${theme.styles.border} backdrop-blur-md`}>
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variants={tabVariants}
              animate={activeTab === tab.id ? 'active' : 'inactive'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-4 py-3 rounded-lg font-medium transition-all duration-300 min-w-[120px] group ${
                activeTab === tab.id
                  ? 'text-white shadow-lg'
                  : `${theme.styles.textSecondary} hover:${theme.styles.text}`
              }`}
              style={{
                backgroundColor: activeTab === tab.id ? theme.colors.primary : 'transparent'
              }}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">{tab.icon}</span>
                <span className="text-xs font-medium">{tab.label}</span>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                {tab.description}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                  <div className="border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full"
        >
          {activeTab === 'calculator' && (
            <div className="flex justify-center">
              <MainContent SGPA={SGPA} setSGPA={setSGPA} />
            </div>
          )}
          
          {activeTab === 'semesters' && <SemesterManager />}
          
          {activeTab === 'history' && <HistoryPanel />}
          
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          
          {activeTab === 'export' && <ExportShare />}
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicator */}
      <div className="flex justify-center mt-8">
        <div className="flex space-x-2">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= tabs.findIndex(t => t.id === activeTab)
                  ? 'bg-blue-500'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationTabs;