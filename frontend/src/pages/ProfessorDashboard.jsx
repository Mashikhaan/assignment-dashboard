import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import AssignmentTable from "../components/admin/AssignmentTable.jsx";
import AssignmentForm from "../components/admin/AssignmentForm.jsx";
import CourseForm from "../components/admin/CourseForm.jsx";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const ProfessorDashboard = () => {
  const { currentUser, logout, courses, addCourse, getCourses } =
    useAppContext();

  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [showCourseForm, setShowCourseForm] = useState(false);

  const [courseLoading, setCourseLoading] = useState(true);
  const [courseError, setCourseError] = useState("");
  const [deletingCourseId, setDeletingCourseId] = useState("");

  const [assignments, setAssignments] = useState([]);
  const [assignmentLoading, setAssignmentLoading] = useState(true);
  const [assignmentError, setAssignmentError] = useState("");
  const [formError, setFormError] = useState("");

  // Submission tracking state
  const [trackingData, setTrackingData] = useState({});
  const [trackingLoading, setTrackingLoading] = useState(false);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        await getCourses();
      } catch (error) {
        setCourseError(
          error.response?.data?.message || "Failed to load courses",
        );
      } finally {
        setCourseLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setAssignmentLoading(true);
        setAssignmentError("");

        const { data } = await API.get("/assignment");

        setAssignments(data.assignments || []);
      } catch (error) {
        setAssignmentError(
          error.response?.data?.message || "Failed to load assignments",
        );
      } finally {
        setAssignmentLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  // Fetch submission tracking for each assignment
  useEffect(() => {
    if (assignments.length === 0) {
      setTrackingData({});
      return;
    }

    const fetchTracking = async () => {
      try {
        setTrackingLoading(true);

        const results = await Promise.all(
          assignments.map(async (assignment) => {
            try {
              const { data } = await API.get(
                `/submissions/${assignment._id}/tracking`,
              );

              return {
                assignmentId: assignment._id,
                tracking: data.tracking || [],
                total: data.total || 0,
                submitted: data.submitted || 0,
                pending: data.pending || 0,
              };
            } catch (error) {
              console.error(
                `Failed to fetch tracking for ${assignment.title}`,
                error,
              );

              return {
                assignmentId: assignment._id,
                tracking: [],
                total: 0,
                submitted: 0,
                pending: 0,
              };
            }
          }),
        );

        const updatedTracking = {};

        results.forEach((result) => {
          updatedTracking[result.assignmentId] = result;
        });

        setTrackingData(updatedTracking);
      } finally {
        setTrackingLoading(false);
      }
    };

    fetchTracking();
  }, [assignments]);

  // Assignments fetched from backend
  const myAssignments = assignments;

  // Open create assignment form
  const openCreateForm = () => {
    setEditingAssignment(null);
    setSelectedCourseId(courses[0]?._id || "");
    setFormError("");
    setShowForm(true);
  };

  // Open edit assignment form
  const openEditForm = (assignment) => {
    setEditingAssignment(assignment);
    setSelectedCourseId(assignment.course?._id || "");
    setFormError("");
    setShowForm(true);
  };

  // Create assignment
  const handleCreateAssignment = async (formData) => {
    try {
      setFormError("");

      const { data } = await API.post("/assignment/create", {
        ...formData,
        course: selectedCourseId,
      });

      setAssignments((prev) => [...prev, data.assignment]);

      setShowForm(false);
      setSelectedCourseId("");
    } catch (error) {
      setFormError(
        error.response?.data?.message || "Failed to create assignment",
      );
    }
  };

  // Update assignment
  const handleUpdateAssignment = async (formData) => {
    try {
      setFormError("");

      const { data } = await API.put(
        `/assignment/${editingAssignment._id}`,
        formData,
      );

      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment._id === editingAssignment._id
            ? data.assignment
            : assignment,
        ),
      );

      setEditingAssignment(null);
      setShowForm(false);
    } catch (error) {
      setFormError(
        error.response?.data?.message || "Failed to update assignment",
      );
    }
  };

  // Delete assignment
  const handleDeleteAssignment = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this assignment?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/assignment/${id}`);

      setAssignments((prev) =>
        prev.filter((assignment) => assignment._id !== id),
      );
    } catch (error) {
      setAssignmentError(
        error.response?.data?.message || "Failed to delete assignment",
      );
    }
  };

  // Create course
  const handleCreateCourse = async (formData) => {
    try {
      setCourseError("");

      await addCourse(formData);

      setShowCourseForm(false);
    } catch (error) {
      setCourseError(
        error.response?.data?.message || "Failed to create course",
      );
    }
  };

  // Dashboard statistics
  const totalAssignments = myAssignments.length;

  const totalAssigned = Object.values(trackingData).reduce(
    (total, item) => total + item.total,
    0,
  );

  const totalSubmitted = Object.values(trackingData).reduce(
    (total, item) => total + item.submitted,
    0,
  );

  const completionRate = totalAssigned
    ? Math.round((totalSubmitted / totalAssigned) * 100)
    : 0;

  // Delete course
  const handleDeleteCourse = async (courseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course? All related assignments, groups and submissions will also be permanently deleted.",
    );

    if (!confirmDelete) return;

    try {
      setCourseError("");
      setDeletingCourseId(courseId);

      // Delete course from backend
      await API.delete(`/courses/${courseId}`);

      // Remove related assignments from frontend state
      setAssignments((prev) =>
        prev.filter(
          (assignment) =>
            String(assignment.course?._id || assignment.course) !==
            String(courseId),
        ),
      );

      // Refresh professor's courses
      await getCourses();
    } catch (error) {
      setCourseError(
        error.response?.data?.message || "Failed to delete course",
      );
    } finally {
      setDeletingCourseId("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Joineazy</h1>

        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-700">{currentUser?.name}</span>

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
        {/* Dashboard Heading */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>

          <p className="text-gray-500 mt-2">
            Manage courses, assignments and track student progress.
          </p>
        </div>

        {/* My Courses Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">My Courses</h3>

              <p className="text-gray-500 text-sm mt-1">Manage your courses.</p>
            </div>

            <button
              onClick={() => setShowCourseForm(true)}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 cursor-pointer"
            >
              + Create Course
            </button>
          </div>

          {courseError && <p className="text-red-500 mb-4">{courseError}</p>}

          {courseLoading ? (
            <p className="text-gray-500 text-center py-8">Loading courses...</p>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((course) => (
                <div
                  key={course._id}
                  onClick={() => navigate(`/professor/courses/${course._id}`)}
                  className="border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <h4 className="font-bold text-lg text-gray-800">
                    {course.title}
                  </h4>

                  <p className="text-sm text-indigo-600 mt-1">
                    {course.courseCode}
                  </p>

                  <p className="text-sm text-gray-500 mt-3">
                    {course.description}
                  </p>

                  <p className="text-sm text-gray-600 mt-4">
                    {course.students?.length || 0} Enrolled Students
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCourse(course._id);
                    }}
                    disabled={deletingCourseId === course._id}
                    className="w-full mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer transition"
                  >
                    {deletingCourseId === course._id
                      ? "Deleting..."
                      : "Delete Course"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <p className="font-medium">No courses created yet.</p>

              <p className="text-sm mt-2">
                Click on Create Course to get started.
              </p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500">Total Assignments</p>
            <h3 className="text-3xl font-bold mt-3">{totalAssignments}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500">Total Assigned</p>
            <h3 className="text-3xl font-bold mt-3">{totalAssigned}</h3>
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
              onClick={openCreateForm}
              disabled={courses.length === 0}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
            >
              + Create Assignment
            </button>
          </div>

          {assignmentError && (
            <p className="text-red-500 mb-4">{assignmentError}</p>
          )}

          {assignmentLoading ? (
            <p className="text-gray-500 text-center py-8">
              Loading assignments...
            </p>
          ) : myAssignments.length > 0 ? (
            <AssignmentTable
              assignments={myAssignments}
              onEdit={openEditForm}
              onDelete={handleDeleteAssignment}
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

          {trackingLoading ? (
            <p className="text-gray-500 text-center py-6">
              Loading submission tracking...
            </p>
          ) : myAssignments.length > 0 ? (
            <div className="space-y-6">
              {myAssignments.map((assignment) => {
                const tracking = trackingData[assignment._id]?.tracking || [];

                const total = trackingData[assignment._id]?.total || 0;

                const submitted = trackingData[assignment._id]?.submitted || 0;

                const pending = trackingData[assignment._id]?.pending || 0;

                const progress = total
                  ? Math.round((submitted / total) * 100)
                  : 0;

                return (
                  <div key={assignment._id} className="border rounded-xl p-5">
                    {/* Assignment Heading */}
                    <div className="flex flex-col sm:flex-row justify-between gap-3">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">
                          {assignment.title}
                        </h4>

                        <p className="text-sm text-gray-500 mt-1">
                          {submitted} of {total} submitted
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

                    <div className="flex gap-4 text-sm mt-3">
                      <span className="text-green-600">
                        Submitted: {submitted}
                      </span>

                      <span className="text-orange-600">
                        Pending: {pending}
                      </span>
                    </div>

                    {/* Student / Group Tracking */}
                    <div className="mt-5 space-y-3">
                      {tracking.length > 0 ? (
                        tracking.map((item) => {
                          const isSubmitted =
                            item.status?.toLowerCase() === "submitted";

                          const displayName = item.student
                            ? item.student.name
                            : item.group?.name || item.group?.title || "Group";

                          const displayEmail = item.student?.email;

                          return (
                            <div
                              key={item._id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-3 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-gray-800">
                                  {displayName}
                                </p>

                                {displayEmail && (
                                  <p className="text-xs text-gray-500">
                                    {displayEmail}
                                  </p>
                                )}
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
                        })
                      ) : (
                        <p className="text-sm text-gray-400">
                          No submission records available yet.
                        </p>
                      )}
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

            {formError && <p className="text-red-500 mb-4">{formError}</p>}

            {/* Course Selection */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Course
              </label>

              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                disabled={!!editingAssignment}
                className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              >
                <option value="">Select a course</option>

                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title} ({course.courseCode})
                  </option>
                ))}
              </select>
            </div>

            <AssignmentForm
              courseId={selectedCourseId}
              initialData={editingAssignment}
              onSubmit={
                editingAssignment
                  ? handleUpdateAssignment
                  : handleCreateAssignment
              }
              onCancel={() => {
                setShowForm(false);
                setEditingAssignment(null);
                setSelectedCourseId("");
                setFormError("");
              }}
            />
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      {showCourseForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-5">Create New Course</h2>

            <CourseForm
              onSubmit={handleCreateCourse}
              onCancel={() => setShowCourseForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorDashboard;
