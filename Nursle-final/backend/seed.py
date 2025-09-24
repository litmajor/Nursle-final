from app import app
from models import db, Nurse

with app.app_context():
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
