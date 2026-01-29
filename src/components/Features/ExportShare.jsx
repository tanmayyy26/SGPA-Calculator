import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSGPA } from '../../context/SGPAContext';
import { subjectsBySemester } from '../../../data/subject';
import ShinyText from '../reactBits/ShinyText';
import ClickSpark from '../reactBits/ClickSpark';

const ExportShare = () => {
  const { currentGrades, currentSemester, allSemesters, history, calculateCGPA } = useSGPA();
  const [exportType, setExportType] = useState('pdf');
  
  // Get subjects for current semester
  const subjects = subjectsBySemester[currentSemester] || subjectsBySemester["Semester 2"];
  const [shareUrl, setShareUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const generateShareableData = () => {
    return {
      semester: currentSemester,
      grades: currentGrades,
      subjects: subjects,
      timestamp: new Date().toISOString(),
      cgpa: calculateCGPA()
    };
  };

  const generateShareUrl = () => {
    const data = generateShareableData();
    const encodedData = btoa(JSON.stringify(data));
    const url = `${window.location.origin}${window.location.pathname}?share=${encodedData}`;
    setShareUrl(url);
    setShowShareModal(true);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const exportToJSON = () => {
    const exportData = {
      currentSemester,
      currentGrades,
      allSemesters,
      history,
      cgpa: calculateCGPA(),
      exportDate: new Date().toISOString(),
      subjects
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `sgpa_data_${currentSemester.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    let csvContent = 'Subject,Grade,Out Of,Credit,Type,Percentage\n';
    
    Object.entries(subjects).forEach(([key, subject]) => {
      const grade = currentGrades[key] || 0;
      const percentage = subject.outOf > 0 ? ((grade / subject.outOf) * 100).toFixed(2) : 0;
      csvContent += `"${subject.label}",${grade},${subject.outOf},${subject.credit},${subject.type},${percentage}%\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `grades_${currentSemester.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generatePDFContent = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>SGPA Report - ${currentSemester}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { color: #333; font-size: 24px; margin-bottom: 10px; }
          .subtitle { color: #666; font-size: 16px; }
          .section { margin: 20px 0; }
          .section h3 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .summary { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
          .cgpa-box { text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                     color: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
          .grade-A { color: #4CAF50; font-weight: bold; }
          .grade-B { color: #2196F3; font-weight: bold; }
          .grade-C { color: #FF9800; font-weight: bold; }
          .grade-D { color: #FF5722; font-weight: bold; }
          .grade-F { color: #F44336; font-weight: bold; }
          .footer { text-align: center; margin-top: 40px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">Academic Performance Report</h1>
          <p class="subtitle">${currentSemester} - Generated on ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="cgpa-box">
          <h2>Current CGPA: ${calculateCGPA() || 'Not Available'}</h2>
          <p>Based on ${Object.keys(allSemesters).length} completed semester(s)</p>
        </div>

        <div class="section">
          <h3>Current Semester Grades</h3>
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Grade</th>
                <th>Out of</th>
                <th>Percentage</th>
                <th>Letter Grade</th>
                <th>Credits</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(subjects).map(([key, subject]) => {
                const grade = currentGrades[key] || 0;
                const percentage = subject.outOf > 0 ? ((grade / subject.outOf) * 100) : 0;
                const letterGrade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : 
                                  percentage >= 70 ? 'B+' : percentage >= 60 ? 'B' : 
                                  percentage >= 50 ? 'C+' : percentage >= 40 ? 'C' : 'F';
                const gradeClass = letterGrade.startsWith('A') ? 'grade-A' : 
                                 letterGrade.startsWith('B') ? 'grade-B' :
                                 letterGrade.startsWith('C') ? 'grade-C' : 
                                 letterGrade === 'F' ? 'grade-F' : '';
                
                return `
                  <tr>
                    <td>${subject.label}</td>
                    <td>${grade}</td>
                    <td>${subject.outOf}</td>
                    <td>${percentage.toFixed(1)}%</td>
                    <td class="${gradeClass}">${letterGrade}</td>
                    <td>${subject.credit}</td>
                    <td>${subject.type}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        ${Object.keys(allSemesters).length > 0 ? `
          <div class="section">
            <h3>Semester History</h3>
            <table>
              <thead>
                <tr>
                  <th>Semester</th>
                  <th>SGPA</th>
                  <th>Date Completed</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(allSemesters).map(([sem, data]) => `
                  <tr>
                    <td>${sem}</td>
                    <td>${data.sgpa}</td>
                    <td>${new Date(data.date).toLocaleDateString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        <div class="footer">
          <p>Report generated by SGPA Calculator | ${window.location.origin}</p>
        </div>
      </body>
      </html>
    `;
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    
    try {
      const htmlContent = generatePDFContent();
      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
        setIsExporting(false);
      };
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsExporting(false);
    }
  };

  const handleExport = () => {
    switch (exportType) {
      case 'pdf':
        exportToPDF();
        break;
      case 'json':
        exportToJSON();
        break;
      case 'csv':
        exportToCSV();
        break;
      default:
        console.log('Unknown export type');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Export & Share</h2>

        {/* Export Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Export Report</h3>
          
          <div className="flex flex-wrap gap-4 mb-4">
            {[
              { id: 'pdf', label: 'PDF Report', icon: '📄' },
              { id: 'json', label: 'JSON Data', icon: '💾' },
              { id: 'csv', label: 'CSV File', icon: '📊' }
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setExportType(option.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                  exportType === option.id
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>

          <ClickSpark sparkColor='#60A5FA' sparkCount={10}>
            <button
              onClick={handleExport}
              disabled={isExporting || Object.keys(currentGrades).length === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                Object.keys(currentGrades).length === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-500'
              }`}
            >
              {isExporting ? (
                <span className="flex items-center space-x-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Exporting...</span>
                </span>
              ) : (
                <ShinyText text={`Export as ${exportType.toUpperCase()}`} speed={4} />
              )}
            </button>
          </ClickSpark>
        </div>

        {/* Share Section */}
        <div className="border-t border-gray-600 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Share Results</h3>
          
          <div className="flex flex-wrap gap-4">
            <ClickSpark sparkColor='#34D399' sparkCount={8}>
              <button
                onClick={generateShareUrl}
                disabled={Object.keys(currentGrades).length === 0}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  Object.keys(currentGrades).length === 0
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white border border-green-500'
                }`}
              >
                <ShinyText text="Generate Share Link" speed={4} />
              </button>
            </ClickSpark>

            <button
              onClick={() => {
                const text = `Check out my SGPA: ${calculateCGPA() || 'Calculating...'} 🎓\n\nCalculated using SGPA Calculator`;
                copyToClipboard(text);
              }}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors border border-purple-500"
            >
              Copy Summary
            </button>
          </div>
        </div>

        {/* Preview Card */}
        {Object.keys(currentGrades).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600"
          >
            <h4 className="font-semibold text-white mb-2">Export Preview</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <p>• Semester: {currentSemester}</p>
              <p>• Subjects: {Object.keys(currentGrades).length}/{Object.keys(subjects).length} completed</p>
              <p>• CGPA: {calculateCGPA() || 'Not available'}</p>
              <p>• Export Date: {new Date().toLocaleDateString()}</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-600"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Share Your Results</h3>
              
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Shareable Link:</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(shareUrl)}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportShare;