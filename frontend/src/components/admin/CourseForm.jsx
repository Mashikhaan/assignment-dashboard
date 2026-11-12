
import React, { useState } from "react";

const CourseForm = ({ initialData, onSubmit, onCancel }) => {

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    courseCode: initialData?.courseCode || "",
    description: initialData?.description || ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim() || !formData.courseCode.trim()) {
      setError("Course title and course code are required.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Title
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter course title"
          className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Code
        </label>

        <input
          type="text"
          name="courseCode"
          value={formData.courseCode}
          onChange={handleChange}
          placeholder="e.g. MERN101"
          className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter course description"
          rows={4}
          className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <div className="flex justify-end gap-3">

        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          {initialData ? "Update Course" : "Create Course"}
        </button>

      </div>

    </form>
  );
};

export default CourseForm;
