import { useState } from "react";
import { users } from "../../data/seedData";

const AssignmentForm = ({onSubmit, onCancel, initialData,}) => {

  const [title, setTitle] = useState( initialData?.title || "" );

  const [description, setDescription] = useState( initialData?.description || "" );

  const [dueDate, setDueDate] = useState( initialData?.dueDate || "" );

  const [driveLink, setDriveLink] = useState( initialData?.driveLink || "" );

  const [assignmentType, setAssignmentType] = useState(
    initialData?.assignedTo.length === users.filter(
      (user) => user.role === "student"
    ).length ? "all" : "selected" );

  const [selectedStudents, setSelectedStudents] = useState( initialData?.assignedTo || [] );

  const students = users.filter( (user) => user.role === "student" );

  //handle change for selected students
  const handleStudentChange = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId] );
  };

  //handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const assignedTo = assignmentType === "all"? students.map((student) => student.id) : selectedStudents;

    if (assignedTo.length === 0) {
      alert("Please select at least one student.");
      return;
    }

    //call the onSubmit function passed as a prop with form data
    onSubmit({title,description, dueDate, driveLink,assignedTo, });

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
            placeholder="Enter description"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Due Date
          </label>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toLocaleDateString("en-CA")}
            required
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Google Drive Link
          </label>

          <input
            type="url"
            value={driveLink}
            onChange={(e) => setDriveLink(e.target.value)}
            required
            className="w-full border rounded-lg p-3"
            placeholder="https://drive.google.com/..."
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Assign To
          </label>

          <select
            value={assignmentType}
            onChange={(e) => setAssignmentType(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="all">All Students</option>
            <option value="selected">Selected Students</option>
          </select>
        </div>

        {assignmentType === "selected" && (
          <div className="border rounded-lg p-3 space-y-3">
            {students.map((student) => (
              <label
                key={student.id}
                className="flex items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => handleStudentChange(student.id)}
                />

                <span>{student.name}</span>
              </label>
            ))}
          </div>
        )}

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