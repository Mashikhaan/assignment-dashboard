
# Joineazy Dashboard

A role-based assignment management dashboard built with **React, Vite, and Tailwind CSS**. Joineazy provides separate interfaces for administrators and students to manage assignments, track progress, and monitor submission statuses through a clean, responsive, and user-friendly interface.

The application is designed as a lightweight front-end prototype using seeded mock data and browser-based persistence with `localStorage`.

---

## ✨ Features

### 🔐 Authentication & Role Management

- Role-based login for Admin and Student users.
- Predefined mock user accounts for easy testing.
- Automatic dashboard redirection based on user roles.
- Protected routes based on user permissions.

### 👨‍💼 Admin Dashboard

- View and manage assignments.
- Create, edit, and delete assignments.
- Assign work to all students or selected students.
- Track assignment submission statuses.
- View assignment statistics and progress.
- Add Google Drive links to assignments.
- Monitor student submission activity.

### 🎓 Student Dashboard

- View assignments assigned to the logged-in student.
- Track pending and submitted assignments.
- View assignment descriptions and due dates.
- Access assignment resources through Google Drive links.
- Submit assignments with a confirmation modal.
- Monitor submission progress through dashboard statistics.

### ⚡ General Features

- Responsive user interface.
- Centralized state management using React Context API.
- Persistent application state using browser `localStorage`.
- Reusable React components.
- Interactive modals and dashboard statistics.
- Role-based navigation and dashboard views.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Component-based UI development |
| Vite | Development server and build tool |
| React Router DOM | Client-side routing and navigation |
| Tailwind CSS | Responsive UI styling |
| Lucide React | Icons and visual elements |
| React Context API | Global state management |
| JavaScript | Application logic |
| Browser localStorage | Client-side data persistence |

---

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (included with Node.js)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone <repository-url>
```

### 2. Navigate to the Project Directory

```bash
cd joineazy-dashboard
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Open the Application

Once the development server starts, open the following URL in your browser:

```text
http://localhost:5173
```

### 6. Build for Production

```bash
npm run build
```

### 7. Preview the Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

The project follows a modular folder structure to keep components, application logic, mock data, and page-level views organized.

