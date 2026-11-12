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
  const [trackingData, setTrackingData] = useState({});
  const [trackingLoading, setTrackingLoading] = useState({});

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

        //tracking result
        const trackingResults = await Promise.all(
          courseAssignments.map(async (assignment) => {
            try {
              setTrackingLoading((prev) => ({
                ...prev,
                [assignment._id]: true,
              }));

              const { data } = await API.get(
                `/submissions/${assignment._id}/tracking`,
              );

              return [assignment._id, data];
            } catch (err) {
              console.error(
                `Tracking error for ${assignment.title}:`,
                err.response?.data || err.message,
              );

              return [assignment._id, null];
            } finally {
              setTrackingLoading((prev) => ({
                ...prev,
                [assignment._id]: false,
              }));
            }
          }),
        );

        setTrackingData(Object.fromEntries(trackingResults));
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

                {/* Submission Tracking */}
                <div className="mt-6 border-t pt-4">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Submission Tracking
                  </h4>

                  {trackingLoading[assignment._id] ? (
                    <p className="text-sm text-gray-500">Loading tracking...</p>
                  ) : trackingData[assignment._id] ? (
                    <>
                      {(() => {
                        const tracking = trackingData[assignment._id];

                        return (
                          <>
                            <div className="grid grid-cols-3 gap-2 text-center mb-4">
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-xl font-bold text-blue-700">
                                  {tracking.total}
                                </p>
                                <p className="text-xs text-gray-600">Total</p>
                              </div>

                              <div className="bg-green-50 p-3 rounded-lg">
                                <p className="text-xl font-bold text-green-700">
                                  {tracking.submitted}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Submitted
                                </p>
                              </div>

                              <div className="bg-orange-50 p-3 rounded-lg">
                                <p className="text-xl font-bold text-orange-700">
                                  {tracking.pending}
                                </p>
                                <p className="text-xs text-gray-600">Pending</p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              {tracking.tracking.map((item, index) => (
                                <div
                                  key={
                                    item.student?._id ||
                                    item.group?._id ||
                                    index
                                  }
                                  className="border rounded-lg p-3"
                                >
                                  <div className="flex justify-between items-center gap-2">
                                    <p className="font-medium text-sm">
                                      {assignment.submissionType ===
                                      "Individual"
                                        ? item.student?.name
                                        : item.group?.name}
                                    </p>

                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        item.status === "Submitted"
                                          ? "bg-green-100 text-green-700"
                                          : "bg-orange-100 text-orange-700"
                                      }`}
                                    >
                                      {item.status}
                                    </span>
                                  </div>

                                  {assignment.submissionType === "Group" && (
                                    <>
                                      <p className="text-xs text-gray-500 mt-2">
                                        Leader: {item.group?.leader?.name}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Members:{" "}
                                        {item.group?.members?.length || 0}
                                      </p>
                                    </>
                                  )}

                                  {item.status === "Submitted" && (
                                    <>
                                      {assignment.submissionType ===
                                        "Group" && (
                                        <p className="text-xs text-gray-600 mt-2">
                                          Acknowledged by:{" "}
                                          {item.acknowledgedBy?.name || "N/A"}
                                        </p>
                                      )}

                                      <p className="text-xs text-gray-500 mt-1">
                                        Submitted on:{" "}
                                        {item.acknowledgedAt
                                          ? new Date(
                                              item.acknowledgedAt,
                                            ).toLocaleString()
                                          : "N/A"}
                                      </p>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        );
                      })()}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Tracking data unavailable.
                    </p>
                  )}
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
            editingAssignment ? handleUpdateAssignment : handleCreateAssignment
          }
        />
      )}
    </div>
  );
};

export default CourseAssignments;
