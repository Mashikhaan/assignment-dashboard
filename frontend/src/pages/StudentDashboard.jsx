
import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api.js";

const StudentDashboard = () => {
  const { currentUser, logout, courses, getCourses } = useAppContext();
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exploreLoading, setExploreLoading] = useState(true);
  const [error, setError] = useState("");
  const [exploreError, setExploreError] = useState("");
  const [enrollingId, setEnrollingId] = useState("");
  const [actionError, setActionError] = useState("");

  // Fetch enrolled courses and all available courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setExploreLoading(true);
      setError("");
      setExploreError("");

      const [, exploreResponse] = await Promise.all([
        getCourses(),
        API.get("/courses/explore"),
      ]);

      setAllCourses(exploreResponse.data.courses || []);
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load courses.";

      setError(message);
      setExploreError(message);
    } finally {
      setLoading(false);
      setExploreLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Enroll in a course
  const handleEnroll = async (courseId) => {
    try {
      setEnrollingId(courseId);
      setActionError("");

      await API.post(`/courses/${courseId}/enroll`);

      // Refresh enrolled courses
      await getCourses();

      setActionError("");
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Failed to enroll in course."
      );
    } finally {
      setEnrollingId("");
    }
  };

  // Check whether student is enrolled
  const isEnrolled = (courseId) => {
    return courses.some(
      (course) => String(course._id) === String(courseId)
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">
          Joineazy
        </h1>

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

        {/* Dashboard Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Student Dashboard
          </h2>

          <p className="text-gray-500 mt-2">
            Explore available courses and manage your enrolled courses.
          </p>
        </div>

        {/* Action Error */}
        {actionError && (
          <p className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-3 mb-6">
            {actionError}
          </p>
        )}

        {/* Explore Courses */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">

          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Explore Courses
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              Discover courses created by all professors.
            </p>
          </div>

          {exploreLoading ? (
            <p className="text-gray-500 text-center py-10">
              Loading available courses...
            </p>
          ) : exploreError ? (
            <p className="text-red-600 text-center py-10">
              {exploreError}
            </p>
          ) : allCourses.length === 0 ? (
            <p className="text-gray-400 text-center py-10">
              No courses are available yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

              {allCourses.map((course) => {
                const enrolled = isEnrolled(course._id);

                return (
                  <div
                    key={course._id}
                    className="border rounded-xl p-5 hover:shadow-md transition"
                  >
                    <h4 className="text-lg font-semibold text-gray-800">
                      {course.title}
                    </h4>

                    <p className="text-sm text-indigo-600 mt-2">
                      {course.courseCode}
                    </p>

                    <p className="text-gray-500 text-sm mt-3">
                      {course.description ||
                        "No course description available."}
                    </p>

                    <p className="text-gray-500 text-sm mt-3">
                      Professor: {course.professor?.name || "Not available"}
                    </p>

                    <div className="mt-5">
                      {enrolled ? (
                        <button
                          onClick={() =>
                            navigate(`/student/courses/${course._id}`)
                          }
                          className="w-full bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium"
                        >
                          Enrolled - View Course
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course._id)}
                          disabled={enrollingId === course._id}
                          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 cursor-pointer"
                        >
                          {enrollingId === course._id
                            ? "Enrolling..."
                            : "Enroll Now"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

            </div>
          )}
        </div>

        {/* My Courses */}
        <div className="bg-white rounded-xl shadow-sm border p-6">

          <h3 className="text-xl font-bold text-gray-800 mb-6">
            My Courses
          </h3>

          {loading ? (
            <p className="text-gray-500 text-center py-10">
              Loading your courses...
            </p>
          ) : error ? (
            <p className="text-red-600 text-center py-10">
              {error}
            </p>
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
                    {course.description ||
                      "No course description available."}
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
