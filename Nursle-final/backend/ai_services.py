
"""
AI Services Foundation Module for Nursle
Provides core AI functionality and service abstractions
"""

import json
import numpy as np
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from abc import ABC, abstractmethod

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class DiagnosisResult:
    """Data class for diagnosis results"""
    condition: str
    confidence: float
    severity: str
    description: str
    recommendations: List[str]

@dataclass
class PredictionResult:
    """Data class for prediction results"""
    recovery_days: int
    confidence: float
    risk_level: str
    complications_probability: float
    resource_requirements: Dict[str, any]

class BaseAIService(ABC):
    """Abstract base class for AI services"""
    
    def __init__(self, model_version: str = "v1.0"):
        self.model_version = model_version
        self.confidence_threshold = 0.7
        self.created_at = datetime.now()
    
    @abstractmethod
    def process(self, input_data: Dict) -> Dict:
        """Process input data and return AI results"""
        pass
    
    def validate_input(self, input_data: Dict, required_fields: List[str]) -> bool:
        """Validate input data contains required fields"""
        return all(field in input_data for field in required_fields)
    
    def log_prediction(self, input_data: Dict, result: Dict, processing_time: float):
        """Log prediction for monitoring and improvement"""
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'model_version': self.model_version,
            'processing_time_ms': processing_time * 1000,
            'input_hash': hash(str(input_data)),
            'confidence': result.get('confidence', 0.0)
        }
        logger.info(f"AI Prediction logged: {log_entry}")

