import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import ShinyText from '../reactBits/ShinyText';
import ClickSpark from '../reactBits/ClickSpark';

const SettingsPanel = () => {
  const {
    currentTheme,
    themes,
    highContrast,
    fontSize,
    reducedMotion,
    screenReader,
    toggleTheme,
    toggleHighContrast,
    changeFontSize,
    toggleReducedMotion,
    theme
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('appearance');

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'about', label: 'About', icon: '👨‍💻' }
  ];

  const fontSizeOptions = [
    { id: 'small', label: 'Small', size: '14px' },
    { id: 'normal', label: 'Normal', size: '16px' },
    { id: 'large', label: 'Large', size: '18px' },
    { id: 'extra-large', label: 'Extra Large', size: '20px' }
  ];

  return (
    <>
      {/* Settings Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full ${theme.styles.surface} ${theme.styles.border} border backdrop-blur-md shadow-lg transition-all hover:scale-105`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open Settings"
      >
        <span className="text-xl">⚙️</span>
      </motion.button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className={`fixed top-0 right-0 h-full w-full max-w-md ${theme.styles.background} border-l ${theme.styles.border} z-50 shadow-2xl`}
            >
              <div className="p-6 h-full overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${theme.styles.text}`}>Settings</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`p-2 rounded-lg ${theme.styles.surfaceLight} ${theme.styles.textSecondary} hover:${theme.styles.text} transition-colors`}
                    aria-label="Close Settings"
                  >
                    ✕
                  </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span className="hidden sm:block">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {activeTab === 'appearance' && (
                    <motion.div
                      key="appearance"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {/* Theme Selection */}
                      <div>
                        <h3 className={`text-lg font-semibold ${theme.styles.text} mb-3`}>Color Theme</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(themes).map(([key, themeOption]) => (
                            <button
                              key={key}
                              onClick={() => toggleTheme(key)}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${
                                currentTheme === key
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                              }`}
                            >
                              <div className="flex items-center space-x-3 mb-2">
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: themeOption.colors.primary }}
                                />
                                <span className={`font-medium ${theme.styles.text}`}>
                                  {themeOption.name}
                                </span>
                              </div>
                              <div className="flex space-x-1">
                                <div
                                  className="w-3 h-3 rounded"
                                  style={{ backgroundColor: themeOption.colors.surface }}
                                />
                                <div
                                  className="w-3 h-3 rounded"
                                  style={{ backgroundColor: themeOption.colors.secondary }}
                                />
                                <div
                                  className="w-3 h-3 rounded"
                                  style={{ backgroundColor: themeOption.colors.accent }}
                                />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* High Contrast */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`font-semibold ${theme.styles.text}`}>High Contrast</h3>
                          <p className={`text-sm ${theme.styles.textSecondary}`}>
                            Increases contrast for better visibility
                          </p>
                        </div>
                        <button
                          onClick={toggleHighContrast}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            highContrast ? 'bg-blue-600' : 'bg-gray-400'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                              highContrast ? 'translate-x-6' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'accessibility' && (
                    <motion.div
                      key="accessibility"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {/* Font Size */}
                      <div>
                        <h3 className={`text-lg font-semibold ${theme.styles.text} mb-3`}>Font Size</h3>
                        <div className="space-y-2">
                          {fontSizeOptions.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => changeFontSize(option.id)}
                              className={`w-full p-3 text-left rounded-lg border transition-all ${
                                fontSize === option.id
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                              }`}
                            >
                              <span
                                className={`${theme.styles.text}`}
                                style={{ fontSize: option.size }}
                              >
                                {option.label} ({option.size})
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Reduced Motion */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`font-semibold ${theme.styles.text}`}>Reduce Motion</h3>
                          <p className={`text-sm ${theme.styles.textSecondary}`}>
                            Minimizes animations and transitions
                          </p>
                        </div>
                        <button
                          onClick={toggleReducedMotion}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            reducedMotion ? 'bg-blue-600' : 'bg-gray-400'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                              reducedMotion ? 'translate-x-6' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Screen Reader Detection */}
                      {screenReader && (
                        <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
                          <p className={`text-sm text-green-800 dark:text-green-200`}>
                            ✓ Screen reader detected. Accessibility features are automatically optimized.
                          </p>
                        </div>
                      )}

                      {/* Accessibility Tips */}
                      <div className={`p-4 rounded-lg ${theme.styles.surfaceLight} border ${theme.styles.border}`}>
                        <h4 className={`font-semibold ${theme.styles.text} mb-2`}>Accessibility Tips</h4>
                        <ul className={`text-sm ${theme.styles.textSecondary} space-y-1`}>
                          <li>• Use Tab key to navigate between elements</li>
                          <li>• Press Space or Enter to activate buttons</li>
                          <li>• Use Ctrl + Plus/Minus to zoom</li>
                          <li>• All colors meet WCAG contrast standards</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'preferences' && (
                    <motion.div
                      key="preferences"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div className={`p-4 rounded-lg ${theme.styles.surfaceLight} border ${theme.styles.border}`}>
                        <h4 className={`font-semibold ${theme.styles.text} mb-2`}>Current Settings Summary</h4>
                        <div className={`text-sm ${theme.styles.textSecondary} space-y-1`}>
                          <p>• Theme: {themes[currentTheme].name}</p>
                          <p>• Font Size: {fontSize}</p>
                          <p>• High Contrast: {highContrast ? 'On' : 'Off'}</p>
                          <p>• Reduced Motion: {reducedMotion ? 'On' : 'Off'}</p>
                        </div>
                      </div>

                      <ClickSpark sparkColor={theme.colors.primary} sparkCount={8}>
                        <button
                          onClick={() => {
                            // Reset to defaults
                            toggleTheme('dark');
                            changeFontSize('normal');
                            if (highContrast) toggleHighContrast();
                            if (reducedMotion) toggleReducedMotion();
                          }}
                          className={`w-full p-3 rounded-lg border ${theme.styles.border} ${theme.styles.textSecondary} hover:${theme.styles.text} transition-colors`}
                        >
                          <ShinyText text="Reset to Defaults" speed={4} />
                        </button>
                      </ClickSpark>
                    </motion.div>
                  )}

                  {activeTab === 'about' && (
                    <motion.div
                      key="about"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div className={`text-center p-6 rounded-lg ${theme.styles.surfaceLight} border ${theme.styles.border}`}>
                        <div className="text-4xl mb-4">🎓</div>
                        <h4 className={`text-2xl font-bold ${theme.styles.text} mb-2`}>
                          <ShinyText text="SGPA Calculator" speed={3} />
                        </h4>
                        <p className={`text-lg ${theme.styles.textSecondary} mb-4`}>
                          Created with ❤️ by
                        </p>
                        <div className={`text-3xl font-bold ${theme.styles.text} mb-4`}>
                          <ShinyText text="Tanmay Wagh" speed={2} />
                        </div>
                        <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${theme.colors.primary} text-white text-sm font-semibold mb-4`}>
                          👨‍💻 Full Stack Developer
                        </div>
                        
                        {/* Social Media Links */}
                        <div className="flex justify-center space-x-4">
                          <motion.a
                            href="https://linkedin.com/in/tanmay-wagh-446141345"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center px-3 py-2 rounded-lg ${theme.styles.surface} border ${theme.styles.border} ${theme.styles.textSecondary} hover:${theme.styles.text} transition-all hover:scale-105`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="mr-2">💼</span>
                            <span className="text-sm font-medium">LinkedIn</span>
                          </motion.a>
                          <motion.a
                            href="https://instagram.com/tanmaywagh_26"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center px-3 py-2 rounded-lg ${theme.styles.surface} border ${theme.styles.border} ${theme.styles.textSecondary} hover:${theme.styles.text} transition-all hover:scale-105`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="mr-2">📸</span>
                            <span className="text-sm font-medium">Instagram</span>
                          </motion.a>
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg ${theme.styles.surfaceLight} border ${theme.styles.border}`}>
                        <h4 className={`font-semibold ${theme.styles.text} mb-3 flex items-center`}>
                          <span className="mr-2">🚀</span>
                          Features & Technologies
                        </h4>
                        <div className={`text-sm ${theme.styles.textSecondary} space-y-2`}>
                          <div className="grid grid-cols-2 gap-2">
                            <div>• React 18 & Hooks</div>
                            <div>• Framer Motion</div>
                            <div>• Three.js 3D Graphics</div>
                            <div>• AI Study Assistant</div>
                            <div>• Voice Recognition</div>
                            <div>• PWA Technology</div>
                            <div>• Gamification System</div>
                            <div>• Advanced Analytics</div>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg ${theme.styles.surfaceLight} border ${theme.styles.border}`}>
                        <h4 className={`font-semibold ${theme.styles.text} mb-2 flex items-center`}>
                          <span className="mr-2">🎯</span>
                          Project Vision
                        </h4>
                        <p className={`text-sm ${theme.styles.textSecondary} leading-relaxed`}>
                          To revolutionize student grade calculation with cutting-edge technology, 
                          providing an intuitive, intelligent, and visually stunning experience 
                          that helps students track and improve their academic performance.
                        </p>
                      </div>

                      <div className={`p-4 rounded-lg ${theme.styles.surfaceLight} border ${theme.styles.border} text-center`}>
                        <p className={`text-xs ${theme.styles.textSecondary}`}>
                          Made with passion for education technology
                        </p>
                        <p className={`text-xs ${theme.styles.textSecondary} mt-1`}>
                          Created by Tanmay Wagh
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SettingsPanel;