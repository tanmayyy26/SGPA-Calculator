import React, { forwardRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSGPA } from "../../context/SGPAContext";

const InputBox = forwardRef(({ name, outOf, subjectKey }, ref) => {
  const { currentGrades, errors, setError, setGrade } = useSGPA();
  const [value, setValue] = useState(currentGrades[subjectKey] || '');
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);
  
  const error = errors[subjectKey];

  useEffect(() => {
    setValue(currentGrades[subjectKey] || '');
  }, [currentGrades, subjectKey]);

  const validateInput = (inputValue) => {
    const numValue = parseFloat(inputValue);
    
    if (inputValue === '') {
      setIsValid(true);
      return true;
    }
    
    if (isNaN(numValue)) {
      setError(subjectKey, 'Please enter a valid number');
      setIsValid(false);
      return false;
    }
    
    if (numValue < 0) {
      setError(subjectKey, 'Grade cannot be negative');
      setIsValid(false);
      return false;
    }
    
    if (numValue > outOf) {
      setError(subjectKey, `Grade cannot exceed ${outOf}`);
      setIsValid(false);
      return false;
    }
    
    setError(subjectKey, null);
    setIsValid(true);
    return true;
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    
    // Validate and update context
    if (validateInput(inputValue)) {
      setGrade(subjectKey, inputValue ? parseFloat(inputValue) : 0);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    validateInput(value);
  };

  const getGradeColor = () => {
    if (!value || !isValid) return 'text-white';
    const percentage = (parseFloat(value) / outOf) * 100;
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 75) return 'text-yellow-400';
    if (percentage >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getGradeLetter = () => {
    if (!value || !isValid) return '';
    const percentage = (parseFloat(value) / outOf) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
  };

  return (
    <motion.div 
      className="flex items-center justify-center flex-col mb-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`input-group w-50 h-12 m-1 relative transition-all duration-300 ${
        isFocused ? 'transform scale-105' : ''
      }`}>
        <motion.input 
          type="number" 
          className={`form-control ${getGradeColor()} bg-transparent custom-input transition-all duration-300 ${
            isFocused ? 'border-blue-400 shadow-lg shadow-blue-400/20' : ''
          } ${
            error ? 'border-red-500 shadow-lg shadow-red-500/20' : ''
          } ${
            isValid && value ? 'border-green-500/50' : ''
          }`}
          placeholder={name} 
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          ref={ref} 
          max={outOf} 
          min={0}
          step="0.1"
        />
        
        <span className={`input-group-text w-12 flex justify-center bg-transparent transition-colors ${
          isFocused ? 'text-blue-400' : 'text-white'
        } ${error ? 'text-red-400' : ''}`}>
          {outOf}
        </span>
        
        {/* Grade Letter Display */}
        <AnimatePresence>
          {value && isValid && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`absolute -right-12 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded-md text-xs font-bold ${getGradeColor()} bg-gray-800 border border-gray-600`}
            >
              {getGradeLetter()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-400 text-xs mt-1 text-center max-w-full"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Indicator */}
      <AnimatePresence>
        {value && isValid && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default InputBox;