class DiagnosticEngine(BaseAIService):
    """AI-powered diagnostic engine for symptom analysis"""
    
    def __init__(self):
        super().__init__("diagnostic_v1.0")
        self.symptom_keywords = {
            'respiratory': ['cough', 'shortness of breath', 'dyspnea', 'wheezing', 'chest pain'],
            'cardiac': ['chest pain', 'palpitations', 'heart racing', 'irregular heartbeat'],
            'neurological': ['headache', 'dizziness', 'confusion', 'seizure', 'weakness'],
            'gastrointestinal': ['nausea', 'vomiting', 'diarrhea', 'abdominal pain'],
            'infectious': ['fever', 'chills', 'fatigue', 'body aches', 'sore throat']
        }
        
        self.condition_database = {
            'respiratory': [
                {'name': 'Common Cold', 'severity': 'Low', 'base_confidence': 0.8},
                {'name': 'Influenza', 'severity': 'Medium', 'base_confidence': 0.75},
                {'name': 'Pneumonia', 'severity': 'High', 'base_confidence': 0.7},
                {'name': 'Bronchitis', 'severity': 'Medium', 'base_confidence': 0.72}
            ],
            'cardiac': [
                {'name': 'Chest Pain Syndrome', 'severity': 'High', 'base_confidence': 0.85},
                {'name': 'Arrhythmia', 'severity': 'Medium', 'base_confidence': 0.7},
                {'name': 'Angina', 'severity': 'High', 'base_confidence': 0.8}
            ],
            'neurological': [
                {'name': 'Migraine', 'severity': 'Medium', 'base_confidence': 0.75},
                {'name': 'Tension Headache', 'severity': 'Low', 'base_confidence': 0.8},
                {'name': 'Vertigo', 'severity': 'Medium', 'base_confidence': 0.7}
            ]
        }
    
    def process(self, input_data: Dict) -> Dict:
        """Process symptoms and return diagnostic suggestions"""
        if not self.validate_input(input_data, ['symptoms']):
            raise ValueError("Missing required field: symptoms")
        
        start_time = datetime.now()
        
        symptoms = input_data['symptoms'].lower()
        age = input_data.get('age', 30)
        gender = input_data.get('gender', 'Unknown')
        
        # Analyze symptom categories
        category_scores = self._analyze_symptom_categories(symptoms)
        
        # Generate diagnoses
        diagnoses = self._generate_diagnoses(category_scores, age, gender)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(diagnoses)
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        result = {
            'diagnosis': diagnoses,
            'recommendations': recommendations,
            'confidence': max([d['confidence'] for d in diagnoses]) if diagnoses else 0.0,
            'processing_time': processing_time
        }
        
        self.log_prediction(input_data, result, processing_time)
        return result
    
    def _analyze_symptom_categories(self, symptoms: str) -> Dict[str, float]:
        """Analyze symptoms and score by medical category"""
        category_scores = {}
        
        for category, keywords in self.symptom_keywords.items():
            score = 0.0
            keyword_count = 0
            
            for keyword in keywords:
                if keyword in symptoms:
                    score += 1.0
                    keyword_count += 1
            
            if keyword_count > 0:
                category_scores[category] = min(score / len(keywords), 1.0)
        
        return category_scores
    
    def _generate_diagnoses(self, category_scores: Dict[str, float], age: int, gender: str) -> List[Dict]:
        """Generate potential diagnoses based on symptom analysis"""
        diagnoses = []
        
        for category, score in category_scores.items():
            if category in self.condition_database and score > 0.3:
                for condition in self.condition_database[category]:
                    confidence = self._calculate_confidence(
                        condition['base_confidence'], score, age, gender
                    )
                    
                    if confidence >= self.confidence_threshold:
                        diagnoses.append({
                            'condition': condition['name'],
                            'confidence': round(confidence, 3),
                            'severity': condition['severity'],
                            'category': category
                        })
        
        # Sort by confidence
        diagnoses.sort(key=lambda x: x['confidence'], reverse=True)
        return diagnoses[:5]  # Return top 5 diagnoses
    
    def _calculate_confidence(self, base_confidence: float, symptom_score: float, 
                            age: int, gender: str) -> float:
        """Calculate diagnostic confidence with demographic factors"""
        # Age factor (elderly and very young are higher risk)
        age_factor = 1.0
        if age > 65 or age < 5:
            age_factor = 1.1
        elif age > 50:
            age_factor = 1.05
        
        # Gender factor (condition-specific adjustments)
        gender_factor = 1.0
        
        # Combine factors
        confidence = base_confidence * symptom_score * age_factor * gender_factor
        return min(confidence, 0.98)  # Cap at 98% confidence
    
    def _generate_recommendations(self, diagnoses: List[Dict]) -> List[str]:
        """Generate clinical recommendations based on diagnoses"""
        if not diagnoses:
            return ["Please consult with a healthcare professional for proper evaluation."]
        
        recommendations = [
            "Monitor vital signs closely",
            "Ensure patient comfort and positioning",
            "Document all symptoms and their progression"
        ]
        
        # Add severity-specific recommendations
        high_severity = any(d['severity'] == 'High' for d in diagnoses)
        if high_severity:
            recommendations.extend([
                "Consider immediate medical intervention",
                "Prepare for potential emergency procedures",
                "Notify attending physician immediately"
            ])
        else:
            recommendations.extend([
                "Schedule follow-up within 24-48 hours",
                "Provide patient education on symptom monitoring"
            ])
        
        return recommendations

