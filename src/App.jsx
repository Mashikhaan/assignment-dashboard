import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login';
import { useAppContext } from './context/AppContext';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';




const App = () => {
  const { currentUser } = useAppContext();
  return (
    <Routes>
      //if the user is logged in, redirect to the dashboard page, otherwise show the login page
      <Route path="/" element = {currentUser ? (<Navigate to={currentUser.role === "admin" ? "/admin-dashboard" : "/student-dashboard"} />) : (<Login/>)} />
      //admin dashboard route
      <Route path="/admin-dashboard" element={currentUser?.role === "admin" ? (<AdminDashboard />) : (<Navigate to="/" replace />)} />
      //student dashboard route
      <Route path="/student-dashboard" element={currentUser?.role === "student" ? (<StudentDashboard />) : (<Navigate to="/" replace />)} />
    </Routes>
  )
}

export default App