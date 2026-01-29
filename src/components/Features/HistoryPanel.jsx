import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSGPA } from '../../context/SGPAContext';
import ShinyText from '../reactBits/ShinyText';

const HistoryPanel = () => {
  const { history, removeCalculation, clearAllData } = useSGPA();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [selectedCalculation, setSelectedCalculation] = useState(null);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleClearHistory = () => {
    clearAllData();
    setShowClearConfirm(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Calculation History</h2>
          <p className="text-gray-400">Track your SGPA calculations over time</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Clear All
          </button>
        )}
      </motion.div>

      {/* History List */}
      <AnimatePresence mode="wait">
        {history.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg mb-4">No calculations yet</p>
            <p className="text-gray-500">Calculate your SGPA to see history here</p>
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {history.map((calc, index) => (
              <motion.div
                key={calc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 hover:border-gray-600 transition-all group cursor-pointer"
                onClick={() => setSelectedCalculation(selectedCalculation === calc.id ? null : calc.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-2xl font-bold text-yellow-400">
                        {parseFloat(calc.sgpa).toFixed(2)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{calc.semester}</h3>
                        <p className="text-sm text-gray-400">{formatDate(calc.date)}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCalculation(calc.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded text-sm"
                  >
                    Remove
                  </button>
                </div>

                {/* Expanded View */}
                <AnimatePresence>
                  {selectedCalculation === calc.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-700"
                    >
                      <h4 className="text-sm font-semibold text-gray-300 mb-3">Grades:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(calc.grades || {}).map(([key, grade]) => {
                          if (!grade || grade <= 0) return null;
                          return (
                            <div
                              key={key}
                              className="bg-gray-700/30 rounded p-2 text-sm flex justify-between"
                            >
                              <span className="text-gray-300">{key}</span>
                              <span className="text-white font-semibold">{grade}</span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear History Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl p-6 max-w-sm w-full border border-gray-600"
            >
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                Clear All History
              </h3>
              
              <p className="text-gray-400 text-center mb-6">
                Are you sure you want to delete all {history.length} calculation{history.length !== 1 ? 's' : ''}? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearHistory}
                  className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HistoryPanel;
