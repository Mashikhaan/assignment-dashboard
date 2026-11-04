import React from 'react'
import { useAppContext } from '../context/AppContext';


const StudentDashboard = () => {
  const { currentUser, logout, assignments } = useAppContext();

  // Find assignments assigned to the logged-in student
  const myAssignments = assignments.filter((assignment) =>
    assignment.assignedTo.includes(currentUser.id)
  );

  //pending assignments count
  const pendingCount = myAssignments.filter(
    (assignment) =>
      assignment.submissions[currentUser.id] === "pending"
  ).length;

  //submitted assignments count
  const submittedCount = myAssignments.filter(
    (assignment) =>
      assignment.submissions[currentUser.id] === "Submitted"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
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
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6 md:p-8 max-w-7xl mx-auto">

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Student Dashboard
          </h2>

          <p className="text-gray-500 mt-2">
            View your assignments and track your progress.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500">Total Assignments</p>
            <h3 className="text-3xl font-bold mt-3">
              {myAssignments.length}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500">Pending</p>
            <h3 className="text-3xl font-bold mt-3 text-orange-500">
              {pendingCount}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500">Submitted</p>
            <h3 className="text-3xl font-bold mt-3 text-green-600">
              {submittedCount}
            </h3>
          </div>

        </div>

        {/* Assignments */}
        <div className="bg-white rounded-xl shadow-sm border mt-8 p-6">

          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              My Assignments
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              Assignments assigned to you.
            </p>
          </div>

          {myAssignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {myAssignments.map((assignment) => {
                const status =
                  assignment.submissions[currentUser.id];

                return (
                  <div
                    key={assignment.id}
                    className="border rounded-xl p-5 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start gap-3">

                      <h4 className="text-lg font-semibold text-gray-800">
                        {assignment.title}
                      </h4>

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          status === "Submitted"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {status}
                      </span>

                    </div>

                    <p className="text-gray-500 text-sm mt-3">
                      {assignment.description}
                    </p>

                    <p className="text-sm text-gray-600 mt-4">
                      <strong>Due Date:</strong>{" "}
                      {assignment.dueDate}
                    </p>

                    {assignment.driveLink && (
                      <a
                        href={assignment.driveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block text-indigo-600 hover:underline mt-4 text-sm font-medium"
                      >
                        View Assignment →
                      </a>
                    )}

                  </div>
                );
              })}

            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg font-medium">
                No assignments assigned yet.
              </p>

              <p className="text-sm mt-2">
                Your assignments will appear here.
              </p>
            </div>
          )}

        </div>

      </main>
    </div>
  );
};

export default StudentDashboard;