class PredictiveAnalytics(BaseAIService):
    """AI-powered predictive analytics for healthcare outcomes"""
    
    def __init__(self):
        super().__init__("predictive_v1.0")
        self.recovery_models = {
            'respiratory': {'base_days': 7, 'variance': 3, 'complications_risk': 0.15},
            'cardiac': {'base_days': 14, 'variance': 7, 'complications_risk': 0.25},
            'neurological': {'base_days': 21, 'variance': 10, 'complications_risk': 0.20},
            'infectious': {'base_days': 5, 'variance': 2, 'complications_risk': 0.10}
        }
    
    def process(self, input_data: Dict) -> Dict:
        """Process patient data and return outcome predictions"""
        if not self.validate_input(input_data, ['symptoms']):
            raise ValueError("Missing required field: symptoms")
        
        start_time = datetime.now()
        
        # Classify condition type
        condition_type = self._classify_condition_type(input_data['symptoms'])
        age = input_data.get('age', 30)
        priority = input_data.get('priority', 'Medium')
        
        # Generate predictions
        recovery_prediction = self._predict_recovery_time(condition_type, age, priority)
        risk_assessment = self._assess_complications_risk(condition_type, age)
        resource_needs = self._predict_resource_requirements(condition_type, recovery_prediction)
        outcome_probabilities = self._calculate_outcome_probabilities(condition_type, age)
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        result = {
            'recovery_time': recovery_prediction,
            'complications_risk': risk_assessment,
            'resource_needs': resource_needs,
            'outcome_prediction': outcome_probabilities,
            'condition_type': condition_type,
            'processing_time': processing_time
        }
        
        self.log_prediction(input_data, result, processing_time)
        return result
    
    def _classify_condition_type(self, symptoms: str) -> str:
        """Classify the primary condition type from symptoms"""
        symptoms_lower = symptoms.lower()
        
        # Simple keyword-based classification
        if any(keyword in symptoms_lower for keyword in ['chest pain', 'heart', 'cardiac']):
            return 'cardiac'
        elif any(keyword in symptoms_lower for keyword in ['cough', 'breathing', 'respiratory']):
            return 'respiratory'
        elif any(keyword in symptoms_lower for keyword in ['headache', 'dizziness', 'neurological']):
            return 'neurological'
        elif any(keyword in symptoms_lower for keyword in ['fever', 'infection', 'chills']):
            return 'infectious'
        else:
            return 'general'
    
    def _predict_recovery_time(self, condition_type: str, age: int, priority: str) -> Dict:
        """Predict patient recovery time"""
        if condition_type not in self.recovery_models:
            condition_type = 'general'
            base_days = 10
            variance = 5
        else:
            model = self.recovery_models[condition_type]
            base_days = model['base_days']
            variance = model['variance']
        
        # Age adjustment
        age_multiplier = 1.0
        if age > 65:
            age_multiplier = 1.3
        elif age < 18:
            age_multiplier = 0.8
        
        # Priority adjustment
        priority_multiplier = {
            'High': 1.2,
            'Medium': 1.0,
            'Low': 0.9
        }.get(priority, 1.0)
        
        estimated_days = int(base_days * age_multiplier * priority_multiplier)
        confidence = 0.85 - (variance * 0.05)  # Higher variance = lower confidence
        
        return {
            'estimated_days': estimated_days,
            'confidence': round(confidence, 2),
            'range_min': estimated_days - variance,
            'range_max': estimated_days + variance
        }
    
    def _assess_complications_risk(self, condition_type: str, age: int) -> Dict:
        """Assess risk of complications"""
        base_risk = self.recovery_models.get(condition_type, {}).get('complications_risk', 0.15)
        
        # Age-based risk adjustment
        if age > 70:
            risk_multiplier = 2.0
        elif age > 60:
            risk_multiplier = 1.5
        elif age < 18:
            risk_multiplier = 1.2
        else:
            risk_multiplier = 1.0
        
        final_risk = min(base_risk * risk_multiplier, 0.8)
        
        # Determine risk level
        if final_risk > 0.4:
            risk_level = 'High'
        elif final_risk > 0.2:
            risk_level = 'Medium'
        else:
            risk_level = 'Low'
        
        return {
            'risk_level': risk_level,
            'probability': round(final_risk, 3)
        }
    
    def _predict_resource_requirements(self, condition_type: str, recovery_prediction: Dict) -> Dict:
        """Predict required healthcare resources"""
        estimated_days = recovery_prediction['estimated_days']
        
        # Base resource calculations
        bed_days = max(1, estimated_days // 3)
        specialist_required = condition_type in ['cardiac', 'neurological']
        follow_up_visits = min(max(1, estimated_days // 7), 4)
        
        return {
            'bed_days': bed_days,
            'specialist_required': specialist_required,
            'follow_up_visits': follow_up_visits,
            'estimated_cost': bed_days * 500 + (follow_up_visits * 150)  # Rough estimate
        }
    
    def _calculate_outcome_probabilities(self, condition_type: str, age: int) -> Dict:
        """Calculate probability of different outcomes"""
        # Base probabilities by condition type
        base_probs = {
            'respiratory': {'full': 0.85, 'partial': 0.12, 'chronic': 0.03},
            'cardiac': {'full': 0.75, 'partial': 0.20, 'chronic': 0.05},
            'neurological': {'full': 0.70, 'partial': 0.25, 'chronic': 0.05},
            'infectious': {'full': 0.90, 'partial': 0.08, 'chronic': 0.02}
        }.get(condition_type, {'full': 0.80, 'partial': 0.15, 'chronic': 0.05})
        
        # Age adjustment
        if age > 65:
            base_probs['full'] *= 0.9
            base_probs['chronic'] *= 1.5
        
        # Normalize probabilities
        total = sum(base_probs.values())
        normalized_probs = {k: v/total for k, v in base_probs.items()}
        
        return {
            'full_recovery': round(normalized_probs['full'], 3),
            'partial_recovery': round(normalized_probs['partial'], 3),
            'chronic_condition': round(normalized_probs['chronic'], 3)
        }

class AIServiceManager:
    """Manager class for coordinating AI services"""
    
    def __init__(self):
        self.diagnostic_engine = DiagnosticEngine()
        self.predictive_analytics = PredictiveAnalytics()
        self.service_status = {
            'diagnostic': True,
            'predictive': True,
            'voice': False  # Not yet implemented
        }
    
    def get_diagnosis(self, symptoms: str, age: int = None, gender: str = None) -> Dict:
        """Get AI-powered diagnosis"""
        try:
            input_data = {'symptoms': symptoms}
            if age:
                input_data['age'] = age
            if gender:
                input_data['gender'] = gender
            
            return self.diagnostic_engine.process(input_data)
        except Exception as e:
            logger.error(f"Diagnosis error: {str(e)}")
            return self._get_fallback_diagnosis()
    
    def get_predictions(self, symptoms: str, age: int = None, priority: str = None) -> Dict:
        """Get AI-powered outcome predictions"""
        try:
            input_data = {'symptoms': symptoms}
            if age:
                input_data['age'] = age
            if priority:
                input_data['priority'] = priority
            
            return self.predictive_analytics.process(input_data)
        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            return self._get_fallback_predictions()
    
    def get_service_health(self) -> Dict:
        """Get health status of all AI services"""
        return {
            'services': self.service_status,
            'diagnostic_version': self.diagnostic_engine.model_version,
            'predictive_version': self.predictive_analytics.model_version,
            'last_updated': datetime.now().isoformat()
        }
    
    def _get_fallback_diagnosis(self) -> Dict:
        """Fallback diagnosis when AI service fails"""
        return {
            'diagnosis': [
                {
                    'condition': 'Medical Evaluation Needed',
                    'confidence': 0.5,
                    'severity': 'Medium'
                }
            ],
            'recommendations': [
                'AI service temporarily unavailable',
                'Please conduct manual assessment',
                'Consult with attending physician'
            ],
            'confidence': 0.5
        }
    
    def _get_fallback_predictions(self) -> Dict:
        """Fallback predictions when AI service fails"""
        return {
            'recovery_time': {'estimated_days': 7, 'confidence': 0.5},
            'complications_risk': {'risk_level': 'Medium', 'probability': 0.2},
            'resource_needs': {'bed_days': 2, 'specialist_required': True, 'follow_up_visits': 2},
            'outcome_prediction': {'full_recovery': 0.8, 'partial_recovery': 0.15, 'chronic_condition': 0.05}
        }

# Global AI service manager instance
ai_manager = AIServiceManager()
