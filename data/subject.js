const subjectsBySemester = {
  "Semester 1": {
    BCS1T01: { label: "Essentials of Chemistry", credit: 2, type: "theory", outOf: 100 },
    BCS1P01: { label: "Essentials of Chemistry Lab", credit: 1, type: "practical", outOf: 50 },
    BCS1T02: { label: "Applied Algebra", credit: 3, type: "theory", outOf: 100 },
    BCS1T03: { label: "Problem Solving using 'C'", credit: 3, type: "theory", outOf: 100 },
    BCS1P03: { label: "Problem Solving using 'C' Lab", credit: 1, type: "practical", outOf: 50 },
    BCS1T04: { label: "Basics of Electronics Engineering", credit: 3, type: "theory", outOf: 100 },
    BCS1P04: { label: "Basics of Electronics Engineering Lab", credit: 1, type: "practical", outOf: 50 },
    BVS1P01: { label: "Web Design Technology", credit: 2, type: "practical", outOf: 100 },
    BAEIT01: { label: "Communication Skills", credit: 1, type: "theory", outOf: 50 },
    BAE1P01: { label: "Communication Skills Lab", credit: 1, type: "practical", outOf: 50 },
    BCC1P01: { label: "CC-I (Refer CC Basket)", credit: 2, type: "practical", outOf: 100 },
  },
  "Semester 2": {
    EpT: { label: "Essential Of Physics", credit: 3, type: "theory", outOf: 100 },
    EpP: { label: "Essential Of Physics Lab", credit: 1, type: "practical", outOf: 50 },
    MfcsT: { label: "Maths (MFSC)", credit: 3, type: "theory", outOf: 100 },
    MfcsP: { label: "MFCS Lab", credit: 1, type: "practical", outOf: 50 },
    PpT: { label: "Python Programming", credit: 3, type: "theory", outOf: 100 },
    PpP: { label: "Python Programming Lab", credit: 1, type: "practical", outOf: 50 },
    Cao: { label: "CAO", credit: 2, type: "theory", outOf: 100 },
    Iks: { label: "IKS", credit: 2, type: "theory", outOf: 100 },
    Sec: { label: "SEC (Linux/Shell)", credit: 2, type: "theory", outOf: 100 },
    Cc: { label: "Co-Curricular", credit: 2, type: "theory", outOf: 100 },
  },
  "Semester 3": {
    BCSE3T09: { label: "Data Structure and Algorithms", credit: 3, type: "theory", outOf: 100 },
    BCSE3P09: { label: "Data Structure and Algorithms Lab", credit: 1, type: "practical", outOf: 50 },
    BCSE3T10: { label: "Object Oriented Programming using Java", credit: 3, type: "theory", outOf: 100 },
    BCSE3P10: { label: "OOP using Java Lab", credit: 1, type: "practical", outOf: 50 },
    BMD3T11: { label: "Probability Theory and Statistics", credit: 2, type: "theory", outOf: 100 },
    BOE3T01: { label: "Open Elective - I (Theory)", credit: 3, type: "theory", outOf: 100 },
    BOE3P01: { label: "Open Elective - I (Lab)", credit: 1, type: "practical", outOf: 50 },
    BHM3T01: { label: "Entrepreneurship and Startups", credit: 2, type: "theory", outOf: 100 },
    BVE3T01: { label: "Constitution of India", credit: 2, type: "theory", outOf: 100 },
    BCE3P01: { label: "Community Engagement Project", credit: 2, type: "practical", outOf: 100 },
  },
  "Semester 4": {
    BCSE4T12: { label: "Operating System", credit: 3, type: "theory", outOf: 100 },
    BCSE4P12: { label: "Operating System Lab", credit: 1, type: "practical", outOf: 50 },
    BCSE4T13: { label: "Artificial Intelligence", credit: 3, type: "theory", outOf: 100 },
    BCSE4P13: { label: "Artificial Intelligence Lab", credit: 1, type: "practical", outOf: 50 },
    BMD4T14: { label: "Quantum Computing", credit: 2, type: "theory", outOf: 100 },
    BOE4T02: { label: "Open Elective - II", credit: 2, type: "theory", outOf: 100 },
    BVE4P02: { label: "Hardware and Networking (VSC)", credit: 2, type: "practical", outOf: 100 },
    BAE4T02: { label: "Technical Report Writing (AEC)", credit: 2, type: "theory", outOf: 100 },
    BHM4T02: { label: "Economics and Entrepreneurship", credit: 2, type: "theory", outOf: 100 },
    BVE4T02: { label: "Universal Human Values", credit: 2, type: "theory", outOf: 100 },
  },
  "Semester 5": {
    AiT: { label: "Artificial Intelligence", credit: 3, type: "theory", outOf: 100 },
    AiP: { label: "AI Lab", credit: 1, type: "practical", outOf: 50 },
    MlT: { label: "Machine Learning", credit: 3, type: "theory", outOf: 100 },
    MlP: { label: "Machine Learning Lab", credit: 1, type: "practical", outOf: 50 },
    WtT: { label: "Web Technologies", credit: 3, type: "theory", outOf: 100 },
    WtP: { label: "Web Technologies Lab", credit: 1, type: "practical", outOf: 50 },
    Is: { label: "Information Security", credit: 2, type: "theory", outOf: 100 },
    Cc: { label: "Computer Graphics", credit: 2, type: "theory", outOf: 100 },
    Elective1: { label: "Elective I", credit: 2, type: "theory", outOf: 100 },
    Cc2: { label: "Co-Curricular", credit: 2, type: "theory", outOf: 100 },
  },
  "Semester 6": {
    DlT: { label: "Deep Learning", credit: 3, type: "theory", outOf: 100 },
    DlP: { label: "Deep Learning Lab", credit: 1, type: "practical", outOf: 50 },
    CcT: { label: "Cloud Computing", credit: 3, type: "theory", outOf: 100 },
    CcP: { label: "Cloud Computing Lab", credit: 1, type: "practical", outOf: 50 },
    BdaT: { label: "Big Data Analytics", credit: 3, type: "theory", outOf: 100 },
    BdaP: { label: "Big Data Analytics Lab", credit: 1, type: "practical", outOf: 50 },
    Iot: { label: "Internet of Things", credit: 2, type: "theory", outOf: 100 },
    Bc: { label: "Blockchain Technology", credit: 2, type: "theory", outOf: 100 },
    Elective2: { label: "Elective II", credit: 2, type: "theory", outOf: 100 },
    Cc2: { label: "Co-Curricular", credit: 2, type: "theory", outOf: 100 },
  },
  "Semester 7": {
    NlpT: { label: "Natural Language Processing", credit: 3, type: "theory", outOf: 100 },
    NlpP: { label: "NLP Lab", credit: 1, type: "practical", outOf: 50 },
    CvT: { label: "Computer Vision", credit: 3, type: "theory", outOf: 100 },
    CvP: { label: "Computer Vision Lab", credit: 1, type: "practical", outOf: 50 },
    ProjectT: { label: "Major Project Phase I", credit: 3, type: "theory", outOf: 100 },
    ProjectP: { label: "Project Lab", credit: 1, type: "practical", outOf: 50 },
    Cs: { label: "Cyber Security", credit: 2, type: "theory", outOf: 100 },
    Ds: { label: "Distributed Systems", credit: 2, type: "theory", outOf: 100 },
    Elective3: { label: "Elective III", credit: 2, type: "theory", outOf: 100 },
    Cc2: { label: "Co-Curricular", credit: 2, type: "theory", outOf: 100 },
  },
  "Semester 8": {
    Project: { label: "Major Project Phase II", credit: 6, type: "theory", outOf: 100 },
    Internship: { label: "Industrial Training/Internship", credit: 4, type: "theory", outOf: 100 },
    Seminar: { label: "Technical Seminar", credit: 2, type: "theory", outOf: 100 },
    Elective4: { label: "Elective IV", credit: 3, type: "theory", outOf: 100 },
    Ethics: { label: "Professional Ethics", credit: 2, type: "theory", outOf: 100 },
    Innovation: { label: "Innovation & Entrepreneurship", credit: 2, type: "theory", outOf: 100 },
    Cc2: { label: "Co-Curricular", credit: 1, type: "theory", outOf: 100 },
  }
};

// Helper function to get subjects for current semester
const getCurrentSemester = () => {
  if (typeof window !== 'undefined') {
    const storedSemester = localStorage.getItem('currentSemester');
    return storedSemester || 'Semester 2';
  }
  return 'Semester 2';
};

// Export subjects for current semester (default to Semester 2)
const subjects = subjectsBySemester[getCurrentSemester()] || subjectsBySemester["Semester 2"];

export default subjects;
export { subjectsBySemester };
