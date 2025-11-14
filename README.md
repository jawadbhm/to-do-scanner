# Code TODO Scanner

A simple tool that scans a project folder for `TODO` and `FIXME` comments and displays the results in a clear way. This project is part of my portfolio as I prepare for software engineering apprenticeship programs. It focuses on code organization, clean documentation, and working with a small TypeScript/React codebase.

## 🚀 What it does
- Scans files in a selected project folder  
- Detects lines that contain `TODO` or `FIXME`  
- Displays the file name, line number, and extracted comment  
- Toggle between detailed and summary views

This helps quickly identify unfinished tasks or reminders left in code.

## 🛠 Tech stack
- **TypeScript** - Type-safe development
- **React 19** - Modern UI library
- **Vite** - Fast build tooling and dev server
- **Tailwind CSS** (via CDN) - Utility-first styling
- **FileReader API** - Browser-based file processing

## ▶️ How to run it
These steps may vary slightly based on the environment, but this is the standard way to run it locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jawadbhm/to-do-scanner.git
   cd to-do-scanner
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open the link shown in the terminal** (usually http://localhost:3000) to view the app in your browser.

## 🏗 Building for production
To create a production build:
```bash
npm run build
npm run preview
```

## 📁 Project structure
```
to-do-scanner/
├── src/
│   ├── components/
│   │   ├── FileUploader.tsx
│   │   ├── ResultsDisplay.tsx
│   │   ├── ToggleSwitch.tsx
│   │   └── Icons.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🌱 Why I built this
I created this project to practice:
- Understanding how file scanning works in the browser
- Working with a small but complete codebase
- Using modern React/TypeScript tooling
- Publishing clean, well-documented work on GitHub
- Preparing for software engineering apprenticeship applications

## ✨ Features
- **Folder Selection**: Upload entire project folders using native browser APIs
- **Pattern Matching**: Flexible regex to catch various TODO/FIXME formats
- **Dual View Modes**: Switch between detailed line-by-line view and summary statistics
- **File Filtering**: Automatically skips binary files and files over 1MB
- **Responsive Design**: Works on desktop and mobile devices
- **Clean UI**: Modern dark theme with Tailwind CSS

## 🚧 Future improvements
- Support additional file types and comment formats (e.g., `HACK`, `NOTE`, `XXX`)
- Add the option to export scan results (JSON, CSV)
- Add filtering options (TODO vs FIXME, specific file types, date ranges)
- Add search functionality within results
- Implement AI-powered task prioritization
- Add file exclusion patterns (node_modules, .git, etc.)

## 🤝 Contributions
Feel free to open issues or submit pull requests if you'd like to improve the project.

## 📝 License
This project is open source and available for educational purposes.

---

**Built with ❤️ as a portfolio project for software engineering apprenticeship applications.**
