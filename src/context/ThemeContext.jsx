import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ThemeContext = createContext();

const themes = {
  dark: {
    name: 'Dark',
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#F59E0B',
      background: '#000000',
      surface: '#1F2937',
      surfaceLight: '#374151',
      text: '#FFFFFF',
      textSecondary: '#9CA3AF',
      textMuted: '#6B7280',
      border: '#4B5563',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      gradientFrom: '#3B82F6',
      gradientTo: '#8B5CF6'
    },
    styles: {
      background: 'bg-black',
      surface: 'bg-gray-800',
      surfaceLight: 'bg-gray-700',
      text: 'text-white',
      textSecondary: 'text-gray-400',
      textMuted: 'text-gray-500',
      border: 'border-gray-600'
    }
  },
  light: {
    name: 'Light',
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#F59E0B',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      surfaceLight: '#F3F4F6',
      text: '#111827',
      textSecondary: '#4B5563',
      textMuted: '#6B7280',
      border: '#D1D5DB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      gradientFrom: '#3B82F6',
      gradientTo: '#8B5CF6'
    },
    styles: {
      background: 'bg-white',
      surface: 'bg-gray-50',
      surfaceLight: 'bg-gray-100',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      border: 'border-gray-300'
    }
  },
  blue: {
    name: 'Ocean Blue',
    colors: {
      primary: '#0EA5E9',
      secondary: '#06B6D4',
      accent: '#F97316',
      background: '#0C1222',
      surface: '#1E293B',
      surfaceLight: '#334155',
      text: '#F1F5F9',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      border: '#475569',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      gradientFrom: '#0EA5E9',
      gradientTo: '#3B82F6'
    },
    styles: {
      background: 'bg-slate-900',
      surface: 'bg-slate-800',
      surfaceLight: 'bg-slate-700',
      text: 'text-slate-100',
      textSecondary: 'text-slate-400',
      textMuted: 'text-slate-500',
      border: 'border-slate-600'
    }
  },
  purple: {
    name: 'Purple Dreams',
    colors: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      accent: '#F59E0B',
      background: '#1A0B2E',
      surface: '#2D1B69',
      surfaceLight: '#3730A3',
      text: '#F3E8FF',
      textSecondary: '#C4B5FD',
      textMuted: '#A78BFA',
      border: '#5B21B6',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      gradientFrom: '#8B5CF6',
      gradientTo: '#EC4899'
    },
    styles: {
      background: 'bg-purple-900',
      surface: 'bg-purple-800',
      surfaceLight: 'bg-purple-700',
      text: 'text-purple-100',
      textSecondary: 'text-purple-300',
      textMuted: 'text-purple-400',
      border: 'border-purple-600'
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useLocalStorage('selectedTheme', 'dark');
  const [highContrast, setHighContrast] = useLocalStorage('highContrast', false);
  const [fontSize, setFontSize] = useLocalStorage('fontSize', 'normal');
  const [reducedMotion, setReducedMotion] = useLocalStorage('reducedMotion', false);
  const [screenReader, setScreenReader] = useState(false);

  // Detect screen reader usage
  useEffect(() => {
    const detectScreenReader = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const screenReaderIndicators = ['nvda', 'jaws', 'voiceover', 'narrator'];
      return screenReaderIndicators.some(indicator => userAgent.includes(indicator));
    };

    setScreenReader(detectScreenReader());

    // Detect system preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    mediaQuery.addEventListener('change', (e) => {
      setReducedMotion(e.matches);
    });

    return () => mediaQuery.removeEventListener('change', () => {});
  }, []);

  // Apply theme to document
  useEffect(() => {
    const theme = themes[currentTheme];
    if (theme) {
      // Apply CSS variables
      Object.entries(theme.colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--color-${key}`, value);
      });

      // Apply body class
      document.body.className = `${theme.styles.background} ${theme.styles.text} transition-colors duration-300`;
      
      // Apply font size
      document.documentElement.style.setProperty('--font-size-base', 
        fontSize === 'small' ? '14px' : 
        fontSize === 'large' ? '18px' : 
        fontSize === 'extra-large' ? '20px' : '16px'
      );

      // Apply motion preference
      if (reducedMotion) {
        document.documentElement.style.setProperty('--animation-duration', '0s');
      } else {
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
      }
    }
  }, [currentTheme, fontSize, reducedMotion]);

  const toggleTheme = (themeName) => {
    setCurrentTheme(themeName);
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  const changeFontSize = (size) => {
    setFontSize(size);
  };

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
  };

  const value = {
    currentTheme,
    theme: themes[currentTheme],
    themes,
    highContrast,
    fontSize,
    reducedMotion,
    screenReader,
    toggleTheme,
    toggleHighContrast,
    changeFontSize,
    toggleReducedMotion,
    
    // Helper functions
    getThemeColor: (colorName) => themes[currentTheme]?.colors[colorName],
    getThemeClass: (className) => themes[currentTheme]?.styles[className],
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};