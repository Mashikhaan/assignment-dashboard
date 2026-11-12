# Joineazy Dashboard

Joineazy is a role-based course and assignment management application. It has separate dashboards for professors and students, with a React frontend and an Express/MongoDB backend.

## Features

### Authentication and roles

- Register and log in as a professor or student.
- Keep the login session in an HTTP-only cookie.
- Redirect users to a dashboard based on their role.
- Restrict dashboard pages and API operations by role.

### Professor dashboard

- Create and view courses.
- View enrolled students in a course.
- Create, update, and delete assignments.
- Choose individual or group submission types.
- Set assignment due dates and OneDrive links.
- Track assignment submission acknowledgements.

### Student dashboard

- View enrolled courses and their assignments.
- Enroll in courses.
- Create or join a group for a course.
- Acknowledge individual or group assignment submissions.
- Check assignment submission status.

> Submission acknowledgement records a submission in the application. File uploading is not currently implemented.

## Tech stack

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| Vite | Frontend development server and build tool |
| React Router | Frontend routing |
| Tailwind CSS | Styling |
| Axios | Frontend API requests |
| Node.js | Backend runtime |
| Express | Backend API |
| MongoDB and Mongoose | Database and data models |
| JWT and HTTP-only cookies | Authentication |
| bcryptjs | Password hashing |

## Prerequisites

- Node.js and npm
- MongoDB, either installed locally or available through MongoDB Atlas
- Git

## Getting started

The project has separate `frontend` and `backend` applications. Install and run each one in its own terminal.

### 1. Clone the repository

```bash
git clone <repository-url>
cd joineazy-dashboard
```

### 2. Configure the backend

Create `backend/.env` with the following values:

```env
PORT=3000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<a-long-random-secret>
FRONTEND_URL=http://localhost:5173
```

Keep `.env` private and do not commit real credentials or secrets.

> **Port note:** The frontend API client currently uses `http://localhost:3000/api`. The backend defaults to port `5000` unless `PORT` is set. The example above sets `PORT=3000` so the frontend and backend match. Alternatively, update the frontend API base URL to use the backend's port.

### 3. Install backend dependencies and start the server

```bash
cd backend
npm install
npm run dev
```

The backend uses `nodemon` for development. To start it without the development watcher, use:

```bash
npm start
```

The health-check endpoint is available at:

```text
http://localhost:3000/health
```

### 4. Install frontend dependencies and start the app

In a second terminal, from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, usually:

```text
http://localhost:5173
```

## Available scripts

### Frontend

Run these commands from `frontend/`:

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

### Backend

Run these commands from `backend/`:

| Command | Description |
|---|---|
| `npm run dev` | Start the backend with nodemon |
| `npm start` | Start the backend with Node.js |

## Application routes

| Frontend route | Access | Description |
|---|---|---|
| `/` | Public or authenticated | Login page, or redirect to the role-specific dashboard |
| `/login` | Public or authenticated | Login page, or redirect to the role-specific dashboard |
| `/register` | Public or authenticated | Registration page, or redirect to the role-specific dashboard |
| `/professor-dashboard` | Professor | Professor dashboard |
| `/professor/courses/:courseId` | Professor | Course assignments |
| `/student-dashboard` | Student | Student dashboard |
| `/student/courses/:courseId` | Student | Student course assignments |

## API overview

All API routes use the `/api` prefix unless noted otherwise. Authenticated requests use the login cookie.

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a student or professor |
| `POST` | `/api/auth/login` | Public | Log in |
| `GET` | `/api/auth/me` | Authenticated | Get the current user |
| `POST` | `/api/auth/logout` | Authenticated | Log out |

### Courses

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/courses` | Authenticated | Get courses available to the current user |
| `POST` | `/api/courses/create` | Professor | Create a course |
| `GET` | `/api/courses/:courseId` | Authenticated | Get a course |
| `PUT` | `/api/courses/:courseId` | Professor | Update a course |
| `DELETE` | `/api/courses/:courseId` | Professor | Delete a course |
| `POST` | `/api/courses/:courseId/enroll` | Student | Enroll in a course |
| `GET` | `/api/courses/:courseId/students` | Professor | Get enrolled students |

### Assignments

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/assignment` | Authenticated | Get assignments visible to the current user |
| `POST` | `/api/assignment/create` | Professor | Create an assignment |
| `GET` | `/api/assignment/:assignmentId` | Authenticated | Get one assignment |
| `PUT` | `/api/assignment/:assignmentId` | Professor | Update an assignment |
| `DELETE` | `/api/assignment/:assignmentId` | Professor | Delete an assignment |

### Groups

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/groups/create` | Student | Create a group for a course |
| `POST` | `/api/groups/:groupId/join` | Student | Join a group |
| `GET` | `/api/groups/:groupId` | Student | Get group details |
| `GET` | `/api/groups/course/:courseId` | Student | List groups in a course |

### Submissions

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/submissions/:assignmentId/acknowledge` | Student | Acknowledge an individual assignment |
| `POST` | `/api/submissions/:assignmentId/group-acknowledge` | Student | Acknowledge a group assignment |
| `GET` | `/api/submissions/:assignmentId/status` | Student | Check the student's assignment status |
| `GET` | `/api/submissions/:assignmentId/tracking` | Professor | View assignment submission tracking |

## Project structure

```text
joineazy-dashboard/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       └── routes/
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── assets/
        ├── components/
        │   └── admin/
        ├── context/
        │   └── AppContext.jsx
        ├── data/
        ├── pages/
        │   ├── CourseAssignments.jsx
        │   ├── Login.jsx
        │   ├── ProfessorDashboard.jsx
        │   ├── Register.jsx
        │   ├── StudentCourseAssignments.jsx
        │   └── StudentDashboard.jsx
        └── services/
            └── api.js
```

## Authentication and access control

The backend hashes passwords before storing them and issues a JWT in an HTTP-only cookie after registration or login. Protected API routes use authentication middleware; professor- and student-specific operations also check the user's role.

The frontend uses the authenticated user's role to show the appropriate dashboard and restrict dashboard routes. Authorization is enforced by the backend as well as by the frontend.

## Current limitations

- Assignment submissions are acknowledged in the app; uploading files is not implemented.
- The frontend API base URL is currently set to `http://localhost:3000/api`. It must match the backend port.
- The frontend and backend require a running MongoDB database.
- No automated test script is currently defined in the package manifests.

## License

No license is currently specified for this project. Check with the repository owner before redistributing or reusing the code.

## 👨‍💻 Author

**MOHD MASIHULLA**

Simplifying assignment management through a role-based and user-friendly dashboard.

---

**Built with ❤️ using React, Vite, Tailwind CSS, Node.js, Express, and MongoDB.**