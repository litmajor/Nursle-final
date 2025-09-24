import React, { useState, useRef } from 'react'
import Button from './Button'

export default function VoiceInput({ onTranscription, isDisabled = false }) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await processAudio(audioBlob)
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Unable to access microphone. Please check your permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const processAudio = async (audioBlob) => {
    setIsProcessing(true)
    try {
      // For demo purposes, we'll simulate AI transcription
      // In a real implementation, this would send the audio to OpenAI Whisper API
      setTimeout(() => {
        const simulatedTranscription = "Patient reports experiencing chest pain, shortness of breath, and dizziness for the past 2 hours. Pain is sharp and radiating to left arm."
        onTranscription(simulatedTranscription)
        setIsProcessing(false)
      }, 2000)
      
      // Real implementation would look like:
      // const formData = new FormData()
      // formData.append('file', audioBlob, 'audio.webm')
      // const response = await fetch('/api/transcribe', {
      //   method: 'POST',
      //   body: formData
      // })
      // const { text } = await response.json()
      // onTranscription(text)
      
    } catch (error) {
      console.error('Error processing audio:', error)
      alert('Error processing audio. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center">
        <div className="bg-slate-700 dark:bg-slate-600 text-white rounded-lg p-4 mb-4">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">AI Voice Assistant</span>
          </div>
          <p className="text-sm text-gray-200">
            Hello, I am an AI assistant. Please describe the patient's condition.
          </p>
          <div className="text-xs text-gray-300 mt-2">
            This feature is powered by OpenAI and ElevenLabs
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {!isRecording && !isProcessing && (
          <Button
            onClick={startRecording}
            disabled={isDisabled}
            variant="primary"
            className="flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
            <span>Start Recording</span>
          </Button>
        )}

        {isRecording && (
          <Button
            onClick={stopRecording}
            variant="danger"
            className="flex items-center space-x-2 animate-pulse"
          >
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Stop Recording</span>
          </Button>
        )}

        {isProcessing && (
          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-600"></div>
            <span>Processing audio...</span>
          </div>
        )}
      </div>

      {(isRecording || isProcessing) && (
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isRecording ? 'Listening... Speak clearly about the patient\'s symptoms' : 'Converting speech to text...'}
          </p>
        </div>
      )}
    </div>
  )
}