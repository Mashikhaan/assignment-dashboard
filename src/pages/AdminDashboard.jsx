import React from "react";
import { useAppContext } from "../context/AppContext";
import { useState } from "react";
import AssignmentTable from "../components/admin/AssignmentTable";
import AssignmentForm from "../components/admin/AssignmentForm";
import { users } from "../data/seedData.js";

const AdminDashboard = () => {
  const {
    currentUser,
    logout,
    assignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
  } = useAppContext();

  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  // Only show assignments created by the logged-in admin
  const myAssignments = assignments.filter(
    (assignment) => assignment.createdBy === currentUser.id,
  );

  // Create assignment
  const handleCreate = (data) => {
    addAssignment(data);
    setShowForm(false);
  };

  // Update assignment
  const handleUpdate = (data) => {
    updateAssignment(editingAssignment.id, data);
    setEditingAssignment(null);
    setShowForm(false);
  };

  // Delete assignment
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this assignment?",
    );
    if (confirmDelete) {
      deleteAssignment(id);
    }
  };

  // Statistics:--

  const totalStudents = 5;

  const totalAssignments = myAssignments.length;

  //total assigned assignments
  const totalAssigned = myAssignments.reduce((total, assignment) => {
    total + assignment.assignedTo.length;
  }, 0);

  //total submitted assignments
  const totalSubmitted = myAssignments.reduce((total, assignment) => {
    total +
      Object.values(assignment.submissions).filter(
        (status) => status === "Submitted",
      ).length;
  }, 0);

  //completion rate
  const completionRate = totalAssigned
    ? Math.round((totalSubmitted / totalAssigned) * 100)
    : 0;

  const students = users.filter((user) => user.role === "student");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Joineazy</h1>

        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-700">{currentUser.name}</span>

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
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>

          <p className="text-gray-500 mt-2">
            Manage assignments and track student progress.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500">Total Assignments</p>
            <h3 className="text-3xl font-bold mt-3">{totalAssignments}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500">Total Students</p>
            <h3 className="text-3xl font-bold mt-3">{totalStudents}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500">Completion Rate</p>
            <h3 className="text-3xl font-bold mt-3">{completionRate}%</h3>
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

            <button
              onClick={() => {
                setEditingAssignment(null);
                setShowForm(true);
              }}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 cursor-pointer"
            >
              + Create Assignment
            </button>
          </div>

          {/* Assignment List */}
          {myAssignments.length > 0 ? (
            <AssignmentTable
              assignments={myAssignments}
              onEdit={(assignment) => {
                setEditingAssignment(assignment);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg font-medium">No assignments created yet.</p>
              <p className="text-sm mt-2">
                Click on Create Assignment to get started.
              </p>
            </div>
          )}
        </div>

        {/* Student Submission Tracking */}

        <div className="bg-white rounded-xl shadow-sm border mt-8 p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Student Submission Tracking
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              Track submissions and monitor student progress.
            </p>
          </div>

          {myAssignments.length > 0 ? (
            <div className="space-y-6">
              {myAssignments.map((assignment) => {
                // Get students assigned to this assignment
                const assignedStudents = students.filter((student) =>
                  assignment.assignedTo.includes(student.id),
                );

                // Count submitted students
                const submittedCount = assignedStudents.filter(
                  (student) =>
                    assignment.submissions?.[student.id]?.toLowerCase() ===
                    "submitted",
                ).length;

                const totalStudents = assignedStudents.length;

                const progress = totalStudents
                  ? Math.round((submittedCount / totalStudents) * 100)
                  : 0;

                return (
                  <div key={assignment.id} className="border rounded-xl p-5">
                    {/* Assignment Heading */}
                    <div className="flex flex-col sm:flex-row justify-between gap-3">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">
                          {assignment.title}
                        </h4>

                        <p className="text-sm text-gray-500 mt-1">
                          {submittedCount} of {totalStudents} students submitted
                        </p>
                      </div>

                      <span className="text-sm font-semibold text-indigo-600">
                        {progress}% Completed
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Student List */}
                    <div className="mt-5 space-y-3">
                      {assignedStudents.map((student) => {
                        const status =
                          assignment.submissions?.[student.id] || "pending";

                        const isSubmitted =
                          status.toLowerCase() === "submitted";

                        return (
                          <div
                            key={student.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-3 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-gray-800">
                                {student.name}
                              </p>

                              <p className="text-xs text-gray-500">
                                {student.email}
                              </p>
                            </div>

                            <span
                              className={`text-xs font-semibold px-3 py-1 rounded-full w-fit ${
                                isSubmitted
                                  ? "bg-green-100 text-green-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {isSubmitted ? "Submitted" : "Pending"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-10 text-gray-400">
              No assignments available for tracking.
            </p>
          )}
        </div>
      </main>

      {/* Create / Edit Assignment Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-5">
              {editingAssignment ? "Edit Assignment" : "Create New Assignment"}
            </h2>

            <AssignmentForm
              initialData={editingAssignment}
              onSubmit={editingAssignment ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false);
                setEditingAssignment(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
