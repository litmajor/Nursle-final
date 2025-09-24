import os
import random
from datetime import datetime, date, timedelta
from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_session import Session
from models import db, Nurse, Patient, MedicalHistory, Symptom, TriageRecord, AnalyticsData

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Config
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'supersecretkey')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://postgres:password@helium:5432/heliumdb')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_TYPE'] = 'filesystem'

db.init_app(app)
Session(app)

# Authentication Routes
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    if Nurse.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    nurse = Nurse(
        full_name=data['full_name'],
        email=data['email'],
        nurse_id=data['nurse_id']
    )
    nurse.set_password(data['password'])
    db.session.add(nurse)
    db.session.commit()
    return jsonify({'message': 'Signup successful'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    nurse = Nurse.query.filter_by(email=data['email']).first()
    if nurse and nurse.check_password(data['password']):
        session['nurse_id'] = nurse.id
        return jsonify({'message': 'Login successful', 'first_name': nurse.full_name.split()[0]}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/dashboard', methods=['GET'])
def dashboard():
    nurse_id = session.get('nurse_id')
    if not nurse_id:
        return jsonify({'error': 'Unauthorized'}), 401
    nurse = Nurse.query.get(nurse_id)
    return jsonify({'first_name': nurse.full_name.split()[0], 'email': nurse.email})

# Patient Management Routes
@app.route('/api/patients', methods=['POST'])
def create_patient():
    nurse_id = session.get('nurse_id')
    if not nurse_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.json
    patient = Patient(
        first_name=data['first_name'],
        last_name=data['last_name'],
        age=data['age'],
        gender=data['gender']
    )
    db.session.add(patient)
    db.session.commit()
    return jsonify({'patient_id': patient.id, 'message': 'Patient created successfully'}), 201

@app.route('/api/patients', methods=['GET'])
def get_patients():
    nurse_id = session.get('nurse_id')
    if not nurse_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    patients = Patient.query.all()
    return jsonify([{
        'id': p.id,
        'first_name': p.first_name,
        'last_name': p.last_name,
        'age': p.age,
        'gender': p.gender,
        'created_at': p.created_at.isoformat()
    } for p in patients])

@app.route('/api/patients/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    nurse_id = session.get('nurse_id')
    if not nurse_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    patient = Patient.query.get_or_404(patient_id)
    return jsonify({
        'id': patient.id,
        'first_name': patient.first_name,
        'last_name': patient.last_name,
        'age': patient.age,
        'gender': patient.gender,
        'created_at': patient.created_at.isoformat()
    })

# Medical History Routes
@app.route('/api/patients/<int:patient_id>/medical-history', methods=['POST'])
def add_medical_history():
    nurse_id = session.get('nurse_id')
    if not nurse_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.json
    history = MedicalHistory(
        patient_id=patient_id,
        condition=data['condition'],
        diagnosis_date=datetime.fromisoformat(data['diagnosis_date']),
        treatment=data.get('treatment'),
        status=data.get('status', 'Active')
    )
    db.session.add(history)
    db.session.commit()
    return jsonify({'message': 'Medical history added successfully'}), 201

@app.route('/api/patients/<int:patient_id>/medical-history', methods=['GET'])
def get_medical_history(patient_id):
    nurse_id = session.get('nurse_id')
    if not nurse_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    history = MedicalHistory.query.filter_by(patient_id=patient_id).order_by(MedicalHistory.diagnosis_date.desc()).all()
    return jsonify([{
        'id': h.id,
        'condition': h.condition,
        'diagnosis_date': h.diagnosis_date.isoformat(),
        'treatment': h.treatment,
        'status': h.status,
        'created_at': h.created_at.isoformat()
    } for h in history])

# Symptom Checker AI Routes
@app.route('/api/symptoms/check', methods=['POST'])
def check_symptoms():
    nurse_id = session.get('nurse_id')
    if not nurse_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.json
    symptoms = data['symptoms']
    age = data.get('age', 30)
    gender = data.get('gender', 'Unknown')
    
    # AI-powered diagnosis simulation
    diagnosis_options = [
        {'condition': 'Common Cold', 'confidence': 0.85, 'severity': 'Low'},
        {'condition': 'Influenza', 'confidence': 0.78, 'severity': 'Medium'},
        {'condition': 'Pneumonia', 'confidence': 0.65, 'severity': 'High'},
        {'condition': 'Bronchitis', 'confidence': 0.72, 'severity': 'Medium'},
        {'condition': 'Allergic Reaction', 'confidence': 0.60, 'severity': 'Low'}
    ]
    
    # Simple AI logic based on symptoms
    if 'chest pain' in symptoms.lower():
        diagnosis_options.insert(0, {'condition': 'Chest Pain Syndrome', 'confidence': 0.90, 'severity': 'High'})
    if 'fever' in symptoms.lower():
        diagnosis_options[1]['confidence'] += 0.10
    
    # Sort by confidence
    diagnosis_options.sort(key=lambda x: x['confidence'], reverse=True)
    
    return jsonify({
        'diagnosis': diagnosis_options[:3],
        'recommendations': [
            'Monitor vital signs closely',
            'Ensure patient comfort',
            'Consider further diagnostic tests if symptoms persist',
            'Follow up within 24-48 hours'
        ]
    })

# Triage Analytics Routes
@app.route('/api/analytics/triage', methods=['GET'])
def get_triage_analytics():
    nurse_id = session.get('nurse_id')
    if not nurse_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    # Generate mock analytics data
    today = date.today()
    analytics = []
    
    for i in range(7):
        current_date = today - timedelta(days=i)
        analytics.append({
            'date': current_date.isoformat(),
            'total_patients': random.randint(15, 45),
            'high_priority': random.randint(2, 8),
            'medium_priority': random.randint(5, 15),
            'low_priority': random.randint(8, 22),
            'avg_wait_time': round(random.uniform(15.0, 45.0), 1)
        })
    
    return jsonify({
        'daily_stats': analytics,
        'summary': {
            'total_patients_week': sum(a['total_patients'] for a in analytics),
            'avg_wait_time_week': round(sum(a['avg_wait_time'] for a in analytics) / len(analytics), 1),
            'high_priority_percentage': round((sum(a['high_priority'] for a in analytics) / sum(a['total_patients'] for a in analytics)) * 100, 1)
        }
    })

# Predictive Healthcare Analytics Routes
@app.route('/api/analytics/predictive', methods=['POST'])
def predict_outcome():
    nurse_id = session.get('nurse_id')
    if not nurse_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.json
    symptoms = data.get('symptoms', '')
    age = data.get('age', 30)
    priority = data.get('priority', 'Medium')
    
    # AI prediction simulation
    predictions = {
        'recovery_time': {
            'estimated_days': random.randint(3, 14),
            'confidence': round(random.uniform(0.7, 0.95), 2)
        },
        'complications_risk': {
            'risk_level': random.choice(['Low', 'Medium', 'High']),
            'probability': round(random.uniform(0.1, 0.4), 2)
        },
        'resource_needs': {
            'bed_days': random.randint(1, 5),
            'specialist_required': random.choice([True, False]),
            'follow_up_visits': random.randint(1, 3)
        },
        'outcome_prediction': {
            'full_recovery': round(random.uniform(0.8, 0.98), 2),
            'partial_recovery': round(random.uniform(0.15, 0.3), 2),
            'chronic_condition': round(random.uniform(0.02, 0.1), 2)
        }
    }
    
    return jsonify(predictions)

@app.route('/api/analytics/trends', methods=['GET'])
def get_health_trends():
    nurse_id = session.get('nurse_id')
    if not nurse_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    # Generate trend data
    trends = {
        'seasonal_patterns': [
            {'month': 'January', 'respiratory_cases': 45, 'flu_cases': 32},
            {'month': 'February', 'respiratory_cases': 38, 'flu_cases': 28},
            {'month': 'March', 'respiratory_cases': 25, 'flu_cases': 15},
            {'month': 'April', 'respiratory_cases': 18, 'flu_cases': 8},
            {'month': 'May', 'respiratory_cases': 12, 'flu_cases': 5}
        ],
        'demographic_insights': {
            'age_groups': [
                {'range': '0-18', 'high_risk_conditions': ['Asthma', 'Allergies']},
                {'range': '19-35', 'high_risk_conditions': ['Stress-related', 'Sports injuries']},
                {'range': '36-60', 'high_risk_conditions': ['Hypertension', 'Diabetes']},
                {'range': '60+', 'high_risk_conditions': ['Cardiovascular', 'Respiratory']}
            ]
        }
    }
    
    return jsonify(trends)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
