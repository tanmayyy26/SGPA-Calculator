# 🎓 Advanced SGPA Calculator

> A powerful, modern web-based calculator for engineering students to calculate and manage their SGPA (Semester Grade Point Average) and CGPA (Cumulative Grade Point Average) with analytics and insights.

**Live Demo:** 👉 [https://tanmayyy26.github.io/SGPA-Calculator/](https://tanmayyy26.github.io/SGPA-Calculator/) 👈

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [Key Components](#-key-components)
- [Development](#-development)
- [Build & Deployment](#-build--deployment)
- [Contributing](#-contributing)
- [Creator](#-creator)
- [License](#-license)

---

## ✨ Features

### Core Functionality
- 🧮 **SGPA Calculator** - Calculate semester GPA with support for multiple subjects
- 📚 **Multi-Semester Support** - Manage up to 8 semesters
- 📊 **CGPA Tracking** - Automatic cumulative GPA calculation
- 📈 **Analytics Dashboard** - Detailed performance insights and trends
- 📋 **Calculation History** - Track all calculations with timestamps
- 💾 **Data Persistence** - Auto-save using localStorage
- 🎨 **Dark Mode UI** - Modern, sleek dark theme with smooth animations
- 🔄 **Reset Options** - Clear individual semesters or all data
- 📤 **Export/Share** - Share your results and export data
- ⚡ **Performance Optimization** - Fast and responsive interface
- 🎭 **Rich Animations** - Smooth transitions and visual effects

### Analytics Features
- 📊 Grade Distribution Charts
- 🎯 Subject Performance Analysis
- 📈 Performance Trends (Improving/Declining/Stable)
- 🔮 Next Semester Predictions
- 🎪 Improvement Recommendations

---

## 🛠 Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Context API** - State management

### Development Tools
- **ESLint** - Code quality
- **npm** - Package manager
- **Node.js** - Runtime

### Build & Deployment
- **Vite** - Optimized production builds
- **GitHub Pages** - Hosting

---

## 📁 Project Structure

```
SGPA-Calculator/
├── public/                          # Static assets
├── src/
│   ├── components/
│   │   ├── AnalyticsDashboard.jsx   # Analytics and performance insights
│   │   ├── Circle.jsx                # Result display component
│   │   ├── Circle.module.css         # Result styling
│   │   ├── Content.module.css        # Content styling
│   │   ├── ExportShare.jsx           # Export/share functionality
│   │   ├── Footer.jsx                # Footer component
│   │   ├── Header.jsx                # Header component
│   │   ├── HistoryPanel.jsx          # Calculation history display
│   │   ├── InputBox.jsx              # Subject input component
│   │   ├── LoadingSystem.jsx         # Loading animation
│   │   ├── MainContent.jsx           # Main calculator interface
│   │   ├── NavigationTabs.jsx        # Tab navigation
│   │   ├── Print.jsx                 # Print functionality
│   │   ├── Print.module.css          # Print styling
│   │   ├── SemesterManager.jsx       # Semester management
│   │   ├── SettingsPanel.jsx         # Settings/preferences
│   │   ├── SubHeading.jsx            # Subheading component
│   │   └── reactBits/                # Reusable animation components
│   │       ├── BlurText.jsx          # Blur animation
│   │       ├── ClickSpark.jsx        # Click spark effect
│   │       ├── GradientText.jsx      # Gradient text
│   │       ├── Particles.jsx         # Particle effects
│   │       ├── ShinyText.jsx         # Shiny text effect
│   │       └── SplitText.jsx         # Text splitting animation
│   ├── context/
│   │   ├── NotificationContext.jsx   # Notification system
│   │   ├── SGPAContext.jsx           # SGPA state management
│   │   └── ThemeContext.jsx          # Theme management
│   ├── hooks/
│   │   └── useLocalStorage.js        # Local storage utilities
│   ├── assets/                       # Images and media
│   ├── App.jsx                       # Main App component
│   ├── App.css                       # App styling
│   ├── index.css                     # Global styles
│   └── main.jsx                      # React entry point
├── data/
│   └── subject.js                    # Semester and subject data
├── scripts/
│   ├── build-optimized.ps1           # PowerShell build script
│   ├── build-optimized.sh            # Bash build script
│   └── optimize-modules.js           # Module optimization
├── vite.config.js                    # Vite configuration
├── tailwind.config.js                # Tailwind CSS config
├── eslint.config.js                  # ESLint config
├── package.json                      # Project dependencies
├── package-lock.json                 # Dependency lock file
├── index.html                        # HTML entry point
├── deploy.sh                         # Deployment script
├── LICENSE                           # License file
└── README.md                         # This file
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/tanmayyy26/SGPA-Calculator.git
   cd SGPA-Calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## 📖 Usage

### Calculate SGPA
1. Navigate to the **Calculator** tab
2. Enter your grades for each subject
3. Click **Preview SGPA** to see estimated result
4. Click **Calculate & Save** to save the semester
5. Click **Reset** to clear all entries

### Manage Semesters
1. Go to **Semesters** tab
2. Click **Switch Semester** to change between semesters
3. Hover over completed semester to **Remove** it
4. View **Academic Progress** visualization

### View History
1. Click **History** tab (📋)
2. Click on any calculation to expand and view details
3. Remove individual calculations or **Clear All**

### Analytics
1. Click **Analytics** tab (📊)
2. View **Overview** - Key metrics and CGPA
3. Check **Grade Distribution** - Visual grade breakdown
4. Analyze **Subject Performance** - Per-subject trends
5. See **Predictions** - Next semester forecast

### Export & Share
1. Go to **Export** tab
2. Share your results via URL
3. Generate shareable links

---

## 🧩 Key Components

### AnalyticsDashboard
Displays comprehensive performance analytics including grade distribution, subject analysis, and predictive insights.

### MainContent
Core calculator interface with subject input fields, preview functionality, and form validation.

### SemesterManager
Manages multiple semesters with switching, deletion, and progress visualization.

### HistoryPanel
Complete calculation history with expandable details and batch clear functionality.

### Context Providers
- **SGPAContext** - Central state for SGPA, grades, and semesters
- **ThemeContext** - Dark/light mode and UI preferences
- **NotificationContext** - Toast notifications and alerts

---

## 💻 Development

### Available Scripts

#### Development
```bash
npm run dev
```
Starts Vite development server with hot module replacement.

#### Build
```bash
npm run build
```
Creates optimized production build.

#### Preview
```bash
npm run preview
```
Preview production build locally.

#### Lint
```bash
npm run lint
```
Run ESLint to check code quality.

#### Optimize
```bash
./scripts/build-optimized.sh
```
Optimized build with bundle analysis.

### Code Standards
- Follow ESLint configuration
- Use functional components with hooks
- Maintain component modularity
- Use Tailwind CSS for styling
- Implement proper error handling

---

## 📦 Build & Deployment

### Production Build
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
./deploy.sh
```

The application uses Vite for optimized builds with:
- Code splitting
- Tree shaking
- Minification
- Asset optimization

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 👨‍💻 Creator

**Tanmay Wagh** 
- GitHub: [@tanmayyy26](https://github.com/tanmayyy26)
- Portfolio: Check out my other projects!

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Designed for engineering students
- Built with modern web technologies
- Inspired by academic excellence
- Powered by React and Tailwind CSS

---

## 📞 Support

For issues, suggestions, or feedback:
- Open an issue on GitHub
- Contact the creator
- Check existing documentation

---

**Made with ❤️ by Tanmay Wagh**
