
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'

export default function PredictiveAnalytics() {
  const navigate = useNavigate()
  const [patientData, setPatientData] = useState({
    symptoms: '',
    age: '',
    priority: 'Medium',
    medical_history: ''
  })
  const [predictions, setPredictions] = useState(null)
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(false)

  React.useEffect(() => {
    fetchTrends()
  }, [])

  const fetchTrends = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/analytics/trends', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setTrends(data)
      }
    } catch (error) {
      console.error('Error fetching trends:', error)
    }
  }

  const handlePredict = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('http://localhost:8000/api/analytics/predictive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(patientData)
      })
      
      if (response.ok) {
        const data = await response.json()
        setPredictions(data)
      }
    } catch (error) {
      console.error('Error getting predictions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20'
      case 'medium': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20'
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700'
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <Header title="Predictive Healthcare Analytics" />
      
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* AI Banner */}
          <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center">
              <div className="bg-purple-600 text-white rounded-lg p-3 mr-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-200">
                  Advanced Predictive Analytics
                </h3>
                <p className="text-purple-700 dark:text-purple-300">
                  Machine learning models predict patient outcomes and optimize resource allocation.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Outcome Predictor */}
            <Card title="Patient Outcome Predictor">
              <form onSubmit={handlePredict} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Patient Symptoms
                  </label>
                  <textarea
                    value={patientData.symptoms}
                    onChange={(e) => setPatientData({ ...patientData, symptoms: e.target.value })}
                    placeholder="Describe patient symptoms..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows="4"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      value={patientData.age}
                      onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="0"
                      max="120"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority Level
                    </label>
                    <select
                      value={patientData.priority}
                      onChange={(e) => setPatientData({ ...patientData, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Medical History (Optional)
                  </label>
                  <textarea
                    value={patientData.medical_history}
                    onChange={(e) => setPatientData({ ...patientData, medical_history: e.target.value })}
                    placeholder="Relevant medical history..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows="3"
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating Predictions...
                    </div>
                  ) : (
                    'Generate Predictions'
                  )}
                </Button>
              </form>
            </Card>

            {/* Prediction Results */}
            <Card title="Prediction Results">
              {!predictions ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Enter patient data to generate AI-powered outcome predictions
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Recovery Time Prediction */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Recovery Time Prediction
                    </h4>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-900 dark:text-blue-200 font-medium">
                          Estimated Recovery: {predictions.recovery_time.estimated_days} days
                        </span>
                        <span className="text-sm text-blue-700 dark:text-blue-300">
                          {Math.round(predictions.recovery_time.confidence * 100)}% confidence
                        </span>
                      </div>
                      <div className="mt-2 bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${predictions.recovery_time.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Complications Risk */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Complications Risk Assessment
                    </h4>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300">Risk Level:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(predictions.complications_risk.risk_level)}`}>
                        {predictions.complications_risk.risk_level}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Probability: {Math.round(predictions.complications_risk.probability * 100)}%
                    </div>
                  </div>

                  {/* Resource Needs */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Resource Requirements
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Estimated bed days:</span>
                        <span className="font-medium">{predictions.resource_needs.bed_days}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Specialist required:</span>
                        <span className={`font-medium ${predictions.resource_needs.specialist_required ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                          {predictions.resource_needs.specialist_required ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Follow-up visits:</span>
                        <span className="font-medium">{predictions.resource_needs.follow_up_visits}</span>
                      </div>
                    </div>
                  </div>

                  {/* Outcome Predictions */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Outcome Probabilities
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Full Recovery</span>
                          <span className="text-sm font-medium">{Math.round(predictions.outcome_prediction.full_recovery * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${predictions.outcome_prediction.full_recovery * 100}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Partial Recovery</span>
                          <span className="text-sm font-medium">{Math.round(predictions.outcome_prediction.partial_recovery * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${predictions.outcome_prediction.partial_recovery * 100}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Chronic Condition</span>
                          <span className="text-sm font-medium">{Math.round(predictions.outcome_prediction.chronic_condition * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: `${predictions.outcome_prediction.chronic_condition * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Health Trends Analysis */}
          {trends && (
            <Card title="Health Trends & Patterns" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Seasonal Patterns */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Seasonal Disease Patterns
                  </h4>
                  <div className="space-y-3">
                    {trends.seasonal_patterns.map((pattern, index) => (
                      <motion.div
                        key={pattern.month}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">{pattern.month}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Respiratory cases:</span>
                            <span className="ml-2 font-medium text-blue-600 dark:text-blue-400">{pattern.respiratory_cases}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Flu cases:</span>
                            <span className="ml-2 font-medium text-red-600 dark:text-red-400">{pattern.flu_cases}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Demographic Insights */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    High-Risk Demographics
                  </h4>
                  <div className="space-y-3">
                    {trends.demographic_insights.age_groups.map((group, index) => (
                      <motion.div
                        key={group.range}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                      >
                        <div className="font-medium text-gray-900 dark:text-white mb-2">
                          Age {group.range}
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Common conditions:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {group.high_risk_conditions.map((condition) => (
                              <span key={condition} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded text-xs">
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <Button variant="secondary" onClick={() => navigate('/')}>
              Back to Dashboard
            </Button>
            {predictions && (
              <Button onClick={() => setPredictions(null)}>
                New Prediction
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
