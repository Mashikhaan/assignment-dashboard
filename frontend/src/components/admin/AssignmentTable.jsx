import { Pencil, Trash2, ExternalLink, CalendarDays } from "lucide-react";

const AssignmentTable = ({ assignments, onEdit, onDelete }) => {

  if (assignments.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-700">
          No assignments yet
        </h3>
        <p className="text-gray-500 mt-2">
          Create your first assignment to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-gray-500 text-sm">
            <th className="p-4">Assignment</th>
            <th className="p-4">Due Date</th>
            <th className="p-4">Students</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id} className="border-b hover:bg-slate-50">
              <td className="p-4">
                <p className="font-semibold text-gray-800">
                  {assignment.title}
                </p>
                <p className="text-sm text-gray-500">
                  {assignment.description}
                </p>
              </td>

              <td className="p-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  {assignment.dueDate}
                </span>
              </td>

              <td className="p-4 text-sm text-gray-600">
                {assignment.assignedTo.length} students
              </td>

              <td className="p-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onEdit(assignment)}
                    className="text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    aria-label={`Edit ${assignment.title}`}
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(assignment.id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    aria-label={`Delete ${assignment.title}`}
                  >
                    <Trash2 size={18} />
                  </button>

                  <a
                    href={assignment.driveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-500 hover:text-gray-800 cursor-pointer"
                    aria-label={`Open Drive link for ${assignment.title}`}
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentTable;