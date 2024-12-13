import React from "react";
import { useParams, useLocation } from "react-router-dom";

const StudentNotificationDetails = () => {
  const { id } = useParams(); // Get the ID from the URL
  const location = useLocation(); // Optional: Get additional state passed during navigation
  // Example: Use the `id` to fetch or display data
  const notification = location.state;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {notification ? (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">
            Notification {id}: {notification.title}
          </h1>
          <p className="mt-4 text-gray-700">{notification.details}</p>
        </div>
      ) : (
        <p className="text-center text-gray-600">No notification details available for ID: {id}</p>
      )}
    </div>
  );
};

export default StudentNotificationDetails;
