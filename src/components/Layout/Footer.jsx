import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import ShinyText from '../reactBits/ShinyText';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <motion.footer 
      className={`mt-8 pt-6 pb-4 border-t ${theme.styles.border} ${theme.styles.surface}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className={`text-sm ${theme.styles.textSecondary} mb-2`}>
          <span className="inline-flex items-center">
            Made with 
            <motion.span 
              className="mx-1 text-red-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              ❤️
            </motion.span>
            by
          </span>
        </div>
        
        <div className={`text-lg font-semibold ${theme.styles.text} mb-1`}>
          <ShinyText text="Tanmay Wagh" speed={3} />
        </div>
        
        <div className={`text-xs ${theme.styles.textSecondary} opacity-80 mb-2`}>
          Full Stack Developer • React Specialist • Education Technology Enthusiast
        </div>
        
        {/* Social Media Links */}
        <div className="flex justify-center space-x-3 mb-2">
          <motion.a
            href="https://linkedin.com/in/tanmay-wagh-446141345"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs ${theme.styles.textSecondary} hover:${theme.styles.text} transition-colors hover:scale-110 flex items-center`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="mr-1">💼</span>
            LinkedIn
          </motion.a>
          <span className={`text-xs ${theme.styles.textSecondary} opacity-50`}>•</span>
          <motion.a
            href="https://instagram.com/tanmaywagh_26"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs ${theme.styles.textSecondary} hover:${theme.styles.text} transition-colors hover:scale-110 flex items-center`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="mr-1">📸</span>
            Instagram
          </motion.a>
        </div>
        
        <div className={`text-xs ${theme.styles.textSecondary} mt-2 opacity-60`}>
          SGPA Calculator • Created by Tanmay Wagh
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;