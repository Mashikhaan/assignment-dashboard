import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login';
import { useAppContext } from './context/AppContext';
import ProfessorDashboard from './pages/ProfessorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Register from './pages/Register';
import CourseAssignments from './pages/CourseAssignments';
import StudentCourseAssignments from "./pages/StudentCourseAssignments";
import Home from './pages/Home';

const App = () => {
  const { currentUser } = useAppContext();
  return (
    <Routes>
      {/* register page,if user login show according to role */}
      <Route path="/register" element = {currentUser ? (<Navigate to={currentUser.role === "professor" ? "/professor-dashboard" : "/student-dashboard"} />) : (<Register/>)} />

     {/* login page */}
     <Route path="/login" element = {currentUser ? (<Navigate to={currentUser.role === "professor" ? "/professor-dashboard" : "/student-dashboard"} />) : (<Login/>)} />
     
      {/* if the user is logged in, redirect to the dashboard page, otherwise show the login page */}
      <Route path="/" element = {currentUser ? (<Navigate to={currentUser.role === "professor" ? "/professor-dashboard" : "/student-dashboard"} />) : (<Home/>)} />

      {/* professor dashboard route */}
      <Route path="/professor-dashboard" element={currentUser?.role === "professor" ? (<ProfessorDashboard />) : (<Navigate to="/" replace />)} />

      {/* course assignment route */}
      <Route path='/professor/courses/:courseId' element={currentUser?.role === "professor" ? (<CourseAssignments />) : (<Navigate to="/" replace />)} />

      {/* student dashboard route */}
      <Route path="/student-dashboard" element={currentUser?.role === "student" ? (<StudentDashboard />) : (<Navigate to="/" replace />)} />

      {/* student course assignment route */}
      <Route path='/student/courses/:courseId' element={currentUser?.role === "student" ? (<StudentCourseAssignments />) : (<Navigate to="/" replace />)} />
    </Routes>
    
  )
}

export default App