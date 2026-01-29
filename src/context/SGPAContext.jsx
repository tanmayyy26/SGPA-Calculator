import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useSGPAHistory, useLocalStorage } from '../hooks/useLocalStorage';

const SGPAContext = createContext();

const initialState = {
  currentGrades: {},
  currentSGPA: 0,
  currentSemester: 'Semester 2',
  allSemesters: {},
  isCalculating: false,
  errors: {},
  lastSaved: null,
  isDirty: false
};

const sgpaReducer = (state, action) => {
  switch (action.type) {
    case 'SET_GRADE':
      return {
        ...state,
        currentGrades: {
          ...state.currentGrades,
          [action.payload.subject]: action.payload.grade
        },
        isDirty: true,
        errors: {
          ...state.errors,
          [action.payload.subject]: null // Clear error for this subject
        }
      };

    case 'SET_SGPA':
      return {
        ...state,
        currentSGPA: action.payload,
        isCalculating: false
      };

    case 'SET_CALCULATING':
      return {
        ...state,
        isCalculating: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.field]: action.payload.message
        }
      };

    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: {}
      };

    case 'SAVE_SEMESTER':
      return {
        ...state,
        allSemesters: {
          ...state.allSemesters,
          [action.payload.semester]: {
            sgpa: action.payload.sgpa,
            grades: action.payload.grades,
            date: new Date().toISOString()
          }
        },
        isDirty: false,
        lastSaved: new Date().toISOString()
      };

    case 'LOAD_SEMESTER':
      const semesterData = state.allSemesters[action.payload];
      return {
        ...state,
        currentGrades: semesterData?.grades || {},
        currentSGPA: semesterData?.sgpa || 0,
        currentSemester: action.payload,
        isDirty: false
      };

    case 'RESET_CURRENT':
      return {
        ...state,
        currentGrades: {},
        currentSGPA: 0,
        errors: {},
        isDirty: false
      };

    case 'DELETE_SEMESTER':
      const newSemesters = { ...state.allSemesters };
      delete newSemesters[action.payload];
      return {
        ...state,
        allSemesters: newSemesters
      };

    case 'RESET_ALL':
      return {
        ...initialState
      };

    case 'LOAD_FROM_STORAGE':
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
};

export const SGPAProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sgpaReducer, initialState);
  const { history, addCalculation, removeCalculation, clearHistory } = useSGPAHistory();
  const [persistedState, setPersistedState] = useLocalStorage('sgpaAppState', initialState);

  // Load persisted state on mount
  useEffect(() => {
    if (persistedState && Object.keys(persistedState).length > 0) {
      dispatch({ type: 'LOAD_FROM_STORAGE', payload: persistedState });
    }
  }, []);

  // Auto-save state changes
  useEffect(() => {
    if (state.isDirty || state.lastSaved) {
      setPersistedState({
        currentGrades: state.currentGrades,
        allSemesters: state.allSemesters,
        currentSemester: state.currentSemester,
        lastSaved: state.lastSaved
      });
    }
  }, [state.currentGrades, state.allSemesters, state.currentSemester, state.lastSaved, setPersistedState]);

  const contextValue = {
    ...state,
    dispatch,
    history,
    addCalculation,
    removeCalculation,
    clearHistory,
    
    // Helper functions
    setGrade: (subject, grade) => dispatch({ 
      type: 'SET_GRADE', 
      payload: { subject, grade } 
    }),
    
    setSGPA: (sgpa) => dispatch({ 
      type: 'SET_SGPA', 
      payload: sgpa 
    }),
    
    setCalculating: (calculating) => dispatch({ 
      type: 'SET_CALCULATING', 
      payload: calculating 
    }),
    
    setError: (field, message) => dispatch({ 
      type: 'SET_ERROR', 
      payload: { field, message } 
    }),
    
    clearErrors: () => dispatch({ type: 'CLEAR_ERRORS' }),
    
    saveSemester: (semester, sgpa, grades) => {
      dispatch({ 
        type: 'SAVE_SEMESTER', 
        payload: { semester, sgpa, grades } 
      });
      addCalculation({ sgpa, grades, semester });
    },
    
    loadSemester: (semester) => dispatch({ 
      type: 'LOAD_SEMESTER', 
      payload: semester 
    }),
    
    resetCurrent: () => dispatch({ type: 'RESET_CURRENT' }),
    
    resetAll: () => dispatch({ type: 'RESET_ALL' }),
    
    clearAllData: () => {
      dispatch({ type: 'RESET_ALL' });
      clearHistory();
    },

    deleteSemester: (semester) => dispatch({
      type: 'DELETE_SEMESTER',
      payload: semester
    }),

    // Calculate CGPA from all semesters
    calculateCGPA: () => {
      const semesters = Object.values(state.allSemesters);
      if (semesters.length === 0) return 0;
      
      const totalSGPA = semesters.reduce((sum, sem) => sum + parseFloat(sem.sgpa || 0), 0);
      return (totalSGPA / semesters.length).toFixed(2);
    }
  };

  return (
    <SGPAContext.Provider value={contextValue}>
      {children}
    </SGPAContext.Provider>
  );
};

export const useSGPA = () => {
  const context = useContext(SGPAContext);
  if (!context) {
    throw new Error('useSGPA must be used within an SGPAProvider');
  }
  return context;
};