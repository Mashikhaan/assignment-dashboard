import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import AssignmentForm from "../components/admin/AssignmentForm";

const CourseAssignments = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [editingAssignment, setEditingAssignment] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError("");

        const [courseResponse, assignmentResponse] = await Promise.all([
          API.get(`/courses/${courseId}`),
          API.get("/assignment"),
        ]);

        setCourse(courseResponse.data.course);

        const courseAssignments = assignmentResponse.data.assignments.filter(
          (assignment) => assignment.course?._id === courseId,
        );

        setAssignments(courseAssignments);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load course details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  if (loading) {
    return <div className="p-6">Loading course details...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  //handle create assignment
  const handleCreateAssignment = async (formData) => {
    try {
      setFormError("");

      const { data } = await API.post("/assignment/create", formData);

      setAssignments((prev) => [...prev, data.assignment]);

      setShowForm(false);
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Failed to create assignment.",
      );
    }
  };

  //handle update assignment
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
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Failed to update assignment.",
      );
    }
  };

  //handle delete assignment
  const handleDeleteAssignment = async (assignmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?",
    );

    if (!confirmed) return;

    try {
      await API.delete(`/assignment/${assignmentId}`);

      setAssignments((prev) =>
        prev.filter((assignment) => assignment._id !== assignmentId),
      );
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Failed to delete assignment.",
      );
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <button
        onClick={() => navigate("/professor-dashboard")}
        className="mb-6 text-blue-600 cursor-pointer"
      >
        ← Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">{course?.title}</h1>

        <p className="text-indigo-600 mt-1">{course?.courseCode}</p>

        <p className="text-gray-500 mt-2">{course?.description}</p>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">Course Assignments</h2>

          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            + Create Assignment
          </button>
        </div>

        {formError && <p className="text-red-600 text-sm mb-4">{formError}</p>}

        {assignments.length === 0 ? (
          <p className="text-gray-500">
            No assignments have been created for this course yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="border rounded-xl p-5">
                {/* assignment details */}
                <h3 className="font-bold text-lg text-gray-800">
                  {assignment.title}
                </h3>

                <p className="text-sm text-gray-600 mt-2">
                  {assignment.description}
                </p>

                <p className="text-sm text-gray-600 mt-3">
                  <strong>Deadline:</strong>{" "}
                  {new Date(assignment.dueDate).toLocaleString()}
                </p>

                <p className="text-sm text-gray-600 mt-2">
                  <strong>Submission:</strong> {assignment.submissionType}
                </p>

                {/* One drive link */}
                {assignment.oneDriveLink && (
                  <a
                    href={assignment.oneDriveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-blue-600 hover:underline"
                  >
                    Open OneDrive Link
                  </a>
                )}

                {/* Edit and Delete Buttons */}
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => {
                      setEditingAssignment(assignment);
                      setShowForm(true);
                      setFormError("");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteAssignment(assignment._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      
{showForm && (
  <AssignmentForm
    key={editingAssignment?._id || "new"}
    courseId={courseId}
    initialData={editingAssignment}
    onCancel={() => {
      setShowForm(false);
      setEditingAssignment(null);
      setFormError("");
    }}
    onSubmit={
      editingAssignment
        ? handleUpdateAssignment
        : handleCreateAssignment
    }
  />
)}

    </div>
  );
};

export default CourseAssignments;
