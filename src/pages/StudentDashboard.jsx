import React from 'react'
import { useAppContext } from '../context/AppContext';


const StudentDashboard = () => {
    const { currentUser, logout } = useAppContext();
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Welcome Student, {currentUser.name}
      </h1>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-5 py-2 rounded mt-5 cursor-pointer"
      >
        Logout
      </button>
    </div>
  )
}

export default StudentDashboard