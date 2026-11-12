import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAppContext } from "../context/AppContext";

const StudentCourseAssignments = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [myGroup, setMyGroup] = useState(null);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupLoading, setGroupLoading] = useState(false);
  const [groupError, setGroupError] = useState("");
  const { currentUser } = useAppContext();

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

        // Fetch groups for this course
        try {
          const { data } = await API.get(`/groups/course/${courseId}`);

          const groups = data.groups || [];
          setAvailableGroups(groups);

          // Find the group in which current student is a member
          const studentGroup = groups.find((group) =>
            group.members.some(
              (member) =>
                String(member._id) ===
                String(currentUser._id || currentUser.id),
            ),
          );

          setMyGroup(studentGroup || null);
        } catch (err) {
          console.log("Failed to fetch groups:", err);
        }

        // Fetch submission status for each assignment
        const statusResults = await Promise.all(
          courseAssignments.map(async (assignment) => {
            try {
              const { data } = await API.get(
                `/submissions/${assignment._id}/status`,
              );

              return [assignment._id, data];
            } catch (err) {
              return [
                assignment._id,
                {
                  acknowledged: false,
                  message:
                    err.response?.data?.message || "Unable to fetch status",
                },
              ];
            }
          }),
        );

        setStatuses(Object.fromEntries(statusResults));
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load course assignments.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  //handle acknowledge

  const handleAcknowledge = async () => {
    try {
      setSubmitting(true);
      setSubmitError("");

      let data;

      if (selectedAssignment.submissionType === "Group") {
        if (!myGroup) {
          setSubmitError(
            "You are not part of any group. Create or join one to submit this assignment.",
          );
          return;
        }

        const response = await API.post(
          `/submissions/${selectedAssignment._id}/group-acknowledge`,
          { groupId: myGroup._id },
        );

        data = response.data;
      } else {
        const response = await API.post(
          `/submissions/${selectedAssignment._id}/acknowledge`,
        );

        data = response.data;
      }

      setStatuses((prev) => ({
        ...prev,
        [selectedAssignment._id]: {
          acknowledged: true,
          submission: data.submission,
        },
      }));

      setSelectedAssignment(null);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || "Failed to acknowledge assignment.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  //handle create group
  const handleCreateGroup = async (e) => {
    e.preventDefault();

    try {
      setGroupLoading(true);
      setGroupError("");

      await API.post("/groups/create", {
        name: groupName,
        courseId,
      });

      const { data } = await API.get(`/groups/course/${courseId}`);
      setAvailableGroups(data.groups || []);

      const studentGroup = data.groups.find((group) =>
        group.members.some((member) => member._id === currentUser._id),
      );

      setMyGroup(studentGroup || null);
      setGroupName("");
    } catch (err) {
      setGroupError(err.response?.data?.message || "Failed to create group.");
    } finally {
      setGroupLoading(false);
    }
  };

  //handle join group
  const handleJoinGroup = async (groupId) => {
    try {
      setGroupLoading(true);
      setGroupError("");

      await API.post(`/groups/${groupId}/join`);

      const { data } = await API.get(`/groups/course/${courseId}`);
      setAvailableGroups(data.groups || []);

      const studentGroup = data.groups.find((group) =>
        group.members.some((member) => member._id === currentUser._id),
      );

      setMyGroup(studentGroup || null);
    } catch (err) {
      setGroupError(err.response?.data?.message || "Failed to join group.");
    } finally {
      setGroupLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading assignments...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/student-dashboard")}
          className="text-indigo-600 font-medium mb-6 cursor-pointer"
        >
          ← Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{course?.title}</h1>
          <p className="text-indigo-600 mt-2">{course?.courseCode}</p>
          <p className="text-gray-500 mt-2">{course?.description}</p>
        </div>

        {/* Group Management */}
        <div className="bg-white border rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-5">My Group</h2>

          {groupError && <p className="text-red-600 mb-4">{groupError}</p>}

          {myGroup ? (
            <div className="mb-8">
              <h3 className="font-semibold text-lg">{myGroup.name}</h3>

              <p className="text-sm text-indigo-600 mt-2">
                Leader: {myGroup.leader?.name}
              </p>

              <h4 className="font-semibold mt-5 mb-3">Members</h4>

              {myGroup.members.map((member) => (
                <div key={member._id} className="text-gray-600 py-2 border-b">
                  {member.name}
                  {member._id === myGroup.leader?._id && (
                    <span className="text-indigo-600 text-sm ml-2">
                      (Leader)
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
              <p className="text-gray-500 mb-5">
                You are not part of any group in this course. Create or join one
                to submit this assignment.
              </p>

              <form onSubmit={handleCreateGroup} className="mb-8">
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  required
                  className="border rounded-lg p-3 w-full mb-3"
                />

                <button
                  type="submit"
                  disabled={groupLoading}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-lg disabled:opacity-50"
                >
                  {groupLoading ? "Creating..." : "Create Group"}
                </button>
              </form>
            </>
          )}

          {/* Available Groups - Always Visible */}
          <h3 className="font-semibold mb-3">Available Groups</h3>

          {availableGroups.length === 0 ? (
            <p className="text-gray-400">No groups available yet.</p>
          ) : (
            availableGroups.map((group) => {
              const isJoined = group.members.some(
                (member) =>
                  String(member._id) ===
                  String(currentUser._id || currentUser.id),
              );

              return (
                <div
                  key={group._id}
                  className="border rounded-lg p-4 mb-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{group.name}</p>
                    <p className="text-sm text-gray-500">
                      Leader: {group.leader?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Members: {group.members.length}
                    </p>
                  </div>

                  <button
                    onClick={() => handleJoinGroup(group._id)}
                    disabled={groupLoading || isJoined || !!myGroup}
                    className={`px-4 py-2 rounded-lg text-white ${
                      isJoined || myGroup
                        ? "bg-gray-500"
                        : "bg-green-600 hover:bg-green-500"
                    }`}
                  >
                    {isJoined
                      ? "Joined"
                      : myGroup
                        ? "Already in a group"
                        : "Join"}
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6">Course Assignments</h2>

          {assignments.length === 0 ? (
            <p className="text-center text-gray-400 py-10">
              No assignments available for this course yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {assignments.map((assignment) => {
                const status = statuses[assignment._id];
                const isSubmitted = status?.acknowledged;

                return (
                  <div key={assignment._id} className="border rounded-xl p-5">
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {assignment.title}
                      </h3>

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          isSubmitted
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {isSubmitted ? "Submitted" : "Pending"}
                      </span>
                    </div>

                    <p className="text-gray-500 text-sm mt-3">
                      {assignment.description}
                    </p>

                    <p className="text-sm text-gray-600 mt-4">
                      <strong>Deadline:</strong>{" "}
                      {new Date(assignment.dueDate).toLocaleString()}
                    </p>

                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Submission Type:</strong>{" "}
                      {assignment.submissionType}
                    </p>

                    {assignment.oneDriveLink && (
                      <a
                        href={assignment.oneDriveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block text-indigo-600 hover:underline mt-4 text-sm font-medium"
                      >
                        Open OneDrive Link →
                      </a>
                    )}

                    {assignment.submissionType === "Individual" && (
                      <>
                        {isSubmitted ? (
                          <p className="text-sm text-green-700 mt-5">
                            Acknowledged on:{" "}
                            {status.submission?.acknowledgedAt
                              ? new Date(
                                  status.submission.acknowledgedAt,
                                ).toLocaleString()
                              : "Submitted"}
                          </p>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedAssignment(assignment);
                              setSubmitError("");
                            }}
                            className="mt-5 w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700"
                          >
                            I have submitted
                          </button>
                        )}
                      </>
                    )}

                    {assignment.submissionType === "Group" && (
                      <>
                        {!myGroup ? (
                          <p className="text-sm text-orange-600 mt-5">
                            You are not part of any group. Create or join one to
                            submit this assignment.
                          </p>
                        ) : isSubmitted ? (
                          <div className="mt-5 text-sm text-green-700">
                            <p>Group Submitted Successfully!</p>
                            <p className="mt-1">
                              Acknowledged by:{" "}
                              {status.submission?.acknowledgedBy?.name ||
                                myGroup.leader?.name}
                            </p>
                            <p className="mt-1">
                              Acknowledged on:{" "}
                              {status.submission?.acknowledgedAt
                                ? new Date(
                                    status.submission.acknowledgedAt,
                                  ).toLocaleString()
                                : "Submitted"}
                            </p>
                          </div>
                        ) : String(myGroup.leader?._id) ===
                          String(currentUser._id || currentUser.id) ? (
                          <button
                            onClick={() => {
                              setSelectedAssignment(assignment);
                              setSubmitError("");
                            }}
                            className="mt-5 w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700"
                          >
                            I have submitted (Group)
                          </button>
                        ) : (
                          <p className="text-sm text-orange-600 mt-5">
                            Waiting for group leader to acknowledge submission.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold">Confirm Submission</h2>

            <p className="mt-3 text-gray-600">
              Have you submitted <strong>{selectedAssignment.title}</strong>?
            </p>

            {submitError && (
              <p className="text-red-600 text-sm mt-3">{submitError}</p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                disabled={submitting}
                className="text-gray-500 px-4 py-2 border rounded-lg"
                onClick={() => setSelectedAssignment(null)}
              >
                Cancel
              </button>

              <button
                disabled={submitting}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg disabled:opacity-50"
                onClick={handleAcknowledge}
              >
                {submitting ? "Submitting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCourseAssignments;
