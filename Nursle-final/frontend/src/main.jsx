import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'

import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PatientForm from './pages/PatientForm'
import TriageResult from './pages/TriageResult'
import MedicalHistory from './pages/MedicalHistory'
import SymptomChecker from './pages/SymptomChecker'
import TriageAnalytics from './pages/TriageAnalytics'
import PredictiveAnalytics from './pages/PredictiveAnalytics'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/new-patient" element={
              <ProtectedRoute>
                <PatientForm />
              </ProtectedRoute>
            } />
            <Route path="/results" element={
              <ProtectedRoute>
                <TriageResult />
              </ProtectedRoute>
            } />
            <Route path="/results/:id" element={
              <ProtectedRoute>
                <TriageResult />
              </ProtectedRoute>
            } />
            <Route path="/triage" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/medical-history/:patientId" element={
              <ProtectedRoute>
                <MedicalHistory />
              </ProtectedRoute>
            } />
            <Route path="/symptom-checker" element={
              <ProtectedRoute>
                <SymptomChecker />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <TriageAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/predictive" element={
              <ProtectedRoute>
                <PredictiveAnalytics />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
)