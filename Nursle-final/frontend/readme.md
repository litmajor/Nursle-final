# Nursle - Medical Triage Application

## Overview
Nursle is a React-based medical triage application that allows users to input patient information and receive basic triage recommendations. This is a frontend-only application using modern web technologies.

## Tech Stack
- **Frontend**: React 18 with React Router for navigation
- **Build Tool**: Vite 5.x for development and production builds
- **Styling**: Tailwind CSS for responsive design
- **Animations**: Framer Motion for smooth UI transitions
- **Language**: JavaScript/JSX

## Project Structure
```
src/
├── pages/
│   ├── PatientForm.jsx    # Main form for patient information input
│   └── TriageResult.jsx   # Results page showing diagnosis and recommendations
├── index.css              # Global styles with Tailwind imports
└── main.jsx               # Application entry point with routing setup
```

## Configuration
- **Vite Config**: Configured for local/production environment with `allowedHosts: true` and proper port binding
- **Development Server**: Runs on `0.0.0.0:5000` for Replit proxy compatibility
- **HMR**: Configured for HTTPS proxy environment (clientPort: 443)

## Features
- Patient information form with name, age, gender, and symptoms
- Simple triage logic (currently returns mock diagnosis)
- Responsive design optimized for various screen sizes
- Smooth page transitions using Framer Motion

## Development
- Run `npm run dev` to start development server
- Run `npm run build` to create production build
- Run `npm run preview` to preview production build

## Recent Changes
- **2025-09-21**: Initial import and setup within development environment
- Configured Vite for proxy compatibility with `allowedHosts: true`
- Set up proper host binding and port configuration
- Configured deployment settings for production

## User Preferences
- No specific coding style preferences noted yet
- Project maintains existing React/Vite patterns and conventions

## Notes
- This is a frontend-only application with no backend dependencies
- Uses mock data for triage recommendations (placeholder for future AI integration)

Written by James Kagua(litmajor)
