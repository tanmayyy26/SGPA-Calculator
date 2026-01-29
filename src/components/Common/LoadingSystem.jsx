import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const LoadingSystem = ({ 
  isLoading, 
  loadingText = "Calculating...", 
  progress = null,
  type = 'spinner' // spinner, dots, pulse, progress
}) => {
  const { theme } = useTheme();
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const spinnerVariants = {
    spin: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const dotVariants = {
    bounce: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (!isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className={`p-8 rounded-xl ${theme.styles.surface} border ${theme.styles.border} min-w-[200px] text-center`}
        >
          {/* Loading Animation */}
          <div className="flex justify-center mb-4">
            {type === 'spinner' && (
              <motion.div
                variants={spinnerVariants}
                animate="spin"
                className={`w-8 h-8 border-3 border-gray-300 border-t-${theme.colors.primary} rounded-full`}
                style={{ borderTopColor: theme.colors.primary }}
              />
            )}

            {type === 'dots' && (
              <div className="flex space-x-1">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    variants={dotVariants}
                    animate="bounce"
                    transition={{ delay: index * 0.2 }}
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                ))}
              </div>
            )}

            {type === 'pulse' && (
              <motion.div
                variants={pulseVariants}
                animate="pulse"
                className="w-12 h-12 rounded-full"
                style={{ backgroundColor: theme.colors.primary }}
              />
            )}

            {type === 'progress' && progress !== null && (
              <div className="w-full">
                <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                </div>
                <div className={`text-sm ${theme.styles.textSecondary}`}>
                  {Math.round(progress)}%
                </div>
              </div>
            )}
          </div>

          {/* Loading Text */}
          <div className={`text-lg font-medium ${theme.styles.text}`}>
            {loadingText}
            {type !== 'progress' && <span className="w-4 inline-block text-left">{dots}</span>}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingSystem;