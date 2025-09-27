import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

const NotificationItem = ({ notification, onRemove }) => {
  const { theme } = useTheme();
  
  const icons = {
    success: '✅',
    error: '❌', 
    warning: '⚠️',
    info: 'ℹ️'
  };

  const colors = {
    success: 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200',
    error: 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200',
    warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200',
    info: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-lg border backdrop-blur-sm shadow-lg cursor-pointer ${colors[notification.type]}`}
      onClick={() => onRemove(notification.id)}
    >
      <div className="flex items-start space-x-3">
        <span className="text-lg flex-shrink-0">{icons[notification.type]}</span>
        <div className="flex-1 min-w-0">
          {notification.title && (
            <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
          )}
          <p className="text-sm">{notification.message}</p>
          {notification.action && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                notification.action.onClick();
                onRemove(notification.id);
              }}
              className="mt-2 px-3 py-1 text-xs font-medium rounded bg-white/20 hover:bg-white/30 transition-colors"
            >
              {notification.action.label}
            </button>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(notification.id);
          }}
          className="text-lg hover:scale-110 transition-transform"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
};

const NotificationContainer = ({ notifications, removeNotification }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <NotificationItem
              notification={notification}
              onRemove={removeNotification}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({ ...options, message, type: 'success' });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification({ ...options, message, type: 'error', duration: 8000 });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({ ...options, message, type: 'warning', duration: 6000 });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({ ...options, message, type: 'info' });
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </NotificationContext.Provider>
  );
};