# Quickstart Guide: User Authentication and Profile Collection

## Prerequisites

- Python 3.11+
- Node.js 18+ (for frontend development)
- PostgreSQL client tools
- Better-Auth account/config
- Neon Postgres account

## Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```
   

2. **Set up backend environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up frontend environment**
   ```bash
   cd frontend
   npm install
   ```

4. **Configure environment variables**
   Create `.env` files in both backend and frontend directories:

   **Backend (.env):**
   ```
   DATABASE_URL=your_neon_postgres_connection_string
   BETTER_AUTH_SECRET=your_auth_secret
   BETTER_AUTH_URL=http://localhost:8000
   ```

   **Frontend (.env):**
   ```
   REACT_APP_API_URL=http://localhost:8000
   REACT_APP_BETTER_AUTH_URL=http://localhost:8000
   ```

## Database Setup

1. **Create the user_profiles table in Neon Postgres**
   ```sql
   CREATE TABLE user_profiles (
     id SERIAL PRIMARY KEY,
     user_id VARCHAR(255) UNIQUE NOT NULL,
     software_level VARCHAR(20) CHECK (software_level IN ('Beginner', 'Intermediate', 'Advanced')),
     programming_languages TEXT[],
     hardware_knowledge TEXT[],
     experience_level VARCHAR(20) CHECK (experience_level IN ('Student', 'Professional', 'Hobbyist')),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **Set up Better-Auth with Neon adapter**
   Follow Better-Auth documentation to configure the database adapter for Neon Postgres.

## Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   uvicorn src.main:app --reload --port 8000
   ```

2. **Start the frontend server**
   ```bash
   cd frontend
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Backend docs: http://localhost:8000/docs

## Key Endpoints

- `POST /auth/signup` - Register a new user
- `POST /auth/signin` - Authenticate a user
- `GET /profile` - Get current user's profile
- `PUT /profile` - Update current user's profile

## Testing

1. **Run backend tests**
   ```bash
   cd backend
   pytest
   ```

2. **Run frontend tests**
   ```bash
   cd frontend
   npm test
   ```

## Deployment

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy the backend** to your preferred hosting platform (ensure environment variables are set)

3. **Configure your domain** to serve the built frontend and proxy API requests to the backend