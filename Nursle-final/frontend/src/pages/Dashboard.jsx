import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'

export default function Dashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')

  // Mock patient data for demonstration
  const patients = [
    { id: 1, name: 'John Doe', priority: 'High' },
    { id: 2, name: 'Jane Smith', priority: 'Medium' },
    { id: 3, name: 'Alice Cooper', priority: 'Low' },
    { id: 4, name: 'Bob Johnson', priority: 'High' }
  ]

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600 dark:text-red-400'
      case 'medium': return 'text-orange-600 dark:text-orange-400'
      case 'low': return 'text-green-600 dark:text-green-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <Header title="Health Triage" />
      
      <div className="p-6">
        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1 inline-flex">
            <button
              onClick={() => setActiveTab('triage')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'triage'
                  ? 'bg-slate-700 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Hospital Triage
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-slate-700 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Dashboard
            </button>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Triage Table */}
          <Card 
            title="Patient Triage"
            headerActions={
              <Button 
                size="sm"
                onClick={() => navigate('/new-patient')}
              >
                New Patient
              </Button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient, index) => (
                    <motion.tr 
                      key={patient.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => navigate(`/results/${patient.id}`, { 
                        state: { 
                          name: patient.name, 
                          priority: patient.priority,
                          diagnosis: 'Common Cold',
                          advice: 'Rest, drink fluids, monitor symptoms.'
                        }
                      })}
                    >
                      <td className="py-3 px-2 text-gray-900 dark:text-white">{patient.name}</td>
                      <td className={`py-3 px-2 font-medium ${getPriorityColor(patient.priority)}`}>
                        {patient.priority}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="space-y-4">
              <Button 
                variant="primary" 
                className="w-full justify-center"
                onClick={() => navigate('/new-patient')}
              >
                Add New Patient
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-center"
                onClick={() => navigate('/triage')}
              >
                View All Results
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}