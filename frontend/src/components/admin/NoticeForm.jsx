import React, { useState } from "react";

const NoticeForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("all");
  const [branch, setBranch] = useState("CSE");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("branch", branch.toUpperCase());
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    try {
      const response = await fetch("http://localhost:8080/api/admin/post", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Notice added successfully!");
      } else {
        alert(`Error: ${data.message || "Error adding notice"}`);
      }
    } catch (error) {
      console.error("Error adding notice:", error);
      alert("Error adding notice!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 border border-gray-300 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Create New Notice</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Branch
          </label>
          <select
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            <option value="CSE">CSE</option>
            <option value="CSM">CSM</option>
            <option value="CSD">CSD</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Video
          </label>
          <input
            type="file"
            onChange={handleVideoChange}
            className="w-full mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Submit Notice
        </button>
      </form>
    </div>
  );
};

export default NoticeForm;
