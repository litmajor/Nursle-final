from app import app
from models import db, Nurse

with app.app_context():
    # Create the nurse account from README
    if not Nurse.query.filter_by(email="nurse@example.com").first():
        nurse = Nurse(
            full_name="Test Nurse",
            email="nurse@example.com",
            nurse_id="NURSE123"
        )
        nurse.set_password("NURSE123")
        db.session.add(nurse)
        db.session.commit()
        print("✅ Test nurse created: nurse@example.com / NURSE123")
    else:
        print("ℹ️ Test nurse already exists")
    
    # Also create a test account
    if not Nurse.query.filter_by(email="test@example.com").first():
        nurse = Nurse(
            full_name="Test Nurse",
            email="test@example.com",
            nurse_id="N123"
        )
        nurse.set_password("N123")
        db.session.add(nurse)
        db.session.commit()
        print("✅ Test user created: test@example.com / N123")
    else:
        print("ℹ️ Test user already exists")
