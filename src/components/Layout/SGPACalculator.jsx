import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ConfettiBoom from 'react-confetti-boom'

const SGPACalculator = () => {
  const [subjects, setSubjects] = useState([
    { id: 1, name: '', credits: '', grade: '', gradePoints: '' }
  ])
  const [sgpa, setSgpa] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const gradePointsMap = {
    'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0
  }

  const addSubject = () => {
    const newId = subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1
    setSubjects([...subjects, { id: newId, name: '', credits: '', grade: '', gradePoints: '' }])
  }

  const removeSubject = (id) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(subject => subject.id !== id))
    }
  }

  const updateSubject = (id, field, value) => {
    setSubjects(subjects.map(subject => {
      if (subject.id === id) {
        const updated = { ...subject, [field]: value }
        if (field === 'grade') {
          updated.gradePoints = gradePointsMap[value] || ''
        }
        return updated
      }
      return subject
    }))
  }

  const calculateSGPA = () => {
    let totalCredits = 0
    let totalGradePoints = 0

    for (const subject of subjects) {
      const credits = parseFloat(subject.credits)
      const gradePoints = parseFloat(subject.gradePoints)

      if (!isNaN(credits) && !isNaN(gradePoints)) {
        totalCredits += credits
        totalGradePoints += credits * gradePoints
      }
    }

    if (totalCredits > 0) {
      const calculatedSGPA = (totalGradePoints / totalCredits).toFixed(2)
      setSgpa(calculatedSGPA)
      
      if (calculatedSGPA >= 7.5) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 4000)
      }
    } else {
      alert('Please enter valid credits and grades for at least one subject')
    }
  }

  const resetCalculator = () => {
    setSubjects([{ id: 1, name: '', credits: '', grade: '', gradePoints: '' }])
    setSgpa(null)
    setShowConfetti(false)
  }

  const getGradeColor = (grade) => {
    if (grade >= 9) return 'text-green-600'
    if (grade >= 8) return 'text-blue-600'
    if (grade >= 7) return 'text-yellow-600'
    if (grade >= 6) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <motion.div
      className="calculator-card"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {showConfetti && (
        <ConfettiBoom 
          particleCount={100}
          effectInterval={2000}
          effectCount={1}
        />
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-gray-50 rounded-lg shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-700">
                  Subject {index + 1}
                </h3>
                {subjects.length > 1 && (
                  <button
                    onClick={() => removeSubject(subject.id)}
                    className="text-red-500 hover:text-red-700 font-bold text-xl"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Subject Name"
                  value={subject.name}
                  onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                  className="grade-input px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="number"
                  placeholder="Credits"
                  value={subject.credits}
                  onChange={(e) => updateSubject(subject.id, 'credits', e.target.value)}
                  className="grade-input px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <select
                  value={subject.grade}
                  onChange={(e) => updateSubject(subject.id, 'grade', e.target.value)}
                  className="grade-input px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Grade</option>
                  <option value="O">O (10)</option>
                  <option value="A+">A+ (9)</option>
                  <option value="A">A (8)</option>
                  <option value="B+">B+ (7)</option>
                  <option value="B">B (6)</option>
                  <option value="C">C (5)</option>
                  <option value="P">P (4)</option>
                  <option value="F">F (0)</option>
                </select>
                <input
                  type="text"
                  placeholder="Grade Points"
                  value={subject.gradePoints}
                  readOnly
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-semibold"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.button
          onClick={addSubject}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          + Add Subject
        </motion.button>

        <div className="flex gap-3">
          <motion.button
            onClick={calculateSGPA}
            className="calculate-btn flex-1 py-3 text-white rounded-lg font-bold text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Calculate SGPA
          </motion.button>
          <motion.button
            onClick={resetCalculator}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Reset
          </motion.button>
        </div>

        <AnimatePresence>
          {sgpa !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="result-card"
            >
              <h2 className="text-2xl font-bold mb-2">Your SGPA</h2>
              <p className={`text-6xl font-bold ${getGradeColor(parseFloat(sgpa))}`}>
                {sgpa}
              </p>
              {parseFloat(sgpa) >= 9 && <p className="mt-3 text-xl">🌟 Outstanding! 🌟</p>}
              {parseFloat(sgpa) >= 7.5 && parseFloat(sgpa) < 9 && <p className="mt-3 text-xl">🎉 Great Job! 🎉</p>}
              {parseFloat(sgpa) >= 6 && parseFloat(sgpa) < 7.5 && <p className="mt-3 text-xl">👍 Good Work! 👍</p>}
              {parseFloat(sgpa) < 6 && parseFloat(sgpa) >= 4 && <p className="mt-3 text-xl">📚 Keep Going! 📚</p>}
              {parseFloat(sgpa) < 4 && <p className="mt-3 text-xl">💪 You Can Do Better! 💪</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.footer
        className="mt-8 text-center text-gray-600 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p>Created with ❤️ by Tanmay Wagh</p>
        <p className="mt-1">Full Stack Developer</p>
      </motion.footer>
    </motion.div>
  )
}

export default SGPACalculator
