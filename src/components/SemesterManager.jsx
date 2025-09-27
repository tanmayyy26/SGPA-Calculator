import React, { useState } from 'react';
import { useSGPA } from '../context/SGPAContext';
import { motion, AnimatePresence } from 'framer-motion';
import ShinyText from './reactBits/ShinyText';
import ClickSpark from './reactBits/ClickSpark';

const SemesterManager = () => {
  const { 
    currentSemester, 
    allSemesters, 
    loadSemester, 
    calculateCGPA,
    resetCurrent,
    history 
  } = useSGPA();
  
  const [showHistory, setShowHistory] = useState(false);
  const [showSemesterList, setShowSemesterList] = useState(false);

  const semesterOptions = [
    'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4',
    'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'
  ];

  const cgpa = calculateCGPA();
  const completedSemesters = Object.keys(allSemesters).length;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Semester Stats Overview */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 mb-6 border border-gray-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <h3 className="text-gray-400 text-sm font-medium">Current Semester</h3>
            <p className="text-2xl font-bold text-white">{currentSemester}</p>
          </div>
          <div>
            <h3 className="text-gray-400 text-sm font-medium">Completed Semesters</h3>
            <p className="text-2xl font-bold text-green-400">{completedSemesters}</p>
          </div>
          <div>
            <h3 className="text-gray-400 text-sm font-medium">CGPA</h3>
            <p className="text-2xl font-bold text-yellow-400">{cgpa > 0 ? cgpa : '--'}</p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <ClickSpark sparkColor='#60A5FA' sparkCount={8}>
          <button
            onClick={() => setShowSemesterList(!showSemesterList)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors border border-blue-500"
          >
            <ShinyText text="Switch Semester" speed={4} />
          </button>
        </ClickSpark>

        <ClickSpark sparkColor='#34D399' sparkCount={8}>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors border border-green-500"
          >
            <ShinyText text={`History (${history.length})`} speed={4} />
          </button>
        </ClickSpark>

        <ClickSpark sparkColor='#F87171' sparkCount={8}>
          <button
            onClick={resetCurrent}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors border border-red-500"
          >
            <ShinyText text="Reset Current" speed={4} />
          </button>
        </ClickSpark>
      </div>

      {/* Semester Selection Dropdown */}
      <AnimatePresence>
        {showSemesterList && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 mb-6 border border-gray-600"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Select Semester</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {semesterOptions.map((semester) => {
                const isCompleted = allSemesters[semester];
                const isCurrent = semester === currentSemester;
                
                return (
                  <button
                    key={semester}
                    onClick={() => {
                      loadSemester(semester);
                      setShowSemesterList(false);
                    }}
                    className={`p-3 rounded-lg border transition-all ${
                      isCurrent 
                        ? 'bg-blue-600 border-blue-400 text-white' 
                        : isCompleted
                        ? 'bg-green-600/20 border-green-400 text-green-300 hover:bg-green-600/30'
                        : 'bg-gray-700 border-gray-500 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {semester}
                    {isCompleted && <div className="text-xs">SGPA: {isCompleted.sgpa}</div>}
                    {isCurrent && <div className="text-xs">Current</div>}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-600"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Calculation History</h3>
            {history.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No calculations saved yet</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {history.map((calc) => (
                  <motion.div
                    key={calc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-white">{calc.semester}</h4>
                        <p className="text-sm text-gray-400">
                          {new Date(calc.date).toLocaleDateString()} at{' '}
                          {new Date(calc.date).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-400">
                          {calc.sgpa}
                        </div>
                        <div className="text-xs text-gray-400">SGPA</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Semester Progress Visualization */}
      {completedSemesters > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 mt-6 border border-gray-700"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Academic Progress</h3>
          <div className="space-y-2">
            {Object.entries(allSemesters).map(([semester, data]) => (
              <div key={semester} className="flex items-center space-x-4">
                <div className="w-24 text-sm text-gray-400">{semester}</div>
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                    style={{ width: `${(parseFloat(data.sgpa) / 10) * 100}%` }}
                  />
                </div>
                <div className="w-12 text-sm font-semibold text-white">{data.sgpa}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SemesterManager;