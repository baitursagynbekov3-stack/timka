# Lumina - Online Course Platform

A modern, minimalist online course platform with a clean aesthetic and full authentication system.

## Features

- **Homepage** - Hero section, featured courses, benefits, certificates preview, reviews, CTA
- **Course Catalog** - Browse and filter courses by category and skill level
- **Course Details** - Enroll, track progress, complete courses
- **User Dashboard** - View enrolled courses, progress, completed courses, certificates
- **Certificates** - Personalized, downloadable, shareable certificates
- **Authentication** - Register, login, logout with JWT tokens

## Tech Stack

### Frontend
- React 18
- React Router 6
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express.js
- SQLite (better-sqlite3)
- JWT Authentication
- bcrypt for password hashing

## Setup Instructions

### Prerequisites
- Node.js 18+ installed

### Installation

1. **Install backend dependencies:**
```bash
cd backend
npm install
```

2. **Install frontend dependencies:**
```bash
cd frontend
npm install
```

### Running the Application

1. **Start the backend server:**
```bash
cd backend
npm start
```
The backend will run on http://localhost:3001

2. **Start the frontend development server:**
```bash
cd frontend
npm run dev
```
The frontend will run on http://localhost:3000

### Demo Account

Use these credentials to test the platform:
- **Email:** demo@example.com
- **Password:** demo123

## Project Structure

```
untitled/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── models/
│   │   └── database.js      # SQLite database & seed data
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── certificates.js  # Certificate routes
│   │   ├── courses.js       # Course routes
│   │   ├── reviews.js       # Review routes
│   │   └── users.js         # User routes
│   ├── package.json
│   └── server.js            # Express server
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Layout.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useApi.js
│   │   ├── pages/
│   │   │   ├── CertificatePage.jsx
│   │   │   ├── CourseDetailPage.jsx
│   │   │   ├── CoursesPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/:id/enroll` - Enroll in course (protected)
- `PUT /api/courses/:id/progress` - Update progress (protected)

### Users
- `GET /api/users/enrollments` - Get user's enrollments (protected)
- `GET /api/users/stats` - Get user stats (protected)

### Certificates
- `GET /api/certificates` - Get user's certificates (protected)
- `GET /api/certificates/:id` - Get certificate details
- `POST /api/certificates/generate` - Generate certificate (protected)

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create review (protected)

## Design System

### Colors
- White (#FFFFFF)
- Soft Gray 50-900 scale
- Minimal accent colors for status indicators

### Typography
- Font: Inter
- Weights: 300, 400, 500, 600, 700

### Animations
- Scroll-triggered slide animations
- Smooth hover tranclausitions
- Subtle scale effects on interactive elements
