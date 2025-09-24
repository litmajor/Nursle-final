
"""
AI Integration Layer for Flask Application
Connects AI services with Flask routes and database operations
"""

from flask import current_app
from ai_services import ai_manager, DiagnosisResult, PredictionResult
from models import db, TriageRecord, AnalyticsData
from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)

class AIIntegration:
    """Integration layer between AI services and Flask application"""
    
    def __init__(self, app=None):
        self.app = app
        if app is not None:
            self.init_app(app)
    
    def init_app(self, app):
        """Initialize AI integration with Flask app"""
        app.config.setdefault('AI_ENABLED', True)
        app.config.setdefault('AI_LOG_PREDICTIONS', True)
        app.config.setdefault('AI_CONFIDENCE_THRESHOLD', 0.7)
        
        # Store AI manager in app context
        app.ai_manager = ai_manager
    
    def process_symptom_check(self, symptoms: str, age: int = None, 
                            gender: str = None, nurse_id: int = None) -> dict:
        """
        Process symptom checking request with AI integration
        
        Args:
            symptoms: Patient symptoms description
            age: Patient age (optional)
            gender: Patient gender (optional)
            nurse_id: ID of nurse making request (optional)
        
        Returns:
            dict: AI diagnosis results with metadata
        """
        try:
            # Get AI diagnosis
            ai_result = ai_manager.get_diagnosis(symptoms, age, gender)
            
            # Log the prediction if enabled
            if current_app.config.get('AI_LOG_PREDICTIONS', True):
                self._log_ai_prediction(
                    prediction_type='diagnosis',
                    input_data={'symptoms': symptoms, 'age': age, 'gender': gender},
                    ai_result=ai_result,
                    nurse_id=nurse_id
                )
            
            # Format response for frontend
            formatted_result = self._format_diagnosis_response(ai_result)
            
            return {
                'success': True,
                'data': formatted_result,
                'ai_metadata': {
                    'model_version': ai_manager.diagnostic_engine.model_version,
                    'processing_time': ai_result.get('processing_time', 0),
                    'confidence_threshold': current_app.config.get('AI_CONFIDENCE_THRESHOLD')
                }
            }
            
        except Exception as e:
            logger.error(f"AI symptom check error: {str(e)}")
            return {
                'success': False,
                'error': 'AI service temporarily unavailable',
                'fallback_data': self._get_manual_assessment_guidance()
            }
    
    def process_predictive_analytics(self, symptoms: str, age: int = None,
                                   priority: str = None, nurse_id: int = None) -> dict:
        """
        Process predictive analytics request with AI integration
        
        Args:
            symptoms: Patient symptoms description
            age: Patient age (optional)
            priority: Triage priority (optional)
            nurse_id: ID of nurse making request (optional)
        
        Returns:
            dict: AI prediction results with metadata
        """
        try:
            # Get AI predictions
            ai_result = ai_manager.get_predictions(symptoms, age, priority)
            
            # Log the prediction if enabled
            if current_app.config.get('AI_LOG_PREDICTIONS', True):
                self._log_ai_prediction(
                    prediction_type='predictive',
                    input_data={'symptoms': symptoms, 'age': age, 'priority': priority},
                    ai_result=ai_result,
                    nurse_id=nurse_id
                )
            
            # Format response for frontend
            formatted_result = self._format_prediction_response(ai_result)
            
            return {
                'success': True,
                'data': formatted_result,
                'ai_metadata': {
                    'model_version': ai_manager.predictive_analytics.model_version,
                    'processing_time': ai_result.get('processing_time', 0),
                    'condition_type': ai_result.get('condition_type')
                }
            }
            
        except Exception as e:
            logger.error(f"AI predictive analytics error: {str(e)}")
            return {
                'success': False,
                'error': 'AI service temporarily unavailable',
                'fallback_data': self._get_standard_predictions()
            }
    
    def get_ai_health_status(self) -> dict:
        """Get health status of all AI services"""
        try:
            health_status = ai_manager.get_service_health()
            
            return {
                'success': True,
                'status': 'healthy',
                'services': health_status['services'],
                'versions': {
                    'diagnostic': health_status['diagnostic_version'],
                    'predictive': health_status['predictive_version']
                },
                'last_updated': health_status['last_updated']
            }
            
        except Exception as e:
            logger.error(f"AI health check error: {str(e)}")
            return {
                'success': False,
                'status': 'degraded',
                'error': str(e)
            }
    
    def _format_diagnosis_response(self, ai_result: dict) -> dict:
        """Format AI diagnosis result for frontend consumption"""
        # Ensure we have the expected structure
        diagnoses = ai_result.get('diagnosis', [])
        recommendations = ai_result.get('recommendations', [])
        
        # Add confidence indicators and formatting
        formatted_diagnoses = []
        for diagnosis in diagnoses:
            formatted_diagnoses.append({
                'condition': diagnosis.get('condition', 'Unknown'),
                'confidence': diagnosis.get('confidence', 0.0),
                'severity': diagnosis.get('severity', 'Medium'),
                'confidence_label': self._get_confidence_label(diagnosis.get('confidence', 0.0))
            })
        
        return {
            'diagnosis': formatted_diagnoses,
            'recommendations': recommendations,
            'overall_confidence': ai_result.get('confidence', 0.0),
            'disclaimer': 'This AI analysis is for informational purposes only and should not replace professional medical diagnosis.'
        }
    
    def _format_prediction_response(self, ai_result: dict) -> dict:
        """Format AI prediction result for frontend consumption"""
        return {
            'recovery_time': ai_result.get('recovery_time', {}),
            'complications_risk': ai_result.get('complications_risk', {}),
            'resource_needs': ai_result.get('resource_needs', {}),
            'outcome_prediction': ai_result.get('outcome_prediction', {}),
            'condition_type': ai_result.get('condition_type', 'general'),
            'disclaimer': 'These predictions are based on statistical models and should be used as guidance alongside clinical judgment.'
        }
    
    def _get_confidence_label(self, confidence: float) -> str:
        """Convert confidence score to human-readable label"""
        if confidence >= 0.9:
            return 'Very High'
        elif confidence >= 0.8:
            return 'High'
        elif confidence >= 0.7:
            return 'Moderate'
        elif confidence >= 0.6:
            return 'Low'
        else:
            return 'Very Low'
    
    def _log_ai_prediction(self, prediction_type: str, input_data: dict,
                          ai_result: dict, nurse_id: int = None):
        """Log AI prediction to database for monitoring and improvement"""
        try:
            # Create prediction log entry (you may want to create a dedicated table for this)
            log_entry = {
                'prediction_type': prediction_type,
                'input_data': json.dumps(input_data),
                'ai_result': json.dumps(ai_result),
                'nurse_id': nurse_id,
                'timestamp': datetime.utcnow(),
                'confidence': ai_result.get('confidence', 0.0),
                'processing_time': ai_result.get('processing_time', 0.0)
            }
            
            # For now, log to application logs
            # In production, you'd save this to a dedicated database table
            logger.info(f"AI Prediction Log: {json.dumps(log_entry, default=str)}")
            
        except Exception as e:
            logger.error(f"Failed to log AI prediction: {str(e)}")
    
    def _get_manual_assessment_guidance(self) -> dict:
        """Provide manual assessment guidance when AI fails"""
        return {
            'guidance': [
                'AI service is temporarily unavailable',
                'Please proceed with standard clinical assessment protocols',
                'Consider the following manual triage factors:'
            ],
            'manual_factors': [
                'Vital signs (temperature, blood pressure, heart rate, respiratory rate)',
                'Pain level assessment (1-10 scale)',
                'Patient mobility and consciousness level',
                'Medical history and current medications',
                'Duration and progression of symptoms'
            ],
            'escalation_criteria': [
                'Severe chest pain or difficulty breathing',
                'Signs of stroke or neurological deficits',
                'Severe bleeding or trauma',
                'Loss of consciousness or altered mental state',
                'Vital signs outside normal ranges'
            ]
        }
    
    def _get_standard_predictions(self) -> dict:
        """Provide standard predictions when AI fails"""
        return {
            'recovery_time': {
                'estimated_days': 7,
                'confidence': 0.5,
                'note': 'Standard estimate - clinical assessment recommended'
            },
            'complications_risk': {
                'risk_level': 'Medium',
                'probability': 0.2,
                'note': 'Default risk assessment - please evaluate clinically'
            },
            'resource_needs': {
                'bed_days': 2,
                'specialist_required': True,
                'follow_up_visits': 2,
                'note': 'Standard resource allocation - adjust based on clinical judgment'
            },
            'outcome_prediction': {
                'full_recovery': 0.8,
                'partial_recovery': 0.15,
                'chronic_condition': 0.05,
                'note': 'Population-based averages - individual outcomes may vary'
            }
        }

# Initialize AI integration
ai_integration = AIIntegration()
