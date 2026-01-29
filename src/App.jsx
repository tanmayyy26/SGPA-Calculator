import React, { useState, useEffect } from "react";
import Header from "./components/Layout/Header";
import SubHeading from "./components/Common/SubHeading";
import NavigationTabs from "./components/Common/NavigationTabs";
import SettingsPanel from "./components/Common/SettingsPanel";
import Footer from "./components/Layout/Footer";
import LoadingSystem from "./components/Common/LoadingSystem";
import Particles from "./components/reactBits/Particles";
import Confetti from "react-confetti-boom";
import { SGPAProvider } from "./context/SGPAContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { NotificationProvider, useNotification } from "./context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const AppContent = () => {
  const { theme, reducedMotion } = useTheme();
  const { showSuccess, showInfo } = useNotification();
  const [SGPA, setSGPA] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
    setLoading(false);
    showInfo("Welcome to the advanced SGPA Calculator! 🎓", {
      title: "Welcome!",
      duration: 4000
    });
  };

  const handleSGPACalculated = (sgpa) => {
    setIsCalculating(true);
    
    setTimeout(() => {
      setSGPA(sgpa);
      setIsCalculating(false);
      showSuccess(`SGPA calculated: ${sgpa}! 🎉`, {
        title: "Calculation Complete",
        duration: 3000
      });
    }, 1500);
  };

  // Handle URL sharing
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('share');
    
    if (sharedData) {
      try {
        const data = JSON.parse(atob(sharedData));
        showInfo(`Viewing shared SGPA: ${data.cgpa || 'N/A'}`, {
          title: "Shared Results",
          duration: 5000,
          action: {
            label: "Import Data",
            onClick: () => {
              // Logic to import shared data
              console.log("Importing shared data:", data);
            }
          }
        });
      } catch (error) {
        console.error("Failed to load shared data:", error);
      }
    }
  }, [showInfo]);

  return (
    <div 
      className={`m-0 p-0 w-screen min-h-screen relative flex justify-center items-start overflow-x-hidden flex-col ${theme.styles.background}`}
      style={{ 
        background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.surface} 100%)`,
        minHeight: '100vh'
      }}
    >
      {/* Settings Panel */}
      <SettingsPanel />

      {/* Loading System */}
      <LoadingSystem 
        isLoading={isCalculating} 
        loadingText="Calculating SGPA" 
        type="dots"
      />

      {/* Main Content Container */}
      <div className="flex justify-around flex-col w-full max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Header loading={loading} handleLoading={handleAnimationComplete} />
        </motion.div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {SGPA == 0 && !loading && (
            <motion.div
              key="main-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SubHeading />
              <div className="relative z-10 text-center py-10">
                <NavigationTabs 
                  SGPA={SGPA} 
                  setSGPA={handleSGPACalculated} 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Display */}
        <AnimatePresence>
          {SGPA != 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6 }}
              className="relative z-10 text-center py-10"
            >
              <NavigationTabs 
                SGPA={SGPA} 
                setSGPA={setSGPA} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Confetti for celebration */}
        <AnimatePresence>
          {SGPA != 0 && !reducedMotion && (
            <Confetti 
              mode="fall" 
              particleCount="150" 
              fadeOutHeight={1} 
            />
          )}
        </AnimatePresence>

        {/* Particle Background */}
        {!reducedMotion && (
          <Particles
            particleColors={[theme.colors.primary, theme.colors.secondary]}
            particleCount={300}
            particleSpread={15}
            speed={0.05}
            particleBaseSize={80}
            moveParticlesOnHover={true}
            alphaParticles={true}
            disableRotation={false}
          />
        )}

        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${theme.colors.primary} 0%, transparent 50%)`
          }}
        />
      </div>

      {/* Accessibility Skip Link */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>

      {/* Main Content Landmark */}
      <main id="main-content" className="sr-only">
        SGPA Calculator Main Content
      </main>

      {/* Footer with Creator Attribution */}
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <SGPAProvider>
          <AppContent />
        </SGPAProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
