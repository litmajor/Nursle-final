# ---------- Frontend build ----------
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# ---------- Backend build ----------
FROM python:3.11-slim AS backend
WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ .

# Copy built frontend into backend’s static directory
COPY --from=frontend-build /app/dist ./static

# Expose port for backend
EXPOSE 8000

# Start Gunicorn (serves API + static frontend)
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "app:app"]
