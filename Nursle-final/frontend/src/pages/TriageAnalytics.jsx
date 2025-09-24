
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'

export default function TriageAnalytics() {
  const navigate = useNavigate()
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/analytics/triage', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-orange-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
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
      <Header title="Triage Analytics Dashboard" />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Summary Cards */}
          {analyticsData && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {analyticsData.summary.total_patients_week}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Patients (7 days)</div>
                </div>
              </Card>
              
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {analyticsData.summary.avg_wait_time_week}m
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg Wait Time</div>
                </div>
              </Card>
              
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {analyticsData.summary.high_priority_percentage}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">High Priority Cases</div>
                </div>
              </Card>
              
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    92%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Efficiency Rating</div>
                </div>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Patient Flow */}
            <Card title="Daily Patient Flow (Last 7 Days)">
              {analyticsData && (
                <div className="space-y-4">
                  {analyticsData.daily_stats.map((day, index) => (
                    <motion.div
                      key={day.date}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {new Date(day.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {day.total_patients} patients
                        </div>
                      </div>
                      
                      {/* Priority Breakdown */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                            {day.high_priority}
                          </div>
                          <div className="text-xs text-gray-500">High</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                            {day.medium_priority}
                          </div>
                          <div className="text-xs text-gray-500">Medium</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                            {day.low_priority}
                          </div>
                          <div className="text-xs text-gray-500">Low</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="flex h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="bg-red-500 h-full"
                          style={{ width: `${(day.high_priority / day.total_patients) * 100}%` }}
                        />
                        <div 
                          className="bg-orange-500 h-full"
                          style={{ width: `${(day.medium_priority / day.total_patients) * 100}%` }}
                        />
                        <div 
                          className="bg-green-500 h-full"
                          style={{ width: `${(day.low_priority / day.total_patients) * 100}%` }}
                        />
                      </div>
                      
                      <div className="text-right text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Avg wait: {day.avg_wait_time}m
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>

            {/* Performance Metrics */}
            <Card title="Performance Metrics">
              <div className="space-y-6">
                {/* Wait Time Analysis */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Wait Time Analysis
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">High Priority</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                        <span className="text-sm font-medium">5.2m</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Medium Priority</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <span className="text-sm font-medium">18.7m</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Low Priority</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-sm font-medium">32.1m</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resource Utilization */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Resource Utilization
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">87%</div>
                      <div className="text-xs text-blue-700 dark:text-blue-300">Bed Occupancy</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">94%</div>
                      <div className="text-xs text-purple-700 dark:text-purple-300">Staff Efficiency</div>
                    </div>
                  </div>
                </div>

                {/* Quality Indicators */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Quality Indicators
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Patient Satisfaction</span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">4.8/5.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Readmission Rate</span>
                      <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">2.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Treatment Accuracy</span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">96.7%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Real-time Updates */}
          <Card title="Real-time Updates" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-lg font-semibold text-green-700 dark:text-green-300">
                  Currently Active
                </div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 my-2">23</div>
                <div className="text-sm text-green-600 dark:text-green-400">Patients in triage</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-lg font-semibold text-yellow-700 dark:text-yellow-300">
                  Waiting
                </div>
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 my-2">7</div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400">In queue</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                  Completed Today
                </div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 my-2">156</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Successfully processed</div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <Button variant="secondary" onClick={() => navigate('/')}>
              Back to Dashboard
            </Button>
            <Button onClick={() => fetchAnalytics()}>
              Refresh Data
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
