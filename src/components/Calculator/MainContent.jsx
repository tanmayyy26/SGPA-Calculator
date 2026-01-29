import React, { useRef, useState, useEffect } from "react"
import InputBox from "./InputBox"
import { subjectsBySemester } from "../../../data/subject";
import ShinyText from "../reactBits/ShinyText";
import ClickSpark from "../reactBits/ClickSpark";
import { useSGPA } from "../../context/SGPAContext";
import { motion, AnimatePresence } from "framer-motion";

const MainContent = ({ SGPA, setSGPA }) => {
  const { 
    currentGrades, 
    currentSemester,
    setCalculating, 
    saveSemester,
    errors,
    clearErrors,
    resetCurrent
  } = useSGPA();
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const [showPreview, setShowPreview] = useState(false);
  const [calculatedSGPA, setCalculatedSGPA] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);

  // Get subjects for current semester
  const subjects = subjectsBySemester[currentSemester] || subjectsBySemester["Semester 2"];

  const subjectRefs = useRef({});
  
  // Update refs when subjects change
  useEffect(() => {
    Object.keys(subjects).forEach((key) => {
      if (!subjectRefs.current[key]) {
        subjectRefs.current[key] = React.createRef();
      }
    });
  }, [subjects]);

  // Check if form has any errors or empty required fields
  React.useEffect(() => {
    const hasErrors = Object.values(errors).some(error => error !== null);
    const hasAllGrades = Object.keys(subjects).every(key => 
      currentGrades[key] !== undefined && currentGrades[key] !== '' && currentGrades[key] > 0
    );
    setIsFormValid(!hasErrors && hasAllGrades);
  }, [errors, currentGrades, subjects]);

  const calculatePreviewSGPA = () => {
    let totalTheory = 0;
    let totalPractical = 0;

    Object.entries(subjects).forEach(([key, { credit, type }]) => {
      const value = parseFloat(currentGrades[key] || 0);
      if (type === "theory") {
        totalTheory += value * credit;
      } else {
        totalPractical += value;
      }
    });

    return ((totalTheory / 10) + (totalPractical / 5)) / 20;
  };

  const handlePreview = (e) => {
    e.preventDefault();
    clearErrors();
    
    if (isFormValid) {
      const sgpa = calculatePreviewSGPA();
      setCalculatedSGPA(sgpa);
      setShowPreview(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      // Show validation errors
      Object.keys(subjects).forEach(key => {
        if (!currentGrades[key] || currentGrades[key] <= 0) {
          // This will be handled by InputBox validation
        }
      });
      return;
    }

    setCalculating(true);
    
    // Add a small delay for better UX
    setTimeout(() => {
      const sgpa = calculatePreviewSGPA();
      setSGPA(sgpa.toFixed(2));
      saveSemester(currentSemester, sgpa.toFixed(2), currentGrades);
    }, 1000);
  };

  const handleReset = () => {
    resetCurrent();
    setShowResetConfirm(false);
    clearErrors();
  };

  const getSubjectProgress = () => {
    const completed = Object.keys(subjects).filter(key => 
      currentGrades[key] && currentGrades[key] > 0
    ).length;
    return (completed / Object.keys(subjects).length) * 100;
  };

  return (
    <div className="animate-fadein lg:w-170 w-120">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Progress</span>
          <span>{Object.keys(subjects).filter(key => currentGrades[key] && currentGrades[key] > 0).length} / {Object.keys(subjects).length}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getSubjectProgress()}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-1">
          {Object.entries(subjects).map(([key, { label, outOf }]) => {
            return (
              <InputBox
                key={key}
                name={label}
                outOf={outOf}
                subjectKey={key}
                ref={subjectRefs.current[key]}
              />
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
          <ClickSpark
            sparkColor='#60A5FA'
            sparkSize={14}
            sparkRadius={50}
            sparkCount={12}
            duration={400}
          >
            <button 
              type="button"
              onClick={handlePreview}
              disabled={!isFormValid}
              className={`border p-2 px-6 rounded-2xl mt-2 border-gray-600 transition-all ${
                isFormValid 
                  ? 'hover:border-blue-400 hover:shadow-lg hover:shadow-blue-400/20' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <ShinyText 
                text="Preview SGPA" 
                disabled={!isFormValid} 
                speed={6} 
                className='text-blue-400' 
              />
            </button>
          </ClickSpark>

          <ClickSpark
            sparkColor='#34D399'
            sparkSize={14}
            sparkRadius={50}
            sparkCount={12}
            duration={400}
          >
            <button 
              type="submit" 
              disabled={!isFormValid}
              className={`border p-2 px-6 rounded-2xl mt-2 border-gray-600 transition-all ${
                isFormValid 
                  ? 'hover:border-green-400 hover:shadow-lg hover:shadow-green-400/20' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <ShinyText 
                text="Calculate & Save" 
                disabled={!isFormValid} 
                speed={6} 
                className='text-green-400'
              />
            </button>
          </ClickSpark>

          <ClickSpark
            sparkColor='#F87171'
            sparkSize={14}
            sparkRadius={50}
            sparkCount={12}
            duration={400}
          >
            <button 
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className={`border p-2 px-6 rounded-2xl mt-2 border-gray-600 transition-all hover:border-red-400 hover:shadow-lg hover:shadow-red-400/20`}
            >
              <ShinyText 
                text="Reset" 
                speed={6} 
                className='text-red-400'
              />
            </button>
          </ClickSpark>
        </div>
      </form>

      {/* SGPA Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-600"
            >
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                SGPA Preview
              </h3>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  {calculatedSGPA.toFixed(2)}
                </div>
                <div className="text-gray-400">
                  {currentSemester}
                </div>
              </div>

              <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
                {Object.entries(subjects).map(([key, { label }]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-300">{label}</span>
                    <span className="text-white">{currentGrades[key] || 0}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={(e) => {
                    setShowPreview(false);
                    handleSubmit(e);
                  }}
                  className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
                >
                  Calculate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl p-6 max-w-sm w-full border border-gray-600"
            >
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                Reset Form
              </h3>
              
              <p className="text-gray-400 text-center mb-6">
                Are you sure you want to clear all the grades for {currentSemester}? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                >
                  Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainContent;
