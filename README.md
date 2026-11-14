# Joineazy Dashboard

Joineazy Dashboard is a role-based course and assignment management app for professors and students.

## Features

- Student and professor registration/login
- Role-based access control
- Course creation and enrollment
- Assignment creation and tracking
- Student group creation and joining
- Assignment acknowledgment and status tracking
- Separate dashboards for professor and student users

## Tech Stack

- React
- Vite
- React Router
- Node.js
- Express
- MongoDB + Mongoose
- JWT + HTTP-only cookies
- bcryptjs
- Tailwind CSS
- Axios

## Project Structure

```text
joineazy-dashboard/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       └── routes/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── data/
│       ├── pages/
│       ├── services/
│       ├── index.css
│       └── main.jsx
├── README.md
└── .gitignore
```

## Prerequisites

- Node.js and npm
- MongoDB running locally or in MongoDB Atlas
- Git

## Setup

### 1. Clone the repo

```bash
git clone <repository-url>
cd joineazy-dashboard
```

### 2. Backend configuration

Create a `backend/.env` file:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/joineazy-dashboard
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Start backend

```bash
cd backend
npm install
npm run dev
```

Health check:

```text
http://localhost:5000/health
```

### 4. Frontend configuration

Create a `frontend/.env` file:

```env
VITE_BACKEND_URL=http://localhost:5000/api
```

### 5. Start frontend

```bash
cd frontend
npm install
npm run dev
```

Then open the local Vite URL, usually:

```text
http://localhost:5173
```

## Main Routes

### Frontend

- `/` - landing page
- `/login` - login page
- `/register` - registration page
- `/professor-dashboard` - professor dashboard
- `/student-dashboard` - student dashboard
- `/professor/courses/:courseId` - professor course assignments
- `/student/courses/:courseId` - student course assignments

### Backend API

#### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

#### Courses

- `POST /api/courses/create`
- `GET /api/courses`
- `GET /api/courses/explore`
- `GET /api/courses/:courseId`
- `PUT /api/courses/:courseId`
- `DELETE /api/courses/:courseId`
- `POST /api/courses/:courseId/enroll`
- `GET /api/courses/:courseId/students`

#### Assignments

- `POST /api/assignment/create`
- `GET /api/assignment`
- `GET /api/assignment/:assignmentId`
- `PUT /api/assignment/:assignmentId`
- `DELETE /api/assignment/:assignmentId`

#### Groups

- `POST /api/groups/create`
- `POST /api/groups/:groupId/join`
- `GET /api/groups/:groupId`
- `GET /api/groups/course/:courseId`

#### Submissions

- `POST /api/submissions/:assignmentId/acknowledge`
- `POST /api/submissions/:assignmentId/group-acknowledge`
- `GET /api/submissions/:assignmentId/status`
- `GET /api/submissions/:assignmentId/tracking`

## Notes

- File upload feature is not implemented in the current version.
- Authentication is handled using JWT stored in an HTTP-only cookie.
- Backend role checks protect professor-only and student-only routes.

## Author

Joineazy Dashboard

**MOHD MASIHULLA**

Simplifying assignment management through a role-based and user-friendly dashboard.

---

**Built with ❤️ using React, Vite, Tailwind CSS, Node.js, Express, and MongoDB.**