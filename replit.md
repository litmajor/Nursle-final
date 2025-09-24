# Overview

Nursle is a full-stack medical triage application designed to help healthcare professionals manage patient information and authentication. The system allows nurses to register, log in, and access a dashboard for patient management. The application uses a React frontend with a Flask backend, providing a complete web-based solution for medical triage workflows.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with React Router for client-side navigation
- **Build System**: Vite 5.x for fast development and optimized production builds
- **Styling**: Tailwind CSS for utility-first responsive design with dark mode support
- **Animations**: Framer Motion for smooth UI transitions and enhanced user experience
- **State Management**: React hooks and context for local state management
- **API Communication**: Custom API client with fetch-based requests supporting credentials and error handling

## Backend Architecture
- **Framework**: Flask web framework with modular structure
- **Database ORM**: SQLAlchemy for database operations and model definitions
- **Authentication**: Session-based authentication using Flask-Session with password hashing via Werkzeug
- **API Design**: RESTful endpoints for user registration, login, and dashboard access
- **CORS**: Flask-CORS configured to support cross-origin requests with credentials
- **Security**: Environment-based configuration with secret key management

## Data Storage
- **Database**: PostgreSQL as the primary database system
- **Session Storage**: Filesystem-based session storage for user authentication state
- **Models**: Single Nurse model with fields for full_name, email, nurse_id, and hashed passwords
- **Database Initialization**: Automated database schema creation and seeding with test accounts

## Authentication & Authorization
- **Password Security**: Werkzeug-based password hashing and verification
- **Session Management**: Server-side session storage with nurse_id tracking
- **Route Protection**: Session-based authorization for protected endpoints
- **User Registration**: Email uniqueness validation and secure password storage

## Development Environment
- **Containerization**: Docker Compose setup for consistent development environment
- **Environment Configuration**: Environment variable support for database URLs and secret keys
- **Development Server**: Configured for both local development and Replit deployment
- **Database Seeding**: Pre-configured test accounts for development and testing

# External Dependencies

## Backend Dependencies
- **Flask**: Web framework and core application server
- **SQLAlchemy**: Database ORM and query builder
- **PostgreSQL**: Primary database system (psycopg2-binary driver)
- **Flask-CORS**: Cross-origin resource sharing support
- **Flask-Session**: Server-side session management
- **Werkzeug**: Password hashing and security utilities
- **Gunicorn**: WSGI HTTP server for production deployment

## Frontend Dependencies
- **React & React-DOM**: Core React framework (v18.2.0)
- **React Router DOM**: Client-side routing (v6.20.1)
- **Framer Motion**: Animation library (v10.16.4)
- **OpenAI**: AI integration capabilities (v5.22.0)
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS & Autoprefixer**: CSS processing and vendor prefixes

## Infrastructure & Deployment
- **Docker**: Containerization for backend and database services
- **PostgreSQL**: Database service running in Docker container
- **Environment Variables**: Configuration management for database connections and secrets
- **HTTPS/Proxy Support**: Configured for Replit deployment with proper host binding and HMR settings