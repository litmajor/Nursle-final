import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'

export default function TriageResult() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20'
      case 'medium': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20'
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700'
    }
  }

  // Mock symptoms data for demonstration
  const symptoms = ['Chest pain', 'Dyspnea', 'Cough', 'Dizziness']

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <Header title="Patient Results" />
      
      <div className="p-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Triage Information */}
          <Card title="Triage">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Patient Name</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {state?.name || 'Unknown Patient'}
                </span>
              </div>
              
              {state?.age && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Age</span>
                  <span className="text-gray-900 dark:text-white font-medium">{state.age}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Condition</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {state?.diagnosis || 'Under evaluation'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(state?.priority || state?.triage)}`}>
                  {state?.priority || state?.triage || 'Medium'}
                </span>
              </div>
            </div>
          </Card>

          {/* Recommendations */}
          <Card title="Recommendations">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Treatment Advice</h4>
                <p className="text-gray-900 dark:text-white">
                  {state?.advice || 'The patient requires immediate medical attention. Monitor vital signs and provide appropriate care.'}
                </p>
              </div>
              
              {state?.symptoms && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reported Symptoms</h4>
                  <p className="text-gray-900 dark:text-white">{state.symptoms}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Symptoms</h4>
                <ul className="space-y-1">
                  {symptoms.map((symptom, index) => (
                    <li key={index} className="flex items-center text-gray-900 dark:text-white">
                      <div className="w-2 h-2 bg-slate-700 dark:bg-slate-400 rounded-full mr-2"></div>
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto mt-6 flex gap-4">
          <Button 
            variant="secondary"
            onClick={() => navigate('/')}
          >
            Back to Dashboard
          </Button>
          <Button 
            variant="primary"
            onClick={() => navigate('/new-patient')}
          >
            New Patient
          </Button>
          <Button 
            variant="success"
            className="ml-auto"
          >
            Diagnose
          </Button>
        </div>
      </div>
    </motion.div>
  )
}