```text
joineazy-dashboard/
│
├── public/
│   ├── favicon.jpeg
│   └── icons.svg
│
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AssignmentForm.jsx
│   │   │   ├── AssignmentTable.jsx
│   │   │   
│   │   
│   │   
│   │       
│   │       
│   │
│   ├── context/
│   │   └── AppContext.jsx
│   │
│   ├── data/
│   │   └── seedData.js
│   │
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── Login.jsx
│   │   └── StudentDashboard.jsx
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

---

## 🏗️ Component Architecture

The application follows a component-based architecture with centralized state management and role-specific dashboard views.

### 1. Application Entry Point

**`main.jsx`**

Initializes the React application and wraps it with the required providers:

- `BrowserRouter` – Enables client-side routing.
- `AppProvider` – Makes global application state available throughout the component tree.

**`App.jsx`**

Defines application routes, access restrictions, and role-based navigation.

| Route | Access | Description |
|---|---|---|
| `/` | Public | Redirects users based on login status and role |
| `/admin-dashboard` | Admin | Administrator dashboard |
| `/student-dashboard` | Student | Student dashboard |

### 2. Global State Management

**`context/AppContext.jsx`**

Acts as the central state management layer of the application.

It manages:

- `currentUser` – Stores the currently authenticated mock user.
- `assignments` – Maintains assignment records.
- `login()` – Handles mock user login.
- `logout()` – Clears the current session.
- `addAssignment()` – Creates new assignments.
- `updateAssignment()` – Updates existing assignments.
- `deleteAssignment()` – Removes assignments.
- `submitAssignment()` – Updates assignment submission status.

The context also handles synchronization with browser `localStorage` to preserve application state across page refreshes.

### 3. Authentication & Routing

**`pages/Login.jsx`**

Provides a login interface with a dropdown containing predefined mock users.

After selecting a user, the application redirects them to the appropriate dashboard based on their assigned role.

### 4. Admin Dashboard

**`pages/AdminDashboard.jsx`**

Provides administrators with tools to manage assignments and monitor student activity.

Key responsibilities:

- Display assignments created by the logged-in administrator.
- Show dashboard statistics.
- Create and edit assignments.
- Delete existing assignments.
- Monitor submission statuses for assigned students.

Reusable components:

- `AssignmentForm.jsx`
- `AssignmentTable.jsx`


### 5. Student Dashboard

**`pages/StudentDashboard.jsx`**

Provides students with an overview of their assigned work and submission progress.

Key responsibilities:

- Display assignments assigned to the current student.
- Calculate total, pending, and submitted assignment counts.
- Display assignment completion progress.
- Allow students to submit assignments.
- Show a confirmation modal before final submission.

### 6. Reusable Components

**`components/admin/AssignmentForm.jsx`**

A modal-based form used for creating and editing assignments.

Supported fields:

- Assignment title.
- Description.
- Due date.
- Google Drive link.
- Student assignment selection.

Administrators can assign tasks to all students or selected students.

**`components/admin/AssignmentTable.jsx`**

Displays assignment records in a structured table.

Provides actions for:

- Editing assignments.
- Deleting assignments.
- Opening associated Google Drive links.



### 7. Seed Data

**`data/seedData.js`**

Contains predefined mock users, role definitions, and initial assignment data.

This allows the application to demonstrate its functionality without requiring an external API or database.

---

## 💡 Key Design Decisions

### 1. React Context API for Global State

React Context API is used to manage shared application data and business logic.

This avoids excessive prop drilling and provides a centralized approach to managing users, assignments, and submission operations.

### 2. localStorage for Data Persistence

Since the application is designed as a front-end prototype, browser `localStorage` is used instead of a backend database.

Benefits include:

- Data persistence across browser refreshes.
- No backend infrastructure required.
- Simple development and testing.
- Immediate feedback when managing assignments.

### 3. Client-Side Role-Based Access Control

Dashboard access and navigation are controlled using the current user's role.

Administrators can access administrative functionality, while students are directed to their respective dashboards.

> **Note:** This is a demonstration of client-side access control, not production-grade security. A real application must enforce authorization on the backend.

### 4. Seeded Mock Data Instead of API Integration

Predefined mock users and assignment records simulate real-world application workflows.

This approach keeps the project lightweight and allows users to explore both administrator and student experiences without configuring external services.

### 5. Centralized Assignment Lifecycle Management

All assignment-related operations are maintained within `AppContext.jsx`.

This ensures consistent behavior across different dashboard views and reduces duplicated business logic.

### 6. Modal-Based Admin Interactions

Assignment creation and editing are handled through modal interfaces.

This keeps administrative workflows focused, minimizes unnecessary navigation, and provides a cleaner user experience.

### 7. Reusable and Modular Components

The application separates page-level components, shared UI components, state management, and mock data.

This improves code organization, maintainability, and the ability to extend the application with additional features.

---

## 💾 Data Persistence

The application uses browser `localStorage` to persist relevant application data.

| Data | Storage |
|---|---|
| Current user/session | Browser localStorage |
| Assignment records | Browser localStorage |
| Initial mock data | `seedData.js` |

Data is stored locally in the browser, meaning it is not synchronized across different devices or users.

Clearing browser storage may remove persisted application data.

---

## ⚠️ Current Limitations

Joineazy Dashboard is currently a front-end demonstration project and has the following limitations:

- No backend API integration.
- No real authentication or authorization service.
- No database integration.
- No server-side validation.
- User and assignment data are based on seeded mock data.
- localStorage provides browser-specific persistence rather than centralized data storage.
- Shared layout components such as Navbar and Sidebar are present but are not yet fully integrated into the main dashboard flow.

---

## 🔮 Future Improvements

The application can be extended with the following features:

- Backend integration using Node.js and Express.
- Database integration using MongoDB or PostgreSQL.
- Secure authentication using JWT or session-based authentication.
- Server-side role-based access control.
- File upload functionality for assignment submissions.
- Real-time submission notifications.
- Assignment search, filtering, and sorting.
- Improved analytics and reporting.
- Deployment with a production backend.

---

## 📄 License

This project is developed for educational and demonstration purposes.

Unless otherwise specified by the repository owner, all rights and usage permissions are subject to the repository owner's terms.

---

## 👨‍💻 Author

**MOHD MASIHULLA**

Simplifying assignment management through a role-based and user-friendly dashboard.

---

**Built with ❤️ using React, Vite, and Tailwind CSS.**
