# Pharmacy Prescription System

A simplified pharmacy prescription system built with NestJS, PostgreSQL, and Sequelize.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Initialize the Project

```bash
# Create a new directory
mkdir pharmacy-prescription-system
cd pharmacy-prescription-system

# Initialize npm project
npm init -y

# Install NestJS CLI globally (if not already installed)
npm install -g @nestjs/cli

# Generate NestJS application structure
nest new . --skip-git --package-manager npm
```

### 2. Install Dependencies

```bash
# Install main dependencies
npm install @nestjs/sequelize @nestjs/config @nestjs/jwt @nestjs/passport sequelize sequelize-typescript pg pg-hstore bcryptjs passport passport-jwt passport-local class-transformer class-validator

# Install dev dependencies
npm install --save-dev @types/bcryptjs @types/passport-jwt @types/passport-local @types/pg @types/sequelize
```

### 3. Database Setup

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE pharmacy_db;

# Create a user (optional)
CREATE USER pharmacy_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE pharmacy_db TO pharmacy_user;

# Exit PostgreSQL
\q
```

### 4. Environment Configuration

```bash
# Copy environment example
cp .env.example .env

# Edit .env file with your database credentials
```

Update your `.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=pharmacy_user
DB_PASSWORD=your_password
DB_NAME=pharmacy_db

JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=7d

PORT=3000
NODE_ENV=development
```

### 5. Project Structure

Replace the generated files with the provided code files in this structure:

```
src/
├── auth/
│   ├── dto/
│   │   └── login.dto.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── jwt-auth.guard.ts
│   └── jwt.strategy.ts
├── doctors/
│   ├── dto/
│   │   └── create-doctor.dto.ts
│   ├── entities/
│   │   └── doctor.entity.ts
│   ├── doctors.controller.ts
│   ├── doctors.module.ts
│   └── doctors.service.ts
├── patients/
│   ├── dto/
│   │   └── create-patient.dto.ts
│   ├── entities/
│   │   └── patient.entity.ts
│   ├── patients.controller.ts
│   ├── patients.module.ts
│   └── patients.service.ts
├── medications/
│   └── entities/
│       └── medication.entity.ts
├── prescriptions/
│   └── entities/
│       └── prescription.entity.ts
├── app.module.ts
└── main.ts
```

### 6. Run the Application

```bash
# Start in development mode
npm run start:dev

# Or start in production mode
npm run build
npm run start:prod
```

The application will be available at `http://localhost:3000`

### 7. Create Initial Data

First, create a doctor account by making a POST request to `/doctors`:

```bash
curl -X POST http://localhost:3000/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Smith",
    "email": "doctor@example.com",
    "password": "password123",
    "specialization": "General Medicine",
    "phone": "+1234567890"
  }'
```

Secondly, create a patient account by making a POST request to `/patients`:

```bash
curl -X POST http://localhost:3000/patients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "patient@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01"
  }'
```

Then login to get your JWT token:

```bash
curl -X POST http://localhost:3000/auth/patient/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "password123"
  }'
```

```bash
curl -X POST http://localhost:3000/auth/doctor/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@example.com",
    "password": "password123"
  }'
```

Use the returned `access_token` in the Authorization header for protected routes:
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

## API Endpoints

### Authentication
- `POST /auth/login` - Login as a doctor

### Doctors
- `POST /doctors` - Register a new doctor (public)
- `GET /doctors` - Get all doctors (public)

### Patients (Protected - requires JWT)
- `POST /patients` - Create a new patient
- `GET /patients` - Get all patients
- `GET /patients?search=query` - Search patients by name or email
- `GET /patients/:id` - Get patient by ID

## Troubleshooting

### Common Issues

1. **Database Connection Error**: 
   - Make sure PostgreSQL is running
   - Verify database credentials in `.env`
   - Ensure the database exists

2. **Port Already in Use**:
   - Change the PORT in `.env`
   - Or kill the process using the port: `lsof -ti:3000 | xargs kill`

3. **JWT Secret Error**:
   - Make sure JWT_SECRET is set in `.env`
   - Use a long, random string for production

### Development Commands

```bash
# Generate new module
nest generate module module-name

# Generate new controller
nest generate controller controller-name

# Generate new service
nest generate service service-name

# Run tests
npm run test

# Check for linting issues
npm run lint
```