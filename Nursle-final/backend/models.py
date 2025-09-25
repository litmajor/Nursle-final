from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class Nurse(db.Model):
    def __init__(self, full_name, email, nurse_id, password_hash):
        self.full_name = full_name
        self.email = email
        self.nurse_id = nurse_id
        self.password_hash = password_hash
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    nurse_id = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Patient(db.Model):
    def __init__(self, first_name, last_name, age, gender):
        self.first_name = first_name
        self.last_name = last_name
        self.age = age
        self.gender = gender
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    medical_histories = db.relationship('MedicalHistory', backref='patient', lazy=True)
    triage_records = db.relationship('TriageRecord', backref='patient', lazy=True)

class MedicalHistory(db.Model):
    def __init__(self, patient_id, condition, diagnosis_date, treatment, status):
        self.patient_id = patient_id
        self.condition = condition
        self.diagnosis_date = diagnosis_date
        self.treatment = treatment
        self.status = status
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    condition = db.Column(db.String(200), nullable=False)
    diagnosis_date = db.Column(db.DateTime, nullable=False)
    treatment = db.Column(db.Text)
    status = db.Column(db.String(50), default='Active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Symptom(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    severity_weight = db.Column(db.Float, default=1.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class TriageRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    nurse_id = db.Column(db.Integer, db.ForeignKey('nurse.id'), nullable=False)
    symptoms = db.Column(db.Text, nullable=False)
    priority = db.Column(db.String(20), nullable=False)
    diagnosis = db.Column(db.String(200))
    ai_confidence = db.Column(db.Float)
    predicted_outcome = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
class AnalyticsData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    total_patients = db.Column(db.Integer, default=0)
    high_priority = db.Column(db.Integer, default=0)
    medium_priority = db.Column(db.Integer, default=0)
    low_priority = db.Column(db.Integer, default=0)
    avg_wait_time = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
