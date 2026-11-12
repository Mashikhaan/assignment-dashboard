
import { useState } from "react";

const getLocalDateTime = (date) => {
  if (!date) return "";

  const d = new Date(date);
  const offset = d.getTimezoneOffset() * 60000;

  return new Date(d.getTime() - offset)
    .toISOString()
    .slice(0, 16);
};

const AssignmentForm = ({
  onSubmit,
  onCancel,
  initialData,
  courseId,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [dueDate, setDueDate] = useState(
    getLocalDateTime(initialData?.dueDate)
  );
  const [oneDriveLink, setOneDriveLink] = useState(
    initialData?.oneDriveLink || ""
  );
  const [submissionType, setSubmissionType] = useState(
    initialData?.submissionType || "Individual"
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      title,
      description,
      dueDate,
      oneDriveLink,
      submissionType,
      course: courseId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4 my-auto"
      >
        <h2 className="text-2xl font-bold text-gray-800">
          {initialData ? "Edit Assignment" : "Create Assignment"}
        </h2>

        <div>
          <label className="block mb-1 font-medium">
            Assignment Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded-lg p-3"
            placeholder="Enter assignment title"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="3"
            className="w-full border rounded-lg p-3"
            placeholder="Enter assignment description"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Deadline (Date & Time)
          </label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={getLocalDateTime(new Date())}
            required
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            OneDrive Link
          </label>
          <input
            type="url"
            value={oneDriveLink}
            onChange={(e) => setOneDriveLink(e.target.value)}
            required
            className="w-full border rounded-lg p-3"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Submission Type
          </label>
          <select
            value={submissionType}
            onChange={(e) => setSubmissionType(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="Individual">Individual</option>
            <option value="Group">Group</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer"
          >
            {initialData ? "Save Changes" : "Create Assignment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentForm;
