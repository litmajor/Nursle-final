FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create database tables and seed data on startup, then run the app
CMD ["sh", "-c", "python -c 'from app import app, db; app.app_context().push(); db.create_all(); print(\"Database tables created\")' && python seed.py && gunicorn --bind=0.0.0.0:8000 --reuse-port app:app"]
