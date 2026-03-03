# College Event Management System - Setup Instructions

## Issues Fixed

1. **User ID Constraint Error**: Fixed the EventRegistration model to properly handle null user_id
2. **Authentication Persistence**: Improved AuthContext to maintain user session across page refreshes
3. **API Endpoint Consistency**: Standardized all API calls to use port 8080
4. **User Stats Fetching**: Added proper endpoint for fetching user registration statistics

## Prerequisites

1. **Java 17+** installed
2. **Maven** installed
3. **MySQL** server running on localhost:3306
4. **Node.js 16+** and **npm** installed

## Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE users_app_devo;
```

2. Run the database fix script:
```sql
-- Execute the contents of fix_database_constraints.sql
```

## Backend Setup

1. Navigate to the springapp directory:
```bash
cd springapp
```

2. Install dependencies and start the server:
```bash
./mvnw clean compile
./mvnw spring-boot:run
```

Or on Windows, use the provided batch file:
```bash
start_backend.bat
```

The backend will start on `https://bakend-folder-college-event.onrender.com`

## Frontend Setup

1. Navigate to the reactapp directory:
```bash
cd reactapp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Key Features Fixed

### 1. User Registration & Authentication
- Users can register and login with proper JWT authentication
- Session persistence across page refreshes
- Automatic form pre-filling for authenticated users

### 2. Event Registration
- Fixed the "user_id cannot be null" error
- Proper handling of both authenticated and guest registrations
- Duplicate registration prevention
- Real-time registration count updates

### 3. Student Dashboard
- Accurate registration statistics
- Proper event listing with registration status
- Responsive design with modern UI

### 4. Admin Features
- Event management (CRUD operations)
- Registration tracking and attendance marking
- Dashboard with analytics

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/validate` - Token validation
- `POST /api/auth/admin/login` - Admin login

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (admin)
- `PUT /api/events/{id}` - Update event (admin)
- `DELETE /api/events/{id}` - Delete event (admin)

### Registrations
- `POST /api/registrations` - Register for event
- `GET /api/registrations/student/{studentId}` - Get student registrations
- `GET /api/registrations/event/{eventId}` - Get event registrations
- `PUT /api/registrations/{id}/attendance` - Mark attendance

### User Stats
- `GET /api/events/user/{username}/registrations` - Get user registration stats

## Troubleshooting

### Backend Issues
1. **Port 8080 already in use**: Stop any other services using port 8080
2. **Database connection failed**: Ensure MySQL is running and credentials are correct
3. **JWT errors**: Check if the JWT secret is properly configured

### Frontend Issues
1. **CORS errors**: Ensure backend is running on port 8080
2. **Authentication issues**: Clear browser localStorage and try again
3. **Registration failures**: Check browser console for detailed error messages

## Testing

1. **Register a new user** at `/register`
2. **Login** with the created credentials
3. **Browse events** and register for one
4. **Check dashboard** to see registration statistics
5. **Admin login** to manage events and view registrations

## Default Admin Credentials
- Username: `admin`
- Password: `admin123`

## Database Schema

The system uses the following main tables:
- `users` - User accounts
- `events` - Event information
- `event_registrations` - Event registrations (supports both authenticated and guest users)
- `admins` - Admin accounts

## Security Features

- JWT-based authentication
- Password encryption
- CORS protection
- Input validation
- SQL injection prevention