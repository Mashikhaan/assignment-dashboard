
import { useState } from "react";

const getLocalDateTime = (date) => {
  if (!date) return "";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return "";

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
      ...(!initialData && { course: courseId }),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white w-full rounded-2xl space-y-4"
    >
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
          disabled={!initialData && !courseId}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {initialData ? "Save Changes" : "Create Assignment"}
        </button>
      </div>
    </form>
  );
};

export default AssignmentForm;
