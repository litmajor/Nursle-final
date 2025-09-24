
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'

export default function MedicalHistory() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [history, setHistory] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEntry, setNewEntry] = useState({
    condition: '',
    diagnosis_date: '',
    treatment: '',
    status: 'Active'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPatientData()
    fetchMedicalHistory()
  }, [patientId])

  const fetchPatientData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/patients/${patientId}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setPatient(data)
      }
    } catch (error) {
      console.error('Error fetching patient:', error)
    }
  }

  const fetchMedicalHistory = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/patients/${patientId}/medical-history`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setHistory(data)
      }
    } catch (error) {
      console.error('Error fetching medical history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddEntry = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:8000/api/patients/${patientId}/medical-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newEntry)
      })
      
      if (response.ok) {
        setShowAddForm(false)
        setNewEntry({ condition: '', diagnosis_date: '', treatment: '', status: 'Active' })
        fetchMedicalHistory()
      }
    } catch (error) {
      console.error('Error adding medical history:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'chronic': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <Header title="Medical History" />
      
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Patient Info Header */}
          {patient && (
            <Card title="Patient Information" className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</span>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {patient.first_name} {patient.last_name}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Age</span>
                  <p className="text-gray-900 dark:text-white font-medium">{patient.age}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Gender</span>
                  <p className="text-gray-900 dark:text-white font-medium">{patient.gender}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Patient Since</span>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {new Date(patient.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Medical History Timeline */}
          <Card 
            title="Medical History Timeline"
            headerActions={
              <Button 
                size="sm"
                onClick={() => setShowAddForm(true)}
              >
                Add Entry
              </Button>
            }
          >
            {history.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No medical history records found.</p>
                <Button 
                  className="mt-4"
                  onClick={() => setShowAddForm(true)}
                >
                  Add First Entry
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-l-4 border-slate-200 dark:border-slate-600 pl-4 relative"
                  >
                    <div className="absolute w-3 h-3 bg-slate-600 dark:bg-slate-400 rounded-full -left-2 top-2"></div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {entry.condition}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                          {entry.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Diagnosed: {new Date(entry.diagnosis_date).toLocaleDateString()}
                      </p>
                      {entry.treatment && (
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                          <strong>Treatment:</strong> {entry.treatment}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Added: {new Date(entry.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>

          {/* Add Entry Modal */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Add Medical History Entry
                </h3>
                <form onSubmit={handleAddEntry} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Condition
                    </label>
                    <input
                      type="text"
                      value={newEntry.condition}
                      onChange={(e) => setNewEntry({ ...newEntry, condition: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Diagnosis Date
                    </label>
                    <input
                      type="date"
                      value={newEntry.diagnosis_date}
                      onChange={(e) => setNewEntry({ ...newEntry, diagnosis_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Treatment
                    </label>
                    <textarea
                      value={newEntry.treatment}
                      onChange={(e) => setNewEntry({ ...newEntry, treatment: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={newEntry.status}
                      onChange={(e) => setNewEntry({ ...newEntry, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Chronic">Chronic</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Add Entry
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <Button variant="secondary" onClick={() => navigate('/')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
