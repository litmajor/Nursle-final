from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_session import Session
from models import db, Nurse

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Config
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@db:5432/nursledb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_TYPE'] = 'filesystem'

db.init_app(app)
Session(app)

# Routes
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
