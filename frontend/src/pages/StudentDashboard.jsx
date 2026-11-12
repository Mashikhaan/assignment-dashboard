
import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const { currentUser, logout, courses, getCourses } = useAppContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");
        await getCourses();
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load your courses."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Joineazy</h1>

        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-700">
            {currentUser?.name}
          </span>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Student Dashboard
          </h2>
          <p className="text-gray-500 mt-2">
            View your enrolled courses and assignments.
          </p>
        </div>

        {/* Enrolled Courses */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            My Courses
          </h3>

          {loading ? (
            <p className="text-gray-500 text-center py-10">
              Loading your courses...
            </p>
          ) : error ? (
            <p className="text-red-600 text-center py-10">{error}</p>
          ) : courses.length === 0 ? (
            <p className="text-gray-400 text-center py-10">
              You are not enrolled in any course yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((course) => (
                <div
                  key={course._id}
                  onClick={() =>
                    navigate(`/student/courses/${course._id}`)
                  }
                  className="border rounded-xl p-5 hover:shadow-md transition cursor-pointer"
                >
                  <h4 className="text-lg font-semibold text-gray-800">
                    {course.title}
                  </h4>

                  <p className="text-sm text-indigo-600 mt-2">
                    {course.courseCode}
                  </p>

                  <p className="text-gray-500 text-sm mt-3">
                    {course.description || "No course description available."}
                  </p>

                  <p className="text-indigo-600 font-medium text-sm mt-5">
                    View Assignments →
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
