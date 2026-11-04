import React from 'react'
import { useAppContext } from '../context/AppContext';


const AdminDashboard = () => {
  const { currentUser, logout } = useAppContext();

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Top Navbar */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">
          Joineazy
        </h1>

        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-700">
            {currentUser.name}
          </span>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6 md:p-8 max-w-7xl mx-auto">

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h2>

          <p className="text-gray-500 mt-2">
            Manage assignments and track student progress.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500">Total Assignments</p>
            <h3 className="text-3xl font-bold mt-3">0</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500">Total Students</p>
            <h3 className="text-3xl font-bold mt-3">5</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500">Completion Rate</p>
            <h3 className="text-3xl font-bold mt-3">0%</h3>
          </div>

        </div>

        {/* Assignments Section */}
        <div className="bg-white rounded-xl shadow-sm border mt-8 p-6">

          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                My Assignments
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                Manage and monitor your assignments.
              </p>
            </div>

            <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700">
              + Create Assignment
            </button>
          </div>

          <div className="text-center py-12 text-gray-400">
            No assignments created yet.
          </div>

        </div>

      </main>

    </div>
  );
};

export default AdminDashboard;